const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");

router.post("/register", controller.auth.register);
router.post("/login", controller.auth.login);
router.get("/verify/:token", controller.auth.verify);
router.get("/google", controller.auth.google);
router.post("/changePassword", mid.mustLogin, controller.auth.changePassword);
router.post("/forgotPassword", controller.auth.forgotPasswordBE);
router.post("/resetPassword", controller.auth.resetPassword);
router.post("/readProfile", mid.mustLogin, controller.auth.readProfile);
router.put("/updateProfile", mid.mustLogin, controller.auth.updateProfile);

module.exports = router;
