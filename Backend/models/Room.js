const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomAddress: { type: String, required: true },
  roomType: { type: String, required: true },
  price: { type: Number, required: true },
  isNegotiable: { type: Boolean, required: true },
  ownerName: { type: String, required: true },
  ownerContactNumber: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }], // Array of image URLs
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the customer who added the room
}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);
