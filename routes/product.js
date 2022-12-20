const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");

router.get("/", mid.mustLogin, controller.product.getAll);
router.get("/:id", mid.mustLogin, controller.product.getOne);

module.exports = router;
