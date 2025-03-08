import { useState } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle } from "lucide-react";

const ComplaintModal = ({ isOpen, onClose, onSubmit, setComplaintType, setDescription, complaintType, description }) => {
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        await onSubmit(); // Call the submit function
        setSuccess(true); // Show success message
    };

    const handleClose = () => {
        setSuccess(false);
        setComplaintType("");
        setDescription("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white p-8 rounded-2xl shadow-2xl w-[500px] relative border border-orange-400"
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.85 }}
            >
                {/* Close Button */}
                {!success && (
                    <button
                        className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 transition"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </button>
                )}

                {success ? (
                    <div className="flex flex-col items-center justify-center text-center">
                        <CheckCircle size={60} className="text-green-500 mb-4" />
                        <h2 className="text-2xl font-bold text-green-600 mb-2">
                            Complaint Submitted!
                        </h2>
                        <p className="text-gray-700 mb-6">Thank you for reporting the issue. We'll review it soon.</p>
                        <button
                            className="px-5 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition shadow-md"
                            onClick={handleClose}
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">
                            📝 File a Complaint
                        </h2>

                        {/* Complaint Type */}
                        <label className="block text-sm font-medium text-gray-800">
                            Complaint Type
                        </label>
                        <select
                            className="w-full p-3 mt-1 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            value={complaintType}
                            onChange={(e) => setComplaintType(e.target.value)}
                        >
                            <option value="">Select Type</option>
                            <option value="Service Issue">Service Issue</option>
                            <option value="Tutor Misconduct">Tutor Misconduct</option>
                            <option value="Technical Problem">Technical Problem</option>
                            <option value="Other">Other</option>
                        </select>

                        {/* Description */}
                        <label className="block text-sm font-medium text-gray-800 mt-5">
                            Description
                        </label>
                        <textarea
                            className="w-full p-3 mt-1 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
                            rows="5"
                            placeholder="Describe the issue in detail..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        {/* Buttons */}
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                className="px-5 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-5 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition shadow-md"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
};

export default ComplaintModal;
