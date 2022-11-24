const express = require("express");
const router = express.Router();
const controller = require("../controllers");

router.post("/register", controller.auth.register);
router.post("/login", controller.auth.login);
router.get("/google", controller.auth.google);

module.exports = router;
