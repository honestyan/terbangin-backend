const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");

router.get("/", mid.mustLogin, controller.product.getAll);
router.get("/:id", mid.mustLogin, controller.product.getOne);
router.get("/search", controller.product.getBySearch);
router.get("/", controller.product.pagination);

module.exports = router;
