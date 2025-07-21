const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./connection");
const { restrictLoggedUserOnly, checkAuth } = require("./middlewares/authMW");
const URL = require("./models/urlsModel");

const staticRoute = require("./routes/staticRouter");
const urlRoute = require("./routes/urlRoutes");
const userRoute = require("./routes/userRoutes");

const app = express();

dotenv.config({
  path: "./config/config.env",
});

// connecting mongoDb
connectDB();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// for test api
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    msg: "Successfully running",
  });
});

// for redirecting the urls with original urls
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.use("/user", userRoute); // for signup and login
app.use("/url", restrictLoggedUserOnly, urlRoute); // for auth verify and then allowing to generate short url
app.use("/get-urls", checkAuth, staticRoute); // for getting the logged in user's url

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server is running at PORT:${PORT}`));
