import React, { useState } from "react";
import { useUserReducer } from "../Reducers/UserReducer";

const AddExperience = ({ experience, setExperience, userId }) => {
    const [newExperience, setNewExperience] = useState({ years: "", organization: "" });
    const [addingExperience, setAddingExperience] = useState(false);

    const { addOrEdit, removeItem } = useUserReducer();

    const handleAddExperience = () => {
        if (newExperience.years && newExperience.organization) {
            setExperience([...experience, newExperience]);
            setNewExperience({ years: "", organization: "" });
            setAddingExperience(false); // Reset fields

            const data = {
                userId,
                type: "experience",
                years: newExperience.years,
                organization: newExperience.organization
            }

            addOrEdit(data)
        }
    };

    

    // ✅ Function to Remove Experience
    const handleRemoveExperience = async (index) => {
        const expToRemove = experience[index]; // ✅ Get correct experience
        console.log("hii")
        if (!expToRemove) return;

        const data = {
            userId,
            type: "experience",
            years: expToRemove.years,
            organization: expToRemove.organization
        };

        try {
            await removeItem(data); // ✅ Remove from backend
            setExperience((prevExperience) => prevExperience.filter((_, i) => i !== index)); // ✅ Update state
        } catch (error) {
            console.error("Error removing experience:", error);
        }
    };


    return (
        <div className="bg-orange-50 p-5 rounded-lg border my-3 shadow-md">
            <h3 className="font-medium text-lg text-gray-700">📜 Experience</h3>

            {experience.length > 0 ? (
                experience.map((exp, index) => (
                    <div key={index} className="bg-white relative p-4 rounded-lg border mt-2 shadow-sm hover:shadow-md transition flex flex-col">
                        <p className="text-gray-800 font-semibold">💼 {exp.years} years</p>
                        <p className="text-gray-600">🏢 {exp.organization}</p>
                        {/* ✅ Remove Button */}
                        <button
                            onClick={() => handleRemoveExperience(index)}
                            className="absolute top-2 right-2 text-white px-2 py-1 rounded-full text-sm hover:scale-105 transition"
                        >
                            ❌
                        </button>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-center mt-2">No exps or experience added yet.</p>
            )}

            {addingExperience ? (
                <div className="mt-4 space-y-3">
                    <input
                        type="text"
                        placeholder="Years of Experience"
                        value={newExperience.years}
                        onChange={(e) => setNewExperience({ ...newExperience, years: e.target.value })}
                        className="w-full p-2 border rounded-md"
                    />
                    <input
                        type="text"
                        placeholder="Organization"
                        value={newExperience.organization}
                        onChange={(e) => setNewExperience({ ...newExperience, organization: e.target.value })}
                        className="w-full p-2 border rounded-md"
                    />

                    {/* Buttons - Save & Cancel */}
                    <div className="flex gap-4 mt-2">
                        <button
                            onClick={handleAddExperience}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg w-full hover:bg-green-700 transition"
                        >
                            ✅ Save Experience
                        </button>
                        <button
                            onClick={() => setAddingExperience(false)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600 transition"
                        >
                            ❌ Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setAddingExperience(true)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition mt-4 w-full"
                >
                    ➕ Add Experience
                </button>
            )}
        </div>
    );
};

export default AddExperience;
