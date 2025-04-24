const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectMongoDB } = require("./connection");
const { restrictLoggedUserOnly, checkAuth } = require("./middlewares/authMW");
const URL = require("./models/urlsModel");

const staticRoute = require("./routes/staticRouter");
const urlRoute = require("./routes/urlRoutes");
const userRoute = require("./routes/userRoutes");

const app = express();
const PORT = 8001;

connectMongoDB("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log("MongoDB Connected"))
  .catch(() => console.log("Error while connecting to MongoDB"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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
app.use("/", checkAuth, staticRoute); // for getting the logged in user's url

app.listen(PORT, () => console.log(`Server is running at PORT:${PORT}`));
