const { userSchema, courseSchema, validateLogin, validateUpdate } = require("./schema");
const jwt = require('jsonwebtoken');

// Signup validation for both admin as well as user
module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  }
  
module.exports.validateCourse = (req, res, next) => {
  const { error } = courseSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

module.exports.validateLogin = (req, res, next) => {
  const { error } = validateLogin.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

module.exports.validateUpdate = (req, res, next) => {
  const { error } = validateUpdate.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

// Middleware to verify JWT token and set req.user
module.exports.isLogin = (req, res, next) => {
  const token = req.cookies.token;
  console.log('Token:', token); // Log token for debugging

  try {
    const user = jwt.verify(token, process.env.SECRET_KEY);
    console.log('User:', user); // Log user for debugging
    req.user = user;
    next();
  } catch (error) {
    console.error('Error:', error); // Log the error for debugging
    res.status(401).json({ message: 'Unauthorized' }); // Send unauthorized response
    res.clearCookie('token'); // Clear cookie on error
  }
};


exports.isUser = (req, res, next) => {
  if(req.user.role !== 'user'){
      return res.status(400).json({ message: 'User access denied' });
  }
  next();
}

exports.isAdmin = (req, res, next) => {
  if(req.user.role !== 'admin'){
      return res.status(400).json({ message: 'Admin access denied' });
  }
  next();
}