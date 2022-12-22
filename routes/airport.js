const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");

router.get("/", controller.airport.getAll);
router.get("/:id", controller.airport.getOne);

module.exports = router;
