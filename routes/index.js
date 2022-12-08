const express = require("express");
const router = express.Router();
const auth = require("./auth");
const airport = require("./airport");
const admin = require("./admin");
const product = require("./product");

router.get("/", (req, res) => {
  return res.status(200).json({
    status: true,
    message: "Welcome to Terbangin API",
  });
});

router.use("/admin", admin);
router.use("/auth", auth);
router.use("/airport", airport);
router.use("/product", product);

module.exports = router;
