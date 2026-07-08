const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleeware");

const {
  getVehicles,
  getVehicleById,
  addVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

// Public Routes
router.get("/", getVehicles);
router.get("/:id", getVehicleById);

// Protected Routes
router.post("/", protect, addVehicle);
router.put("/:id", protect, updateVehicle);
router.delete("/:id", protect, deleteVehicle);

module.exports = router;