import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {useUserReducer} from "../Reducers/UserReducer"

const WeekendScheduleBlock = ({ schedule, setSchedule, userId }) => {
    const [addingSlot, setAddingSlot] = useState(false);
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedTime, setSelectedTime] = useState("Anytime"); // Default to "Anytime"

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const timePreferences = ["Morning", "Afternoon", "Evening", "Anytime"];

    const { addOrEdit } = useUserReducer()

    const handleAddSlot = () => {
        if (selectedDay) {
            const newSlot = `${selectedDay} - ${selectedTime}`;
            setSchedule([...schedule, newSlot]);
            const data = {
                userId,
                type: "schedule",
                timePreference: selectedTime,
                value: selectedDay
            }
            addOrEdit(data)

            setSelectedDay("");
            setSelectedTime("Anytime"); // Reset to default
            setAddingSlot(false);
        }
    };

    const handleRemoveSlot = (index) => {
        const updatedSchedule = schedule.filter((_, i) => i !== index);
        setSchedule(updatedSchedule);
    };

    return (
        <div className="bg-orange-50 p-5 rounded-lg border mb-4 shadow">
            <h3 className="font-medium text-lg text-gray-700">📅 Weekend Schedule</h3>

            {/* No schedule message */}
            {schedule.length === 0 && (
                <motion.p
                    className="text-gray-500 text-sm mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    ⚠️ No schedule available. Add your preferred days & time!
                </motion.p>
            )}

            {/* Schedule List */}
            {schedule.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    <AnimatePresence>
                        {schedule.map((slot, index) => (
                            <motion.div
                                key={index}
                                className="flex items-center gap-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md hover:bg-orange-600 transition cursor-pointer"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {slot?.day +  " - " +  slot?.time}
                                <button
                                    onClick={() => handleRemoveSlot(index)}
                                    className="text-white hover:text-gray-200 transition"
                                >
                                    ✖
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Add Schedule Input */}
            {addingSlot ? (
                <motion.div
                    className="flex flex-col gap-2 mt-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <select
                        className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                    >
                        <option value="">Select a Day</option>
                        {daysOfWeek.map((day) => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>

                    <select
                        className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                    >
                        {timePreferences.map((time) => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>

                    <div className="flex gap-2">
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full"
                            onClick={handleAddSlot}
                        >
                            ✅ Add
                        </button>
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition w-full"
                            onClick={() => setAddingSlot(false)}
                        >
                            ❌ Cancel
                        </button>
                    </div>
                </motion.div>
            ) : (
                <button
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition mt-3 w-full flex justify-center items-center gap-2"
                    onClick={() => setAddingSlot(true)}
                >
                    ➕ Add Schedule
                </button>
            )}
        </div>
    );
};

export default WeekendScheduleBlock;
