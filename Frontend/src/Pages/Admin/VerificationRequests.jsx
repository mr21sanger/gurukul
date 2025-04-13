import React, { useEffect, useState } from "react";
import VerificationReqModal from "../../Components/VerificationReqModal";
import { useAdmin } from "../../Reducers/AdminReducer";

const VerificationRequests = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { verificationRequests, verifyUser } = useAdmin();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    setRequests(verificationRequests.filter(user => user?.verificationStatus !== "Verified"));
  }, [verificationRequests]);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleRequest = (userId, status) => {
    verifyUser(userId, status);
    setRequests(prevRequests => prevRequests.filter(user => user.id !== userId));
  };

  return (
    <div className="mt-8">
      {/* Display message if no verification requests */}
      {requests.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg font-semibold">No verification requests available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((user) => (
            <div
              key={user?.id}
              className="bg-white shadow-lg rounded-lg p-5 hover:shadow-xl transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
              <p className="text-gray-600 text-sm">{user?.email}</p>
              <div className="flex flex-wrap mt-3 gap-2">
                {user?.documents[0] &&
                  Object.values(user.documents[0]).map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt="Verification"
                      className="h-16 w-16 rounded-md shadow-md border border-gray-300 hover:scale-110 transition-transform"
                    />
                  ))}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`px-4 py-2 rounded-md text-white font-semibold shadow-md text-sm ${
                    user?.status === "Rejected" ? "bg-red-500" : "bg-yellow-500"
                  }`}
                >
                  {user?.verificationStatus}
                </span>
                <button
                  onClick={() => openModal(user)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Component */}
      <VerificationReqModal
        isOpen={isModalOpen}
        onClose={closeModal}
        user={selectedUser}
        handleVerification={handleRequest}
      />
    </div>
  );
};

export default VerificationRequests;
