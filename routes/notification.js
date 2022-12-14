const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");

router.post("/handling", controller.notification.hadlingPayment);

module.exports = router;
