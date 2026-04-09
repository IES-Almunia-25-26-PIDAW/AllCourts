const express = require("express");
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, bookingController.create);
router.get("/", authMiddleware, roleMiddleware("manager"), bookingController.getAll);
router.get("/user/:userId", authMiddleware, bookingController.getByUserId);
router.get("/court/:courtId", authMiddleware, roleMiddleware("manager"), bookingController.getByCourtId);
router.get("/:id", authMiddleware, bookingController.getById);
router.patch("/:id/status", authMiddleware, roleMiddleware("manager"), bookingController.updateStatus);
router.patch("/:id/cancel", authMiddleware, bookingController.cancel);
router.delete("/:id", authMiddleware, roleMiddleware("manager"), bookingController.delete);

module.exports = router;
