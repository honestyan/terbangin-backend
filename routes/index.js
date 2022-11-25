const express = require("express");
const router = express.Router();
const auth = require("./auth");

router.get("/", (req, res) => {
  return res.status(200).json({
    status: true,
    message: "Welcome to Terbangin API",
  });
});

router.use("/auth", auth);

module.exports = router;