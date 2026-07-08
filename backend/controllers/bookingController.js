const Booking = require("../models/Booking");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const logActivity = require("../utils/activityLogger");

// Create booking
const createBooking = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, amount } = req.body;

    if (!vehicleId || !startDate || !endDate || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    if (!vehicle.available) {
      return res.status(400).json({ message: "Vehicle is already booked and unavailable" });
    }

    // Set vehicle availability to false
    vehicle.available = false;
    await vehicle.save();

    const booking = await Booking.create({
      user: req.user,
      userName: user.name,
      vehicle: vehicleId,
      vehicleName: vehicle.name,
      startDate,
      endDate,
      amount,
      status: "Booked",
    });

    await logActivity({
      userId: user._id,
      username: user.name,
      email: user.email,
      action: "CREATE_BOOKING",
      details: `Created booking for vehicle ${vehicle.name} (ID: ${booking._id}) with amount ₹${amount}`,
    });

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user's bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user, status: { $ne: "Cancelled" } }).populate("vehicle");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("vehicle");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Ensure it belongs to the authenticated user
    if (booking.user.toString() !== req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    booking.status = "Cancelled";
    await booking.save();

    // Mark vehicle available again
    if (booking.vehicle) {
      const vehicleId = booking.vehicle._id || booking.vehicle;
      await Vehicle.findByIdAndUpdate(vehicleId, { available: true });
    }

    const user = await User.findById(req.user);
    await logActivity({
      userId: user._id,
      username: user.name,
      email: user.email,
      action: "CANCEL_BOOKING",
      details: `Cancelled booking for vehicle ${booking.vehicle.name} (ID: ${booking._id})`,
    });

    res.status(200).json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Pay for booking
const payBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("vehicle");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Ensure it belongs to the authenticated user
    if (booking.user.toString() !== req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    booking.status = "Paid";
    await booking.save();

    const user = await User.findById(req.user);
    await logActivity({
      userId: user._id,
      username: user.name,
      email: user.email,
      action: "PAYMENT",
      details: `Payment of ₹${booking.amount} completed for Booking ID: ${booking._id} (${booking.vehicle.name})`,
    });

    res.status(200).json({ message: "Payment processed successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  payBooking,
};