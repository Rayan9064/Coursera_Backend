const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const userController = require("../controllers/user.js");
const { validateUser, validateLogin, isLogin, validateUpdate } = require("../middleware.js");

router
    .route("/signup")
    .post(validateUser, wrapAsync(userController.signup)); 

router
    .route("/login")
    .get(userController.login)
    .post(validateLogin, wrapAsync(userController.login));

router
    .route("/profile")
    .get(isLogin, wrapAsync(userController.profile))
    .put(validateUpdate, isLogin, wrapAsync(userController.updateUser));

module.exports = router;