import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, CheckCircle, Globe } from "lucide-react";
import ForStudents from "../Components/ForStudents";
import Subjects from "../Components/Subjects";
import { useUserReducer } from "../Reducers/UserReducer";
import { useNavigate } from "react-router-dom";
import HireTutorModal from "../Components/HireTutorModal";

const tutors = [
  {
    id: 1,
    name: "Pinky Shaurya",
    location: "Haryana, India",
    rating: 5.0,
    price: 300,
    availability: ["MON", "TUE", "WED", "THU", "FRI"],
    services: ["Student's home", "Online"],
    description:
      "I'm Shaurya, a passionate and dedicated tutor. I specialize in helping students grasp complex concepts in a clear and engaging way.",
  },
  {
    id: 2,
    name: "Sunny Verma",
    location: "Faridabad, Haryana, India",
    rating: 4.5,
    price: 500,
    availability: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    services: ["Student's home"],
    description:
      "I can teach Accounts, Economics, and Business for class XI and XII.",
  },
];

const TutorPage = () => {
  const [showForm, setShowForm] = useState(false);
  const { user } = useUserReducer();
  const navigate = useNavigate();

  const handleClick = () => {
    if (user && user?.userId?.role === "Student") {
      setShowForm(true);
    } else {
      navigate("/get-started/signup");
    }
  };

  const handleStepClick = () => {
    if (user && user?.userId?.role === "Student") {
      navigate("/parent-dash");
    } else {
      navigate("/get-started/signup");
    }
  };

  return (
    <div className="min-h-screen py-10 bg-gray-50/70 px-4 md:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="my-8 md:my-16 max-w-6xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-4xl mt-5 md:text-3xl font-bold text-gray-900 text-center md:text-left">
            Find Your Perfect Tutor
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="px-4 md:px-6 py-2 md:py-3 bg-orange-600 text-white rounded-md font-semibold shadow-md hover:bg-orange-700 transition-all"
          >
            Post Your Requirement
          </motion.button>
        </div>

        {/* Tutor Listings */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {tutors.map((tutor, index) => (
            <motion.div
              key={tutor.id}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white shadow-md rounded-lg p-4 md:p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 flex items-center gap-2">
                  {tutor.name}
                  <CheckCircle className="text-green-500" size={20} />
                </h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <MapPin size={16} /> {tutor.location}
                </p>
                <p className="text-gray-600 flex items-center gap-2 mt-2">
                  <Star size={16} className="text-yellow-500" /> {tutor.rating} (0)
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tutor.availability.map((day, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-200 text-sm rounded-md">
                      {day}
                    </span>
                  ))}
                </div>
                <div className="mt-3">
                  <p className="text-gray-700 font-semibold">Teaching Services:</p>
                  <div className="flex flex-wrap gap-3 mt-1">
                    {tutor.services.includes("Student's home") && (
                      <span className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-sm rounded-md">
                        <Globe size={14} /> Student's Home
                      </span>
                    )}
                    {tutor.services.includes("Online") && (
                      <span className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-sm rounded-md">
                        <Globe size={14} /> Online
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 mt-3">{tutor.description}</p>
              </div>
              <div className="text-right mt-4">
                <p className="text-lg md:text-xl font-semibold text-orange-600">₹{tutor.price}/hr</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Form Modal */}
        {showForm && (
          <HireTutorModal isOpen={showForm} onClose={() => setShowForm(false)} parentId={user?._id} />
        )}
      </motion.div>

      <ForStudents onClick={handleStepClick} />
      <Subjects onClick={handleClick} />
    </div>
  );
};

export default TutorPage;
