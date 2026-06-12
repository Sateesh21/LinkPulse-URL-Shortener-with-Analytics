const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    shortCode: { type: String, required: true },
    urlId: { type: mongoose.Schema.Types.ObjectId, ref: "URL", required: true, index: true },
    ipAddress: { type: String, default: null },
    device: {
      type: String,
      enum: ["mobile", "tablet", "desktop", "unknown"],
      default: "unknown",
    },
  },
  { timestamps: true },
);

const Analytics = mongoose.model("Analytics", analyticsSchema);

module.exports = Analytics;

