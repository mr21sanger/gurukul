const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    role: { type: String, enum: ["Student", "Instructor"], required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
