const express = require("express");
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("manager"), paymentController.getAll);
router.get("/booking/:bookingId", authMiddleware, paymentController.getByBookingId);
router.get("/user/:userId", authMiddleware, paymentController.getByUserId);
router.get("/manager/:managerId", authMiddleware, roleMiddleware("manager"), paymentController.getByManagerId);
router.get("/:id", authMiddleware, paymentController.getById);
router.post("/", authMiddleware, paymentController.create);
router.patch("/:id/status", authMiddleware, roleMiddleware("manager"), paymentController.updateStatus);
router.delete("/:id", authMiddleware, roleMiddleware("manager"), paymentController.delete);

module.exports = router;
