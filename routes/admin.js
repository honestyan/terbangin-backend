const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");

//auth
router.post("/login", controller.admin.login);

//airport
router.get("/airport/", mid.mustAdmin, controller.airport.airport);
router.post("/airport/create", mid.mustAdmin, controller.airport.create);
router.put("/airport/:id", mid.mustAdmin, controller.airport.update);
router.delete("/airport/:id", mid.mustAdmin, controller.airport.delete);

module.exports = router;
