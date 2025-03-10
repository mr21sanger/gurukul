const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Schemas/userSchema");
const Parent = require("../Schemas/parentsSchema");
const Tutor = require("../Schemas/tutorSchema");
const cloudinary = require("../Config/cloudinaryConfig")
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const upload = require("../MiddleWare/multer");
const sendNotification = require("../Config/notification");
const verifyToken = require("../MiddleWare/auth");

//SIGN UP ROUTER
router.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, role, address } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            role,
            address: {
                street: address?.street || "",
                city: address?.city || "",
                state: address?.state || "",
                zipCode: address?.zipCode || "",
                country: address?.country || "",
            }
        });

        await newUser.save();

        let additionalData = {}; // Object to store role-based data

        // Initialize corresponding schema based on role
        if (role === "Instructor") {
            const newTutor = new Tutor({
                userId: newUser._id,
                subjects: [],
                experience: [],
                qualifications: [],
                availability: [],
                hourlyRate: 0,
                assignedParents: [],
                attendance: [],
                isVerified: false,
                documents: []
            });
            await newTutor.save();
            additionalData = { tutorData: newTutor };
        } else if (role === "Student") {
            const newParent = new Parent({
                userId: newUser._id,
                assigned: false,
                tutorRequests: [],
                tutorAssigned: {
                    tutorId: null,
                    assignedAt: null,
                    status: "pending"
                }
            });
            await newParent.save();
            additionalData = { parentData: newParent };
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.SECRET_KEY, { expiresIn: "7d" });


        res.status(201).json({
            message: "User registered successfully!",
            status: true,
            token,
            userData: newUser,
            ...additionalData  // Merge role-specific data
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// ✅ Post a Tutor Request (Parent requests a tutor)
router.post("/request-tutor", verifyToken, async (req, res) => {
    try {
        const {
            subject,
            classLevel,
            availableDays,
            previousMarks,
            school,
            genderPreferred,
            timePreferred,
            fee,
            locality, parentId
        } = req.body;


        // ✅ Check if parent exists
        let parent = await Parent.findOne({ _id: parentId }).populate("userId");

        if (!parent) {
            return res.status(404).json({ message: "Parent profile not found." });
        }

        // ✅ Initialize `tutorRequests` if it's undefined or not an array
        if (!Array.isArray(parent.tutorRequests)) {
            parent.tutorRequests = [];
        }

        // ✅ Generate Unique Order ID
        const orderId = Math.floor(10000 + Math.random() * 90000);

        // ✅ Create new tutor request
        const newRequest = {
            subject: subject || "Not Specified",
            classLevel: classLevel || "Not Specified",
            availableDays: availableDays || [],
            previousMarks: previousMarks || "Not Specified",
            postedAt: new Date(),
            locality: locality,
            school: school || "Not Specified"
        };

        parent.tutorRequests.push(newRequest);
        await parent.save(); // Save in database

        const data = {
            orderId,
            genderPreferred: genderPreferred || "Any",
            timePreferred: timePreferred || "Flexible",
            classLevel,
            subject,
            availableDays: availableDays.length,
            fee,
            locality,
            phone: parent.userId.phone,
        
        }

        sendNotification("NEW_TUTOR_REQUEST", data, "telegram")
        res.status(201).json({ message: "Tutor request posted successfully!", tutorRequests: parent.tutorRequests });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
});


// ✅ Role-based Dashboard Access
router.get("/dashboard", verifyToken, async (req, res) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        let userData;
        if (user.role === "Student") {
            userData = await Parent.findOne({ userId: user._id }).populate("userId");
            await userData?.tutorAssigned?.populate("tutor")
            await userData?.tutorAssigned?.tutor?.populate("userId")
        } else if (user.role === "Instructor") {
            userData = await Tutor.findOne({ userId: user._id }).populate("userId");
        } else {
            return res.status(400).json({ message: "Invalid role." });
        }

        res.json({ user: userData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
});



// Upload Aadhaar & Selfie for Verification

router.put("/upload-verification/:id", verifyToken, upload.fields([
    { name: "aadhaar", maxCount: 1 },
    { name: "selfie", maxCount: 1 }
]), async (req, res) => {
    const { id } = req.params;

    try {
        if (!req.files || !req.files["aadhaar"] || !req.files["selfie"]) {
            return res.status(400).json({ error: "Both Aadhaar and Selfie are required" });
        }

        // Get local file paths
        const aadhaarPath = req.files["aadhaar"][0].path;
        const selfiePath = req.files["selfie"][0].path;

        // Upload to Cloudinary
        const aadhaarUpload = await cloudinary(aadhaarPath);
        const selfieUpload = await cloudinary(selfiePath);


        //UPDATING TO TUTORS DATA IN DATABASE

        const tutor = await Tutor.findOne({ userId: id })

        if (tutor) {
            tutor.documents.push({
                aadhar: aadhaarUpload.secure_url,
                selfie: selfieUpload.secure_url
            });

            tutor.verificationStatus = "Pending"; // Update verification status to pending

            await tutor.save();
        }

        res.status(200).json({
            message: "Files uploaded successfully",
            aadhaarUrl: aadhaarUpload.secure_url,
            selfieUrl: selfieUpload.secure_url,
            status: true,
            verificationStatus: "Pending"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "File upload failed" });
    }
});


// ADD OR EDIT DATA
router.post("/addOrEdit", verifyToken, async (req, res) => {
    try {
        const { userId, type, value, newValue, timePreference, years, organization, qualification } = req.body;


        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const capitalizeWords = (text) => {
            return text
                .trim()
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
        };

        let formattedValue = value && capitalizeWords(value?.trim());
        const user = await Tutor.findOne({ userId });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        switch (type) {
            case "subject":
                if (newValue) {
                    // ✅ **Edit existing subject**
                    let formattedNewValue = capitalizeWords(newValue.trim());
                    let index = Tutor.subjects.indexOf(formattedValue);

                    if (index === -1) {
                        return res.status(400).json({ error: "Subject not found" });
                    }
                    if (user.subjects.includes(formattedNewValue)) {
                        return res.status(400).json({ error: "New subject already exists" });
                    }

                    user.subjects[index] = formattedNewValue; // Update subject
                } else {
                    // ✅ **Add new subject**
                    if (user.subjects.includes(formattedValue)) {
                        return res.status(400).json({ error: "Subject already exists" });
                    }
                    user.subjects.push(formattedValue);
                }

                await user.save();
                return res.status(201).json({ message: "Subject updated successfully", subjects: user.subjects });

            case "schedule":
                if (!timePreference) {
                    return res.status(400).json({ error: "Time preference is required for schedule" });
                }

                let formattedTime = capitalizeWords(timePreference);
                let scheduleIndex = user.schedules.findIndex((s) => s.day === value);

                if (newValue) {
                    // ✅ **Edit existing schedule**
                    let formattedNewDay = capitalizeWords(newValue.trim());

                    if (user.schedules.some((s) => s.day === formattedNewDay && s.time === formattedTime)) {
                        return res.status(400).json({ error: "New schedule already exists" });
                    }

                    if (scheduleIndex === -1) {
                        return res.status(400).json({ error: "Schedule not found" });
                    }

                    user.schedules[scheduleIndex] = { day: formattedNewDay, time: formattedTime }; // Update schedule
                } else {
                    // ✅ **Add new schedule**
                    if (user.schedules.some((s) => s.day === formattedValue && s.time === formattedTime)) {
                        return res.status(400).json({ error: "Schedule already exists" });
                    }

                    user.schedules.push({ day: formattedValue, time: formattedTime });
                }

                await user.save();
                return res.status(201).json({ message: "Schedule updated successfully", schedules: user.schedules });


            case "experience":
                if (!years || !organization) {
                    return res.status(400).json({ error: "Years and Organization are required" });
                }


                let formattedOrganization = capitalizeWords(organization.trim());

                // Prevent duplicate experience entries
                if (user.experience.some((exp) => exp.years === years && exp.organization === formattedOrganization)) {
                    return res.status(400).json({ error: "Experience already exists" });
                }

                user.experience.push({ years, organization: formattedOrganization });
                await user.save();

                return res.status(201).json({ message: "Experience added successfully", experience: user.experience });

            case "qualification":
                if (!qualification) {
                    return res.status(400).json({ error: "Qualification details are required" });
                }

                let { degree, institution, fromYear, toYear, grade } = qualification;

                if (!degree || !institution || !fromYear || !toYear || !grade) {
                    return res.status(400).json({ error: "All qualification fields are required" });
                }

                // Capitalize and trim inputs
                degree = capitalizeWords(degree);
                institution = capitalizeWords(institution);
                fromYear = fromYear.trim();
                toYear = toYear.trim();
                grade = grade.trim();

                if (newValue) {
                    // **Edit existing qualification**
                    let index = user.qualifications.findIndex(q => q.degree === value.trim());

                    if (index === -1) {
                        return res.status(400).json({ error: "Qualification not found" });
                    }

                    user.qualifications[index] = { degree, institution, fromYear, toYear, grade };
                } else {
                    // **Add new qualification**
                    if (user.qualifications.some(q => q.degree === degree && q.institution === institution)) {
                        return res.status(400).json({ error: "Qualification already exists" });
                    }

                    user.qualifications.push({ degree, institution, fromYear, toYear, grade });
                }

                await user.save();
                return res.status(201).json({ message: "Qualification updated successfully", qualifications: user.qualifications });


            case "updateProfile":
                const { firstName, lastName, email } = value;

                // Check if email is already taken by another user
                if (email) {
                    const emailExists = await User.findOne({ email, _id: { $ne: userId } });
                    if (emailExists) return res.status(400).json({ message: "Email already in use." });
                }

                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { firstName, lastName, email },
                    { new: true, runValidators: true }
                );

                res.status(200).json({ message: "Profile updated successfully", user: updatedUser });

            default:
                return res.status(400).json({ error: "Invalid type provided" });
        }



    } catch (error) {
        console.error("Error adding/editing data:", error);
        return res.status(500).json({ error: "Server error" });
    }
})


// REMOVE DATA FROM THE SCHEMA
router.post("/removeItem", verifyToken, async (req, res) => {
    try {
        const { userId, type, value, timePreference, years, organization, qualification } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const capitalizeWords = (text) => {
            return text
                .trim()
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
        };

        let formattedValue = value && capitalizeWords(value.trim());
        const user = await Tutor.findOne({ userId });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        switch (type) {
            case "subject":
                // ✅ Remove subject
                user.subjects = user.subjects.filter((subject) => subject !== formattedValue);
                await user.save();
                return res.status(200).json({ message: "Subject removed successfully", subjects: user.subjects });

            case "schedule":
                if (!timePreference) {
                    return res.status(400).json({ error: "Time preference is required for schedule removal" });
                }

                let formattedTime = capitalizeWords(timePreference);

                user.schedules = user.schedules.filter((s) => !(s.day === formattedValue && s.time === formattedTime));


                await user.save();
                return res.status(200).json({ message: "Schedule removed successfully", schedules: user.schedules });

            case "experience":
                if (!years || !organization) {
                    return res.status(400).json({ error: "Years and Organization are required for experience removal" });
                }

                let formattedOrganization = capitalizeWords(organization.trim());
                // ✅ Remove experience based on years and organization
                user.experience = user.experience.filter((exp) => !(exp.years === years && exp.organization === formattedOrganization));
                await user.save();
                return res.status(200).json({ message: "Experience removed successfully", experience: user.experience });

            case "qualification":
                if (!qualification) {
                    return res.status(400).json({ error: "Qualification details are required for removal" });
                }

                let { degree, institution } = qualification;

                degree = capitalizeWords(degree);
                institution = capitalizeWords(institution);

                // ✅ Remove qualification based on degree and institution
                user.qualifications = user.qualifications.filter((q) => !(q.degree === degree && q.institution === institution));
                await user.save();
                return res.status(200).json({ message: "Qualification removed successfully", qualifications: user.qualifications });

            default:
                return res.status(400).json({ error: "Invalid type provided" });
        }

    } catch (error) {
        console.error("Error removing item:", error);
        return res.status(500).json({ error: "Server error" });
    }
});



//LOGIN CASE

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.SECRET_KEY,  // Ensure you have this in your .env file
            { expiresIn: "7d" }      // Token expires in 7 days
        );

        // Send response
        res.status(200).json({
            message: "Login successful",
            token,
            status: true,
            userData: {
                id: user._id,
                name: user.firstName + user.lastName,
                email: user.email,
                role: user?.role,
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//UPDATE PROFILE

router.put("/update-profile", verifyToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { firstName, lastName, phone, street, city, state, zipCode, country } = req.body;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Update user details
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phone = phone || user.phone;
        user.address = {
            street: street || user.address?.street,
            city: city || user.address?.city,
            state: state || user.address?.state,
            zipCode: zipCode || user.address?.zipCode,
            country: country || user.address?.country,
        };

        // Save the updated user profile
        await user.save();

        res.status(200).json({ message: "Profile updated successfully!", user, status: true });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// CHANGE PASSWORD 
router.post("/change-password", verifyToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const { userId } = req.user;

        // Fetch user from database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if old password matches
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Old password is incorrect" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in database
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});


// FORGOT PASSWORD

router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate JWT reset token (valid for 1 hour)
        const resetToken = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "1h" });

        // Store hashed token in the database
        const hash = await bcrypt.hash(resetToken, 10);
        user.resetPasswordToken = hash;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
        await user.save();

        // ✅ Generate Reset Link (localhost for now)
        const resetLink = `${process.env.url}reset-password?token=${resetToken}`;
        
        // Send reset token via email with the link
        const data = { resetLink, email };
        await sendNotification("RESET_PASSWORD", data, "email");

        res.json({ message: "Password reset link sent to your email", status: true });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Invalid token" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY || "your_secret_key");


        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify hashed token
        const userToken = user?.resetPasswordToken
        if (userToken) {
            const isMatch = bcrypt.compare(token, user.resetPasswordToken);
            if (!isMatch || Date.now() > user.resetPasswordExpires) {
                return res.status(400).json({ message: "Invalid or expired token" });
            }
        }

        // Update password
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ message: "Password has been reset successfully", status: true });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;
