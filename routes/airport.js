const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");

router.get("/", mid.mustLogin, controller.airport.getAll);
router.get("/:id", mid.mustLogin, controller.airport.getOne);

module.exports = router;
