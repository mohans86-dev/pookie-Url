const express = require("express");
const {
  handlePOSTuserSignup,
  handlePOSTuserLogin,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", handlePOSTuserSignup); // for sign up
router.post("/login", handlePOSTuserLogin); // for login

module.exports = router;
