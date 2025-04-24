const { getUser } = require("../services/auth");

async function restrictLoggedUserOnly(req, res, next) {
  const userUid = req.headers["authorization"];
  if (!userUid) {
    return res.status(400).json({
      msg: "from middleware, login first",
    });
    // return res.redirect("/login");
  }

  const token = userUid.split("Bearer ")[1];
  const user = getUser(token);
  if (!user) {
    return res.status(400).json({
      msg: "Token is not match",
    });
    // return res.redirect("/login");
  }
  req.user = user;
  next();
}

async function checkAuth(req, res, next) {
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
}

module.exports = {
  restrictLoggedUserOnly,
  checkAuth,
};
