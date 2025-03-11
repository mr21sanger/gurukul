import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useUserReducer } from "../Reducers/UserReducer";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const SignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    role: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });
  const [otp, setOtp] = useState(""); // State for OTP input
  const [isOtpSent, setIsOtpSent] = useState(false); // State to track if OTP is sent
  const [isOtpVerified, setIsOtpVerified] = useState(false); // State to track OTP verification

  const [otpMessage, setOtpMessage] = useState("")

  const { userSignUp, loading, error, sendOtp, verifyOtp } = useUserReducer();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setApiError(null); // Clear API errors on new input

    if (name.startsWith("address.")) {
      const field = name.split(".")[1]; // Extract 'street', 'city', etc.
      setFormData((prevData) => ({
        ...prevData,
        address: { ...prevData.address, [field]: value },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Form validation
  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = "Enter a valid 10-digit phone number";
    if (!formData.email.includes("@")) newErrors.email = "Enter a valid email address";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.role) newErrors.role = "Role selection is required";
    if (!formData.address.street) newErrors.street = "Street address is required";
    if (!formData.address.city) newErrors.city = "City is required";
    if (!formData.address.state) newErrors.state = "State is required";
    if (!formData.address.zipCode) newErrors.zipCode = "Zip Code is required";
    if (!formData.address.country) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (email) => {
    if (!validateForm()) return;
    // Send OTP to the user's email
    const status = await sendOtp(email);
    if (status) {
      setIsOtpSent(true); // Show OTP input form
    } else {
      setApiError(error || "Unexpected Error Occured");
    }
  };

  // Handle OTP verification
  const handleOtpVerification = async () => {
    const status = await verifyOtp({ email: formData?.email, otp });
    if (status) {
      setIsOtpVerified(true);
      setOtpMessage("Otp Verified Successfully. Redirecting to dashboard...")

      // Add a 3-second loading pause for smooth transition
      setTimeout(() => {
        // Proceed with user signup
        const signupStatus = userSignUp(formData);
        if (signupStatus) {
          navigate(formData.role === "Instructor" ? "/tutor-dash" : "/parent-dash");
        } else {
          setApiError(error || "Unexpected Error Occured");
        }
      }, 3000); // 3-second delay
    } else {
      setApiError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-x-hidden overflow-y-auto">
      {/* Left Side - Fixed Section */}
      <div className="md:w-1/2 w-full bg-orange-800 flex items-center justify-center text-white p-8 md:fixed md:h-screen md:left-0">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">Your Learning Journey Starts Here!</h2>
          <p className="text-yellow-400 text-lg mt-2">Every Minute & Every Second Counts.</p>
        </motion.div>
      </div>

      {/* Right Side - Swipeable Form */}
      <motion.div
        className="md:w-1/2 w-full flex items-center touch-pan-y justify-center p-6 md:p-10 bg-gray-100 md:ml-auto"
      >
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg bg-white p-5 md:p-6 rounded-lg overflow-hidden shadow-xl"
        >
          <h2 className="text-3xl font-bold text-orange-700 text-center">Welcome!</h2>
          <p className="text-gray-600 text-lg text-center md:mb-4">It’s really nice to see you</p>

          <p className="text-center mb-4 text-gray-600">
            Already have an account?{" "}
            <Link to="/get-started/login" className="text-orange-600 font-semibold hover:underline">
              Log in
            </Link>
          </p>

          {!isOtpSent ? (
            // Initial Signup Form
            <div className="space-y-4">
              {/* Name Fields */}
              <div className="flex flex-col md:flex-row gap-4">
                <input name="firstName" value={formData.firstName} onChange={handleChange} className="input-field" placeholder="First name" />
                <input name="lastName" value={formData.lastName} onChange={handleChange} className="input-field" placeholder="Last name" />
              </div>

              {/* Phone & Email */}
              <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="input-field" placeholder="Phone number" />
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="Enter your email" />

              {/* Password Field */}
              <div className="relative">
                <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} className="input-field pr-12" placeholder="Enter password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 text-gray-600">
                  {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>

              {/* Address Fields */}
              <input name="address.street" value={formData.address.street} onChange={handleChange} className="input-field" placeholder="Street Address" />
              <input name="address.city" value={formData.address.city} onChange={handleChange} className="input-field" placeholder="City" />
              <input name="address.state" value={formData.address.state} onChange={handleChange} className="input-field" placeholder="State" />
              <input name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} className="input-field" placeholder="Zip Code" />
              <input name="address.country" value={formData.address.country} onChange={handleChange} className="input-field" placeholder="Country" />

              {/* Role Selection (Dropdown) */}
              <select name="role" value={formData.role} onChange={handleChange} className="input-field" required>
                <option value="">Select Role</option>
                <option value="Instructor">Instructor / Tutor</option>
                <option value="Student">Student / Parent</option>
              </select>

              {apiError && <p className="text-red-500 text-center mb-3">{apiError}</p>}

              <motion.button onClick={() => handleSubmit(formData.email)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg">
                {loading ? "Sending OTP..." : "Send OTP →"}
              </motion.button>
            </div>
          ) : (
            // OTP Verification Form
            <div className="space-y-4">
              <p className="text-center text-gray-600">We’ve sent an OTP to your email. Please enter it below.</p>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input-field"
                placeholder="Enter OTP"
                required
              />

              {otpMessage && (
                <p className={`text-center mb-3 ${isOtpVerified ? "text-green-500" : "text-red-500"}`}>
                  {otpMessage}
                </p>)}

              {apiError && <p className="text-red-500 text-center mb-3">{apiError}</p>}
              <motion.button onClick={handleOtpVerification} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg">
                {loading ? "Verifying OTP..." : "Verify OTP →"}
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignupPage;