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

//airplane
router.get("/airplane/", mid.mustAdmin, controller.airplane.search);
router.get("/airplane/", mid.mustAdmin, controller.airplane.getAll);
router.get("/airplane/:id", mid.mustAdmin, controller.airplane.getOne);
router.post("/airplane", mid.mustAdmin, controller.airplane.create);
router.put("/airplane/:id", mid.mustAdmin, controller.airplane.update);
router.delete("/airplane/:id", mid.mustAdmin, controller.airplane.delete);

//airline
router.get("/airline/", mid.mustAdmin, controller.airline.getAll);
router.get("/airline/:id", mid.mustAdmin, controller.airline.getOne);
router.post("/airline/", mid.mustAdmin, controller.airline.create);
router.put("/airline/:id", mid.mustAdmin, controller.airline.update);
router.delete("/airline/:id", mid.mustAdmin, controller.airline.delete);

//transaction
router.get("/transaction/", mid.mustAdmin, controller.transaction.getAll);
router.delete("/transaction/:id", mid.mustAdmin, controller.transaction.delete);

//notification
router.get("/notification/", mid.mustAdmin, controller.notification.getAll);
router.delete(
    "/notification/:id",
    mid.mustAdmin,
    controller.notification.delete
);
router.post("/notification/", mid.mustAdmin, controller.notification.create);
router.put("/notification/:id", mid.mustAdmin, controller.notification.update);

module.exports = router;