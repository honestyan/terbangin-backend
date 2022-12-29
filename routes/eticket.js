const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");
const multer = require("multer");
const upload = multer();

router.get(
  "/:invoice/",
  mid.mustLogin,
  upload.single("document"),
  controller.eticket.create
);
router.put("/checkIn/", controller.eticket.scan);

module.exports = router;
