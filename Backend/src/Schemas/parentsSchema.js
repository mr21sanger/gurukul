const mongoose = require("mongoose");

const ParentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assigned: { type: Boolean, default: false },
  complaints: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint", required: false },

  tutorRequests: [
    {
      status: { type: String, enum: ["assigned", "pending", "completed"], default: "pending" },
      subject: String,
      classLevel: String,
      availableDays: [String],
      school: { type: String, required: true },
      mode: {
        type: String,
        enum: ['Online', 'Offline', 'Both'],
        default: 'Both',
      },
      previousMarks: String,
      postedAt: { type: Date, default: Date.now },
      locality: { type: String, required: true },
      school: { type: String, required: true }, 
      timePreference: {
        type: String
      }
    }
  ],
  tutorAssigned: {
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor" },
    assignedAt: { type: Date },
    status: { type: String, enum: ["assigned", "pending", "completed"], default: "pending" }
  }
});

module.exports = mongoose.model("Parent", ParentSchema);
