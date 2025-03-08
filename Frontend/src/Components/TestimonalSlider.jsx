import React, { useState } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Reviews from "../Components/Reviews";

const TestimonalSlider = ({ testimonials }) => {
    if (!testimonials || testimonials.length === 0) {
        return <div>No testimonials available.</div>;
    }

    const [activeSlide, setActiveSlide] = useState(0);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "0px",
        autoplay: true,
        autoplaySpeed: 3000,
        arrows:false,
        beforeChange: (current, next) => setActiveSlide(next + 1), // Track center slide
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    centerMode: false,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerMode: true,
                },
            },
        ],
    };

    return (
        <div className="max-w-7xl min-h-[60vh] py-10 mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold text-black mb-6">
               See what they say
            </h2>
            <Slider {...settings}>
                {testimonials.map((testimonial, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`p-6 md:p-4 rounded-xl mx-4 transition-all duration-500 ${
                            index === activeSlide ? "opacity-100 scale-115" : "opacity-0 scale-95"
                        }`}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`Testimonial ${index + 1}`}
                    >
                        <Reviews {...testimonial} />
                    </motion.div>
                ))}
            </Slider>
        </div>
    );
};

export default TestimonalSlider;
