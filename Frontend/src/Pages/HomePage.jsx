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
            <div className="relative top-26 md:top-26 w-full min-h-[85vh] mb-18 flex items-center justify-center text-white bg-gradient-to-b from-orange-200 to-orange-50 overflow-hidden px-6 md:pb-60 z-10 md:mb-44">
                <div className="max-w-7xl w-full flex flex-col md:flex-row items-center gap-6 px-4 sm:px-8 lg:px-12">
                    {/* Left Side - Text Content */}
                    <div className="md:w-1/2 text-center md:text-left">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-4xl sm:text-5xl md:text-6xl text-black font-bold mb-4 leading-tight"
                        >
                            Find the Best Tutors for Your Child
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-lg sm:text-xl text-gray-900 mb-6"
                        >
                            Personalized home tutoring services tailored to your child's needs.
                        </motion.p>

                        {/* Buttons */}
                        <div className="flex justify-center md:justify-start gap-4 sm:gap-6 mt-3 z-50">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => handleHeroButtonClick("Student")}
                                className="bg-orange-500 text-white px-5 sm:px-6 py-3 rounded-lg font-semibold text-base sm:text-lg shadow-md hover:bg-orange-600 transition-all"
                            >
                                Hire a Tutor
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => handleHeroButtonClick("Instructor")}
                                className="border-2 border-orange-500 text-orange-500 px-5 font-bold sm:px-6 py-3 rounded-lg text-base sm:text-lg hover:bg-orange-500 hover:text-white transition-all"
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
                            className="w-[90vw] sm:w-[75vw] md:w-[50vw] lg:w-[40vw] max-w-md"
                        />
                    </div>
                </div>


            </div>

            <motion.div

                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-95px] left-0 w-full z-10 hidden sm:block"
            >

                <svg className="w-full h-full  " viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill="#ffd69f"
                        fillOpacity="1"
                        d="M0,160L60,176C120,192,240,224,360,224C480,224,600,192,720,181.3C840,171,960,181,1080,176C1200,171,1320,149,1380,138.7L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                    />
                </svg>
            </motion.div>



            {/* Detail Section */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative z-10 bg-orange-50 px-6 max-w-7xl  mx-auto flex flex-col md:flex-row-reverse items-center justify-between gap-12 md:gap-24 py-16 min-h-[85vh]"
            >
                {/* Text Content */}
                <div className="md:w-1/2 mt-12 text-center md:text-left">
                    <h2 className="text-5xl md:text-5xl font-bold mb-6 text-gray-900">
                        Personalized Learning Experience
                    </h2>
                    <p className="text-lg md:text-xl mb-6 text-gray-800">
                        Our tutoring services ensure a personalized learning approach that caters to each student's unique needs.
                    </p>
                </div>

                {/* Image */}
                <div className="md:w-1/2 flex justify-center">
                    <img
                        src="/6-removebg-preview.webp"
                        alt="Tutoring session"
                        loading="lazy"
                        className="w-full max-w-md md:max-w-lg rounded-lg"
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
