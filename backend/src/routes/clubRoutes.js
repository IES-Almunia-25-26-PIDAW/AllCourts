const express = require("express");
const clubController = require("../controllers/clubController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", clubController.getAll);
router.get("/city/:city", clubController.getByCity);
router.get("/manager/:managerId", clubController.getByManagerId);
router.get("/:id", clubController.getById);
router.post("/", authMiddleware, roleMiddleware("manager"), clubController.create);
router.put("/:id", authMiddleware, roleMiddleware("manager"), clubController.update);
router.delete("/:id", authMiddleware, roleMiddleware("manager"), clubController.delete);

module.exports = router;
