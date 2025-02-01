const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Room = require("../models/Room");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token after 'Bearer'
  if (!token) {
    return res.status(403).json({ error: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Attach user ID to request object
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};


module.exports = { verifyToken };


const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (extname && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png) are allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});



// Route to fetch rooms by the logged-in customer
router.get("/myrooms", verifyToken, async (req, res) => {
  try {
    const rooms = await Room.find({ customerId: req.userId });
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found for this customer" });
    }
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: "An error occurred while retrieving rooms" });
  }
});

// Route to add a new room
router.post("/addroom", verifyToken, upload.array("images", 10), async (req, res) => {
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
});


// Route to update a room
router.put("/updateroom/:id", upload.array("images", 10), async (req, res) => {
  const roomId = req.params.id;

  try {
    // Log the roomId to verify it's passed correctly
    console.log("Room ID to update:", roomId);

    // Find the room by ID
    const room = await Room.findById(roomId);
    if (!room) {
      // Room not found, send an error response
      console.log(`Room with ID ${roomId} not found.`);
      return res.status(404).json({ error: "Room not found" });
    }

    // Log the room data before updates
    console.log("Existing room data:", room);

    // Parse the list of images to keep
    const { keepImages = "[]" } = req.body;
    const imagesToKeep = JSON.parse(keepImages);

    // Log the images to keep
    console.log("Images to keep:", imagesToKeep);

    // Filter out images that are not in the keep list
    room.images = room.images.filter((image) => imagesToKeep.includes(image));

    // Add new images if they exist in the request
    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map((file) => `/uploads/${file.filename}`);
      room.images = [...room.images, ...uploadedImages]; // Append new images
      console.log("New images added:", uploadedImages);
    }

    // Update room details
    room.roomType = req.body.roomType || room.roomType;
    room.roomAddress = req.body.roomAddress || room.roomAddress;
    room.price = req.body.price || room.price;
    room.description = req.body.description || room.description;

    // Log updated room data
    console.log("Updated room data:", room);

    // Save the updated room to the database
    await room.save();

    // Return success response with updated room
    res.json({ message: "Room updated successfully", room });
  } catch (err) {
    // Log the error for debugging
    console.error("Error updating room:", err);
    res.status(500).json({ error: "Failed to update room" });
  }
});


// Route to delete a room
router.delete("/deleteroom/:id", verifyToken, async (req, res) => {
  try {
    const roomId = req.params.id;
    const deletedRoom = await Room.findOneAndDelete({ _id: roomId, customerId: req.userId });
    if (!deletedRoom) {
      return res.status(404).json({ error: "Room not found or not authorized" });
    }
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (err) {
    console.error("Error deleting room:", err.message);
    res.status(500).json({ error: "An error occurred while deleting the room" });
  }
});


module.exports = router;
