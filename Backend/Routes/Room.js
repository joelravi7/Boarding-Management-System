const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Room = require("../models/Room");
const { verifyToken } = require("../middleware/verifyToken");

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    // Create upload directory if it does not exist
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per image
});

// Middleware for Multer errors
const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError || err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Route: Add a new room
router.post("/addroom", verifyToken, upload.array("images", 10), handleMulterErrors, async (req, res) => {
  try {
    const {
      roomAddress,
      roomType,
      price,
      isNegotiable,
      ownerName,
      ownerContactNumber,
      description,
    } = req.body;

    // Validate required fields
    if (!roomAddress || !roomType || !price || !ownerName || !ownerContactNumber || !description) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Validate image files
    if (!req.files || req.files.length < 1 || req.files.length > 10) {
      return res.status(400).json({ error: "You must upload between 1 and 10 images." });
    }

    // Map the uploaded files to their paths
    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    // Create a new Room document
    const newRoom = new Room({
      roomAddress,
      roomType,
      price,
      isNegotiable: isNegotiable === "true", // Convert isNegotiable to boolean
      ownerName,
      ownerContactNumber,
      images: imagePaths,
      description,
      customerId: req.userId, // Assuming `req.userId` is set by the verifyToken middleware
    });

    // Save the room to the database
    await newRoom.save();

    // Respond with success message
    res.status(201).json({ message: "Room added successfully!" });
  } catch (err) {
    console.error("Error adding room:", err);
    res.status(500).json({ error: "An error occurred while adding the room." });
  }
});





module.exports = router;
