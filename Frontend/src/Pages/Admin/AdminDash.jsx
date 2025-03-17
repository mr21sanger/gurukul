import { useState } from "react";
import Sidebar from "./Sidebar";
import StatsCard from "./StatsCard";
import VerificationRequests from "./VerificationRequests";
import Complaint from "./Complaint";
import { useAdmin } from "../../Reducers/AdminReducer";
import AssignTutorPage from "./AssignTutorPage";

function AdminDash() {
    const [activeSection, setActiveSection] = useState("Dashboard");

    const [stats, setStats] = useState({
        totalUsers: 500,
        totalTutors: 150,
        totalParents: 350,
        tutorRequests: 120,
        verificationRequests: 15,
        complaints: 8,
    });

    const { totalUsersCount, verifyUser } = useAdmin()

    const [verificationRequests, setVerificationRequests] = useState([
        { id: 1, name: "John Doe", email: "john@example.com", status: "Pending", documents: ["/images/doc1.webp"] },
        { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Pending", documents: ["/images/doc2.webp"] },
    ]);

    const [complaints, setComplaints] = useState([
        { id: 1, user: "Parent A", issue: "Issue with tutor", status: "Pending" },
        { id: 2, user: "Tutor B", issue: "Resolved issue", status: "Resolved" },
    ]);

    const handleVerification = (id, action) => {
        verifyUser(id, action)
    };
    const [newJoiners, setNewJoiners] = useState([
        { id: 1, name: "Emily Johnson", role: "Tutor", joinedOn: "2025-02-25" },
        { id: 2, name: "Michael Brown", role: "Parent", joinedOn: "2025-02-26" },
    ]);
    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100 my-16">
            <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
            <div className="flex-1 p-4 md:p-6 overflow-auto">
                <h1 className="text-3xl font-bold mb-6">{activeSection}</h1>

                {activeSection === "Dashboard" && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {Object.entries(stats).map(([key, value]) => (
                                <StatsCard key={key} title={key} value={value} />
                            ))}
                        </div>

                        <div className="bg-white p-4 shadow-md mt-4 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">New Joiners</h2>
                            <table className="min-w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-300 p-2">ID</th>
                                        <th className="border border-gray-300 p-2">Name</th>
                                        <th className="border border-gray-300 p-2">Role</th>
                                        <th className="border border-gray-300 p-2">Joined On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newJoiners.map((joiner) => (
                                        <tr key={joiner.id} className="text-center">
                                            <td className="border border-gray-300 p-2">{joiner.id}</td>
                                            <td className="border border-gray-300 p-2">{joiner.name}</td>
                                            <td className="border border-gray-300 p-2">{joiner.role}</td>
                                            <td className="border border-gray-300 p-2">{joiner.joinedOn}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div></>
                )}

                {activeSection === "Verifications" && (
                    <VerificationRequests verificationRequests={verificationRequests} handleVerification={handleVerification} />
                )}

                {activeSection === "Complaints" && <Complaint complaints={complaints} />}
                {activeSection === "Assign Tutor" && <AssignTutorPage />}

                {/* Add other sections here as needed */}
            </div>
        </div>
    );
}

export default AdminDash
