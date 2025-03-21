import { motion } from "framer-motion";
import { BookOpen, Users, Star, Video, ShieldCheck, MessageCircle } from 'lucide-react';
import FeatureCard from "../Components/FeatureCard";
import InstructorSection from "../Components/InstructorSection";
import HowToStart from "../Components/HowToStart";
import FeatureCard_2 from "../Components/FeatureCard_2";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TestimonalSlider from "../Components/TestimonalSlider";
import { useState } from "react";
import BecomeTutorModal from "../Components/BecomeTutorModal"
import HireTutorModal from "../Components/HireTutorModal";
import { useNavigate } from "react-router-dom";
import { useUserReducer } from "../Reducers/UserReducer";

const HomePage = () => {
    const features = [
        { id: 1, icon: BookOpen, title: "Offering all types of courses", description: "We provide a wide range of courses, from academic tutoring to specialized skill development, tailored to fit your needs." },
        {
            id: 2, icon: Video, title: "Online consultation for all",
            description: "Get expert guidance through personalized online consultations across various subjects and skills."
        },
        { id: 3, icon: Star, title: "A great investment for future", description: "We offer personalized education, helping you build a strong foundation for long-term success." },
        { id: 4, icon: ShieldCheck, title: "Best results guaranteed", description: "We guarantee exceptional academic performance through personalized tutoring and expert guidance tailored to each student’s needs." },
        { id: 5, icon: Users, title: "Easy to connect with anyone", description: "We simplify connections between students, parents, and tutors for a seamless educational experience." },
        { id: 6, icon: MessageCircle, title: "All certified tutors for you", description: "We connect you with thoroughly verified tutors, ensuring high-quality education tailored to your needs." }
    ];

    const testimonials = [
        {
            name: "Sudha Jain", role: "Student", location: "South Delhi", image: "",
            review: "Perfect Tutor is the best platform for getting home tutors. The teachers are highly experienced and well-qualified."
        },

        {
            name: "Vaibhav Gupta", role: "Student (X)", location: "Mumbai", image: "",
            review: "The teaching quality and content are excellent. I find it difficult to understand Maths, but my tutor makes it easy!"
        },

        {
            name: "Anubhav Singh", role: "Parent", location: "Delhi", image: "",
            review: "Finding a tutor was so easy and the quality of teaching is great. My child has improved significantly!"
        }
    ];

    const [modalOpen, setModalOpen] = useState(false)
    const [hireModal, setHireModal] = useState(false)

    const navigate = useNavigate()
    const { user } = useUserReducer()

    const handleHeroButtonClick = (type) => {
        if (user && user.userId.role === type && type === "Student") {
            navigate("/parent-dash")
        }
        else if (user && user.userId.role === type && type === "Instructor") {
            navigate("/tutor-dash")
        } else {
            navigate("/get-started/signup")
        }
    }

    return (
        <>
            <div className="relative top-26 md:top-24 w-full flex items-center justify-center text-white bg-gradient-to-b from-orange-200 to-orange-50 overflow-hidden px-6 z-10 mb-28 md:mb-16">
                <div className="max-w-7xl w-full flex flex-col md:flex-row items-center gap-6 px-4 sm:px-8 lg:px-12">
                    {/* Left Side - Text Content */}
                    <div className="md:w-1/2 text-center font-semibold md:text-left">
                        <motion.h1
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-4xl mt-5 sm:text-5xl md:text-6xl font-extrabold mb-4 md:leading-16 leading-snug md:text-left text-center text-gray-900"
                        >
                            Find the
                            <span className="bg-gradient-to-r from-orange-500 to-orange-700 text-transparent bg-clip-text font-bold">
                                {" "}  Best Tutors {" "}
                            </span>
                            for Your Child
                        </motion.h1>


                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-xl sm:text-xl text-gray-900 mb-6"
                        >
                            Personalized home tutoring services tailored to your child's needs.
                        </motion.p>
                        {/* Buttons */}
                        <div className="flex flex-col md:flex-row justify-center md:justify-start gap-2 md:gap-4 sm:gap-6 mt-3 z-50">
                            <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.92 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => handleHeroButtonClick("Student")}
                                className="bg-orange-600 text-white px-6 sm:px-7 py-3.5 rounded-xl font-semibold text-lg sm:text-xl shadow-md hover:bg-orange-700 hover:shadow-lg focus:ring-4 focus:ring-orange-300 transition-all w-full md:w-auto"
                            >
                                Hire a Tutor
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.92 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => handleHeroButtonClick("Instructor")}
                                className="border-2 border-orange-600 text-orange-600 px-6 sm:px-7 py-3.5 rounded-xl font-semibold text-lg sm:text-xl bg-orange-50 hover:bg-orange-600 hover:text-white hover:shadow-lg focus:ring-4 focus:ring-orange-300 transition-all w-full md:w-auto"
                            >
                                Get Hired as a Tutor
                            </motion.button>
                        </div>

                    </div>

                    <div className="md:w-1/2 flex justify-center">
                        <img
                            src="/hero.webp"
                            alt="Online Tutor"
                            loading="lazy"
                            className="w-[90vw] mb-14 md:mb-10 sm:w-[75vw] md:w-[50vw] lg:w-[40vw] max-w-md"
                        />
                    </div>
                </div>

            </div>
            <div className="bg-orange-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="hidden md:block mt-16" viewBox="0 0 1440 320"><path fill="#FECF96" fill-opacity="1" d="M0,64L21.8,69.3C43.6,75,87,85,131,80C174.5,75,218,53,262,58.7C305.5,64,349,96,393,101.3C436.4,107,480,85,524,96C567.3,107,611,149,655,170.7C698.2,192,742,192,785,165.3C829.1,139,873,85,916,80C960,75,1004,117,1047,144C1090.9,171,1135,181,1178,181.3C1221.8,181,1265,171,1309,154.7C1352.7,139,1396,117,1418,106.7L1440,96L1440,320L1418.2,320C1396.4,320,1353,320,1309,320C1265.5,320,1222,320,1178,320C1134.5,320,1091,320,1047,320C1003.6,320,960,320,916,320C872.7,320,829,320,785,320C741.8,320,698,320,655,320C610.9,320,567,320,524,320C480,320,436,320,393,320C349.1,320,305,320,262,320C218.2,320,175,320,131,320C87.3,320,44,320,22,320L0,320Z"></path></svg>
            </div>

            {/* Detail Section */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative z-10 px-6 mt- md:px-12 lg:px-20 w-full bg-white mx-auto flex flex-col md:flex-row-reverse items-center justify-between gap-12 md:gap-24 py-16 min-h-[85vh]"
            >
                {/* Text Content */}
                <div className="w-full md:w-1/2 mt-12 text-center md:text-left">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                        Personalized Learning Experience
                    </h2>
                    <p className="text-lg md:text-xl mb-6 text-gray-800">
                        Our tutoring services ensure a personalized learning approach that caters to each student's unique needs.
                    </p>
                </div>

                {/* Image */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <img
                        src="/6-removebg-preview.webp"
                        alt="Tutoring session"
                        loading = "lazy"
                        className="w-full max-w-md md:max-w-lg lg:max-w-xl rounded-lg"
                    />
                </div>
            </motion.div>

            {/* Why Choose Us */}
            <div className="w-full py-16 flex justify-center items-center bg-gradient-to-b from-orange-200 to-orange-100 text-white px-6">
                <div className="max-w-5xl text-center">
                    <h2 className="md:text-5xl text-3xl font-extrabold mb-8 text-orange-500">Why Choose Us?</h2>
                    <p className="text-xl text-gray-900 mb-12">Our platform connects students with expert tutors, ensuring personalized learning experiences that drive results.</p>
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 justify-center">
                        {features.map((feature) => (
                            <FeatureCard key={feature.id} {...feature} />
                        ))}
                    </div>
                </div>
            </div>

            <FeatureCard_2 />
            <HowToStart />
            <InstructorSection />

            <TestimonalSlider
                testimonials={testimonials} />

            <BecomeTutorModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
            <HireTutorModal isOpen={hireModal} onClose={() => setHireModal(false)} />
        </>
    );
};

export default HomePage;
