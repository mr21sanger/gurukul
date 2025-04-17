import React, { useState } from "react";
import { useAdmin } from "../../Reducers/AdminReducer";
import { motion } from "framer-motion";
import InstructorInfoCard from "../../Components/InstructorInfoCard";

const VerifiedTutors = () => {
  const { tutors } = useAdmin();

  const [filter, setFilter] = useState("verified"); // Options: "all", "verified", "nonVerified"

  const filteredTutors = tutors?.filter((tutor) => {
    if (filter === "verified") return tutor.isVerified;
    if (filter === "nonVerified") return !tutor.isVerified;
    return true; // "all"
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 px-6 py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-purple-800 mb-4">🎓 Tutors</h1>
        <p className="text-gray-600 mb-4">
          {filteredTutors.length > 0
            ? `Showing ${filteredTutors.length} ${filter} instructor${filteredTutors.length !== 1 ? "s" : ""}`
            : "No tutors found for the selected filter."}
        </p>

        {/* Filter Buttons */}
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === "all"
                ? "bg-purple-600 text-white"
                : "bg-white border border-purple-300 text-purple-600"
            }`}
          >
            Show All
          </button>
          <button
            onClick={() => setFilter("verified")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === "verified"
                ? "bg-green-600 text-white"
                : "bg-white border border-green-300 text-green-600"
            }`}
          >
            Verified
          </button>
          <button
            onClick={() => setFilter("nonVerified")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === "nonVerified"
                ? "bg-red-600 text-white"
                : "bg-white border border-red-300 text-red-600"
            }`}
          >
            Non-Verified
          </button>
        </div>
      </div>

      {/* Tutors Grid */}
      {filteredTutors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredTutors.map((tutor, index) => (
            <motion.div
              key={tutor._id || index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <InstructorInfoCard instructor={tutor} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-24">
          <div className="text-6xl text-purple-300 mb-4">📭</div>
          <p className="text-lg text-gray-500">No tutors found for this filter.</p>
        </div>
      )}
    </div>
  );
};

export default VerifiedTutors;
