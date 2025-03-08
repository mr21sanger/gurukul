import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { useUserReducer } from "../Reducers/UserReducer";
import { useNavigate } from "react-router-dom";

const instructors = [
    {
        name: "Gaurav Raj",
        location: "Greater Noida, Uttar Pradesh, India",
        rate: "₹600.00/hr",
    },
    {
        name: "Ranjana Ghoghal",
        location: "India",
        rate: "₹500.00/hr",
    },
    {
        name: "Amardeep Kaur",
        location: "Faridabad, Haryana, India",
        rate: "₹500.00/hr",
    },
    {
        name: "Mayank Yadav",
        location: "India",
        rate: "₹500.00/hr",
    },
];



const InstructorSection = () => {
    const { user } = useUserReducer();
    const Navigate = useNavigate();

    const handleClick = () => {
        if (user && user?.userId?.role === "Student") {
            Navigate("/parent-dash")
        } else {
            Navigate("/get-started/signup")
        }
    }
    return (
        <section className="py-12 bg-gray-100 min-h-[90vh] flex flex-col items-center justify-center text-black">
            <div className="text-center mb-8">
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-5xl font-bold"
                >
                    Meet Our Expert Instructors
                </motion.h3>
                <p className="mt-2 text-black max-w-2xl mx-auto">
                    Highly qualified professionals carefully selected to provide the best learning experience.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {instructors.map((instructor, index) => (
                    <motion.div
                        key={index}
                        className="bg-orange-400/70 p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-black text-2xl">👤</span>
                        </div>
                        <h4 className="text-lg font-semibold mt-3 flex items-center">
                            {instructor.name} <FaCheckCircle className="text-green-400 ml-1" />
                        </h4>
                        <p className="text-sm text-black">{instructor.location}</p>
                        <p className="text-orange-600 font-semibold mt-2">{instructor.rate}</p>
                    </motion.div>
                ))}
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-18 px-6 py-3 bg-orange-400/70 text-lg text-black font-bold rounded-lg shadow-md hover:bg-orange-600/80 transition"
                onClick={handleClick}
            >
                Get Your Tutor
            </motion.button>
        </section>
    );
};

export default InstructorSection;
