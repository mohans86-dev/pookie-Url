const { v4: uuidv4 } = require("uuid");
const User = require("../models/userModel");
const { setUser } = require("../services/auth");

async function handlePOSTuserSignup(req, res) {
  const { name, email, password } = req.body;
  await User.create({
    name,
    email,
    password,
  });

  return res.status(201).json({
    success: true,
    msg: "user registered",
  });

  // redirect to login page when registered
  // return res.redirect('/login');
}

async function handlePOSTuserLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) {
    return res.status(400).json({
      msg: "Invalid Username or password",
    });
    // return res.render('login', {
    //     error:"Invalid Username or password",
    // });
  }

  // creating token in cookie after login
  const token = setUser(user);
  // res.cookie('uid', token);

  user.token = token;
  await user.save(); // Save updated document

  return res.json({
    success: true,
    msg: "Logged in successfully",
    token: token,
  });

  // redirect to home page when logged in
  // return res.redirect('/');
}

module.exports = {
  handlePOSTuserSignup,
  handlePOSTuserLogin,
};
