const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcryptjs");

// User registration
router.post("/register", async (req, res) => {
  const { email, password, role = "user" } = req.body; // Default role to "user"
  try {
    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Registration error: Email already in use");
      return res.status(400).json({ message: "Email already in use" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role });
    await user.save();
    
    console.log("User registered successfully:", user);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error); // Log error for debugging
    res.status(400).json({ message: error.message });
  }
});

// User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt with email:", email); // Log email being used
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Login error: User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Use the comparePassword method
    const isPasswordValid = await user.comparePassword(password);
    console.log("Password valid:", isPasswordValid); // Log password validation
    if (!isPasswordValid) {
      console.log("Login error: Invalid password");
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    
    res.json({ token, user });
  } catch (error) {
    console.error("Login error:", error); // Log error
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
