import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserReducer } from "../Reducers/UserReducer"

const AddSubjectBlock = ({ subjects, setSubjects, userId }) => {
    const [addingSubject, setAddingSubject] = useState(false);
    const [newSubject, setNewSubject] = useState("");
    const { addOrEdit, removeItem } = useUserReducer()

    // Capitalize first letter of each word
    const capitalizeWords = (text) => {
        return text
            .trim()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const handleAddSubject = () => {

        if (newSubject.trim() !== "") {
            const formattedSubject = capitalizeWords(newSubject);
            setSubjects([...subjects, formattedSubject]);
            setNewSubject("");
            setAddingSubject(false);
            const data = {
                userId,
                type: "subject",
                value: formattedSubject
            }
            addOrEdit(data)
        }

    };

    const handleRemoveSubject = async (index) => {
        const subjectToRemove = subjects[index];

        if (!subjectToRemove) return; 

        const data = {
            userId,
            type: "subject",
            value: subjectToRemove
        };

        try {
            await removeItem(data); 
            setSubjects((prevSubjects) => prevSubjects.filter((_, i) => i !== index)); // ✅ Update state correctly
        } catch (error) {
            console.error("Error removing subject:", error);
        }
    };

    return (
        <div className="bg-orange-50 p-5 rounded-lg border mb-4 shadow">
            <h3 className="font-medium text-lg text-gray-700">📚 Subjects & Expertise</h3>

            {/* No subjects message */}
            {subjects.length === 0 && (
                <motion.p
                    className="text-gray-500 text-sm mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    ⚠️ No subjects available. Add them now!
                </motion.p>
            )}

            {/* Subject List */}
            {subjects.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    <AnimatePresence>
                        {subjects.map((subject, index) => (
                            <motion.div
                                key={index}
                                className="flex items-center gap-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md hover:bg-orange-600 transition cursor-pointer"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {subject}
                                <button
                                    onClick={() => handleRemoveSubject(index)}
                                    className="text-white hover:text-gray-200 transition"
                                >
                                    ✖
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Add Subject Input */}
            {addingSubject ? (
                <motion.div
                    className="flex gap-2 mt-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <input
                        type="text"
                        className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-600"
                        placeholder="Enter subject..."
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                    />
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        onClick={handleAddSubject}
                    >
                        ✅
                    </button>
                    <button
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        onClick={() => setAddingSubject(false)}
                    >
                        ❌
                    </button>
                </motion.div>
            ) : (
                <button
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition mt-3 w-full flex justify-center items-center gap-2"
                    onClick={() => setAddingSubject(true)}
                >
                    ➕ Add Subjects
                </button>
            )}
        </div>
    );
};

export default AddSubjectBlock;
