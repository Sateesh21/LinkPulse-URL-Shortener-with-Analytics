const URL = require("../models/url.models");
const Analytics = require("../models/analytics.model");
const mongoose = require("mongoose");

const getAnalyticsByShortCode = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const userId = req.user.id;

    const url = await URL.findOne({ shortCode, userId });

    if (!url)
      return res.status(404).json({
        success: false,
        message: "URL not found for the user",
      });

    //total clicks
    const totalClicks = url.totalClicks;

    const dailyBreakdown = await Analytics.aggregate([
      { $match: { urlId: url._id } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    //device breakdown using aggregation
    const deviceBreakdown = await Analytics.aggregate([
      { $match: { urlId: url._id } },
      {
        $group: {
          _id: "$device",
          count: { $sum: 1 },
        },
      },
    ]);

    //return all data
    return res.status(200).json({
      success: true,
      message: "Analytics fetched successfully",
      data: {
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        totalClicks,
        isActive: url.isActive,
        dailyBreakdown,
        deviceBreakdown,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//getAllAnalytics

const getAllAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Step 1 — find all URLs belonging to this user
    const urls = await URL.find({ userId });

    if (urls.length === 0)
      return res.status(200).json({
        success: true,
        message: "No URLs found",
        data: [],
      });

    // Step 2 — get URL ids
    const urlIds = urls.map((url) => url._id);

    // Step 3 — total clicks across all URLs
    const totalClicks = urls.reduce((sum, url) => sum + url.totalClicks, 0);

    // Step 4 — daily breakdown across all URLs
    const dailyBreakdown = await Analytics.aggregate([
      { $match: { urlId: { $in: urlIds } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Step 5 — device breakdown across all URLs
    const deviceBreakdown = await Analytics.aggregate([
      { $match: { urlId: { $in: urlIds } } },
      {
        $group: {
          _id: "$device",
          count: { $sum: 1 },
        },
      },
    ]);

    // Step 6 — per URL summary
    const urlSummary = urls.map((url) => ({
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      totalClicks: url.totalClicks,
      isActive: url.isActive,
    }));

    return res.status(200).json({
      success: true,
      message: "Analytics fetched successfully",
      data: {
        totalUrls: urls.length,
        totalClicks,
        dailyBreakdown,
        deviceBreakdown,
        urls: urlSummary,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getAnalyticsByShortCode, getAllAnalytics };
