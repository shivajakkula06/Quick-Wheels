const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");

// Dashboard Statistics
exports.getDashboard = async (req, res) => {
    try {

        const totalUsers = await User.countDocuments();

        const totalVehicles = await Vehicle.countDocuments();

        const totalBookings = await Booking.countDocuments();

        const availableVehicles = await Vehicle.countDocuments({
            available: true,
        });

        res.status(200).json({
            totalUsers,
            totalVehicles,
            totalBookings,
            availableVehicles,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get All Users
exports.getUsers = async (req, res) => {
    try {

        const users = await User.find().select("-password");

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get All Bookings
exports.getBookings = async (req, res) => {
    try {

        const bookings = await Booking.find()
            .populate("user", "name email")
            .populate("vehicle");

        res.status(200).json(bookings);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Delete Vehicle
exports.deleteVehicle = async (req, res) => {
    try {

        await Vehicle.findByIdAndDelete(req.params.id);

        res.json({
            message: "Vehicle Deleted Successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get All Activity Logs
exports.getActivities = async (req, res) => {
    try {
        const Activity = require("../models/Activity");
        const activities = await Activity.find().sort({ createdAt: -1 });
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};