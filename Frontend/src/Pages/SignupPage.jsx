import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    role: "Instructor",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const { userSignUp, loading, error } = useUserReducer();

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
    if (!formData.address.street) newErrors.street = "Street address is required";
    if (!formData.address.city) newErrors.city = "City is required";
    if (!formData.address.state) newErrors.state = "State is required";
    if (!formData.address.zipCode) newErrors.zipCode = "Zip Code is required";
    if (!formData.address.country) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const status = await userSignUp(formData);
    if (status) {
      navigate(formData.role === "Instructor" ? "/tutor-dash" : "/parent-dash");
    } else {
      setApiError(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side */}
      <div className="md:w-1/2 w-full bg-orange-800 flex items-center justify-center text-white p-8">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl md:text-4xl font-bold">Your Learning Journey Starts Here!</h2>
          <p className="text-yellow-400 text-lg mt-2">Every Minute & Every Second Counts.</p>
        </motion.div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-6 md:p-10 bg-gray-100">
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-lg bg-white p-5 md:p-6 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-orange-700 text-center">Welcome!</h2>
          <p className="text-gray-600 text-lg text-center md:mb-4">It’s really nice to see you</p>

          {apiError && <p className="text-red-500 text-center mb-3">{apiError}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="flex flex-col md:flex-row gap-4">
              <input name="firstName" value={formData.firstName} onChange={handleChange} className="input-field" placeholder="First name" />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
              <input name="lastName" value={formData.lastName} onChange={handleChange} className="input-field" placeholder="Last name" />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>

            {/* Phone & Email */}
            <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="input-field" placeholder="Phone number" />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            <input name="email" type="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="Enter your email" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            {/* Password Field */}
            <div className="relative">
              <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} className="input-field pr-12" placeholder="Enter password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 text-gray-600">
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* Address Fields */}
            <input name="address.street" value={formData.address.street} onChange={handleChange} className="input-field" placeholder="Street Address" />
            {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}
            <input name="address.city" value={formData.address.city} onChange={handleChange} className="input-field" placeholder="City" />
            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            <input name="address.state" value={formData.address.state} onChange={handleChange} className="input-field" placeholder="State" />
            {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
            <input name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} className="input-field" placeholder="Zip Code" />
            {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
            <input name="address.country" value={formData.address.country} onChange={handleChange} className="input-field" placeholder="Country" />
            {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}

            {/* Role Selection (Radio Buttons) */}
            <div className="flex gap-6">
              <label className="flex items-center space-x-2">
                <input type="radio" name="role" value="Instructor" checked={formData.role === "Instructor"} onChange={handleChange} className="form-radio text-orange-600" />
                <span className="text-gray-700">Instructor</span>
              </label>

              <label className="flex items-center space-x-2">
                <input type="radio" name="role" value="Student" checked={formData.role === "Student"} onChange={handleChange} className="form-radio text-orange-600" />
                <span className="text-gray-700">Student</span>
              </label>
            </div>
            
            {/* Submit Button */}
            <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg">
              {loading ? "Signing Up..." : "Join now →"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
