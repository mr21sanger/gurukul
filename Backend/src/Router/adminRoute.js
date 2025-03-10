const { Server } = require("socket.io");
const Tutor = require("../Schemas/tutorSchema"); // Import Tutor schema
const User = require("../Schemas/userSchema")
const Parent = require("../Schemas/parentsSchema")
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const sendNotification = require("../Config/notification");
let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        // GET ALL THE COUNTS OF USERS
        socket.on("getUsers", async () => {
            try {
                const allUsers = await User.find();

                let totalUsers = allUsers.length;
                let tutorCount = 0;
                let parentCount = 0;
                let verifiedTutors = 0;
                let tutors = []
                let students = []

                for (const user of allUsers) {
                    if (user.role === "Instructor") {
                        tutorCount++;
                        const tutor = await Tutor.findOne({ userId: user._id }).populate("userId"); // Find a single tutor entry
                        if (tutor) {
                            tutors.push(tutor);
                        }
                        if (user.isVerified) {
                            verifiedTutors++;
                        }
                    } else if (user.role === "Student") {
                        parentCount++;
                        const student = await Parent.findOne({ userId: user._id }).populate("userId")
                        if (student) {
                            students.push(student);
                        }
                    }
                }

                io.emit("userCounts", {
                    counts: {
                        totalUsers,
                        tutorCount,
                        parentCount,
                        verifiedTutors,
                    },
                    tutors,
                    students
                });

            } catch (error) {
                console.error("Error fetching users:", error);
            }
        });


        // Send all pending verification requests when an admin connects
        socket.on("getVerificationRequests", async () => {
            try {
                const verificationRequests = await Tutor.find({
                    isVerified: false,
                    documents: { $exists: true, $ne: [] }
                }).populate("userId", "firstName lastName email"); // Populate userId to get name and email

                // Extract only required fields
                const formattedRequests = verificationRequests.map(request => ({
                    id: request.userId?._id,
                    name: request.userId?.firstName + request.userId?.lastName || "Unknown",
                    email: request.userId?.email || "Unknown",
                    experience: request.experience,
                    documents: request.documents.flat(),
                    verificationStatus: request.verificationStatus
                }));

                socket.emit("verificationRequests", formattedRequests);
            } catch (error) {
                console.error("Error fetching verification requests:", error);
                socket.emit("error", { message: "Failed to fetch requests" });
            }
        });


        // Approve or Reject Tutor Verification
        socket.on("verifyUser", async ({ userId, isVerified }) => {
            try {
                const updatedTutor = await Tutor.findOneAndUpdate(
                    { userId },
                    { $set: { isVerified, verificationStatus: isVerified ? "Verified" : "Rejected" } },
                    { new: true }
                );
                if (!updatedTutor) {
                    return socket.emit("error", { message: "Tutor not found" });
                }

                // Find User to get email
                const user = await User.findById(userId);
                if (!user) {
                    return socket.emit("error", { message: "User not found" });
                }

                // Send Notification
                isVerified ? sendNotification("TUTOR_VERIFICATION_APPROVED", user, "email") : sendNotification("TUTOR_VERIFICATION_REJECTED", user, "email")

                // Notify all admins of the update
                io.emit("verificationUpdate", {
                    userId,
                    isVerified,
                    verificationStatus: "Verified",
                    user: updatedTutor,
                });

                // Send success response to the admin
                socket.emit("success", { message: `Verification ${isVerified ? "approved" : "rejected"} and email sent to the user.` });

            } catch (error) {
                console.error("Error verifying user:", error);
                socket.emit("error", { message: "Server error. Please try again." });
            }
        });


        socket.on("getAllRequest", async () => {
            const parentRequests = await Parent.find().populate("userId")
                .lean();

            // Filter out only pending or not assigned requests
            const pendingRequests = parentRequests.filter(request => request.tutorRequests.length > 0 && // Ensure user has made at least one request
                (
                    !request.assigned ||
                    request.tutorAssigned?.status === 'pending' ||
                    request.tutorRequests.some(req => req.status === 'pending')
                ));

            io.emit("pendingRequests", {
                status: true,
                message: "Fetched Pending Request SuccessFully",
                pendingRequests
            })

        });


        //Assign tutor function
        socket.on("assign-tutor", async ({ tutorId, parentId }) => {
            try {
                const tutor = await Tutor.findOne({ userId: tutorId });

                if (!tutor || !tutor.isVerified) {
                    return socket.emit("error", { message: "Tutor is not verified" });
                }

                const updatedParent = await Parent.findOneAndUpdate(
                    { userId: parentId },
                    {
                        assigned: true,
                        tutorAssigned: {
                            tutor: tutor._id,
                            assignedAt: new Date(),
                            status: "assigned",
                        },
                    },
                    { new: true }
                ).populate("tutorAssigned.tutor");

                // Ensure updatedParent exists before trying to populate
                if (!updatedParent) {
                    return socket.emit("error", { message: "Parent not found" });
                }

                await updatedParent.populate("tutorAssigned.tutor.userId");

                // Fix: Ensure assignedParents is an array and update it correctly
                const updatedTutor = await Tutor.findOneAndUpdate(
                    { userId: tutorId },
                    {
                        $push: { assignedParents: { parentId: updatedParent.userId._id } },
                        assigned: true
                    },
                    { new: true }
                );

                await updatedTutor.populate("assignedParents.parentId")

                io.emit("tutorAssigned", {
                    parentId,
                    tutorId,
                    tutorDetails: updatedParent.tutorAssigned.tutor,
                    tutorUpdate: updatedTutor.assignedParents,
                    message: "Tutor assigned successfully!",
                });



                //NOTIFICATION FOR BOTH PARENT AND TUTOR
                await updatedParent.populate("userId")
                await tutor.populate("userId")


                // Extract necessary details for notifications
                const parentEmail = updatedParent.userId.email;
                const tutorEmail = tutor.userId.email;

                const notificationDataForParent = {
                    parentName: updatedParent.userId.firstName,
                    tutorName: tutor.userId.firstName + tutor.userId.lastName,
                    tutorPhone: tutor.userId.phone,
                    tutorEmail,
                    locality: updatedParent.userId.address.city,
                    email: parentEmail
                };


                const notificationDataForTutor = {
                    tutorName: tutor.userId.firstName,
                    parentName: updatedParent.userId.firstName,
                    parentPhone: updatedParent.userId.phone,
                    subject: updatedParent.tutorAssigned.subject,
                    locality: updatedParent.userId.address.city,
                    email: tutorEmail
                };

                // Send email notifications
                await sendNotification("TUTOR_ASSIGNED", notificationDataForParent, "email"); // Notify parent
                await sendNotification("TUTOR_ASSIGNMENT_CONFIRMATION", notificationDataForTutor, "email"); // Notify tutor


            } catch (error) {
                console.error("Assignment Error:", error);
                socket.emit("error", { message: "Failed to assign tutor" });
            }
        });


        socket.on("disconnect", () => {
            console.log("User disconnected:");
        });
    });
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io has not been initialized!");
    }
    return io;
};

module.exports = { initializeSocket, getIo };
