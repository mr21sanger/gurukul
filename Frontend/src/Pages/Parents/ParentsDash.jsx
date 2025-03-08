import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiEdit, FiPlusCircle, FiLock, FiTrash, FiCheckCircle,
  FiXCircle, FiFileText, FiPhone
} from "react-icons/fi";
import { useUserReducer } from "../../Reducers/UserReducer";
import HireTutorModal from "../../Components/HireTutorModal";
import Error from "../../Components/Error";
import ComplaintModal from "../../Components/ComplaintModal";
import { Alert, AlertTitle } from "@mui/material";
import EditProfileModal from "../../Components/EditProfileModal";
import ChangePasswordModal from "../../Components/ChangePasswordModal";


const ParentDash = () => {
  const [isTutorAssigned, setIsTutorAssigned] = useState(false);
  const { user, loading } = useUserReducer();
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [complaintType, setComplaintType] = useState("");
  const [description, setDescription] = useState("");
  const { postComplaint } = useUserReducer();
  const [success, setSuccess] = useState(false)

  const [assignedTutor, setAssignedTutor] = useState({});
  const [details, setDetails] = useState({});
  const [postRequestModal, setPostRequestModal] = useState(false);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [editPasswordModal, setEditPassWordModal] = useState(false);

  const handleClick = () => {
    setPostRequestModal(true);
  };

  const handleUpdateClick = () => {
    setEditProfileModal(true)
  }

  const handleSubmit = async () => {
    if (!complaintType || !description) {
      alert("All fields are required.");
      return;
    }
    const id = details?._id
    const res = await postComplaint({ complaintType, description, id });
    res ? setSuccess(true) : null
    setComplaintType("");
    setDescription("");
    setTimeout(() => setSuccess(false), 3000);
  };


  useEffect(() => {
    setDetails(user?.userId);
    if (user?.assigned) {
      setIsTutorAssigned(user?.assigned);
      setAssignedTutor(user?.tutorAssigned?.tutor);
    }
  }, [user]);

  if (user?.userId?.role !== "Student") {
    return <Error />;
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden my-16 bg-gray-100 p-4 sm:p-6">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 bg-white shadow-lg rounded-lg p-6 sm:p-8 max-w-7xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Parent Profile */}
        <div className="bg-orange-100 p-6 rounded-lg shadow-md w-full">
          <h2 className="text-2xl font-semibold text-orange-700 mb-4 text-center sm:text-left">
            Profile Information
          </h2>
          <div className="flex flex-col sm:flex-row items-center mb-4">
            <img
              src={details?.image || `https://i.pravatar.cc/100?u=${details?.email}`}
              alt="Profile"
              className="w-20 sm:w-24 h-20 sm:h-24 rounded-full border-2 border-orange-500 shadow-md"
            />
            <div className="sm:ml-4 mt-2 sm:mt-0 text-center sm:text-left">
              <p className="text-lg font-medium">{details?.firstName + " " + details?.lastName}</p>
              <p className="text-gray-600">{details?.email}</p>
            </div>
          </div>
          <div className="border p-4 rounded-lg w-full">
            <p><strong>Phone:</strong> {details?.phone}</p>
            <p><strong>Location:</strong> {`${details?.address?.street}, ${details?.address?.city}, ${details?.address?.state} - ${details?.address?.zipCode}, ${details?.address?.country}` || "N/A"}</p>
          </div>

          {/* Buttons - Moved Here for Better Visibility */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button className="bg-orange-500 text-white py-2 rounded-lg flex items-center justify-center w-full sm:w-auto hover:bg-orange-600" onClick={handleUpdateClick}>
              <FiEdit className="mr-2" /> Edit Profile
            </button>

            <button className="bg-yellow-500 text-white py-2 rounded-lg flex items-center justify-center w-full sm:w-auto hover:bg-yellow-600" onClick={handleClick}>
              <FiPlusCircle className="mr-2" /> Post Requirement
            </button>
            <button className="bg-orange-500 text-white py-2 rounded-lg flex items-center justify-center w-full sm:w-auto hover:bg-orange-600"
              onClick={() => setEditPassWordModal(true)}>
              <FiLock className="mr-2" /> Change Password
            </button>
            <button className="bg-red-500 text-white py-2 rounded-lg flex items-center justify-center w-full sm:w-auto hover:bg-red-600">
              <FiTrash className="mr-2" /> Delete Account
            </button>
          </div>



          {/* Complaint Section */}
          <div className="mt-6 p-4 border rounded-lg w-full">
            <h3 className="text-lg font-semibold text-orange-700 text-center sm:text-left">
              Post a Complaint
            </h3>
            <p className="text-gray-600 text-center sm:text-left">
              If you have any issues with the tutor, you can submit a complaint.
            </p>
            <button className="mt-2 w-full bg-red-500 flex justify-center items-center text-white py-2 px-4 rounded-lg hover:bg-red-600" onClick={() => setIsComplaintModalOpen(true)}>
              <FiFileText className="mr-2" /> Submit Complaint
            </button>
          </div>
          {success ? (<Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            This is a success Alert with an encouraging title.
          </Alert>) : null}
        </div>




        {/* Tutor Information */}
        <div className="p-6 rounded-lg shadow-md w-full">
          <h2 className="text-2xl font-semibold text-orange-700 mb-4 text-center sm:text-left">
            Tutor Information
          </h2>

          <div className="p-4 border rounded-lg flex flex-col sm:flex-row items-center justify-between mb-4 w-full">
            <span className="text-lg font-medium text-gray-700 text-center sm:text-left">
              Tutor Assignment Status:
            </span>
            {isTutorAssigned ? (
              <span className="flex items-center bg-green-500 text-white px-3 py-1 rounded mt-2 sm:mt-0">
                <FiCheckCircle className="mr-2" />
                Assigned
              </span>
            ) : (
              <motion.span
                className="flex items-center bg-red-500 text-white px-3 py-1 rounded mt-2 sm:mt-0"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              >
                <FiXCircle className="mr-2" />
                Waiting for Assignment
              </motion.span>
            )}
          </div>

          {/* Tutor Details */}
          <div className="p-4 border rounded-lg mb-4 w-full">
            <h3 className="text-lg font-semibold text-orange-700 text-center sm:text-left">
              Tutor Details
            </h3>
            {isTutorAssigned ? (
              <ul className="text-gray-600 text-center sm:text-left">
                <li><strong>Name:</strong> {assignedTutor?.userId?.firstName} {assignedTutor?.userId?.lastName}</li>
                <li><strong>Email:</strong> {assignedTutor?.userId?.email}</li>
                <li><strong>Phone:</strong> {assignedTutor?.userId?.phone || "N/A"}</li>
                <li>
                  <strong>Location:</strong>{" "}
                  {assignedTutor?.userId?.address &&
                    assignedTutor.userId.address.street &&
                    assignedTutor.userId.address.city &&
                    assignedTutor.userId.address.state &&
                    assignedTutor.userId.address.zipCode &&
                    assignedTutor.userId.address.country
                    ? `${assignedTutor.userId.address.street}, ${assignedTutor.userId.address.city}, ${assignedTutor.userId.address.state} - ${assignedTutor.userId.address.zipCode}, ${assignedTutor.userId.address.country}`
                    : "N/A"}
                </li>

              </ul>
            ) : (
              <p className="text-gray-500 text-center">No assigned tutor yet.</p>
            )}
          </div>

          {/* Tutor Record */}

          {isTutorAssigned ? (
            <div className="bg-white p-4 sm:p-6 rounded-lg border shadow-md max-w-lg sm:max-w-xl lg:max-w-2xl mx-auto">
              {/* Header */}
              <h2 className="text-lg font-semibold text-orange-700 mb-2">Tutor Record</h2>

              {/* Experience Section */}
              <div className="mb-2">
                <p className="font-semibold text-gray-800">Experience:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {Array.isArray(assignedTutor?.experience) && assignedTutor.experience.length > 0
                    ? assignedTutor.experience.map((exp, index) => (
                      <span key={index} className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-md">
                        {exp.years} years at {exp.organization}
                      </span>
                    ))
                    : <span className="text-gray-500">Not provided</span>}
                </div>
              </div>

              {/* Qualifications Section */}
              <div className="mb-2">
                <p className="font-semibold text-gray-800">Qualifications:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {Array.isArray(assignedTutor?.qualifications) && assignedTutor.qualifications.length > 0
                    ? assignedTutor.qualifications.map((qual, index) => (
                      <span key={index} className="bg-orange-100 text-orange-700 text-sm font-medium px-3 py-1 rounded-md">
                        {qual.degree} from {qual.institution} ({qual.fromYear} - {qual.toYear})
                      </span>
                    ))
                    : <span className="text-gray-500">Not provided</span>}
                </div>
              </div>

              {/* Hourly Rate */}
              <p className="font-semibold text-gray-800">
                Hourly Rate: <span className="text-gray-600">{assignedTutor?.hourlyRate ? `$${assignedTutor.hourlyRate}/hr` : "Not specified"}</span>
              </p>
            </div>
          ) : null}

          {/* Contact Tutor Button */}
          {isTutorAssigned && (
            <button
              className="mt-4 w-full bg-orange-500 flex justify-center items-center text-white py-2 px-4 rounded-lg hover:bg-orange-600"
              onClick={() => window.location.href = `tel:${assignedTutor?.userId?.phone}`}
            >
              <FiPhone className="mr-2" /> Contact Tutor
            </button>
          )}

        </div>
      </motion.div>

      <ComplaintModal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        setComplaintType={setComplaintType}
        setDescription={setDescription}
        onSubmit={handleSubmit}
        complaintType={complaintType}
        description={description}
      />

      <HireTutorModal isOpen={postRequestModal} parentId={user?._id} onClose={() => setPostRequestModal(false)} />

      <EditProfileModal isOpen={editProfileModal} onClose={() => setEditProfileModal(false)} user={user?.userId} />
      <ChangePasswordModal isOpen={editPasswordModal} onClose={() => setEditPassWordModal(false)} />

    </div>
  );
};

export default ParentDash;
