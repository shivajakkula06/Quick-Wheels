const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["Car", "Bike"],
        required: true
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    available: {
        type: Boolean,
        default: true
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);