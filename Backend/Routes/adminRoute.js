const express = require("express");
const { 
  registerAdmin, 
  loginAdmin, 
  getAdminProfile, 
  updateAdmin 
} = require("../controllers/adminController");

const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/profile", verifyToken, verifyAdmin, getAdminProfile);
router.put("/profile/update", verifyToken, verifyAdmin, updateAdmin);

module.exports = router;
