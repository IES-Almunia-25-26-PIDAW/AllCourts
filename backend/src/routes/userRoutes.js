const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { requireSameUserParam } = require("../middlewares/ownershipMiddleware");
const { uploadAvatar } = require("../middlewares/uploadMiddleware");

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

router.get(
	"/",
	authMiddleware,
	roleMiddleware("manager"),
	userController.getAll,
);
router.get(
	"/:id",
	authMiddleware,
	requireSameUserParam("id"),
	userController.getById,
);
router.put(
	"/:id",
	authMiddleware,
	requireSameUserParam("id"),
	uploadAvatar.single("avatar"),
	userController.update,
);
router.patch(
	"/:id/password",
	authMiddleware,
	requireSameUserParam("id"),
	userController.updatePassword,
);
router.delete(
	"/:id",
	authMiddleware,
	roleMiddleware("manager"),
	userController.delete,
);

module.exports = router;
