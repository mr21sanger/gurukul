import { motion } from "framer-motion";
import { useState } from "react";
import { useUserReducer } from "../Reducers/UserReducer";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [success, setSuccess] = useState(""); // Success message
  const [inputErrors, setInputErrors] = useState({ email: "", password: "" });
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Toggle state

  const { login, loading, forgetPassword, error } = useUserReducer();
  const navigate = useNavigate();

  // Validate Email
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      setInputErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Invalid email format",
      }));
    }

    if (name === "password") {
      setInputErrors((prev) => ({
        ...prev,
        password: value.length >= 6 ? "" : "Password must be at least 6 characters long",
      }));
    }
  };

  // Handle login
  const handleLoginClick = async () => {
    setSuccess("");

    if (!formData.email || !formData.password) {
      setInputErrors({
        email: formData.email ? "" : "Email is required",
        password: formData.password ? "" : "Password is required",
      });
      return;
    }

    if (inputErrors.email || inputErrors.password) return;

    const data = await login(formData);
    if (data) {
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate(`/${data}`), 1000);
    }
  };

  // Handle forgot password submission
  const handleForgetPasswordSubmit = async () => {
    if (!formData.email) {
      setInputErrors((prev) => ({
        ...prev,
        email: "Please enter your email to reset password",
      }));
      return;
    }

    try {
      const data = await forgetPassword(formData.email);
      if (data.status) {
        setSuccess("Reset link sent to your email.");
      }// setIsForgotPassword(false); // Return to login form after success
      setTimeout(() => setSuccess(""), 5000)
    } catch {
      setSuccess("Failed to send reset link. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Motivation & Branding */}
      <div className="w-full md:w-1/2 bg-orange-800 text-white flex flex-col justify-center items-center p-8 md:p-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">"Keep Learning, Keep Growing!"</h1>
        <p className="mt-2 text-lg opacity-90">Your Journey to Excellence Continues...</p>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 px-6 py-10">
        <motion.div
          className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Conditional Rendering */}
          {isForgotPassword ? (
            <>
              <h2 className="text-2xl font-bold text-orange-600 text-center mb-2">Forgot Password</h2>
              <p className="text-gray-600 text-center mb-4">Enter your email to reset your password</p>

              {/* Email Input */}
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm md:text-base"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                {inputErrors.email && <p className="text-red-500 text-sm">{inputErrors.email}</p>}
              </div>

              {success && <p className="text-green-600 text-center mt-3">{success}</p>}

              {/* Submit Button */}
              <motion.button
                className="w-full text-white py-2 rounded-lg mt-4 bg-orange-500 hover:bg-orange-600 transition-all duration-300 shadow-md text-sm md:text-base"
                whileHover={{ scale: 1.05 }}
                onClick={handleForgetPasswordSubmit}
                disabled={loading}
              >
                {loading ? "Sending..." : "Reset Password"}
              </motion.button>

              {/* Back to Login */}
              <div className="flex justify-center mt-3">
                <button
                  className="text-orange-500 hover:underline text-sm font-medium"
                  onClick={() => setIsForgotPassword(false)}
                >
                  Back to Login
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-orange-600 text-center mb-2">Welcome Back!</h2>
              <p className="text-gray-600 text-center mb-4">Sign in to continue</p>

              {/* Email Input */}
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm md:text-base"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* Password Input */}
              <div className="relative mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm md:text-base"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2 text-gray-500 text-lg"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end mb-3">
                <button
                  className="text-orange-500 hover:underline text-sm font-medium"
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot password?
                </button>
              </div>

              {error && <p className="text-red-500 text-center mt-2">{error}</p>}
              {success && <p className="text-green-600 text-center mt-3">{success}</p>}
              {/* Submit Button */}
              <motion.button
                className="w-full text-white py-2 rounded-lg mt-4 bg-orange-500 hover:bg-orange-600 transition-all duration-300 shadow-md text-sm md:text-base"
                whileHover={{ scale: 1.05 }}
                onClick={handleLoginClick}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Sign In"}
              </motion.button>

              {/* Sign Up Link */}
              <div className="flex flex-col items-center mt-4">
                <p className="text-gray-700 text-sm md:text-base">
                  Don't have an account?{" "}
                  <span
                    className="text-orange-500 cursor-pointer hover:underline font-medium"
                    onClick={() => navigate("/get-started/signup")}
                  >
                    Sign up
                  </span>
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
