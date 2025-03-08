import { motion } from "framer-motion";
import { BookOpen, Beaker, MonitorSmartphone, Globe, MessageSquare, Microscope, Calculator, Atom } from "lucide-react";

const subjects = [
  { id: 1, name: "Mathematics", icon: <BookOpen size={36} />, color: "bg-gradient-to-r from-purple-200 to-purple-300" },
  { id: 2, name: "Chemistry", icon: <Beaker size={36} />, color: "bg-gradient-to-r from-blue-200 to-blue-300" },
  { id: 3, name: "Computer Science", icon: <MonitorSmartphone size={36} />, color: "bg-gradient-to-r from-orange-200 to-orange-300" },
  { id: 4, name: "Geography", icon: <Globe size={36} />, color: "bg-gradient-to-r from-pink-200 to-pink-300" },
  { id: 5, name: "Languages", icon: <MessageSquare size={36} />, color: "bg-gradient-to-r from-yellow-200 to-yellow-300" },
  { id: 6, name: "Biology", icon: <Microscope size={36} />, color: "bg-gradient-to-r from-gray-200 to-gray-300" },
  { id: 7, name: "Accounting", icon: <Calculator size={36} />, color: "bg-gradient-to-r from-red-200 to-red-300" },
  { id: 8, name: "Physics", icon: <Atom size={36} />, color: "bg-gradient-to-r from-teal-200 to-teal-300" },
];

const Subjects = ({ onClick }) => {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl font-extrabold text-gray-900"
        >
          Explore Subjects & Find Expert Tutors
        </motion.h2>
        <p className="mt-3 text-gray-600 text-lg">
          Choose a subject and get connected with a tutor in minutes!
        </p>

        {/* Subjects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mt-10"
        >
          {subjects.map((subject) => (
            <motion.div
              key={subject.id}
              whileHover={{ scale: 1.05 }}
              animate={{ rotate: [0, 1, -1, 0] }} // Slow rotate effect
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} // Smooth looping animation
              className={`p-6 rounded-lg shadow-md flex flex-col items-center text-center ${subject.color}`}
            >
              <div className="p-3 bg-white rounded-full">{subject.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-gray-800">{subject.name}</h3>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-8 py-3 font-bold text-lg rounded-full bg-orange-600 text-white shadow-lg hover:bg-orange-500 transition"
          onClick={onClick}
        >
          Find a Tutor Now
        </motion.button>
      </div>
    </section>
  );
};

export default Subjects;
