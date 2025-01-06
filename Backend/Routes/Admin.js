const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin"); // Import Admin model

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided!" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.user = verified; // Attach user info to request
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid or Expired Token!" });
  }
};

// Add a new admin
router.post("/register", async (req, res) => {
  const { name, lname, phoneNumber, email, password, createdAt } = req.body;

  if (!name || !lname || !phoneNumber || !email || !password || !createdAt) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validate createdAt as a valid date
  if (isNaN(new Date(createdAt).getTime())) {
    return res.status(400).json({ message: "Invalid date format for createdAt" });
  }

  try {
    // Check if email is already registered
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password and create new admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      name,
      lname,
      phoneNumber,
      email,
      password: hashedPassword,
      createdAt,
    });

    await newAdmin.save();

    // Generate token
    const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "1h" });

    res.status(201).json({ message: "Registration successful", token, admin: newAdmin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get logged-in admin details
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin fetched successfully", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update admin details
router.put("/update/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, password, lname, phoneNumber } = req.body;

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update fields if provided
    admin.name = name || admin.name;
    admin.email = email || admin.email;
    if (password) {
      admin.password = await bcrypt.hash(password, 10); // Hash the new password
    }
    admin.lname = lname || admin.lname;
    admin.phoneNumber = phoneNumber || admin.phoneNumber;
    
    await admin.save();

    res.status(200).json({ message: "Admin updated successfully", admin });
  } catch (error) {
    res.status(500).json({ message: "An error occurred during the update", error: error.message });
  }
});

// Get admin by ID
router.get("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findById(id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin fetched successfully", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
