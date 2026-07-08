const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleeware");
const adminOnly = require("../middleware/adminMiddleware");

const {
    getDashboard,
    getUsers,
    getBookings,
    deleteVehicle,
    getActivities,
} = require("../controllers/adminController");

router.get("/dashboard", protect, adminOnly, getDashboard);
router.get("/users", protect, adminOnly, getUsers);
router.get("/bookings", protect, adminOnly, getBookings);
router.delete("/vehicle/:id", protect, adminOnly, deleteVehicle);
router.get("/activities", protect, adminOnly, getActivities);

module.exports = router;