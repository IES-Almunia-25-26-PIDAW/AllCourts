const express = require("express");
const courtScheduleController = require("../controllers/courtScheduleController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/bulk", authMiddleware, roleMiddleware("manager"), courtScheduleController.upsertBulk);
router.post("/", authMiddleware, roleMiddleware("manager"), courtScheduleController.upsert);
router.get("/court/:courtId", courtScheduleController.getByCourtId);
router.get("/court/:courtId/day/:dayOfWeek", courtScheduleController.getByCourtAndDay);
router.put("/:id", authMiddleware, roleMiddleware("manager"), courtScheduleController.update);
router.delete("/:id", authMiddleware, roleMiddleware("manager"), courtScheduleController.delete);
router.delete("/court/:courtId", authMiddleware, roleMiddleware("manager"), courtScheduleController.deleteByCourtId);

module.exports = router;
