const express = require("express");
const router = express.Router();
const Complaint = require("../Schemas/complaintSchema");
const verifyToken = require("../MiddleWare/auth");


// ✅ Create Complaint
router.post("/post-a-complaint/:id", verifyToken, async (req, res) => {
    try {
        const { complaintType, description, tutorId } = req.body;
        const { id } = req.params;

        if (!complaintType || !description) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const newComplaint = new Complaint({
            user: id,
            complaintType,
            description,
            tutor: tutorId || null, // Optional Tutor ID
        });

        await newComplaint.save();
        res.status(201).json({ message: "Complaint filed successfully!", complaint: newComplaint, status: true });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
});

// ✅ Get All Complaints (Admin, Optional Tutor Filter)
router.get("/", verifyToken, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied!" });
        }

        const { tutorId } = req.query;
        let query = tutorId ? { tutor: tutorId } : {}; // Filter if tutor ID is provided

        const complaints = await Complaint.find(query)
            .populate("user", "name email")
            .populate("tutor", "name email");

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
});

// ✅ Get Single Complaint (User/Admin)
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate("user", "name email")
            .populate("tutor", "name email");

        if (!complaint) return res.status(404).json({ message: "Complaint not found." });

        if (req.user.role !== "admin" && complaint.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied!" });
        }

        res.status(200).json(complaint);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
});

// ✅ Update Complaint Status (Admin Only)
router.patch("/:id/status", verifyToken, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied!" });
        }

        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: "Complaint not found." });

        complaint.status = req.body.status || complaint.status;
        await complaint.save();

        res.status(200).json({ message: "Complaint status updated.", complaint });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
});

// ✅ Delete Complaint (Admin Only)
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied!" });
        }

        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: "Complaint not found." });

        await complaint.deleteOne();
        res.status(200).json({ message: "Complaint deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
});

module.exports = router;
