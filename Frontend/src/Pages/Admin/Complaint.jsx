import React, { useState } from "react";
import { useAdmin } from "../../Reducers/AdminReducer";
import {
  FaExclamationTriangle,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const Complaint = () => {
  const { complaints } = useAdmin();
  const [filter, setFilter] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const handleActionClick = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const handleStatusUpdate = () => {
    if (selectedComplaint && newStatus) {
      setSelectedComplaint(null);
    }
  };

  const filteredComplaints = filter
    ? complaints.filter((complaint) => complaint.complaintType === filter)
    : complaints;

  return (
    <div className="p-4 sm:p-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-start sm:justify-center gap-2 sm:gap-3 mb-6">
        {["Service Issue", "Tutor Misconduct", "Technical Problem", "Other"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-shrink-0 ${
              filter === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            {type}
          </button>
        ))}
        <button
          onClick={() => setFilter("")}
          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-all"
        >
          Show All
        </button>
      </div>

      {/* Display message if no complaints found */}
      {filteredComplaints.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg font-semibold">No complaints found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-white shadow-md rounded-xl p-5 border border-gray-200 transition-all hover:shadow-lg relative"
            >
              {/* Complaint Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <FaExclamationTriangle className="text-red-500 text-lg" />
                  <h3 className="text-lg font-semibold text-gray-900">{complaint.complaintType}</h3>
                </div>
              </div>

              {/* Complaint Description */}
              <p className="text-sm text-gray-600 mb-4">{complaint?.description}</p>

              {/* Complaint By (User who submitted) */}
              <div className="bg-gray-100 p-4 rounded-lg flex flex-col gap-2 text-gray-800 text-sm">
                <h4 className="text-sm font-semibold text-gray-900">Complaint By:</h4>
                <div className="flex items-center gap-2">
                  <FaUser className="text-gray-600" />
                  <span className="font-medium">{complaint?.user?.firstName || "Unknown User"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-600" />
                  <span className="text-sm break-words w-full">{complaint?.user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-gray-600" />
                  <span className="text-sm">{complaint?.user?.phone || "Not Provided"}</span>
                </div>
              </div>

              {/* Complaint Of (If it's about a tutor) */}
              {complaint?.tutor && (
                <div className="bg-gray-200 p-4 rounded-lg flex flex-col gap-2 text-gray-800 text-sm mt-3">
                  <h4 className="text-sm font-semibold text-gray-900">Complaint Of:</h4>
                  <div className="flex items-center gap-2">
                    <FaUser className="text-gray-600" />
                    <span className="font-medium">{complaint?.tutor?.firstName || "Unknown Tutor"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-600" />
                    <span className="text-sm break-words w-full">{complaint?.tutor?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-gray-600" />
                    <span className="text-sm">{complaint?.tutor?.phone || "Not Provided"}</span>
                  </div>
                </div>
              )}

              {/* Status & Action Section */}
              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`flex items-center gap-2 px-4 py-1 text-sm font-semibold rounded-lg ${
                    complaint.status === "Resolved"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {complaint.status === "Resolved" ? (
                    <FaCheckCircle className="text-white" />
                  ) : (
                    <FaTimesCircle className="text-white" />
                  )}
                  {complaint.status}
                </span>
                {/* Take Action Button */}
                <button
                  onClick={() => handleActionClick(complaint)}
                  className="px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all"
                >
                  Take Action
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Take Action on Complaint</h2>
            <p className="text-sm text-gray-600 mb-4">
              Complaint Type: <strong>{selectedComplaint.complaintType}</strong>
            </p>
            {/* Dropdown for Status Selection */}
            <select
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">Select Action</option>
              <option value="Resolved">Mark as Resolved</option>
              <option value="In Progress">Mark as In Progress</option>
              <option value="Rejected">Reject Complaint</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                onClick={() => setSelectedComplaint(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleStatusUpdate}
                disabled={!newStatus}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaint;
