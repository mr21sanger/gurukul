import { useState } from "react";
import { useAdmin } from "../../Reducers/AdminReducer";

function AssignTutorPage() {
    const { pendingTutorRequests, tutors, assignTutors } = useAdmin(); // Context API Data
    const [selectedTutors, setSelectedTutors] = useState({});
    const [modalOpen, setModalOpen] = useState(null); // Track which modal is open

    // Handle selecting tutors
    const handleSelectTutor = (parentId, tutor) => {
        setSelectedTutors((prev) => ({
            ...prev,
            [parentId]: tutor, // Store the full tutor object
        }));
    };


    // Handle assigning tutors
    const handleAssign = (parentId) => {
        if (!selectedTutors[parentId]) return;
        assignTutors(parentId, selectedTutors[parentId]._id) // Call API
            .then(() => {
                setModalOpen(null); // ✅ Close modal after successful assignment
            })
            .catch((err) => console.error("Assignment failed", err));
    };

    return (
        <div className="p-6 min-h-screen bg-gray-100">
            {/* Grid Layout for Parent Requests */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingTutorRequests?.map((request) => (
                    <div key={request.requestId} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-700">{request.parentName}</h2>
                        <p className="text-gray-600"><b>Looking for:</b> {request.subject}</p>
                        <p className="text-gray-600">
                            <b>Address:</b>{" "}
                            {request.parentAddress
                                ? `${request.parentAddress?.street || ""}, ${request.parentAddress?.city || ""}, ${request.parentAddress?.state || ""}, ${request.parentAddress?.zipCode || ""}, ${request.parentAddress?.country || ""}`
                                : "Not Provided"}
                        </p>
                        <p className="text-gray-600"><b>Date:</b> {request.date}</p>

                        {/* Tutor Preview */}
                        <div className="mt-4 p-3 border rounded-lg bg-gray-100 shadow-sm">
                            {selectedTutors[request.requestId] ? (
                                <>
                                    <h3 className="text-lg font-semibold">{selectedTutors[request.requestId]?.userId?.firstName}</h3>
                                    <p className="text-gray-600"><b>Subject:</b> {selectedTutors[request.requestId]?.subject}</p>
                                    <p className="text-gray-600">
                                        <b>Address:</b>{" "}
                                        {selectedTutors[request.requestId]?.userId?.address
                                            ? `${selectedTutors[request.requestId]?.userId?.address?.street || ""}, ${selectedTutors[request.requestId]?.userId?.address?.city || ""}, ${selectedTutors[request.requestId]?.userId?.address?.state || ""}, ${selectedTutors[request.requestId]?.userId?.address?.zipCode || ""}, ${selectedTutors[request.requestId]?.userId?.address?.country || ""}`
                                            : "Not Provided"}
                                    </p>
                                </>
                            ) : (
                                <p className="text-gray-600">No Tutor Selected</p>
                            )}

                            {/* Edit Button to Reopen Modal */}
                            <button
                                onClick={() => setModalOpen(request.requestId)}
                                className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Edit
                            </button>
                        </div>

                        {/* Assign Button */}
                        <button
                            onClick={() => handleAssign(request.requestId)}
                            className={`mt-4 w-full p-2 text-white rounded-lg ${selectedTutors[request.requestId] ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                                }`}
                            disabled={!selectedTutors[request.requestId]}
                        >
                            Assign Tutor
                        </button>

                        {/* Tutor Selection Modal */}
                        {modalOpen === request.requestId && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black/10 bg-opacity-50">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[50%] max-h-[80vh] overflow-y-auto">
                                    <h2 className="text-2xl font-bold mb-4">Select a Tutor</h2>

                                    {/* Grid Layout for Tutor Selection */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {tutors
                                            ?.filter((tutor) => tutor?.isVerified) // ✅ Only verified tutors
                                            .map((tutor) => (
                                                <div
                                                    key={tutor?._id}
                                                    className={`p-4 border rounded-lg shadow-md cursor-pointer transition
                                                        ${selectedTutors[request.requestId]?._id === tutor?._id
                                                            ? "border-green-500 bg-green-100"
                                                            : "border-gray-300"
                                                        }`}
                                                    onClick={() => handleSelectTutor(request.requestId, tutor)}
                                                >
                                                    <h3 className="text-lg font-semibold">{tutor?.userId.firstName}</h3>
                                                    <p className="text-gray-600">
                                                        <b>Subjects:</b> {tutor.subjects?.join(", ")}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        <b>Address:</b> {`${tutor?.userId?.address?.street || ""}, ${tutor?.userId?.address?.city || ""}, ${tutor?.userId?.address?.state || ""}, ${tutor?.userId?.address?.zipCode || ""}, ${tutor?.userId?.address?.country || ""}`}
                                                    </p>
                                                </div>
                                            ))}
                                    </div>

                                    {/* Confirm Button */}
                                    <button
                                        onClick={() => setModalOpen(null)} // ✅ Only close modal when ready
                                        className="mt-4 w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        Confirm Selection
                                    </button>

                                    {/* Close Modal Button */}
                                    <button
                                        onClick={() => setModalOpen(null)}
                                        className="mt-2 w-full p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AssignTutorPage;
