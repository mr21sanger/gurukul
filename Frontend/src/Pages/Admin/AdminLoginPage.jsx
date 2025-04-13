import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useUserReducer } from "../../Reducers/UserReducer";
import { useAdmin } from "../../Reducers/AdminReducer";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState(null);
  const navigate = useNavigate();

  const { adminLogin } = useAdmin();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setErrorMessage("Email and Password are required.");
      return;
    }

    setLoading(true);
    setErrorMessage(""); // Reset errors before a new request

    try {
      const res = await adminLogin({ email, password });
      if (res?.error) {
        throw new Error(res.error); // Handling backend error
      }

      if (res) {
        navigate(`/admin-dashboard/${res?.admin._id}`

        ); // Redirect on successful login
      }

    } catch (err) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setForgotPasswordMessage(
      "For security reasons, password reset requests are handled by our support team. Please contact the Gurukul administration to regain access."
    );
    setTimeout(() => setForgotPasswordMessage(null), 5000);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Admin Branding */}
      <div className="hidden md:flex w-1/2 bg-blue-900 text-white flex-col justify-center items-center p-10">
        <h1 className="text-3xl font-bold">"Manage, Monitor, Succeed."</h1>
        <p className="mt-2 text-lg opacity-80">
          Empowering administrators with control & insights.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-100 p-6">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white shadow-lg rounded-lg p-8"
        >
          <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
            Admin Portal
          </h2>

          {/* Error Message */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 p-3 text-sm text-red-800 bg-red-100 border border-red-500 rounded-md"
            >
              {errorMessage}
            </motion.div>
          )}

          {/* Forgot Password Message */}
          {forgotPasswordMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 p-3 text-sm text-yellow-800 bg-yellow-100 border border-yellow-500 rounded-md"
            >
              {forgotPasswordMessage}
            </motion.div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                required
                placeholder="Enter your admin email"
              />
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <label className="block text-gray-700">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                required
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Forgot Password */}
            <button
              type="button"
              className="float-right text-blue-800 text-sm cursor-pointer hover:underline"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>

            {/* Sign In Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="w-full bg-blue-800 text-white py-2 rounded-md mt-4 hover:bg-blue-900 transition disabled:opacity-50"
              type="submit"
            >
              {loading ? "Logging in..." : "Sign In"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
