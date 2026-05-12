const bcrypt = require("bcrypt");
const fs = require("fs/promises");
const path = require("path");
const User = require("../models/User");

const SALT_ROUNDS = 10;
const AVATAR_PATH_PREFIX = "/uploads/avatars/";
const AVATAR_DIR = path.resolve(__dirname, "../../uploads/avatars");

const getLocalAvatarPath = (avatarUrl, baseUrl) => {
    if (typeof avatarUrl !== "string" || avatarUrl.length === 0) {
        return null;
    }

    if (avatarUrl.startsWith(`${baseUrl}${AVATAR_PATH_PREFIX}`)) {
        return path.join(AVATAR_DIR, path.basename(avatarUrl));
    }

    if (avatarUrl.startsWith(AVATAR_PATH_PREFIX)) {
        return path.join(AVATAR_DIR, path.basename(avatarUrl));
    }

    return null;
};

/**
 * @module userController
 * Controlador de usuarios.
 * Gestiona operaciones CRUD sobre la tabla users.
 * Los campos sensibles (password, tokens) nunca se devuelven en las consultas
 * de lectura gracias a los SELECTs del modelo.
 *
 * Rutas esperadas:
 *   GET    /users              → getAll          (p.ej. solo admin)
 *   GET    /users/:id          → getById
 *   PUT    /users/:id          → update
 *   PATCH  /users/:id/password → updatePassword
 *   DELETE /users/:id          → delete
 */
const userController = {
    /**
     * Devuelve la lista de todos los usuarios registrados.
     * No incluye contraseña ni tokens de verificación.
     *
     * Response 200: array de usuarios
     */
    getAll: async (req, res, next) => {
        try {
            const [rows] = await User.getAll();
            res.json(rows);
        } catch (err) {
            next(err);
        }
    },

    /**
     * Devuelve un usuario por su ID.
     *
     * Params: id
     * Response 200: objeto usuario
     * Response 404: usuario no encontrado
     */
    getById: async (req, res, next) => {
        try {
            const [rows] = await User.getById(req.params.id);
            if (rows.length === 0)
                return res.status(404).json({ message: "User not found" });
            res.json(rows[0]);
        } catch (err) {
            next(err);
        }
    },

    /**
     * Actualiza los datos de perfil de un usuario.
     * Solo se pueden modificar: name, username, phone, avatar_url.
     * La contraseña y el rol se gestionan por endpoints separados.
     *
     * Params: id
     * Body: { name, username, phone?, avatar_url? }
     * Response 200: confirmación
     * Response 404: usuario no encontrado
     */
    update: async (req, res, next) => {
        try {
            // soporta multipart (avatar en req.file) o JSON en req.body
            const { name, username, phone } = req.body;
            const file = req.file;

            const [existing] = await User.getById(req.params.id);
            if (existing.length === 0)
                return res.status(404).json({ message: "User not found" });
            const current = existing[0];

            const host = req.get("host");
            const protocol = req.protocol || "http";
            const baseUrl = `${protocol}://${host}`;
            const previousAvatarPath = file ? getLocalAvatarPath(current.avatar_url, baseUrl) : null;
            const avatar_url = file ? `${baseUrl}/uploads/avatars/${file.filename}` : (req.body.avatar_url || current.avatar_url);

            const newData = {
                name: typeof name !== 'undefined' ? name : current.name,
                username: typeof username !== 'undefined' ? username : current.username,
                phone: typeof phone !== 'undefined' ? phone : current.phone,
                avatar_url,
            };

            const [result] = await User.update(req.params.id, newData);
            if (result.affectedRows === 0)
                return res.status(404).json({ message: "User not found" });

            if (previousAvatarPath && previousAvatarPath !== path.join(AVATAR_DIR, file.filename)) {
                await fs.unlink(previousAvatarPath).catch((error) => {
                    if (error?.code !== "ENOENT") {
                        throw error;
                    }
                });
            }

            const [rows] = await User.getById(req.params.id);
            res.json(rows[0]);
        } catch (err) {
            next(err);
        }
    },

    /**
     * Cambia la contraseña de un usuario.
     * La nueva contraseña se hashea con bcrypt antes de guardarla.
     *
     * Params: id
     * Body: { password }
     * Response 200: confirmación
     * Response 404: usuario no encontrado
     */
    updatePassword: async (req, res, next) => {
        try {
            const { currentPassword, password } = req.body;

            if (!currentPassword || !password) {
                return res.status(400).json({ message: "Missing currentPassword or password" });
            }

            const [rows] = await User.getByIdWithPassword(req.params.id);
            if (rows.length === 0) return res.status(404).json({ message: "User not found" });
            const user = rows[0];

            const match = await bcrypt.compare(currentPassword, user.password);
            if (!match) return res.status(401).json({ message: "Current password incorrect" });

            const hashed = await bcrypt.hash(password, SALT_ROUNDS);
            const [result] = await User.updatePassword(req.params.id, hashed);
            if (result.affectedRows === 0)
                return res.status(404).json({ message: "User not found" });
            res.json({ message: "Password updated successfully" });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Elimina un usuario por su ID.
     * Al tener ON DELETE CASCADE en la BD, elimina también sus reservas,
     * su fila de manager (si aplica), etc.
     *
     * Params: id
     * Response 200: confirmación
     * Response 404: usuario no encontrado
     */
    delete: async (req, res, next) => {
        try {
            const [result] = await User.delete(req.params.id);
            if (result.affectedRows === 0)
                return res.status(404).json({ message: "User not found" });
            res.json({ message: "User deleted successfully" });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = userController;
