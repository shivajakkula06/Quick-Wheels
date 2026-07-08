const Activity = require("../models/Activity");

/**
 * Log a user action/activity to MongoDB
 * @param {Object} params
 * @param {string} params.userId - The ID of the user (optional)
 * @param {string} params.username - The name of the user
 * @param {string} params.email - The email of the user (optional)
 * @param {string} params.action - The action type (e.g. REGISTER, LOGIN, CREATE_BOOKING)
 * @param {string} params.details - Details of the action
 */
const logActivity = async ({ userId, username, email, action, details }) => {
  try {
    await Activity.create({
      user: userId || null,
      username: username || "Guest",
      email: email || "",
      action,
      details,
    });
  } catch (error) {
    console.error("Error logging activity to MongoDB:", error);
  }
};

module.exports = logActivity;
