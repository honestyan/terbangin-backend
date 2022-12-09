const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");

router.get("/", mid.mustAdmin, controller.airplane.getAll);
router.get("/:id", mid.mustAdmin, controller.airplane.getOne);
router.post("/createAirplane", mid.mustAdmin, controller.airplane.create);
router.put("/updateAirplane/:id", mid.mustAdmin, controller.airplane.update);
router.delete("/deleteAirplane/:id", mid.mustAdmin, controller.airplane.delete);

module.exports = router;
