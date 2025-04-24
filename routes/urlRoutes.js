const express = require("express");
const {
  handlePOSTgenerateNewShortUrl,
  handleGetAnalytics,
  handleDELETEsavedUrls,
} = require("../controllers/urlController");

const router = express.Router();

router.post("/", handlePOSTgenerateNewShortUrl); // generating short url
router.get("/analytics/:shortId", handleGetAnalytics); // getting the analytics of particular url
router.delete("/:shortId", handleDELETEsavedUrls);

module.exports = router;
