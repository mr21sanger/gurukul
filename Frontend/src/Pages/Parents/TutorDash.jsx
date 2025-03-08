import { motion } from "framer-motion";
import BecomeTutorModal from "../../Components/BecomeTutorModal";
import { useState } from "react";
import { useUserReducer } from "../../Reducers/UserReducer";
import AddSubjectBlock from "../../Components/AddSubjectBlock";
import AddWeekendSchedule from "../../Components/AddWeekendSchedule";
import AddExperienceBlock from "../../Components/AddExperienceBlock";
import AddQualificationBlock from "../../Components/AddQualification";
import EditProfileModal from "../../Components/EditProfileModal";
import ChangePasswordModal from "../../Components/ChangePasswordModal";

const TutorDashboard = () => {
    const [verificationModal, setVerficationModal] = useState(false);
    const { user } = useUserReducer();
    const { userId } = user || {};
    const [subjects, setSubjects] = useState(user?.subjects || []);
    const [schedule, setSchedule] = useState(user?.schedules || []);
    const [experience, setExperience] = useState(user?.experience || []);
    const [qualifications, setQualifications] = useState(user?.qualifications || []);
    const [editProfileModal, setEditProfileModal] = useState(false);
    const [editPasswordModal, setEditPassWordModal] = useState(false);




    return (
        <div className="container mx-auto p-6 min-h-screen bg-orange-100 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

                {/* Left Column - Profile Card */}
                <motion.div
                    className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-orange-200 transition hover:shadow-2xl"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-6 mb-6">
                        <img src={userId?.profileImage || "/default-profile.png"}
                            alt="Profile"
                            className="w-24 h-24 rounded-full border-4 border-orange-400 shadow-lg"
                        />
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
                                {userId?.firstName + " " + userId?.lastName || "N/A"}
                                {user?.verificationStatus === "Verified" ? (
                                    <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                                        ✅ Verified
                                    </span>
                                ) : user?.verificationStatus === "Pending" ? (
                                    <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                                        🕒 Pending Verification
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => setVerficationModal(true)}
                                        className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-medium hover:bg-red-700"
                                    >
                                        ⚠️ Verify Now
                                    </button>
                                )}

                            </h3>
                            <p className="text-gray-600">{userId?.email || "N/A"}</p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4 text-center md:text-left text-gray-700">
                        <p><strong>📞 Phone:</strong> {userId?.phone || "N/A"}</p>
                        <p><strong>📍 Location:</strong> {`${userId?.address.street}, ${userId?.address.city}, ${userId?.address.state} - ${userId?.address.zipCode}, ${userId?.address.country}` || "N/A"}</p>
                    </div>

                    {/* Experience & Qualifications Block */}
                    <AddExperienceBlock experience={experience} setExperience={setExperience} userId={userId?._id} />

                    <AddQualificationBlock qualifications={qualifications} setQualifications={setQualifications} userId={userId?._id} />


                    {/* Profile Actions */}
                    <div className="mt-6 flex flex-col md:flex-row gap-3">
                        <button className="bg-orange-700 text-white px-5 py-2 rounded-lg hover:bg-orange-800 transition w-full md:w-auto"
                            onClick={() => setEditProfileModal(true)}>
                            ✏️ Edit Profile
                        </button>
                        <button className="bg-orange-700 text-white px-5 py-2 rounded-l9g hover:bg-orange-800 transition w-full md:w-auto"
                            onClick={() => setEditPassWordModal(true)}>
                            🔒 Change Password
                        </button>
                    </div>

                </motion.div>

                {/* Right Column - Dashboard Info */}
                <motion.div
                    className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-orange-200 transition hover:shadow-2xl"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-2xl font-semibold text-gray-800 border-b pb-4 mb-4">Tutor Dashboard</h2>

                    {/* Assignment Status */}
                    <div className="flex justify-between items-center bg-orange-50 p-4 rounded-lg border mb-4  shadow-sm">
                        <span className="font-medium text-gray-700">📌 Assignment Status:</span>
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-1 text-sm font-medium rounded-lg shadow-md 
        ${user?.verificationStatus === "Verified"
                                    ? (userId?.assigned ? "bg-green-600 text-white" : "bg-yellow-500 text-gray-900")
                                    : user?.verificationStatus === "Pending"
                                        ? "bg-yellow-500 text-white"
                                        : "bg-red-500 text-white"
                                }`}>

                                {user?.verificationStatus === "Verified"
                                    ? (user?.assigned ? "✅ Assigned" : "⌛ Not Assigned")
                                    : user?.verificationStatus === "Pending"
                                        ? "🕒 Pending Verification"
                                        : "⚠️ Not Verified"}
                            </span>

                            {/* Show "Verify Now" button only if not verified or pending */}
                            {(user?.verificationStatus !== "Verified" && user?.verificationStatus !== "Pending") && (
                                <button
                                    onClick={() => setVerficationModal(true)}
                                    className="bg-orange-600 text-white px-4 py-2 text-sm font-medium rounded-lg shadow-md hover:bg-orange-700 transition duration-300"
                                >
                                    🔍 Verify Now
                                </button>
                            )}
                        </div>
                    </div>


                    {/* Assigned Students Section - Always Visible */}
                    <div className="bg-orange-50 p-5 rounded-lg border mb-4">
                        <h3 className="font-medium text-lg text-gray-700">👩‍🎓 Assigned Students</h3>
                        {user?.assignedParents?.length > 0 ? (
                            user.assignedParents?.map((student, index) => (
                                <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg border mt-2 shadow-sm hover:shadow-md transition">
                                    <p><strong>{student.name}</strong> - {student.subject}</p>
                                    <span className="text-xs bg-orange-700 text-white px-2 py-1 rounded">{student.joinDate}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center mt-2">No students assigned yet.</p>
                        )}
                    </div>

                    {/* Subjects & Expertise */}
                    <AddSubjectBlock subjects={subjects} setSubjects={setSubjects} userId={userId?._id} />

                    {/* Weekly Schedule */}
                    <AddWeekendSchedule schedule={schedule} setSchedule={setSchedule} userId={userId?._id} />
                </motion.div>
            </div>
            <BecomeTutorModal isOpen={verificationModal} onClose={() => setVerficationModal(false)} id={userId?._id} />

            <EditProfileModal isOpen={editProfileModal} onClose={() => setEditProfileModal(false)} user={user?.userId} />
            <ChangePasswordModal isOpen={editPasswordModal} onClose={() => setEditPassWordModal(false)} user={user?.userId} />

        </div>
    );
};

export default TutorDashboard;
