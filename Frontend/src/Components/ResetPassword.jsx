import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useUserReducer } from "../Reducers/UserReducer";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token"); // Extract token from URL

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [localError, setLocalError] = useState("");
    const { resetPassword, loading, error } = useUserReducer();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLocalError("");

        if (password !== confirmPassword) {
            setLocalError("Passwords do not match.");
            return;
        }
        const response = await resetPassword({ password, token });
        if (response) {
            setMessage("Password has been reset successfully!");
        } else {
            setLocalError(response?.message || "Failed to reset password.");
        }
    };

    return (
        <div className="relative flex justify-center items-center min-h-screen bg-gray-100 px-6">
            {/* Logo at Top-Left */}
            <img
                src="/logo.webp"
                alt="Logo"
                loading="lazy"
                className="absolute top-8 md:left-16 w-40 h-auto"
            />

            {/* Main Container */}
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Password Fields */}
                    <input
                        type="password"
                        placeholder="New Password"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    {/* Error / Success Messages - Now Above the Button */}
                    {message && <p className="text-green-600 text-center text-lg">{message}</p>}
                    {(localError || error) && <p className="text-red-500 text-center text-lg">{localError || error}</p>}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full p-3 rounded-lg text-white font-semibold text-lg transition-all ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-orange-500 hover:bg-orange-600 shadow-md"
                            }`}
                        disabled={loading}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
