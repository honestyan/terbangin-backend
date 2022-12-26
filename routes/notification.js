const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");

router.post("/handling", controller.notification.hadlingPayment);
router.put("/:id", mid.mustLogin, controller.notification.isRead);
router.get("/", mid.mustLogin, controller.notification.getAllByUser);
router.get("/search", mid.mustLogin, controller.notification.search);


module.exports = router;
