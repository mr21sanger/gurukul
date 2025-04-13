const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../Schemas/AdminSchema"); // Assuming you have an Admin model
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();


// ADD ADMIN
router.post("/register-an-admin", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validate input
        if (!firstName || !email || !password || !lastName) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists." });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin
        const newAdmin = new Admin({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await newAdmin.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: newAdmin._id, role: "admin" },
            process.env.SECRET_KEY,
            { expiresIn: "7d" } // Token valid for 7 days
        );

        res.status(201).json({ message: "Admin registered successfully", token, admin: newAdmin });
    } catch (error) {
        console.error("Admin registration error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});




// LOGIN ADMIN
router.post("/login-as-Admin", async (req, res) => {

    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found." });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials.", id: admin._id });
        }


        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, role: "admin" },
            process.env.SECRET_KEY,
            { expiresIn: "7d" } // Token valid for 7 days
        );

        res.status(200).json({ message: "Login successful", token, admin });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;
