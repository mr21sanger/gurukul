import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserReducer } from "../Reducers/UserReducer";

const HireTutorModal = ({ isOpen, onClose, parentId }) => {
  const { loading, postTutorRequest } = useUserReducer();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    classLevel: "",
    school: "",
    previousMarks: "",
    availableDays: [],
    timePreferred: "",
    fee: "",
    locality: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = { ...formData, parentId }; // Avoid direct mutation

    try {
      const status = await postTutorRequest(updatedFormData);

      if (status) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Error submitting tutor request:", error);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const steps = [
    {
      title: "Basic Information",
      content: (
        <>
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                className="input-field"
                placeholder="e.g. Maths, Science"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Class Level</label>
              <input
                type="text"
                name="classLevel"
                value={formData.classLevel}
                className="input-field"
                placeholder="e.g. 10th CBSE"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">School Name</label>
              <input
                type="text"
                name="school"
                value={formData.school}
                className="input-field"
                placeholder="Enter school name"
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </>
      ),
    },
    {
      title: "More Details",
      content: (
        <>
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Previous Marks (%)</label>
              <input
                type="text"
                name="previousMarks"
                value={formData.previousMarks}
                className="input-field"
                placeholder="e.g. 85%"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Preferred Time</label>
              <input
                type="text"
                name="timePreferred"
                value={formData.timePreferred}
                className="input-field"
                placeholder="e.g. 6 PM - 8 PM"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Locality</label>
              <input
                type="text"
                name="locality"
                value={formData.locality}
                className="input-field"
                placeholder="e.g. NIT 5, Faridabad"
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Availability & Fee",
      content: (
        <>
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Available Days</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <button
                    key={day}
                    className={`px-4 py-2 rounded-md border transition ${formData.availableDays.includes(day) ? "bg-yellow-500 text-white border-yellow-500" : "border-gray-400 text-gray-600"
                      }`}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Expected Fee (₹ per month)</label>
              <input
                type="text"
                name="fee"
                value={formData.fee}
                className="input-field"
                placeholder="e.g. 6000"
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-8 rounded-xl w-full max-w-[600px] shadow-xl relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close Button */}
        {!isSuccess && (
          <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg" onClick={onClose}>
            ✖
          </button>
        )}

        {isSuccess ? (
          // Success Message UI
          <div className="flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-green-500 text-6xl mb-4"
            >
              ✅
            </motion.div>
            <h2 className="text-2xl font-semibold text-black">Success!</h2>
            <p className="text-gray-600 mt-2">Your tutor request has been submitted successfully.</p>
            <button className="btn-primary mt-6" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-black">{steps[step - 1].title}</h2>
              <p className="text-sm text-gray-500">Step {step} of {steps.length}</p>
            </div>

            {/* Form Content */}
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
                {steps[step - 1].content}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {step > 1 && <button className="btn-secondary" onClick={prevStep}>Back</button>}
              {step < steps.length ? <button className="btn-primary" onClick={nextStep}>Next</button> : <button className="btn-primary" onClick={handleSubmit}>Submit ✅</button>}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default HireTutorModal;
