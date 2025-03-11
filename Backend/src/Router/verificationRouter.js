const express = require("express");
const User = require("../Schemas/userSchema"); 
const OTP = require("../Schemas/otpSchema");  
const sendNotification = require("../Config/notification"); 

const router = express.Router();

// ✅ Function to Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Send OTP Route
router.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        // 🔹 Check if the email exists in the database
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already exists. Please sign in instead." });
        }

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expire in 5 minutes

        // 🔹 Remove existing OTP for the same email (if any)
        await OTP.findOneAndDelete({ email });

        // 🔹 Save new OTP in the database
        const otpEntry = new OTP({ email, otp, expiresAt });
        await otpEntry.save();

        // 🔹 Send OTP via email
        await sendNotification("OTP_VERIFICATION", { email, otp }, "email");

        res.json({ status: true, message: "OTP sent successfully!" });
    } catch (error) {
        console.error("OTP Sending Error:", error);
        res.status(500).json({ message: "Failed to send OTP" });
    }
});

// ✅ Verify OTP Route
router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    try {
        const otpEntry = await OTP.findOne({ email });

        if (!otpEntry || new Date() > otpEntry.expiresAt) {
            return res.status(400).json({ message: "OTP expired or invalid" });
        }

        if (otpEntry.otp !== otp) {
            return res.status(400).json({ message: "Incorrect OTP" });
        }

        // ✅ OTP is valid → Delete OTP after verification
        await OTP.deleteOne({ email });

        res.json({ status: true, message: "OTP verified successfully!" });
    } catch (error) {
        console.error("OTP Verification Error:", error);
        res.status(500).json({ message: "Failed to verify OTP" });
    }
});

module.exports = router;
