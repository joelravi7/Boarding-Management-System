const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Customer = require("../models/Customer");
const Room = require("../models/Room");

// Register a new customer
exports.addCustomer = async (req, res) => {
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
    const newCustomer = new Customer({ name, lname, dob, gender, phoneNumber1, phoneNumber2, address, email, password: hashedPassword });

    await newCustomer.save();
    const token = jwt.sign({ id: newCustomer._id, role: "customer" }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "1h" });

    res.status(201).json({ status: "Registration successful", token, customer: newCustomer });
  } catch (err) {
    res.status(500).json({ status: "Error", message: err.message });
  }
};

// Get logged-in customer details
exports.getCustomerDetails = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).select("-password");
    if (!customer) {
      return res.status(404).json({ status: "Error", message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ status: "Error", message: err.message });
  }
};

// Update user data
exports.updateCustomer = async (req, res) => {
  const userId = req.params.id;
  const { name, email, password, lname, dob, gender, phoneNumber1, phoneNumber2, address } = req.body;

  try {
    const user = await Customer.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password ? await bcrypt.hash(password, 10) : user.password;
    user.lname = lname || user.lname;
    user.dob = dob || user.dob;
    user.gender = gender || user.gender;
    user.phoneNumber1 = phoneNumber1 || user.phoneNumber1;
    user.phoneNumber2 = phoneNumber2 || user.phoneNumber2;
    user.address = address || user.address;

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during the update" });
  }
};

// Admin - Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    if (customers.length === 0) {
      return res.status(404).json({ status: "Error", message: "No customers found" });
    }
    res.status(200).json({ status: "Success", customers });
  } catch (err) {
    res.status(500).json({ status: "Error", message: "Server Error: Unable to fetch customer details" });
  }
};

// Get a customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select("-password");
    if (!customer) {
      return res.status(404).json({ status: "Error", message: "Customer not found" });
    }
    res.status(200).json({ status: "Customer fetched successfully", customer });
  } catch (err) {
    res.status(500).json({ status: "Error", message: err.message });
  }
};

// Delete a customer and their associated rooms
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "Error", message: "Invalid Customer ID" });
    }

    if (req.user.id !== id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized action" });
    }

    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return res.status(404).json({ status: "Error", message: "Customer not found" });
    }

    const deletedRooms = await Room.deleteMany({ customerId: id });
    res.status(200).json({
      message: "Customer and associated rooms deleted successfully",
      deletedRoomsCount: deletedRooms.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: "An error occurred while deleting the customer and their rooms" });
  }
};
