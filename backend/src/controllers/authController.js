const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const Manager = require("../models/Manager");
const { sendVerificationEmail } = require("../services/emailService");
const RefreshToken = require("../models/RefreshTokens");

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;

const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 1000;
const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function stripSensitiveUser(user) {
  const { password, verification_token, token_expires_at, ...safeUser } = user;
  return safeUser;
}

function signAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
      type: "refresh",
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
  );
}

function setAuthCookies(res, accessToken, refreshToken) {
  const baseOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };

  res.cookie("allcourts_token", accessToken, {
    ...baseOptions,
    maxAge: ACCESS_COOKIE_MAX_AGE,
  });

  res.cookie("allcourts_refresh_token", refreshToken, {
    ...baseOptions,
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });
}

function clearAuthCookies(res) {
  const baseOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };

  res.cookie("allcourts_token", "", {
    ...baseOptions,
    maxAge: 0,
  });

  res.cookie("allcourts_refresh_token", "", {
    ...baseOptions,
    maxAge: 0,
  });
}

/**
 * @module authController
 * Controlador de autenticación.
 * Gestiona el registro, login, verificación de email y perfil del usuario autenticado.
 *
 * Rutas esperadas:
 *   POST   /auth/register         → register
 *   POST   /auth/login            → login
 *   GET    /auth/me               → me          (requiere authMiddleware)
 *   GET    /auth/verify/:token    → verifyEmail
 */
const authController = {
  /**
   * Registra un nuevo usuario (player o manager).
   * - Verifica que el email y el username no estén ya en uso.
   * - Hashea la contraseña antes de guardarla.
   * - Si el rol es "manager", crea también el registro en la tabla managers.
   * - Devuelve un JWT listo para usar.
   *
   * Body: { name, username, email, password, role, phone?, avatar_url? }
   * Response 201: { message, token }
   */
  //#region register
  register: async (req, res, next) => {
    try {
      const { name, username, email, password, role, phone, avatar_url } =
        req.body;

      // Comprobar duplicados antes de insertar
      const [byEmail] = await User.getByEmail(email);
      if (byEmail.length > 0)
        return res
          .status(409)
          .json({ message: "Correo electrónico ya registrado" });

      const [byUsername] = await User.getByUsername(username);
      if (byUsername.length > 0)
        return res
          .status(409)
          .json({ message: "Nombre de usuario ya registrado" });

      // Hashear contraseña (nunca se guarda en texto plano)
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const userRole = role === "manager" ? "manager" : "player";

      // id es un UUID
      const userId = crypto.randomUUID();

      await User.create({
        id: userId,
        name,
        username,
        email,
        password: hashedPassword,
        role: userRole,
        phone: phone || null,
        avatar_url: avatar_url || null,
      });

      // Generar token de verificación y enviarlo por email
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await User.setVerificationToken(userId, verificationToken, expiresAt);
      await sendVerificationEmail(email, verificationToken);

      // Si se registra como manager, crear también su fila en managers
      if (userRole === "manager") {
        await Manager.create({
          id: userId,
          subscription_active: false,
          subscription_start: null,
          subscription_end: null,
        });
      }

      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      next(err);
    }
  },
  //#endregion

  /**
   * Autentica un usuario con email y contraseña.
   * - Compara la contraseña con el hash guardado en BD.
   * - Actualiza el campo last_login.
   * - Devuelve el JWT y los datos del usuario (sin contraseña ni tokens sensibles).
   *
   * Body: { email, password }
   * Response 200: { token, user }
   * Response 401: credenciales inválidas
   */
  //#region login
  login: async (req, res, next) => {
    try {
      const { identifier, password } = req.body;

      const isEmail = identifier.includes("@");
      const [rows] = isEmail
        ? await User.getByEmail(identifier)
        : await User.getByUsername(identifier);

      if (rows.length === 0)
        return res.status(401).json({ message: "Credenciales incorrectas" });

      const user = rows[0];

      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ message: "Credenciales incorrectas" });

      if (!user.is_verified)
        return res.status(403).json({
          message:
            "Verifica tu correo electrónico para poder iniciar sesión. Revisa tu bandeja de entrada o de spam",
        });

      await User.updateLastLogin(user.id);

      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken(user);

      await RefreshToken.create({
        id: crypto.randomUUID(),
        user_id: user.id,
        token_hash: hashToken(refreshToken),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      setAuthCookies(res, accessToken, refreshToken);

      res.json({ user: stripSensitiveUser(user) });
    } catch (err) {
      next(err);
    }
  },
  //#endregion

  //! Añadir documentación de refresh
  //#region refresh
  refresh: async (req, res, next) => {
    try {
      const refreshToken = req.cookies?.allcourts_refresh_token;

      if (!refreshToken) {
        return res
          .status(401)
          .json({ message: "No se ha proporcionado un token de refresco" });
      }

      let payload;
      try {
        payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
      } catch {
        return res.status(401).json({ message: "No válido o token expirado" });
      }

      if (payload.type !== "refresh") {
        return res.status(401).json({ message: "Token de refresco no válido" });
      }

      const tokenHash = hashToken(refreshToken);
      const [tokenRows] = await RefreshToken.findByHash(tokenHash);

      if (tokenRows.length === 0 || tokenRows[0].revoked_at) {
        return res.status(401).json({ message: "Token de refresco revocado" });
      }

      const [users] = await User.getById(payload.id);
      if (users.length === 0) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }

      await RefreshToken.revokeByHash(tokenHash);

      const user = users[0];
      const newAccessToken = signAccessToken(user);
      const newRefreshToken = signRefreshToken(user);

      await RefreshToken.create({
        id: crypto.randomUUID(),
        user_id: user.id,
        token_hash: hashToken(newRefreshToken),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      setAuthCookies(res, newAccessToken, newRefreshToken);

      res.json({ user: stripSensitiveUser(user) });
    } catch (err) {
      next(err);
    }
  },
  //#endregion

  /**
   * Devuelve el perfil del usuario actualmente autenticado.
   * Requiere que el authMiddleware haya inyectado req.user con el id del token.
   *
   * Response 200: datos del usuario (sin contraseña)
   * Response 404: usuario no encontrado
   */
  //#region me
  me: async (req, res, next) => {
    try {
      const [rows] = await User.getById(req.user.id);
      if (rows.length === 0)
        return res.status(404).json({ message: "User not found" });
      res.json(rows[0]);
    } catch (err) {
      next(err);
    }
  },
  //#endregion

  /**
   * Verifica el email de un usuario usando el token enviado por correo.
   * El modelo comprueba que el token exista y no haya caducado (token_expires_at > NOW()).
   * Si es válido, marca is_verified = TRUE y limpia el token.
   *
   * Params: token (en la URL)
   * Response 200: verificación exitosa
   * Response 400: token inválido o expirado
   */
  //#region verifyEmail
  verifyEmail: async (req, res, next) => {
    try {
      const { token } = req.params;
      const [result] = await User.verifyUser(token);
      if (result.affectedRows === 0)
        return res
          .status(400)
          .json({ message: "Invalid or expired verification token" });
      res.json({ message: "Email verified successfully" });
    } catch (err) {
      next(err);
    }
  },
  //#endregion

  //#region logout
  logout: async (req, res, next) => {
    try {
      const refreshToken = req.cookies?.allcourts_refresh_token;

      if (refreshToken) {
        try {
          await RefreshToken.revokeByHash(hashToken(refreshToken));
        } catch {}
      }

      clearAuthCookies(res);
      res.json({ message: "Logged out" });
    } catch (err) {
      next(err);
    }
  },
  //#endregion
};

module.exports = authController;
