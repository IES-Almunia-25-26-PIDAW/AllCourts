const bcrypt = require("bcrypt");
const User = require("../models/User");

const SALT_ROUNDS = 10;

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
            const { name, username, phone, avatar_url } = req.body;
            const [result] = await User.update(req.params.id, {
                name,
                username,
                phone,
                avatar_url,
            });
            if (result.affectedRows === 0)
                return res.status(404).json({ message: "User not found" });
            res.json({ message: "User updated successfully" });
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
            const { password } = req.body;
            // Hashear la nueva contraseña antes de actualizarla en BD
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
