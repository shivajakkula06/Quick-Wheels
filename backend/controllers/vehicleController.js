const Vehicle = require("../models/Vehicle");

// Add Vehicle
exports.addVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.create(req.body);
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Vehicles
exports.getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Vehicle By ID
exports.getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        res.json(vehicle);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Vehicle
exports.updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(vehicle);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Vehicle
exports.deleteVehicle = async (req, res) => {
    try {
        await Vehicle.findByIdAndDelete(req.params.id);

        res.json({
            message: "Vehicle Deleted Successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};