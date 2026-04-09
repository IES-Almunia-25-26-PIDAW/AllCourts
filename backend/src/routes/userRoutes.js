const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("manager"), userController.getAll);
router.get("/:id", authMiddleware, userController.getById);
router.put("/:id", authMiddleware, userController.update);
router.patch("/:id/password", authMiddleware, userController.updatePassword);
router.delete("/:id", authMiddleware, roleMiddleware("manager"), userController.delete);

module.exports = router;
