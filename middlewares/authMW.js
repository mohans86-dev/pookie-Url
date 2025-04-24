const { getUser } = require("../services/auth");

async function restrictLoggedUserOnly(req, res, next) {
  try {
    const userUid = req.headers["authorization"];
    if (!userUid) {
      return res.status(401).json({
        msg: "Authorization token missing or malformed. Please log in.",
      });
      // return res.redirect("/login");
    }

    const token = userUid.split("Bearer ")[1];
    const user = getUser(token);
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Token is not match",
      });
      // return res.redirect("/login");
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error during authorization.",
    });
  }
}

async function checkAuth(req, res, next) {
  try {
    const userUid = req.headers["authorization"];
    if (!userUid || !userUid.startsWith("Bearer ")) {
      req.user = null;
      return res.status(401).json({
        success: false,
        msg: "Token missing or malformed. Please log in.",
      });
      // req.user = null;
      // return next();
    }

    const token = userUid.split("Bearer ")[1];
    const user = getUser(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error during authentication.",
    });
  }
}

module.exports = {
  restrictLoggedUserOnly,
  checkAuth,
};
