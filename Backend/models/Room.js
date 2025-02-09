const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomAddress: { type: String, required: true },
    roomCity: { type: String, required: true },
    roomType: { type: String, required: true },
    price: { type: Number, required: true },
    isNegotiable: { type: Boolean, required: true },
    ownerName: { type: String, required: true },
    ownerContactNumber: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }], // Array of image URLs
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the customer who added the room
    isVerified: { type: Boolean, default: false }, // Admin verification

    isBooked: { type: Boolean, default: false }, 
    buyerName: { type: String },
    buyerContactNumber: { type: String },
    buyerNIC: { type: String },
    buyerCustomerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the buyer
    buyingDate: { type: Date }, // Set only when the room is booked/purchased
    buyingDuration: { type: Number }, // Duration of stay in months/days (based on your requirement)
    buyerRating: { type: Number, min: 1, max: 5 } // Rating given by the owner (optional)
  },
  { timestamps: true } // Mongoose automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Room", roomSchema);
