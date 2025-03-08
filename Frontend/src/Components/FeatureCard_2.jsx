import { motion } from "framer-motion";
import { User, BookOpen } from "lucide-react";

const FeatureCard_2 = () => {
  return (
    <div className="w-full min-h-[80vh] bg-gradient-to-b from-gray-100 to-gray-200 py-16 flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">What are you looking for?</h2>
      <span className="text-lg mb-6 mt-3 text-gray-700 text-center">Teacher or Student</span>

      <div className="flex flex-col md:flex-row gap-10 md:gap-16 mt-10 px-4">
        {/* Teach Card */}
        <motion.div
          whileHover={{ scale: 1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#ffe0e0] rounded-2xl p-6 sm:p-10 w-full max-w-xs md:max-w-md lg:max-w-lg shadow flex flex-col items-center text-center"
        >
          <User className="text-orange-500 w-12 h-12 sm:w-16 sm:h-16 mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Do you want to teach here?</h3>
          <p className="text-gray-700 mb-4 text-sm sm:text-base">
            Teaching is conceptual and intellectual, abstract and concrete, creative, and sequential.
          </p>
          <button className="px-4 py-2 border border-gray-700 rounded-lg text-gray-700 hover:bg-orange-500 hover:text-white transition-all">
            Register Now
          </button>
        </motion.div>
        
        {/* Learn Card */}
        <motion.div
          whileHover={{ scale: 1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#ffeb99] rounded-2xl p-6 sm:p-10 w-full max-w-xs md:max-w-md lg:max-w-lg shadow flex flex-col items-center text-center"
        >
          <BookOpen className="text-orange-500 w-12 h-12 sm:w-16 sm:h-16 mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Do you want to learn here?</h3>
          <p className="text-gray-700 mb-4 text-sm sm:text-base">
            Learning new things is beneficial at any age, and it can change your life.
          </p>
          <button className="px-4 py-2 border border-gray-700 rounded-lg text-gray-700 hover:bg-orange-500 hover:text-white transition-all">
            Register Now
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default FeatureCard_2;
