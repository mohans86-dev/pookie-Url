const { v4: uuidv4 } = require("uuid");
const User = require("../models/userModel");
const { setUser } = require("../services/auth");

async function handlePOSTuserSignup(req, res) {
  try {
    const { name, email, password } = req.body;
    const newUser = await User.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      msg: "User registered successfully",
    });

    // res.redirect('/login');
  } catch (error) {
    console.error("Signup Error:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Registration failed",
      error: error.message,
    });
  }
}

async function handlePOSTuserLogin(req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return res.status(400).json({
        success: false,
        msg: "Invalid email or password",
      });

      // return res.render('login', { error: "Invalid email or password" });
    }

    // Generating token
    const token = setUser(user);

    // Save token in user
    user.token = token;
    // res.cookie('uid', token);

    await user.save();

    // Send response with token
    return res.status(200).json({
      success: true,
      msg: "Logged in successfully",
      token: token,
    });

    // res.redirect('/');
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({
      success: false,
      msg: "An error occurred during login",
      error: error.message,
    });
  }
}

module.exports = {
  handlePOSTuserSignup,
  handlePOSTuserLogin,
};
