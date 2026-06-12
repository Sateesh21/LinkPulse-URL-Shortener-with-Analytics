const URL = require("../models/url.models");
const UAParser = require("ua-parser-js");
const generateShortCode = require("../utils/generateShortCode");
const urlValidator = require("../validators/url.validator");
const Analytics = require("../models/analytics.model");
const validUrlCheck = require("../utils/validUrlCheck");
const redisClient = require("../config/redis");

//generate shorter code
const shortenURL = async (req, res) => {
  try {
    const { originalUrl, clickLimit } = req.body;
    const userId = req.user.id;

    const { error } = urlValidator.validate({ originalUrl });
    if (error)
      return res.status(400).json({
        success: false,
        message: "Validation Has Failed.",
      });

    // const isReachable = await validUrlCheck(originalUrl);
    // if (!isReachable) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "URL is not reachable, please provide a valid working URL",
    //   });
    // }

    const existingURL = await URL.findOne({ originalUrl, userId });
    if (existingURL)
      return res.status(200).json({
        success: true,
        message: "URL already shortened",
        data: {
          originalUrl: existingURL.originalUrl,
          shortCode: existingURL.shortCode,
          shortUrl: existingURL.shortUrl,
        },
      });

    let shortCode = generateShortCode();
    let codeExists = await URL.findOne({ shortCode });

    while (codeExists) {
      shortCode = generateShortCode();
      codeExists = await URL.findOne({ shortCode });
    }

    const shortUrl = `http://localhost:${process.env.PORT || 3000}/${shortCode}`;

    const newURL = new URL({
      originalUrl,
      shortCode,
      shortUrl,
      userId,
      clickLimit: clickLimit || null,
    });

    const savedURL = await newURL.save();

    return res.status(201).json({
      success: true,
      message: "URL shortened successfully",
      data: {
        originalUrl: savedURL.originalUrl,
        shortCode: savedURL.shortCode,
        shortUrl: savedURL.shortUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Url  redirection
const redirectURL = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // const url = await URL.findOne({ shortCode }); //before redis
    const cachedUrl = await redisClient.get(shortCode); // redis

    let url;

    //Cache Integration
    if (cachedUrl) {
      console.log("From the Cache...");
      url = await URL.findOne({ shortCode });
    } else {
      console.log("Cached Missed");
      url = await URL.findOne({ shortCode });
    }

    //find url
    if (!url)
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });

    //active or not
    if (!url.isActive)
      return res.status(404).json({
        success: false,
        message: "URL is no longer active",
      });

    //expired or not
    if (url.expiresAt && url.expiresAt < Date.now())
      return res.status(410).json({
        success: false,
        message: "URL has expired",
      });

    //device info
    const parser = new UAParser(req.headers["user-agent"]);
    const deviceType = parser.getDevice().type || "desktop";

    // Save
    await Analytics.create({
      shortCode,
      urlId: url._id,
      ipAddress: req.ip,
      device: deviceType,
    });

    //increment
    url.totalClicks += 1;

    if (url.clickLimit !== null && url.totalClicks >= url.clickLimit) {
      url.isActive = false;
    }

    await url.save();

    if (!cachedUrl) {
      await redisClient.set(shortCode, url.originalUrl, "EX", 3600);
    }

    //redirect
    return res.redirect(302, url.originalUrl);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get the all Urls for the User
const getAllURLs = async (req, res) => {
  try {
    const userId = req.user.id;

    const urls = await URL.find({ userId })
      .select("-__v")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "URLs fetched successfully",
      total: urls.length,
      data: urls,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Url deactivation
const deactivateURL = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    //find the Url
    const url = await URL.findOne({ _id: id, userId });

    if (!url)
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });

    if (!url.isActive)
      return res.status(400).json({
        success: false,
        message: "URL is already deactivated",
      });

    url.isActive = false;
    await url.save();

    return res.status(200).json({
      success: true,
      message: "URL deactivated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Somthing went wrong",
    });
  }
};

module.exports = {
  shortenURL,
  redirectURL,
  getAllURLs,
  deactivateURL,
};
