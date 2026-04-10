const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const Manager = require("../models/Manager");
const { sendVerificationEmail } = require("../services/emailService");

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

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
    register: async (req, res, next) => {
        try {
            const { name, username, email, password, role, phone, avatar_url } =
                req.body;

            // Comprobar duplicados antes de insertar
            const [byEmail] = await User.getByEmail(email);
            if (byEmail.length > 0)
                return res.status(409).json({ message: "Email already in use" });

            const [byUsername] = await User.getByUsername(username);
            if (byUsername.length > 0)
                return res.status(409).json({ message: "Username already taken" });

            // Hashear contraseña (nunca se guarda en texto plano)
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            const userRole = role === "manager" ? "manager" : "player";

            const [result] = await User.create({
                name,
                username,
                email,
                password: hashedPassword,
                role: userRole,
                phone: phone || null,
                avatar_url: avatar_url || null,
            });

            const userId = result.insertId;

            // Generar token de verificación y enviarlo por email
            const verificationToken = crypto.randomBytes(32).toString("hex");
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
            await User.setVerificationToken(userId, verificationToken, expiresAt);
            await sendVerificationEmail(email, verificationToken);

            // Si se registra como manager, crear también su fila en managers
            if (userRole === "manager") {
                await Manager.create({
                    user_id: userId,
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
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // Buscar usuario por email (esta query devuelve todos los campos, incluido password)
            const [rows] = await User.getByEmail(email);
            if (rows.length === 0)
                return res.status(401).json({ message: "Invalid credentials" });

            const user = rows[0];

            // Comparar contraseña plana con el hash almacenado
            const match = await bcrypt.compare(password, user.password);
            if (!match)
                return res.status(401).json({ message: "Invalid credentials" });

            if (!user.is_verified)
                return res.status(403).json({ message: "Please verify your email before logging in" });

            // Actualizar timestamp de último acceso
            await User.updateLastLogin(user.id);

            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            // Set httpOnly cookie for the token so frontends on the same origin
            // can use cookies for auth without exposing token to JS.
            try {
                const maxAge = 7 * 24 * 60 * 60 * 1000; // default 7 days
                res.cookie("allcourts_token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge,
                    path: "/",
                });
            } catch (e) {
                // continue even if cookies cannot be set
            }

            // Return user data (never the raw token)
            const { password: _pw, verification_token: _vt, token_expires_at: _te, ...safeUser } = user;
            res.json({ user: safeUser });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Devuelve el perfil del usuario actualmente autenticado.
     * Requiere que el authMiddleware haya inyectado req.user con el id del token.
     *
     * Response 200: datos del usuario (sin contraseña)
     * Response 404: usuario no encontrado
     */
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

    /**
     * Verifica el email de un usuario usando el token enviado por correo.
     * El modelo comprueba que el token exista y no haya caducado (token_expires_at > NOW()).
     * Si es válido, marca is_verified = TRUE y limpia el token.
     *
     * Params: token (en la URL)
     * Response 200: verificación exitosa
     * Response 400: token inválido o expirado
     */
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
    logout: async (req, res, next) => {
        try {
            // Clear the cookie set on login
            res.cookie("allcourts_token", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 0,
                path: "/",
            });
            res.json({ message: "Logged out" });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = authController;
