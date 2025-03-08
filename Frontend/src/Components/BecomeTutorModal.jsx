import { motion } from "framer-motion";
import { FaTimes, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const VerificationModal = ({ isOpen, onClose, id }) => {
  if (!isOpen) return null;

  const Navigate = useNavigate()

  const handleVerification = () => {
    Navigate(`/verification/${id}`)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-lg w-full relative text-center"
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <FaTimes size={20} />
        </button>

        {/* Verification Section */}
        <FaShieldAlt className="text-yellow-500 text-6xl mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">Verification Required</h2>
        <p className="text-gray-700 text-md mt-2">
          To start tutoring, please complete the verification process.
        </p>

        <ul className="text-left text-gray-600 text-md space-y-2 mt-4">
          <li>✔ Verify Email and Phone number.</li>

          <li>✔ Upload a valid government-issued ID.</li>
          <li>✔ Complete the identity verification steps.</li>
        </ul>

        {/* Start Verification Button */}
        <button
          type="button"
          onClick={handleVerification}
          className="bg-green-600 text-white px-6 py-2 rounded-lg mt-6 hover:bg-green-700 transition"
        >
          Start Verification
        </button>
      </motion.div>
    </div>
  );
};

export default VerificationModal;
