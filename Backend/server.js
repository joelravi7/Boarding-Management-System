const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables from .env file
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 8070; // Fallback to 8070 if PORT is not defined

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  // Remove 'Bearer ' prefix from the token if it exists
  const tokenWithoutBearer = token.startsWith("Bearer ") ? token.slice(7) : token;

  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Add user ID to request object
    req.userId = decoded.id;
    next(); // Proceed to the next middleware or route handler
  });
};

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON payloads

// MongoDB Connection URL (Ensure .env has MONGODB_URL and JWT_SECRET set)
const URL = process.env.MONGODB_URL;

if (!URL) {
  console.error("MONGODB_URL is not defined in the .env file");
  process.exit(1);
}

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connection successful!"))
  .catch((err) => {
    console.error("MongoDB Connection failed:", err.message);
    process.exit(1); // Exit the process if connection fails
  });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB is connected and ready!");
});

// Models
const Room = require("./models/Room");
const User = require("./models/Customer"); // Ensure this path is correct
const Admin = require("./models/Admin")

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Serve static files (images) from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Registration Route
app.post("/register", async (req, res) => {
  const { name, Lname, DOB, Gender, Phonenumber1, Phonenumber2, Address, email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      Lname,
      DOB,
      Gender,
      Phonenumber1,
      Phonenumber2,
      Address,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Admin Registration Route
app.post("/Adminregister", async (req, res) => {
  const { name, Lname, Phonenumber,  email, password, createdAt } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newAdmin = new Admin({
      name,
      Lname,
      Phonenumber,
      email,
      password: hashedPassword,
      createdAt
    });
    await newAdmin.save();

    res.json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(403).json({ error: "Invalid credentials" });

    // Ensure process.env.JWT_SECRET is set correctly
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT Secret is not defined" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, username: user.name });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Admin Login Route
app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) return res.status(403).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, username: admin.name });
  } catch (err) {
    console.error("Error during admin login:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Route to fetch all rooms (public)
app.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find(); // Fetch all rooms from the database
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found" });
    }
    res.json(rooms); // Send the room data as JSON response
  } catch (err) {
    console.error("Error fetching rooms:", err.message);
    res.status(500).json({ error: "An error occurred while fetching rooms" });
  }
});

// Route to fetch rooms by the logged-in customer (only the customer's rooms)
app.get("/myrooms", verifyToken, async (req, res) => {
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

// Route to add a new room (protected)
app.post("/addroom", verifyToken, upload.array("images", 10), async (req, res) => {
  try {
    const { roomAddress, roomType, price, isNegotiable, ownerName, ownerContactNumber, description } = req.body;

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


app.put("/updateroom/:id", upload.array("images", 10), async (req, res) => {
  const roomId = req.params.id;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Parse the list of images to keep
    const { keepImages = "[]" } = req.body;
    const imagesToKeep = JSON.parse(keepImages);

    // Filter out images that are not in the keep list
    room.images = room.images.filter((image) => imagesToKeep.includes(image));

    // Add new images
    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map((file) => `/uploads/${file.filename}`);
      room.images = [...room.images, ...uploadedImages]; // Append new images
    }

    // Update room details
    room.roomType = req.body.roomType || room.roomType;
    room.roomAddress = req.body.roomAddress || room.roomAddress;
    room.price = req.body.price || room.price;
    room.description = req.body.description || room.description;

    await room.save();
    res.json({ message: "Room updated successfully", room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update room" });
  }
});




// Route to delete a room (protected)
app.delete("/deleteroom/:id", verifyToken, async (req, res) => {
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

// Access Customer routes
const CustomerRouter = require("./Routes/Customer.js");
app.use("/Customer", CustomerRouter);

// Error handling for unhandled routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is up and running on port number: ${PORT}`);
});
