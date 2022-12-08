const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");

//auth
router.post("/login", controller.admin.login);

//airport
router.get("/airport/", mid.mustAdmin, controller.airport.getAll);
router.get("/airport/:id", mid.mustAdmin, controller.airport.getOne);
router.post("/airport/", mid.mustAdmin, controller.airport.create);
router.put("/airport/:id", mid.mustAdmin, controller.airport.update);
router.delete("/airport/:id", mid.mustAdmin, controller.airport.delete);

//product
router.get("/product/", mid.mustAdmin, controller.product.getAll);
router.get("/product/:id", mid.mustAdmin, controller.product.getOne);
router.post("/product/", mid.mustAdmin, controller.product.create);
router.put("/product/:id", mid.mustAdmin, controller.product.update);
router.delete("/product/:id", mid.mustAdmin, controller.product.delete);

module.exports = router;
