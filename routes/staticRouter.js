const express = require("express");
const URL = require("../models/urlsModel");
const User = require("../models/userModel");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        msg: "Sorry! you are not logged in",
      });

      // return res.redirect('/login');
    }

    const allUrls = await URL.find({ createdBy: req.user._id });
    const user = await User.findById(req.user._id).select("token");

    return res.status(200).json({
      success: true,
      msg: "URLs fetched successfully",
      token: user.token,
      urls: allUrls,
    });

    // return res.render('home', { urls: allUrls });
  } catch (error) {
    console.error("Error fetching URLs:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }
});

// router.get('/signup', (req, res)=>{
//     return res.render('signup');
// });

// router.get('/login', (req, res)=>{
//     return res.render('login');
// });

module.exports = router;
