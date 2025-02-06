const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied: No Token Provided!" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.user = verified; // Attach user data (customer, admin, or room owner)
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid or Expired Token!" });
  }
};

exports.verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied: Admins Only!" });
  }
  next();
};

exports.verifyCustomer = (req, res, next) => {
  if (!req.user || req.user.role !== "customer") {
    return res.status(403).json({ message: "Access Denied: Customers Only!" });
  }
  next();
};

exports.verifyCustomerOrAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== "customer" && req.user.role !== "admin")) {
    return res.status(403).json({ message: "Access Denied: Customers or Admins Only!" });
  }
  next();
};
