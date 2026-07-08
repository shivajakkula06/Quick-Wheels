const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");

const seedVehicles = async () => {
  try {
    const count = await Vehicle.countDocuments();
    if (count === 0) {
      await Vehicle.create([
        {
          name: "Swift",
          brand: "Maruti Suzuki",
          type: "Car",
          pricePerDay: 1200,
          image: "/cars/swift.jpg",
          available: true,
        },
        {
          name: "Creta",
          brand: "Hyundai",
          type: "Car",
          pricePerDay: 2500,
          image: "/cars/creta.jpg",
          available: true,
        },
        {
          name: "Royal Enfield",
          brand: "Royal Enfield",
          type: "Bike",
          pricePerDay: 900,
          image: "/bikes/royal-enfield.jpg",
          available: true,
        },
        {
          name: "Activa",
          brand: "Honda",
          type: "Bike",
          pricePerDay: 500,
          image: "/bikes/activa.jpg",
          available: true,
        },
      ]);
      console.log("Database seeded with default vehicles.");
    }
  } catch (error) {
    console.error("Failed to seed default vehicles:", error);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
    await seedVehicles();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;