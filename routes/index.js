const express = require("express");
const router = express.Router();
const auth = require("./auth");
const admin = require("./admin");
const product = require("./product");
const transaction = require("./transaction");
const notification = require("./notification");
const airport = require("./airport");
const eticket = require("./eticket");
const profile = require("./profile");

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
router.use("/notification", notification);
router.use("/airport", airport);
router.use("/eticket", eticket);
router.use("/profile", profile);

module.exports = router;
