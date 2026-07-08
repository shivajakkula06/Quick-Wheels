const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  cancelBooking,
  payBooking,
} = require("../controllers/bookingController");

const protect = require("../middleware/authMiddleeware");

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.delete("/:id", protect, cancelBooking);
router.put("/:id/pay", protect, payBooking);

module.exports = router;