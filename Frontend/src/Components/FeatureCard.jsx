import React from 'react';
import { motion } from "framer-motion";

const FeatureCard = ({ icon: Icon, title, description, stepNumber }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center border-t-4 border-orange-500 w-[300px]"
        >
            {/* Icon */}
            <Icon size={50} className="text-orange-500 mb-4" />

            {/* Step Number */}
            <p className="text-orange-500 font-semibold uppercase tracking-wider text-sm">STEP {stepNumber}</p>

            {/* Title */}
            <h3 className="text-xl font-bold text-black mt-1 mb-2">{title}</h3>

            {/* Description */}
            <p className="text-gray-600 text-sm">{description}</p>
        </motion.div>
    );
};

export default FeatureCard;
