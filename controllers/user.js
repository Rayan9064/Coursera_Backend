const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// New user registration
module.exports.signup = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });
    await newUser.save()
    .then(() => { 
      RegisterationMail(email, name)
      .then(() => console.log("Mail sent")) 
     })
      .then(() => {
        console.log(newUser, "User created successfully");
        res.json({ newUser });
      })
      .catch((error) => {
        if (error.code === 11000) {
          console.log(
            "Duplicate key error: Email already exists, try with different email"
          );
          // Handle duplicate key error
          res.redirect("/");
        } else {
          console.log("Error:", error.message);
          // Handle other errors
        }
      });
  } catch (e) {
    res.status(404).send(e.message);
    res.redirect("/signup");
  }
};

// Route to update user's name and email
module.exports.updateUser = async (req, res) => {
  try {
    const { email, password, newName, newEmail } = req.body;
    console.log(req.body);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare password with hashed password
    console.log(user.password);
    console.log(user.email);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Update user's name and email
    if (newName != null) user.name = newName;
    if (newEmail != null) user.email = newEmail;
    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Route handler for user login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role == "admin") {
      return res.status(404).json({ error: "Only user login" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Set the token in a cookie
    res.cookie("token", token, { httpOnly: true });

    console.log(token);
    // Send token to client
    res.json({ token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.profile = async (req, res) => {
  try {
    // Extract userId from JWT token payload
    const userId = req.user._id;

    // Find user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user profile
    res.json({ user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
