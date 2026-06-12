const express = require("express");
const {
  getAnalyticsByShortCode,
  getAllAnalytics,
} = require("../controllers/analytics.controllers");
const authMiddleware = require("../middleware/auth.middleware");

const analyticsRouter = express.Router();

analyticsRouter.get("/getanalyticsbycode/:shortCode", authMiddleware, getAnalyticsByShortCode);
analyticsRouter.get("/getallanalytics", authMiddleware, getAllAnalytics);

module.exports = analyticsRouter;
