import React, { useState } from "react";

const VerificationReqModal = ({ isOpen, onClose, user, handleVerification }) => {
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image

  if (!isOpen || !user) return null;

  const handleRequest = (userId, action) => {
    handleVerification(userId, action)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      {/* Main Modal */}
      <div className="bg-white rounded-xl shadow-2xl w-[28rem] p-6 relative transform transition-all scale-100 hover:scale-[1.02] duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors duration-200 text-xl"
        >
          ✖
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-5 text-center">Verification Details</h2>

        {/* User Details */}
        <div className="text-gray-700 space-y-2 text-center">
          <p><strong className="text-gray-900">Name:</strong> {user.name}</p>
          <p><strong className="text-gray-900">Email:</strong> {user.email}</p>
        </div>

        {/* Documents Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Uploaded Documents:</h3>
          <div className="flex flex-wrap justify-center gap-4 mt-3">
            {user?.documents[0] &&
              Object.values(user.documents[0]).map((url, index) => (
                <img
                  key={index}
                  src={url}
                  loading="lazy"
                  alt="Verification"
                  className="h-16 w-16 rounded-lg shadow-md border border-gray-300 hover:scale-110 transition-transform duration-200 cursor-pointer"
                  onClick={() => setSelectedImage(url)} // Open image preview
                />
              ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-5">
          <button
            onClick={() => handleRequest(user.id, "Approved")}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-md transition-transform hover:scale-105"
          >
            ✅ Approve
          </button>
          <button
            onClick={() => handleRequest(user.id, "Rejected")}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md transition-transform hover:scale-105"
          >
            ❌ Reject
          </button>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300"
          onClick={() => setSelectedImage(null)} // Close on background click
        >
          <div className="relative transform transition-transform scale-95 hover:scale-100">
            <img
              src={selectedImage}
              alt="Preview"
              loading="lazy"

              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl border-2 border-white"
            />
            <button
              className="absolute top-3 right-3 text-white bg-black bg-opacity-50 rounded-full p-2 text-xl font-bold hover:bg-opacity-80 transition duration-200"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationReqModal;
