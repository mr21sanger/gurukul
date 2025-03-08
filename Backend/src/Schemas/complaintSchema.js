const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        complaintType: { type: String, required: true },
        tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
        description: { type: String, required: true },
        status: { type: String, enum: ["Pending", "Resolved", "Rejected"], default: "Pending" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Complaint", ComplaintSchema);
