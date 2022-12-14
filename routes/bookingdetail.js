const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");
const storage = require('../utils/storage');

router.post("/create", storage.document.fields([{
    name: 'visa', maxCount: 1
  }, {
    name: 'passport', maxCount: 1
  }, {
    name: 'izin', maxCount: 1
  }]),controller.bookingdetail.create);

module.exports = router;
