const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");

/**
 * Checks and updates bookings that have ended.
 * - Marks paid bookings as "Completed" and sets their vehicles to available.
 * - Marks unpaid (booked) bookings as "Cancelled" (since they expired without payment) and sets their vehicles to available.
 */
const checkAndCompleteBookings = async () => {
  try {
    const now = new Date();

    // 1. Process Paid bookings that have ended -> mark as Completed and release vehicle
    const bookingsToComplete = await Booking.find({
      status: "Paid",
      endDate: { $lt: now }
    });

    for (const booking of bookingsToComplete) {
      booking.status = "Completed";
      await booking.save();

      if (booking.vehicle) {
        const vehicleId = booking.vehicle._id || booking.vehicle;
        await Vehicle.findByIdAndUpdate(vehicleId, { available: true });
      }
      console.log(`[Booking Updater] Paid booking ${booking._id} completed. Vehicle released.`);
    }

    // 2. Process Booked (unpaid) bookings that have ended -> mark as Cancelled and release vehicle
    const bookingsToCancel = await Booking.find({
      status: "Booked",
      endDate: { $lt: now }
    });

    for (const booking of bookingsToCancel) {
      booking.status = "Cancelled";
      await booking.save();

      if (booking.vehicle) {
        const vehicleId = booking.vehicle._id || booking.vehicle;
        await Vehicle.findByIdAndUpdate(vehicleId, { available: true });
      }
      console.log(`[Booking Updater] Unpaid booking ${booking._id} expired & cancelled. Vehicle released.`);
    }
  } catch (error) {
    console.error("[Booking Updater] Error updating expired bookings:", error);
  }
};

module.exports = checkAndCompleteBookings;
