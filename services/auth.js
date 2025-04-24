const jwt = require("jsonwebtoken");

function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    process.env.jwtUserSecret
  );
}

function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.jwtUserSecret);
  } catch (err) {
    console.error("Invalid JWT:", err.message);
    return null; // Prevents app crash on token errors
  }
}

module.exports = {
  setUser,
  getUser,
};
