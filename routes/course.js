const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const courseController = require("../controllers/course.js");
const { validateCourse, isAdmin, isLogin } = require("../middleware.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
    .route("/course/new")
    .post(validateCourse, isLogin, isAdmin, upload.single("course[image]"), wrapAsync(courseController.createCourse));

router
    .route("/admin/:id")
    .get( isLogin, isAdmin, wrapAsync(courseController.viewCourse))
    .put( isLogin, isAdmin, wrapAsync(courseController.updateCourse))
    .delete( isLogin, isAdmin, wrapAsync(courseController.deleteCourse));

// User route for course enrollment 
router
    .route("/course/:id")
    .get(isLogin, wrapAsync(courseController.viewCourse))
    .post(isLogin, wrapAsync(courseController.enrollCourse));

router
    .route("/user/courses")
    .get(isLogin, wrapAsync(courseController.viewEnrolled));


router // Shows courses with pagination feature
    .route("/courses")
    .get(wrapAsync(courseController.pagination));

router // Shows courses with filters and pagination
    .route("/courses/filter")
    .post(isLogin, wrapAsync(courseController.showFiltered));
    
module.exports = router;