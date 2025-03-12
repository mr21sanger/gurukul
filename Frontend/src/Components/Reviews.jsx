import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const Reviews = ({ name, role, location, image, review }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white shadow-lg rounded-2xl p-6 max-w-lg relative"
        >
            <div className="flex items-center gap-4">
                <img src={image || "public/defUser.jpg"} alt={name} className="w-14 h-14 rounded-full border" />
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
                    <p className="text-sm text-gray-600">{role}, {location}</p>
                </div>
            </div>

            <Quote className="text-orange-400 absolute top-6 right-6" size={24} />
            
            <p className="mt-4 text-gray-800">{review}</p>
        </motion.div>
    );
};

export default Reviews;
