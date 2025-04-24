const express = require("express");
const URL = require("../models/urlsModel");
const User = require("../models/userModel");

const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.user) {
    return res.status(400).json({
      success: false,
      msg: "Login first",
    });

    // return res.redirect('/login');
  }
  const allUrls = await URL.find({ createdBy: req.user._id });
  const authToken = await User.findOne({ _id: req.user._id });

  return res.status(200).json({
    success: true,
    token: authToken.token,
    urls: allUrls,
  });
  // return res.render('home',{
  //     urls:allUrls,
  // });
});

// router.get('/signup', (req, res)=>{
//     return res.render('signup');
// });

// router.get('/login', (req, res)=>{
//     return res.render('login');
// });

module.exports = router;
