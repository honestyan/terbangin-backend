const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");
const storage = require("../utils/storage");
const multer = require("multer");
const upload = multer();

router.get("/", mid.mustLogin, controller.transaction.getTrxByUser);
router.get("/:id", mid.mustLogin, controller.transaction.getOne);
router.post("/", mid.mustLogin, controller.transaction.createTransaction);
router.post(
  "/upload",
  mid.mustLogin,
  upload.single("document"),
  controller.transaction.uploadFile
);

module.exports = router;
