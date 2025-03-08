import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, ShieldCheck, Rocket, UserPlus, BadgeCheck, PlayCircle } from 'lucide-react';

const StepCard = ({ icon: Icon, step, title, description, color }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05, rotate:1 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            
            className={"bg-white p-6 rounded-lg shadow-xl flex flex-col items-center text-center border-t-4 " + color}
        >
            <Icon size={50} className={color + " mb-4"} />
            <span className={"text-sm font-bold " + color}>{step}</span>
            <h3 className="text-xl font-semibold text-black mb-2">{title}</h3>
            <p className="text-sm text-black">{description}</p>
        </motion.div>
    );
};

const HowToStart = () => {
    const studentSteps = [
        { icon: ClipboardCheck, step: "STEP 01", title: "Post a Tuition Job", description: "Provide details like subject, grade, location, and schedule to post a tuition job.", color: "text-orange-500 border-orange-500" },
        { icon: ShieldCheck, step: "STEP 02", title: "Hire Your Best Match", description: "Review tutor profiles, qualifications, and reviews to find your perfect match.", color: "text-blue-500 border-blue-500" },
        { icon: Rocket, step: "STEP 03", title: "Get it Done on Time", description: "Once hired, enjoy consistent, timely sessions with your tutor for assured success.", color: "text-green-500 border-green-500" }
    ];

    const teacherSteps = [
        { icon: UserPlus, step: "STEP 01", title: "Apply as a Tutor", description: "Register as a tutor by providing necessary details about your expertise.", color: "text-orange-500 border-orange-500" },
        { icon: BadgeCheck, step: "STEP 02", title: "Get Verified", description: "Complete the verification process to ensure credibility and security.", color: "text-yellow-500 border-yellow-500" },
        { icon: PlayCircle, step: "STEP 03", title: "Start Your Journey", description: "Begin teaching and helping students achieve academic success.", color: "text-teal-500 border-teal-500" }
    ];

    return (
        <div className="px-2 min-h-screen py-20 bg-orange-200"
        >
            <h2 className="md:text-5xl font-bold text-3xl md:font-extrabold text-center text-orange-500 mb-6">How to Get Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl  mx-auto">
                {studentSteps.map((step, index) => (
                    <StepCard key={index} {...step} />
                ))}
            </div>
            <h2 className="text-4xl font-bold text-center text-orange-500 mt-12 mb-6">How to Start as a Tutor</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {teacherSteps.map((step, index) => (
                    <StepCard key={index} {...step} />
                ))}
            </div>
        </div>
    );
};

export default HowToStart;
