const User = require("../../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {RegisterationMail} = require('../../utils/mail');
const { Admin } = require("mongodb");

// Route handler for admin registeration
module.exports.adminSignup = async (req, res) => {
  try {
   let { name, email, password } = req.body;
   const hashedPassword = await bcrypt.hash(password, 10);
   const newUser = new User({ name: name, email: email, password: hashedPassword, role: 'admin' });
   

   await newUser.save()
   .then(() => { 
     RegisterationMail(email, name)
     .then(() => console.log("Admin registeration mail sent")) 
    })
   .then(() => {
    res.json("Admin registered");
    console.log("User saved successfully");
    console.log(newUser);
  })
   .catch((error) => {
    if (error.code === 11000) {
      console.log('Duplicate key error: Email already exists, try with different email');
      // Handle duplicate key error
      res.redirect("/");
  } else {
      console.log('Error:', error.message);
      // Handle other errors
  }
  });

  } catch (error) {
      console.log('Error:', error.message);
      res.redirect("/admin/signup");
  }
};

// Route handler for admin login
module.exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    if(user.role != 'admin'){
      return res.status(401).json({ error: 'Access denied' });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });

    // Set the token in a cookie
    res.cookie('token', token, { httpOnly: true });

    console.log(token);
    // Send token to client
    res.json({ token });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
