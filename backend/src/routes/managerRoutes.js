const express = require("express");
const managerController = require("../controllers/managerController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("manager"), managerController.getAll);
router.get("/user/:userId", authMiddleware, managerController.getByUserId);
router.get("/:id/courts", authMiddleware, roleMiddleware("manager"), managerController.getCourts);
router.get("/:id/stats", authMiddleware, roleMiddleware("manager"), managerController.getStats);
router.get("/:id", authMiddleware, roleMiddleware("manager"), managerController.getById);
router.patch("/:id/subscription", authMiddleware, roleMiddleware("manager"), managerController.updateSubscription);
router.delete("/:id", authMiddleware, roleMiddleware("manager"), managerController.delete);

module.exports = router;
