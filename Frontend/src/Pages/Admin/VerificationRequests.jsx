import React, { useEffect, useState } from "react";
import VerificationReqModal from "../../Components/VerificationReqModal";
import { useAdmin } from "../../Reducers/AdminReducer";

const VerificationRequests = ({ handleVerification }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { verificationRequests } = useAdmin()

  const [requests, setRequests] = useState([])

  useEffect(() => {
    setRequests(verificationRequests)
  }, [verificationRequests])

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };


  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Verification Requests</h2>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-left">
              <th className="border p-4">Name</th>
              <th className="border p-4">Email</th>
              <th className="border p-4">Documents</th>
              <th className="border p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((user) => (
              <tr
                key={user?.id}
                className="hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                onClick={() => openModal(user)}
              >
                <td className="border p-4 text-gray-800 font-medium">{user?.name}</td>
                <td className="border p-4 text-gray-600">{user?.email}</td>
                <td className="border p-4">
                  <div className="flex flex-wrap justify-center gap-2">
                    {user?.documents[0] &&
                      Object.values(user.documents[0]).map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt="Verification"
                          className="h-14 w-14 rounded-md shadow-md border border-gray-300 hover:scale-110 transition-transform duration-200"
                        />
                      ))}
                  </div>
                </td>
                <td className="border p-4 text-center">
                  <span
                    className={`px-4 py-2 rounded-md text-white font-semibold shadow-md ${user?.status === "Approved" ? "bg-green-500" : user?.status === "Rejected" ? "bg-red-500" : "bg-yellow-500"
                      }`}
                  >
                    {user?.verificationStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Component */}
      <VerificationReqModal
        isOpen={isModalOpen}
        onClose={closeModal}
        user={selectedUser}
        handleVerification={handleVerification}
      />
    </div>
  );
};

export default VerificationRequests;
