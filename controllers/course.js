const Course = require("../models/course");
const User = require("../models/user");
const { EnrollmentMail } = require("../utils/mail");

module.exports.createCourse = async (req, res) => {
  try {
    //   const token = req.cookies.token;
    //   console.log(token);
    let {
      title,
      description,
      duration,
      instructors,
      price,
      reviews,
      category,
      level,
      popularity,
    } = req.body;
    console.log(req.body);
    const newCourse = new Course({
      title,
      description,
      duration,
      instructors,
      price,
      reviews,
      category,
      level,
      popularity,
      Owner: req.user._id,
    });
    await newCourse
      .save()
      .then(() => console.log("Course created successfully"))
      .catch((e) => console.log(e.message));
    res.json({ newCourse });
  } catch (e) {
    res.status(404).send(e);
  }
};

module.exports.viewCourse = async (req, res) => {
  try {
    let { id } = req.params;
    console.log(id);
    const course = await Course.findById(id);

    // Return user profile
    console.log(course);
    res.json({ course });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.updateCourse = async (req, res) => {
  let { id } = req.params;
  const course = await Course.findById(id);
  if (!course) {
    reṣ.status(400).send("error", "Course you requested for does not exist!");
    //   res.redirect("/view");
  }
  if(typeof req.file !== "undefined") {
  let url = req.file.path;
  let filename = req.file.filename;
  course.image = {url, filename };
  }

  const {
    newTitle,
    newDescription,
    newDuration,
    newPrice,
    newCategory,
    newLevel,
    newPopularity,
  } = req.body;

  if (newTitle != null) course.title = newTitle;
  if (newDescription != null) course.description = newDescription;
  if (newDuration != null) course.duration = newDuration;
  if (newPrice != null) course.price = newPrice;
  if (newCategory != null) course.category = newCategory;
  if (newLevel != null) course.level = newLevel;
  if (newPopularity != null) course.popularity = newPopularity;
  await course.save();

  res.status(200).json({ message: "Course updated successfully" });
};

module.exports.deleteCourse = async (req, res) => {
  let { id } = req.params;
  const deletedCourse = await Course.findByIdAndDelete(id);
  if (!deletedCourse) {
    // req.flash("error", "Course you requested to delete, does not exist!");
    res.redirect("/view");
  }
  console.log(deletedCourse);
  req.status(200).send("success", "Course Removed!");
};

module.exports.enrollCourse = async (req, res) => {
  try {
    let { id } = req.params;
    const user = await User.findById(req.user._id);
    console.log(req.user);
    if (user.courses.includes(id)) {
      console.log("Already enrolled in the course");
      res.redirect("/course/:id");
    }

    user.courses.push(id);
    await user.save()
    .then(() => { 
      EnrollmentMail(user.email, user.name)
      .then(() => console.log("Course enrollment mail sent")) 
     })
     .then(() => res.json({ user }));
  } catch (e) {
    console.log("Error:", e);
    res.status(500).json({ e: "Internal server error" });
  }
};

module.exports.viewEnrolled = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(500).json("You have not enrolled in any course");
    }
    const courses = user.courses;

    // Find courses with matching ObjectId values
    Course.find({ _id: { $in: courses } })
    .select('title description duration instructors price reviews category level popularity owner')
    .populate('Owner', 'name') // Assuming 'name' is the field you want to populate from the 'owner' reference
      .then((courses) => {
        // Handle found courses
        console.log("Found courses:", courses);
        res.json({ courses });
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      });
  } catch (e) {
    console.log("Error:", e);
    res.status(500).json({ e: "Internal server error" });
  }
};


module.exports.showFiltered = async (req, res) => {
  try {
    let { title, category, level, duration, popularity } = req.body;
    const query = {};
    if (title) {
        query.title = title;
    }
    if (category) {
        query.category = category;
    }
    if (level) {
        query.level = level;
    }
    if (duration) {
        query.duration = duration;
    }
    if (popularity) {
        query.popularity = popularity;
    }

    
const page = req.query.page || 1; // Page number
const limit = req.query.limit || 15; // Number of courses per page

    Course.find(query)
    .select('title description duration instructors price reviews category level popularity owner')
    .populate('Owner', 'name')
    .skip((page - 1) * limit)
    .limit(limit)
    .then(courses => {
        // Handle fetched courses
        console.log('Page ' + page + ' of ' + totalPages);
        console.log('Total listings of filtered courses:', totalCount);
        console.log('Courses:', courses);
        res.json({courses });
    })
    .catch(error => {
        // Handle error
        console.error('Error:', error);
    });
    
  } catch (e) {
    console.log(e);
  }
}

module.exports.pagination = async (req, res) => {
  // Pagination parameters
const page = req.query.page || 1; // Page number
const limit = req.query.limit || 15; // Number of courses per page

// Execute the count query to determine the total number of documents
Course.countDocuments()
    .then(totalCount => {
        // Calculate total pages
        const totalPages = Math.ceil(totalCount / limit);

        // Execute the data query with pagination
        Course.find({})
            .select('title description duration instructors price reviews category level popularity owner')
            .populate('Owner', 'name')
            .skip((page - 1) * limit)
            .limit(limit)
            .then(courses => {
                // Handle fetched courses
                console.log('Page ' + page + ' of ' + totalPages);
                console.log('Total listings:', totalCount);
                console.log('Courses:', courses);
                res.json({courses });
            })
            .catch(error => {
                // Handle error
                console.error('Error:', error);
            });
    })
    .catch(error => {
        // Handle error
        console.error('Error:', error);
    });
}