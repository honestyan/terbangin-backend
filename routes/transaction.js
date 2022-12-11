const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");

router.get("/", mid.mustLogin, controller.transaction.getAll);
router.get("/:id", mid.mustLogin, controller.transaction.getOne);
router.post("/", mid.mustLogin, controller.transaction.createTransaction);
router.put("/:id", mid.mustLogin, controller.transaction.payment);
router.delete("/:id", mid.mustLogin, controller.transaction.delete);

module.exports = router;