const express = require("express");
const courtController = require("../controllers/courtController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", courtController.getAll);
router.get("/city/:city", courtController.getByCity);
router.get("/club/:clubId", courtController.getByClubId);
router.get("/:id", courtController.getById);
router.post("/", authMiddleware, roleMiddleware("manager"), courtController.create);
router.put("/:id", authMiddleware, roleMiddleware("manager"), courtController.update);
router.delete("/:id", authMiddleware, roleMiddleware("manager"), courtController.delete);

module.exports = router;
