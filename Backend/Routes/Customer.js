const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Customer = require("../models/Customer");
const Room = require("../models/Room");

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

// Add a new customer
router.post("/add", async (req, res) => {
  const { name, lname, dob, gender, phoneNumber1, phoneNumber2, address, email, password } = req.body;

  if (!name || !lname || !dob || !gender || !phoneNumber1 || !phoneNumber2 || !address || !email || !password) {
    return res.status(400).json({ status: "Error", message: "Missing required fields" });
  }

  try {
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ status: "Error", message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = new Customer({
      name,
      lname,
      dob,
      gender,
      phoneNumber1,
      phoneNumber2,
      address,
      email,
      password: hashedPassword,
    });

    await newCustomer.save();

    const token = jwt.sign({ id: newCustomer._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "1h" });
    res.status(201).json({ status: "Registration successful", token, customer: newCustomer });
  } catch (err) {
    res.status(500).json({ status: "Error", message: err.message });
  }
});

// Get logged-in customer details
router.get("/display", verifyToken, async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).select("-password");
    if (!customer) {
      return res.status(404).json({ status: "Error", message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ status: "Error", message: err.message });
  }
});

// Update user data route
router.put("/update/:id", async (req, res) => {
  const userId = req.params.id;
  const {
    name,
    email,
    password,
    Lname,
    DOB,
    Gender,
    Phonenumber1,
    Phonenumber2,
    Address,
  } = req.body;

  try {
    const user = await Customer.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user details
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;  // Normally you'd hash passwords
    user.Lname = Lname || user.Lname;
    user.DOB = DOB || user.DOB;
    user.Gender = Gender || user.Gender;
    user.Phonenumber1 = Phonenumber1 || user.Phonenumber1;
    user.Phonenumber2 = Phonenumber2 || user.Phonenumber2;
    user.Address = Address || user.Address;

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during the update" });
  }
});


// Get a customer by ID
router.get("/get/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findById(id).select("-password");
    if (!customer) {
      return res.status(404).json({ status: "Error", message: "Customer not found" });
    }

    res.status(200).json({ status: "Customer fetched successfully", customer });
  } catch (err) {
    console.error("Error fetching customer data:", err.message);
    res.status(500).json({ status: "Error", message: err.message });
  }
});

// Delete a customer and their associated rooms
router.delete("/delete/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "Error", message: "Invalid Customer ID" });
    }

    // Ensure only the logged-in user can delete their account
    if (req.user.id !== id) {
      return res.status(403).json({ error: "Unauthorized action" });
    }

    // Delete customer
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return res.status(404).json({ status: "Error", message: "Customer not found" });
    }

    // Delete associated rooms
    const deletedRooms = await Room.deleteMany({ customerId: id });
    console.log(`${deletedRooms.deletedCount} rooms deleted for customer ID: ${id}`);

    res.status(200).json({
      message: "Customer and associated rooms deleted successfully",
      deletedRoomsCount: deletedRooms.deletedCount,
    });
  } catch (err) {
    console.error("Error deleting customer and rooms:", err.message);
    res.status(500).json({ error: "An error occurred while deleting the customer and their rooms" });
  }
});

module.exports = router;
