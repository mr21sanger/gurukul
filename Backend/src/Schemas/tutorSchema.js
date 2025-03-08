const mongoose = require("mongoose");

const TutorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  subjects: [{ type: String, required: false }],

  experience: [{
    years: { type: String, required: false },
    organization: { type: String, required: false }
  }],

  qualifications: [{
    degree: { type: String, required: false },
    institution: { type: String, required: false },
    fromYear: { type: String, required: false },
    toYear: { type: String, required: false },
    grade: { type: String, required: false }
  }],

  schedules: {
    type: [{ day: String, time: String }],
    default: [],
  },

  hourlyRate: { type: Number, required: false },

  assigned: {
    type: Boolean, default: true
  },

  assignedParents: [
    {
      parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      assignedAt: { type: Date, default: Date.now }
    }
  ],

  attendance: [
    {
      date: { type: Date, default: Date.now },
      loginTime: String,
      logoutTime: String
    }
  ],

  // Verification Fields
  isVerified: { type: Boolean, default: false }, // Verification status

  verificationStatus: {
    type: String,
    enum: ["Pending", "Verified", "Rejected", "Not_verified"],
    default: "Not_verified"
  },

  documents: [
    {
      type: Object
    }
  ],

  rejectionReason: { type: String } // Reason if verification is rejected
});

module.exports = mongoose.model("Tutor", TutorSchema);
