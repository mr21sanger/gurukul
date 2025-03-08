import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import { useUserReducer } from "../Reducers/UserReducer";

const ChangePasswordModal = ({ isOpen, onClose, user }) => {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [forgotSuccess, setForgotSuccess] = useState(false);
    const [maskedEmail, setMaskedEmail] = useState("");

    const { changePassword, loading, error, forgetPassword } = useUserReducer();

    useEffect(() => {
        if (error) {
            setErrors((prev) => ({ ...prev, api: error }));
        }
    }, [error]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        if (e.target.name === "confirmPassword") {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: e.target.value !== formData.newPassword ? "Passwords do not match" : "",
            }));
        }
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.oldPassword) newErrors.oldPassword = "Old password is required";
        if (!formData.newPassword) newErrors.newPassword = "New password is required";
        if (formData.newPassword.length < 6) newErrors.newPassword = "Password must be at least 6 characters";
        if (formData.confirmPassword !== formData.newPassword) newErrors.confirmPassword = "Passwords do not match";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const res = await changePassword(formData);

        if (res) {
            setSuccess(true);
            setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            setErrors({});
        }
    };

    // Forgot password handler
    const handleForgotPassword = async () => {
        if (user?.email) {
            const res = await forgetPassword(user.email);

            if (res?.status) {
                // Mask part of the email (e.g., "te****@gmail.com")
                const masked = user.email.replace(/(.{2})(.*)(?=@)/, (match, first, middle) =>
                    first + "*".repeat(middle.length)
                );
                setMaskedEmail(masked);
                setForgotSuccess(true);
            }
        } else {
            setErrors({ api: "Can't reset password at this moment" });
        }
    };

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
                        <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={onClose}>
                            <X size={20} />
                        </button>

                        {success ? (
                            <div className="flex flex-col items-center space-y-4">
                                <CheckCircle size={50} className="text-green-500" />
                                <h2 className="text-lg font-semibold text-gray-800">Password Changed Successfully</h2>
                                <button
                                    className="px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                                    onClick={() => {
                                        setSuccess(false);
                                        onClose();
                                    }}
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">Change Password</h2>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-gray-600 text-sm">Old Password</label>
                                        <input
                                            type="password"
                                            name="oldPassword"
                                            value={formData.oldPassword}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                        {errors.oldPassword && <p className="text-red-500 text-sm">{errors.oldPassword}</p>}

                                        {/* Forgot Password Button */}
                                        <button
                                            className="text-sm text-orange-500 mt-1 hover:underline"
                                            onClick={handleForgotPassword}
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-gray-600 text-sm">New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                        {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-gray-600 text-sm">Confirm Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                                    </div>

                                    {errors.api && <p className="text-red-500 text-sm mt-2">{errors.api}</p>}
                                </div>

                                <div className="flex justify-end mt-4 space-x-2">
                                    <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400" onClick={onClose}>
                                        Cancel
                                    </button>
                                    <button
                                        className="px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        {loading ? "Saving..." : "Change Password"}
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}

            {/* Forgot Password Success Alert */}
            {forgotSuccess && (
                <motion.div
                    className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-lg w-[85%] max-w-sm text-center"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                    >
                        <CheckCircle size={50} className="text-green-500 mx-auto" />
                        <h2 className="text-lg font-semibold text-gray-800 mt-3">Reset Link Sent</h2>
                        <p className="text-gray-600 mt-1">A password reset link has been sent to:</p>
                        <p className="font-semibold text-gray-800">{maskedEmail}</p>
                        <button
                            className="mt-4 px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                            onClick={() => setForgotSuccess(false)}
                        >
                            OK
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </>
    );
};

export default ChangePasswordModal;
