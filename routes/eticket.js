const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");

router.get("/:invoice/", mid.mustLogin, controller.eticket.create);
router.put("/checkIn/", controller.eticket.scan);

module.exports = router;
