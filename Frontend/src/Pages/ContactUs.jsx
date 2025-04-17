import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How can I find a tutor on Gurukul?",
    answer:
      "To find a tutor, sign up as a parent, post your tutoring requirements, and we will assign a verified tutor based on your needs.",
  },
  {
    question: "Is there a free trial session available?",
    answer:
      "Tutors are assigned based on your request. If a tutor offers a free trial, they will inform you after assignment.",
  },
  {
    question: "How do I post a tutoring requirement?",
    answer:
      "After signing up as a parent, go to your dashboard and click 'Post Your Requirement' to submit your tutoring needs.",
  },
  {
    question: "What payment options are available?",
    answer:
      "Currently, payments are handled externally. Once a tutor is assigned, you can coordinate the payment directly with them.",
  },
];

const contacts = [
  { icon: <Mail size={40} />, title: "Email", value: "gurukulorganisation@gmail.com" },
  { icon: <Phone size={40} />, title: "Phone", value: "+91 97111 76093" },
  { icon: <MapPin size={40} />, title: "Location", value: "Faridabad, India" },
];

const ContactUs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="min-h-screen bg-gray-50 py-20 px-4">
      {/* Contact Header */}
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-black mt-4"
        >
          Contact Us
        </motion.h1>
        <p className="text-gray-700 mt-4 text-lg">
          Have questions? We’re here to help. Reach out to us anytime.
        </p>
      </div>

      {/* Contact Info */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {contacts.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
          >
            <span className="p-3 bg-orange-100 text-orange-600 rounded-full">{item.icon}</span>
            <h3 className="text-xl font-semibold mt-3">{item.title}</h3>
            <p className="text-gray-600 mt-1">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-5xl mx-auto mt-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-600 mb-8">
          FAQs
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
              className="bg-white shadow-md p-5 rounded-lg cursor-pointer"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="flex justify-between items-center w-full text-lg font-semibold text-gray-900"
              >
                {faq.question}
                <ChevronDown
                  size={24}
                  className={`transition-transform duration-300 ${activeIndex === index ? "rotate-180" : ""}`}
                />
              </button>
              {activeIndex === index && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 text-gray-700"
                >
                  {faq.answer}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
