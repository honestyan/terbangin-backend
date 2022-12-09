const express = require("express");
const router = express.Router();
const auth = require("./auth");
const airport = require("./airport");
const admin = require("./admin");
const product = require("./product");
const transaction = require("./transaction");
const airline = require("./airline");
const airplane = require("./airplane");

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
router.use("/transaction", transaction);
router.use("/airline", airline);
router.use("/airplane", airplane);

module.exports = router;