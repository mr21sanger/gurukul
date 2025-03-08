import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useAdmin } from "../../Reducers/AdminReducer";

const AssignTutor = () => {
  const { assignTutors, pendingRequests, tutors } = useAdmin();

  const [parents, setParents] = useState([]);
  const [tutorsData, setTutorsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedParentId, setSelectedParentId] = useState(null);

  useEffect(() => setParents(pendingRequests), [pendingRequests]);
  useEffect(() => setTutorsData(tutors), [tutors]);

  // Open Modal
  const openModal = (parentId, request) => {
    setSelectedRequest(request);
    setSelectedParentId(parentId);
    setSelectedTutor(null);
    setIsModalOpen(true);
  };

  // Select Tutor
  const handleTutorSelect = (tutor) => setSelectedTutor(tutor);

  // Assign Tutor
  const handleAssignClick = () => {
    if (selectedParentId && selectedTutor) {
      assignTutors(selectedParentId, selectedTutor?.userId?._id);
      setSelectedTutor(null);
    }
  };

  return (
    <div className="p-6 sm:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">
        📚 Assign Tutor
      </h1>

      {/* Parent Requests Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {parents?.map((parent) => (
          <div
            key={parent?.userId?._id}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition-all hover:shadow-xl"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {parent?.userId?.firstName} {parent?.userId?.lastName}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {`${parent?.userId?.address?.street}, ${parent?.userId?.address?.city}, ${parent?.userId?.address?.state} - ${parent?.userId?.address?.zipCode}, ${parent?.userId?.address?.country}`}
            </p>
            <p className="text-gray-600 text-sm font-medium">{parent?.school}</p>

            {/* Requests */}
            <div className="mt-4 space-y-4">
              {parent?.tutorRequests?.map(
                (request) =>
                  request?.status === "pending" && (
                    <div
                      key={request.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <p className="text-gray-700 font-medium">
                        {request.subject} - {request.classLevel}
                      </p>
                      <p className="text-gray-600 text-sm">
                        📅 Available Days: {request.availableDays.join(", ")}
                      </p>
                      <p className="text-gray-600 text-sm">
                        🎯 Previous Marks: {request.previousMarks}
                      </p>

                      <button
                        onClick={() => openModal(parent?.userId?._id, request)}
                        className="mt-3 w-full bg-orange-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-orange-600 transition-all text-sm"
                      >
                        🎓 Select Tutor
                      </button>
                    </div>
                  )
              )}
            </div>

            {/* Assign Button */}
            <button
              onClick={handleAssignClick}
              disabled={!selectedTutor || selectedParentId !== parent?.userId?._id}
              className={`mt-4 w-full px-4 py-2 rounded-lg shadow-md text-white text-sm transition-all 
              ${
                selectedTutor && selectedParentId === parent?.userId?._id
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              ✅ Assign Tutor
            </button>
          </div>
        ))}
      </div>

      {/* Modal for Selecting a Tutor */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      >
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl w-full h-[90vh] max-w-7xl mx-auto flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              🎓 Select a Tutor
            </h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-red-500 transition-all text-lg font-semibold"
            >
              ❌
            </button>
          </div>

          {/* Tutor List */}
          <div className="flex-grow overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorsData?.map(
                (tutor) =>
                  tutor?.verificationStatus === "Verified" &&
                  tutor?.isVerified && (
                    <div
                      key={tutor?.id}
                      className={`p-5 border rounded-xl shadow-md cursor-pointer transition-all 
                      ${
                        selectedTutor?.userId?._id === tutor?.userId?._id
                          ? "bg-blue-100 border-blue-500"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      onClick={() => handleTutorSelect(tutor)}
                    >
                      <h3 className="font-medium text-base sm:text-lg text-gray-800">
                        {tutor?.userId?.firstName} {tutor?.userId?.lastName}
                      </h3>

                      <p className="text-gray-600 text-sm mt-1">
                        📚 <strong>Subjects:</strong>
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {tutor?.subjects?.length > 0 ? (
                          tutor?.subjects.map((subject, index) => (
                            <span
                              key={index}
                              className="bg-purple-200 text-purple-700 text-xs font-semibold px-2 py-1 rounded-lg"
                            >
                              {subject}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">Not Available</span>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm mt-2">
                        🛠 <strong>Experience:</strong>
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {tutor?.experience?.slice(0, 2).map((exp, index) => (
                          <span
                            key={index}
                            className="bg-green-200 text-green-700 text-xs font-semibold px-2 py-1 rounded-lg"
                          >
                            {exp.years} years at {exp.organization}
                          </span>
                        ))}
                      </div>

                      {selectedTutor?.userId?._id === tutor?.userId?._id && (
                        <span className="block mt-3 text-green-600 font-bold text-center">
                          ✔ Selected
                        </span>
                      )}
                    </div>
                  )
              )}
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-5 w-full bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-red-600 transition-all text-sm sm:text-base font-semibold"
          >
            ❌ Close
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default AssignTutor;
