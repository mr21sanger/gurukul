import { motion } from "framer-motion";
import { useState } from "react";
import { useUserReducer } from "../Reducers/UserReducer";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [success, setSuccess] = useState(""); // Success message
  const [inputErrors, setInputErrors] = useState({ email: "", password: "" }); // Input validation errors

  const { login, loading, forgetPassword, error } = useUserReducer(); // Error from context
  const navigate = useNavigate();

  // Validate Email
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle input changes and validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Input Validation
    if (name === "email") {
      setInputErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Invalid email format",
      }));
    }

    if (name === "password") {
      setInputErrors((prev) => ({
        ...prev,
        password:
          value.length >= 6
            ? ""
            : "Password must be at least 6 characters long",
      }));
    }
  };

  // Handle login
  const handleLoginClick = async () => {
    setSuccess(""); // Reset success messages

    // Final validation before submitting
    if (!formData.email || !formData.password) {
      setInputErrors({
        email: formData.email ? "" : "Email is required",
        password: formData.password ? "" : "Password is required",
      });
      return;
    }

    if (inputErrors.email || inputErrors.password) return; // Prevent submission if errors exist

    const data = await login(formData);
    if (data) {
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate(`/${data}`), 1000);
    }
  };

  // Handle forgot password
  const handleForgetPassword = async () => {
    if (!formData.email) {
      setInputErrors((prev) => ({
        ...prev,
        email: "Please enter your email to reset password",
      }));
      return;
    }

    try {
      await forgetPassword(formData.email);
      setSuccess("Reset link sent to your email.");
    } catch {
      setSuccess("Failed to send reset link. Try again.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-orange-100 to-orange-300">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-orange-600 text-center mb-2">
          Welcome!
        </h2>
        <p className="text-gray-600 text-center mb-4">It’s really nice to see you</p>

        {/* Email Input */}
        <div className="mb-3">
          <input
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none ${inputErrors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-orange-500"
              }`}
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
          {inputErrors.email && <p className="text-red-500 text-sm mt-1">{inputErrors.email}</p>}
        </div>

        {/* Password Input */}
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none ${inputErrors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-orange-500"
              }`}
            placeholder="Your password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {inputErrors.password && <p className="text-red-500 text-sm">{inputErrors.password}</p>}

        {/* Display Errors from Context */}
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        {/* Display Success Messages */}
        {success && <p className="text-green-500 text-center mt-2">{success}</p>}

        {/* Submit Button */}
        <motion.button
          className={`w-full text-white py-2 rounded-lg mt-4 transition-all duration-300 shadow-md ${loading || inputErrors.email || inputErrors.password
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
            }`}
          whileHover={{ scale: loading || inputErrors.email || inputErrors.password ? 1 : 1.05 }}
          onClick={handleLoginClick}
          disabled={loading || inputErrors.email || inputErrors.password}
        >
          {loading ? "Logging in..." : "Submit →"}
        </motion.button>

        {/* Links */}
        <p className="text-orange-500 text-center mt-4 cursor-pointer hover:underline">
          Join us today
        </p>
        <button
          className="text-gray-500 mx-auto text-center mt-2 cursor-pointer hover:underline"
          onClick={handleForgetPassword}
          disabled={loading}
        >
          Lost password?
        </button>
      </motion.div>
    </div>
  );
};

export default LoginPage;
