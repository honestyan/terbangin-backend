const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");

router.get("/", controller.product.getAll);
router.get("/:id", controller.product.getOne);

module.exports = router;
