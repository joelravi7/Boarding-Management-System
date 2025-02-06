const Room = require("../models/Room");
const path = require("path");
const fs = require("fs");

// Get rooms for logged-in customer
const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ customerId: req.userId });
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found for this customer" });
    }
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: "An error occurred while retrieving rooms" });
  }
};

// Add a new room
const addRoom = async (req, res) => {
  try {
    const { roomAddress, roomType, price, isNegotiable, ownerName, ownerContactNumber, description } = req.body;

    if (!roomAddress || !roomType || !price || !ownerName || !ownerContactNumber || !description) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (!req.files || req.files.length < 1 || req.files.length > 10) {
      return res.status(400).json({ error: "You must upload between 1 and 10 images." });
    }

    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
    const newRoom = new Room({
      roomAddress,
      roomType,
      price,
      isNegotiable: isNegotiable === "true",
      ownerName,
      ownerContactNumber,
      images: imagePaths,
      description,
      customerId: req.userId,
    });

    await newRoom.save();
    res.status(201).json({ message: "Room added successfully!" });
  } catch (err) {
    console.error("Error adding room:", err);
    res.status(500).json({ error: "An error occurred while adding the room." });
  }
};

// Update a room
const updateRoom = async (req, res) => {
  const roomId = req.params.id;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const { keepImages = "[]" } = req.body;
    const imagesToKeep = JSON.parse(keepImages);
    room.images = room.images.filter((image) => imagesToKeep.includes(image));

    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map((file) => `/uploads/${file.filename}`);
      room.images = [...room.images, ...uploadedImages];
    }

    room.roomType = req.body.roomType || room.roomType;
    room.roomAddress = req.body.roomAddress || room.roomAddress;
    room.price = req.body.price || room.price;
    room.description = req.body.description || room.description;

    await room.save();
    res.json({ message: "Room updated successfully", room });
  } catch (err) {
    res.status(500).json({ error: "Failed to update room" });
  }
};

// Delete a room
const deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const deletedRoom = await Room.findOneAndDelete({ _id: roomId, customerId: req.userId });

    if (!deletedRoom) {
      return res.status(404).json({ error: "Room not found or not authorized" });
    }

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "An error occurred while deleting the room" });
  }
};

// Get all unverified rooms
const getUnverifiedRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isVerified: false });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Verify a room (Approve/Reject)
const verifyRoom = async (req, res) => {
  try {
    if (typeof req.body.isVerified !== "boolean") {
      return res.status(400).json({ error: "Invalid value for isVerified" });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { isVerified: req.body.isVerified },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json(updatedRoom);
  } catch (err) {
    res.status(500).json({ error: "Error updating room verification status" });
  }
};

module.exports = {
  getMyRooms,
  addRoom,
  updateRoom,
  deleteRoom,
  getUnverifiedRooms,
  verifyRoom,
};
