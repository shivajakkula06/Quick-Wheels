const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    username: {
      type: String,
      required: true,
      default: "Guest",
    },
    email: {
      type: String,
      required: false,
    },
    action: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Activity", activitySchema);
