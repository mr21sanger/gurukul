import React, { useState, useEffect } from "react";
import { useAdmin } from "../Reducers/AdminReducer"; // Assuming you already have context set up

const RecentActivityTables = () => {
    const [filter, setFilter] = useState(""); // Filter state
    const { activities } = useAdmin(); // Get all activities from context
    const [signups, setSignups] = useState([]);
    const [requests, setRequests] = useState([]);
    const [complaints, setComplaints] = useState([]);

    // Split activities based on type and filter data
    useEffect(() => {
        const signupActivities = activities.filter((activity) => activity.type === "signup");
        const requestActivities = activities.filter((activity) => activity.type === "request");
        const complaintActivities = activities.filter((activity) => activity.type === "complaint");
        setSignups(signupActivities);
        setRequests(requestActivities);
        setComplaints(complaintActivities);
    }, [activities]); // Re-run if activities change in context

    // Filtered data based on selected filter
    const filterData = (data) => {
        if (!filter) return data; // If no filter, return the original data
        return data.filter(item => item.status === filter); // Assuming "status" is a field to filter on
    };

    // ActivityTable Component
    const ActivityTable = ({ title, data, columns }) => {
        const filteredData = filterData(data); // Apply filter here

        return (
            <div
                className={`bg-white p-6 md:my-6 rounded-xl shadow-md border border-gray-300 ${filteredData.length === 0 ? "text-center p-4" : "w-full"
                    }`}
            >
                <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-900">{title}</h2>

                {/* Filter Dropdown */}
                <div className="mb-4">
                    <select
                        onChange={(e) => setFilter(e.target.value)}
                        value={filter}
                        className="p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Filter by Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {filteredData.length === 0 ? (
                    <div className="text-gray-500 bg-gray-50 py-6 rounded-lg">
                        No data available
                    </div>
                ) : (
                    <>
                        {/* Mobile View - List Format */}
                        <div className="block md:hidden">
                            {filteredData.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center p-3 border-b last:border-none bg-gray-50 hover:bg-gray-100 rounded-lg"
                                >
                                    <span className="font-medium text-gray-800">{item.userName}</span>
                                    <span className="text-gray-600 text-sm">{item[columns[1]]}</span>
                                    <span className="text-gray-500 text-xs">{item.time}</span>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View - Table Format */}
                        <div className="hidden md:block">
                            <table className="w-full text-gray-700">
                                <thead>
                                    <tr className="bg-gray-200 text-left text-gray-600 uppercase text-sm">
                                        <th className="p-3 font-medium">User</th>
                                        <th className="p-3 font-medium">{columns[1]}</th>
                                        <th className="p-3 font-medium">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="border-t hover:bg-gray-100 transition duration-200 ease-in-out"
                                        >
                                            <td className="p-3">{item.userName}</td>
                                            <td className="p-3">{item[columns[1]]}</td>
                                            <td className="p-3 text-gray-500">{item.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            <ActivityTable title="Recent Signups" data={signups} columns={["user", "role"]} />
            <ActivityTable title="Recent Tutor Requests" data={requests} columns={["user", "action"]} />
            <ActivityTable title="Recent Complaints" data={complaints} columns={["user", "type"]} />
        </div>
    );
};

export default RecentActivityTables;
