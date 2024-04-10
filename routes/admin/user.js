const express = require("express");
const router = express.Router();
const wrapAsync = require("../../utils/wrapAsync.js");
const adminController = require("../../controllers/admin/user.js");
const { validateUser, validateLogin } = require("../../middleware.js");

router
    .route("/admin/signup")
    .post(validateUser, wrapAsync(adminController.adminSignup)); 

router
    .route("/admin/login")
    .post (validateLogin, wrapAsync(adminController.adminLogin));
 
module.exports = router;