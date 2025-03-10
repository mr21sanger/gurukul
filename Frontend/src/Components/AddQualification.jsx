import { useState } from "react";
import { useUserReducer } from "../Reducers/UserReducer";

const AddQualificationBlock = ({ qualifications, setQualifications, userId }) => {
    const [addingQualification, setAddingQualification] = useState(false);
    const [newQualification, setNewQualification] = useState({
        degree: "",
        institution: "",
        fromYear: "",
        toYear: "",
        grade: ""
    });
    const { addOrEdit, removeItem } = useUserReducer();

    const handleAddQualification = () => {
        if (newQualification) {
            setQualifications([...qualifications, newQualification]);

            const data = {
                type: "qualification",
                qualification: newQualification,
                userId
            }
            addOrEdit(data)

            //Reset the feilds
            setNewQualification({ degree: "", institution: "", fromYear: "", toYear: "", grade: "" });
            setAddingQualification(false);

        }
    };

    const handleRemoveQualification = async (index) => {
        const data = {
            userId,
            type: "qualification",
            qualification: qualifications[index]
        };

        await removeItem(data);
        const updatedQualifications = qualifications.filter((_, i) => i !== index);
        setQualifications(updatedQualifications);
    };

    return (
        <div className="bg-orange-50 p-5 rounded-lg border my-3 shadow-md">
            <h3 className="font-medium text-lg text-gray-700">📜 Qualifications</h3>

            {qualifications.length > 0 ? (
                qualifications.map((qualification, index) => (
                    <div key={index} className="bg-white p-4 relative rounded-lg border mt-2 shadow-sm hover:shadow-md transition flex flex-col">
                        <p className="text-gray-800 font-semibold">🎓 {qualification.degree}</p>
                        <p className="text-gray-600">🏫 {qualification.institution}</p>
                        <p className="text-gray-600">📆 {qualification.fromYear} - {qualification.toYear}</p>
                        <p className="text-gray-600">📊 Grade: {qualification.grade}</p>
                        <button
                            onClick={() => handleRemoveQualification(index)}
                            className="absolute top-2 right-2 bg-white text-red-500 text-xs px-2 py-1 rounded hover:bg-gray-100"
                        >
                            ❌ Remove
                        </button>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-center mt-2">No qualifications added yet.</p>
            )}

            {!addingQualification ? (
                <button
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition mt-4 w-full"
                    onClick={() => setAddingQualification(true)}
                >
                    ➕ Add Qualification
                </button>
            ) : (
                <div className="mt-4 space-y-3">
                    <input
                        type="text"
                        placeholder="Degree"
                        className="input-field w-full"
                        onChange={(e) => setNewQualification({ ...newQualification, degree: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Institution"
                        className="input-field w-full"
                        onChange={(e) => setNewQualification({ ...newQualification, institution: e.target.value })}
                    />

                    {/* From & To in the Same Line */}
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="From Year"
                            className="input-field w-1/2"
                            onChange={(e) => setNewQualification({ ...newQualification, fromYear: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="To Year"
                            className="input-field w-1/2"
                            onChange={(e) => setNewQualification({ ...newQualification, toYear: e.target.value })}
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Grade Scored"
                        className="input-field w-full"
                        onChange={(e) => setNewQualification({ ...newQualification, grade: e.target.value })}
                    />

                    {/* Buttons - Save & Cancel */}
                    <div className="flex gap-4 mt-2">
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded-lg w-full hover:bg-green-700 transition"
                            onClick={handleAddQualification}
                        >
                            ✅ Save
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600 transition"
                            onClick={() => setAddingQualification(false)}
                        >
                            ❌ Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddQualificationBlock;
