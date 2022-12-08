const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");

router.get("/", mid.mustLogin, controller.transaction.getAll);
router.post("/", mid.mustLogin, controller.transaction.createTransaction);

module.exports = router;