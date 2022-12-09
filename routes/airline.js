const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");

router.get("/", mid.mustAdmin, controller.airline.getAll);
router.get("/:id", mid.mustAdmin, controller.airline.getOne);
router.post("/createAirline", mid.mustAdmin, controller.airline.create);
router.put("/updateAirline/:id", mid.mustAdmin, controller.airline.update);
router.delete("/deleteAirline/:id", mid.mustAdmin, controller.airline.delete);

module.exports = router;
