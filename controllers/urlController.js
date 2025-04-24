const shortid = require("shortid");
const URL = require("../models/urlsModel");

async function handlePOSTgenerateNewShortUrl(req, res) {
  const shortID = shortid();
  const body = req.body;
  if (!body.url) {
    return res.status(400).json({ errorMsg: "url is required" });
  }
  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
    createdBy: req.user._id,
  });
  return res.status(201).json({
    success: true,
    id: shortID,
    msg: "URL Id created",
  });

  // return res.render('home', {
  //     id:shortID,
  // });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

async function handleDELETEsavedUrls(req, res) {
  const shortid = req.params.shortId;
  if (!shortid)
    return res.status(400).json({
      success: false,
      msg: "url Id is not provided",
    });
  const url = await URL.findOneAndDelete({ shortId: shortid });
  if (!url) {
    return res.status(404).json({
      success: false,
      msg: `${shortid} Not found`,
    });
  }

  return res.status(200).json({
    success: true,
    msg: "URL deleted successfully",
  });
}

module.exports = {
  handlePOSTgenerateNewShortUrl,
  handleGetAnalytics,
  handleDELETEsavedUrls,
};
