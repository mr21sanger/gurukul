import { useState } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import { useUserReducer } from "../Reducers/UserReducer";

const EditProfileModal = ({ isOpen, onClose, user }) => {
    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        createdAt: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "",
        street: user?.address?.street || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        zipCode: user?.address?.zipCode || "",
        country: user?.address?.country || "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const { editProfile, loading } = useUserReducer();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setError("");
        setSuccess(false);

        try {
            await editProfile(formData);
            setSuccess(true);
        } catch (err) {
            setError("Failed to update profile. Please try again.");
        }
    };

    const handleDoneClick = () => {
        setSuccess(false)
        onClose()
    }

    return (
        <>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-lg w-[85%] max-w-md relative"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                    >
                        {/* Close Button */}
                        <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={onClose}>
                            <X size={20} />
                        </button>

                        {success ? (
                            // Success Confirmation Screen
                            <div className="flex flex-col items-center justify-center text-center">
                                <CheckCircle size={50} className="text-green-500 mb-3" />
                                <h2 className="text-xl font-semibold text-gray-800">Profile Updated!</h2>
                                <p className="text-gray-600 text-sm mt-1">Your profile has been successfully updated.</p>

                                <button
                                    className="mt-4 px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                                    onClick={handleDoneClick}
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            // Form Section
                            <>
                                <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">Edit Profile</h2>

                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <div className="w-1/2">
                                            <label className="block text-gray-600 text-sm">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>

                                        <div className="w-1/2">
                                            <label className="block text-gray-600 text-sm">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-600 text-sm">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full p-2 border bg-gray-100 rounded-md text-gray-600 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-600 text-sm">Phone</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-600 text-sm">Street</label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <div className="w-1/2">
                                            <label className="block text-gray-600 text-sm">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>

                                        <div className="w-1/2">
                                            <label className="block text-gray-600 text-sm">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <div className="w-1/2">
                                            <label className="block text-gray-600 text-sm">Zip Code</label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>

                                        <div className="w-1/2">
                                            <label className="block text-gray-600 text-sm">Country</label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                                <div className="flex justify-end mt-4 space-x-2">
                                    <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400" onClick={onClose}>
                                        Cancel
                                    </button>
                                    <button
                                        className="px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        {loading ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </>
    );
};

export default EditProfileModal;
