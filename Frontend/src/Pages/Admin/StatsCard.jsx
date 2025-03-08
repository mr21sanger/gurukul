import React from "react";
import { motion } from "framer-motion";

const StatsCard = ({ title, value }) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="bg-white shadow-md p-6 rounded-lg text-center">
      <h2 className="text-lg font-semibold">{title.replace(/([A-Z])/g, " $1").trim()}</h2>
      <p className="text-2xl font-bold text-orange-600">{value}</p>
    </motion.div>
  );
};

export default StatsCard;
