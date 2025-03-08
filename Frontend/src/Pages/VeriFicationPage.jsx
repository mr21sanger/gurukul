import { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { useUserReducer } from "../Reducers/UserReducer";
import { useNavigate, useParams } from "react-router-dom";

const VerificationPage = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91-9876543210"); // Example phone number
  const [otp, setOtp] = useState("");
  const [aadhaar, setAadhaar] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [introVideo, setIntroVideo] = useState(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const { uploadDocuments, loading } = useUserReducer();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleFileChange = (e, setter) => {
    setter(e.target.files[0]);
  };

  const verifyPhone = () => {
    alert("OTP sent to " + phone);
  };

  const verifyOtp = () => {
    if (otp === "123456") {
      setIsPhoneVerified(true);
      setStatusMessage({ text: "Phone number verified successfully", success: true });
      setTimeout(() => setStatusMessage(null), 3000);
    } else {
      setStatusMessage({ text: "Invalid OTP, please try again", success: false });
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleSubmit = async () => {
    if (isPhoneVerified && aadhaar && selfie) {
      const response = await uploadDocuments(aadhaar, selfie, id);
      if (response.status) {
        setStatusMessage({ text: "Verification submitted successfully!", success: true });
        setTimeout(() => {
          setStatusMessage(null);
          navigate("/tutor-dash");
        }, 3000);
      } else {
        setStatusMessage({ text: "Error occurred, please try again later", success: false });
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } else {
      setStatusMessage({ text: "Please complete all required verification steps", success: false });
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 p-10 min-h-screen bg-gray-50">

      {/* Floating Status Message */}
      {statusMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-5 right-5 px-4 py-2 rounded-lg text-white text-lg shadow-lg ${statusMessage.success ? "bg-green-500" : "bg-red-500"
            }`}
        >
          {statusMessage.text}
        </motion.div>
      )}

      {/* Steps Column */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Steps for Verification</h2>
        <ul className="space-y-4 text-lg">
          <li className="flex items-center"><FaCheckCircle className="mr-2" /> Enter your email for verification</li>
          <li className="flex items-center"><FaCheckCircle className="mr-2" /> Verify your phone number with OTP</li>
          <li className="flex items-center"><FaCheckCircle className="mr-2" /> Upload a clear image of your Aadhaar card</li>
          <li className="flex items-center"><FaCheckCircle className="mr-2" /> Take a selfie for identity confirmation</li>
          <li className="flex items-center"><FaCheckCircle className="mr-2" /> (Optional) Upload an introductory video</li>
        </ul>
      </div>

      {/* Input Fields Column */}
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Upload Your Details</h2>
        <label className="block text-gray-700 mb-2">Email Verification:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg mb-4" placeholder="Enter your email" />

        <label className="block text-gray-700 mb-2">Phone Number:</label>
        <div className="flex items-center mb-4">
          <span className="mr-4 text-lg font-semibold">{phone}</span>
          <button onClick={verifyPhone} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm">Verify Phone</button>
        </div>

        {isPhoneVerified ? (
          <p className="text-green-600 font-semibold mb-4">Phone Verified ✅</p>
        ) : (
          <>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full p-3 border rounded-lg mb-4" placeholder="Enter OTP" />
            <button onClick={verifyOtp} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">Verify OTP</button>
          </>
        )}

        <label className="block text-gray-700 mt-4 mb-2">Upload Aadhaar Card:</label>
        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setAadhaar)} className="w-full p-2 border rounded-lg mb-4" />

        <label className="block text-gray-700 mb-2">Upload Selfie:</label>
        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setSelfie)} className="w-full p-2 border rounded-lg mb-4" />

        <label className="block text-gray-700 mb-2">Upload Introductory Video (Optional):</label>
        <input type="file" accept="video/*" onChange={(e) => handleFileChange(e, setIntroVideo)} className="w-full p-2 border rounded-lg mb-4" />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition w-full text-lg font-semibold flex items-center justify-center"
          disabled={!isPhoneVerified || loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          ) : (
            "Submit Verification"
          )}
        </button>

      </div>
    </div>
  );
};

export default VerificationPage;
