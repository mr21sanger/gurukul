import { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { useUserReducer } from "../Reducers/UserReducer";
import { useNavigate, useParams } from "react-router-dom";

const VerificationPage = () => {
  const [email, setEmail] = useState("");
  const [aadhaar, setAadhaar] = useState(null);
  const [aadhaarPreview, setAadhaarPreview] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const { uploadDocuments, loading } = useUserReducer();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleFileChange = (e, setter, previewSetter) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
      previewSetter(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (aadhaar && selfie) {
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
      setStatusMessage({ text: "Please upload both Aadhaar and Selfie", success: false });
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 p-10 min-h-screen bg-orange-50">

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
      <div className="bg-orange-500 text-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Steps for Verification</h2>
        <ul className="space-y-4 text-lg">
          <li className="flex items-center"><FaCheckCircle className="mr-2" /> Enter your email for verification</li>
          <li className="flex items-center"><FaCheckCircle className="mr-2" /> Upload a clear image of your Aadhaar card</li>
          <li className="flex items-center"><FaCheckCircle className="mr-2" /> Take a selfie for identity confirmation</li>
        </ul>
      </div>

      {/* Input Fields Column */}
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Upload Your Details</h2>

        {/* Aadhaar Upload & Preview */}
        {aadhaarPreview && (
          <img 
            src={aadhaarPreview} 
            alt="Aadhaar Preview" 
            loading="lazy"
            className="w-24 h-24 object-cover rounded-lg mb-4 shadow-md mx-1" 
          />
        )}
        <label className="block text-gray-700 mb-2">Upload National Id:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, setAadhaar, setAadhaarPreview)}
          className="w-full p-2 border rounded-lg mb-4"
        />

        {/* Selfie Upload & Preview */}
        {selfiePreview && (
          <img 
            src={selfiePreview} 
            alt="Selfie Preview" 
            loading="lazy"
            className="w-24 h-24 object-cover rounded-lg mb-4 shadow-md mx-1" 
          />
        )}
        <label className="block text-gray-700 mb-2">Upload Selfie:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, setSelfie, setSelfiePreview)}
          className="w-full p-2 border rounded-lg mb-4"
        />

        {/* Email Input */}
        <label className="block text-gray-700 mb-2">Email Verification:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
          placeholder="Enter your email"
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="bg-orange-600 text-white px-5 py-3 rounded-lg hover:bg-orange-700 transition w-full text-lg font-semibold flex items-center justify-center"
          disabled={loading}
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
