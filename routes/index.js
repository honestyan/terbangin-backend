const express = require("express");
const router = express.Router();
const auth = require("./auth");
const admin = require("./admin");
const product = require("./product");
const transaction = require("./transaction");
const bookingdetail = require("./bookingdetail");
const notification = require("./notification");

router.get("/", (req, res) => {
  return res.status(200).json({
    status: true,
    message: "Welcome to Terbangin API",
  });
});

router.use("/admin", admin);
router.use("/auth", auth);
router.use("/product", product);
router.use("/transaction", transaction);
router.use("/bookingdetail", bookingdetail);
router.use("/notification", notification);

module.exports = router;
