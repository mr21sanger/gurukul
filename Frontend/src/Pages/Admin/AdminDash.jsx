import { useState } from "react";
import { FiUsers, FiUserCheck, FiUserPlus, FiAlertTriangle } from "react-icons/fi";
import { MdAssignmentInd } from "react-icons/md";
import VerificationRequests from "./VerificationRequests";
import Complaint from "./Complaint";
import AssignTutorPage from "./AssignTutorPage";
import { useAdmin } from "../../Reducers/AdminReducer";
import AdminNavbar from "./AdminNavbar";
import RecentActivityTables from "../../Components/RecentActivityTable";
import VerifiedTutors from "./VerifiedTutors";

function AdminDash() {
    const [activeSection, setActiveSection] = useState("Dashboard");
    const { totalUsersCount, admin } = useAdmin();

    const {
        parentCount = 0,
        tutorCount = 0,
        totalUsers = 0,
        verifiedTutors = 0,
        tutorRequests = 0,
        verificationRequests = 0,
        totalComplaints = 0
    } = totalUsersCount || {};

    // Section mapping for navigation
    const sectionMap = {
        "Tutor Requests": "Assign Tutor",
        "Verification Requests": "Verifications",
        "Total Complaints": "Complaints",
        "Verified Tutors": "Verified Tutors",
        "Total Tutors": "Verified Tutors",
    };

    const stats = [
        { title: "Total Users", value: totalUsers, icon: <FiUsers className="text-indigo-600 text-3xl" /> },
        { title: "Total Tutors", value: tutorCount, icon: <MdAssignmentInd className="text-blue-600 text-3xl" /> },
        { title: "Total Parents", value: parentCount, icon: <FiUserPlus className="text-green-600 text-3xl" /> },
        { title: "Verified Tutors", value: verifiedTutors, icon: <FiUserCheck className="text-purple-600 text-3xl" /> },
        { title: "Tutor Requests", value: tutorRequests, icon: <MdAssignmentInd className="text-yellow-600 text-3xl" /> },
        { title: "Verification Requests", value: verificationRequests, icon: <FiUserCheck className="text-teal-600 text-3xl" /> },
        { title: "Total Complaints", value: totalComplaints, icon: <FiAlertTriangle className="text-red-600 text-3xl" /> },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Navbar */}
            <div className="sticky top-0 z-50 bg-white shadow-md">
                <AdminNavbar setActiveSection={setActiveSection} name={admin?.firstName} activeSection={activeSection} />
            </div>

            <div className="flex-1 p-6 flex flex-col md:flex-row gap-6">
                {/* Admin Profile */}
                <div className="hidden md:flex h-96 w-72 bg-white shadow-lg rounded-2xl p-6 border border-gray-200 flex-col items-center text-center sticky top-20">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
                        {admin?.firstName?.charAt(0)}
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 mt-3">{admin?.firstName} {admin?.lastName}</h2>
                    <p className="text-gray-500 text-sm">{admin?.email}</p>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium mt-2">
                        Administrator
                    </span>

                    <div className="mt-4 space-y-2 text-xs text-gray-700 text-left w-full px-2">
                        <p><span className="font-semibold">Email:</span> {admin?.email}</p>
                        <p><span className="font-semibold">Role:</span> Administrator</p>
                        <p><span className="font-semibold">Total Users:</span> {totalUsers}</p>
                    </div>

                    <div className="mt-4 flex gap-3">
                        <button className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg">
                            Edit Profile
                        </button>
                        <button className="px-5 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-lg">
                            Logout
                        </button>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="flex-1">
                    {activeSection === "Dashboard" && (
                        <>
                            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">Admin Panel Dashboard</h1>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {stats.map((stat, index) => {
                                    const targetSection = sectionMap[stat.title] || null;

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => targetSection && setActiveSection(targetSection)}
                                            className={`p-6 rounded-xl shadow-md bg-white flex flex-col items-center border border-gray-200 transition-transform duration-200 hover:scale-105 cursor-pointer ${targetSection ? "hover:shadow-lg" : "cursor-default"
                                                }`}
                                        >
                                            {stat.icon}
                                            <h2 className="text-sm font-semibold text-gray-600 mt-2">{stat.title}</h2>
                                            <p className="text-3xl font-bold text-indigo-700">{stat.value}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            <RecentActivityTables />
                        </>
                    )}

                    {activeSection === "Verifications" && <VerificationRequests />}
                    {activeSection === "Complaints" && <Complaint />}
                    {activeSection === "Assign Tutor" && <AssignTutorPage />}
                    {activeSection === "Verified Tutors" && <VerifiedTutors />}
                </div>
            </div>
        </div>
    );
}

export default AdminDash;
