import { motion } from "framer-motion";
import { UserPlus, MessageCircle, PhoneCall, CalendarCheck } from "lucide-react";

const steps = [
    {
        id: 1,
        title: "Create Your Profile",
        description: "Sign up as a student and create a profile mentioning your learning needs.",
        icon: <UserPlus size={36} className="text-orange-700" />,
    },
    {
        id: 2,
        title: "Get Relevant Matches",
        description: "Receive tutor recommendations that match your requirements via email & SMS.",
        icon: <MessageCircle size={36} className="text-orange-700" />,
    },
    {
        id: 3,
        title: "Connect with Tutors",
        description: "Contact tutors directly via calls, SMS, or WhatsApp to start learning.",
        icon: <PhoneCall size={36} className="text-orange-700" />,
    },
    {
        id: 4,
        title: "Book a Demo Class",
        description: "Schedule a free demo session with a tutor to understand their teaching style.",
        icon: <CalendarCheck size={36} className="text-orange-700" />,
    },

];

const ForStudents = ({onClick}) => {
    return (
        <section className="py-20 bg-orange-50">
            <div className="max-w-6xl mx-auto text-center px-6">
                {/* Section Title */}
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-extrabold text-gray-900"
                >
                    How It Works for Students
                </motion.h2>
                <p className="mt-3 max-w-xl mx-auto text-orange-700 text-lg">
                    A simple and seamless process to connect students with expert tutors.
                </p>

                {/* Steps Container */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, staggerChildren: 0.3 }}
                    className="relative flex flex-col md:flex-row justify-between items-center mt-16 gap-10"
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            whileHover={{ scale: 1.05 }}
                            className="relative bg-white border border-orange-300 shadow-xl rounded-2xl p-6 flex flex-col h-auto items-center text-center w-full md:w-1/4"
                        >
                            {/* Dotted Arrow Connector (Only for Desktop) */}
                            {index < steps.length - 1 && (
                                <div className="absolute hidden md:block top-1/2 right-[-50px] w-12 border-t-2 border-dotted border-orange-500 "></div>
                            )}

                            {/* Icon */}
                            <div className="mb-5 p-4 bg-orange-100 rounded-full shadow-md">{step.icon}</div>

                            {/* Step Title & Description */}
                            <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                            <p className="mt-2 text-gray-700">{step.description}</p>

                            {/* Step Number */}
                            <span className="absolute top-3 right-3 text-orange-500 text-4xl font-bold opacity-50">
                                {step.id}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Call-to-Action Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-12 px-8 py-3 font-bold text-lg rounded-full bg-orange-700 text-white shadow-md hover:bg-orange-600 transition"
                    onClick={onClick}
                >
                    Go To Step 1
                </motion.button>
            </div>
        </section>
    );
};

export default ForStudents;
