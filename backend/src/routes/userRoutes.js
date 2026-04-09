//#region MODULES
const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
//#endregion

/**
 * @module userRouter
 * Rutas de usuarios.
 *
 * GET    /users             → Listar usuarios (solo gestores)
 * GET    /users/:id         → Obtener usuario por id
 * PUT    /users/:id         → Actualizar datos de usuario
 * PATCH  /users/:id/password → Cambiar contraseña
 * DELETE /users/:id         → Eliminar usuario (solo gestores)
 */
const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("manager"), userController.getAll);
router.get("/:id", authMiddleware, userController.getById);
router.put("/:id", authMiddleware, userController.update);
router.patch("/:id/password", authMiddleware, userController.updatePassword);
router.delete("/:id", authMiddleware, roleMiddleware("manager"), userController.delete);

module.exports = router;
