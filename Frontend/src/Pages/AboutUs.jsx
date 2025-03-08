import { motion } from "framer-motion";
import { Users, BookOpen, Globe, Award, Star, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserReducer } from "../Reducers/UserReducer";

const AboutUs = () => {

    const ourAchievments = [
        {
            value: "80+",
            label: "Expert Tutors",
            desc: "A growing community of experienced educators dedicated to helping students excel.",
            icon: "👨‍🏫"
        },
        {
            value: "200+",
            label: "Total Students",
            desc: "Thousands of students trust us for academic and skill-based learning.",
            icon: "🎓"
        },
        {
            value: "280+",
            label: "Enquiries Served",
            desc: "Successfully connecting learners with the right tutors across various subjects.",
            icon: "📩"
        },
        {
            value: "95%",
            label: "Success Rate",
            desc: "Students have seen significant improvement in their academics and skills.",
            icon: "⭐"
        },
        {
            value: "1+",
            label: "Years of Excellence",
            desc: "A decade of providing top-notch tutoring services to learners worldwide.",
            icon: "🏆"
        },
        {
            value: "550+",
            label: "Positive Reviews",
            desc: "Students and parents love our platform for its effectiveness and ease of use.",
            icon: "💬"
        }
    ]

    const Navigate = useNavigate()
    const { user } = useUserReducer()

    const handleClick = () => {
        if (user && user?.userId?.role === "Student") {
          Navigate("/parent-dash");
        } else {
          Navigate("/get-started/signup");
        }
      };

    return (
        <section className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-orange-200 to-orange-100 mt-14 py-10 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-5xl font-extrabold text-black"
                >
                    About Gurukul
                </motion.h1>
                <p className="mt-4 text-gray-700 text-lg max-w-3xl mx-auto">
                    Connecting students with expert tutors for **personalized** and **engaging learning experiences.**
                    Whether you need help with academics or skill development, Gurukul is your go-to platform.
                </p>

                <div className="py-16">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: <Users size={50} className="text-orange-500" />, title: "Qualified Tutors", desc: "Highly experienced and verified educators for every subject." },
                            { icon: <BookOpen size={50} className="text-orange-500" />, title: "Personalized Learning", desc: "Tailored courses to match each student's unique needs." },
                            { icon: <Globe size={50} className="text-orange-500" />, title: "Flexible Learning", desc: "Choose between online or in-home tutoring at your convenience." },
                            { icon: <ShieldCheck size={50} className="text-orange-500" />, title: "Safe & Secure", desc: "Background-checked tutors ensuring a safe learning experience." },
                            { icon: <Star size={50} className="text-orange-500" />, title: "Affordable Rates", desc: "Quality education at reasonable prices." },
                            { icon: <Award size={50} className="text-orange-500" />, title: "Proven Success", desc: "Thousands of students have improved their grades and skills with us." }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
                            >
                                {item.icon}
                                <h3 className="mt-4 text-2xl font-semibold text-gray-800">{item.title}</h3>
                                <p className="text-gray-600 mt-2">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Why Choose Us */}


            {/* How It Works */}
            <div className="bg-gray-100/70 py-16 text-center">
                <h2 className="text-4xl font-bold text-orange-500">How Gurukul Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 max-w-7xl mx-auto px-6">
                    {[
                        { title: "Find a Tutor", desc: "Browse profiles of expert tutors and choose the best fit." },
                        { title: "Schedule Sessions", desc: "Pick a time that suits you and book a session easily." },
                        { title: "Start Learning", desc: "Enjoy engaging and effective learning experiences." }
                    ].map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <h3 className="text-2xl font-semibold text-gray-800">{step.title}</h3>
                            <p className="text-gray-600 mt-2">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Achievements Section */}
            <div className="bg-orange-100 py-16 text-center">
                <h2 className="text-4xl font-bold text-black">Our Best Achievements</h2>
                <p className="mt-4 text-gray-700 text-lg max-w-4xl mx-auto px-4">
                    We take pride in our accomplishments, reflecting the trust and success of our students and tutors.
                    Here are some key milestones that highlight our journey so far.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-10 max-w-7xl mx-auto px-6">
                    {ourAchievments.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
                        >
                            <div className="text-5xl">{item.icon}</div>
                            <h3 className="text-4xl font-bold text-orange-600 mt-4">{item.value}</h3>
                            <p className="text-xl font-semibold text-gray-800">{item.label}</p>
                            <p className="text-gray-600 mt-2">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="text-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 text-lg font-bold text-white bg-orange-500 rounded-full shadow-md hover:bg-orange-600 transition-all"
                        onClick={handleClick}
                    >
                        Join Gurukul Today
                    </motion.button>
                </div>
            </div>



        </section>
    );
};

export default AboutUs;
