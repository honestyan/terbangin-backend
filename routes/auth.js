const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const mid = require("../helpers/middleware");

router.post("/register", controller.auth.register);
router.post("/login", controller.auth.login);
router.get("/verify/:token", controller.auth.verify);
router.get("/google", controller.auth.google);
router.post("/changepassword", mid.mustLogin, controller.auth.changePassword);
router.post("/forgotpassword", controller.auth.forgotPasswordBE);
router.post("/reset-password", controller.auth.resetPassword);
router.post("/readprofile", mid.mustLogin, controller.auth.readProfile);
router.put("/updateprofile", mid.mustLogin, controller.auth.updateProfile);

module.exports = router;
