import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useAdmin } from "../../Reducers/AdminReducer";

const AssignRequestBlock = ({ parent, selectedTutors, openModal }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800">{parent.parent}</h2>
      <p className="text-gray-600">{parent.locality}, {parent.school}</p>

      <div className="mt-4 space-y-4">
        {parent.requests.map((req) => (
          <div key={req.requestId} className="p-4 border rounded-lg shadow-sm bg-gray-50">
            <h3 className="font-medium text-gray-800">{req.subject} - {req.classLevel}</h3>
            <p className="text-gray-600 text-sm">Available Days: {req.availableDays.join(", ")}</p>
            <p className="text-gray-600 text-sm">Previous Marks: {req.previousMarks}</p>

            <div className="mt-3 flex gap-2">
              {selectedTutors[req.requestId] || req.tutorAssigned ? (
                <>
                  <p className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">
                    {selectedTutors[req.requestId]?.name || req.tutorAssigned?.name}
                  </p>
                  <button
                    onClick={() => openModal(parent.id, req.requestId)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
                  >
                    Edit
                  </button>
                </>
              ) : (
                <button
                  onClick={() => openModal(parent.id, req.requestId)}
                  className="bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600 text-sm"
                >
                  Select
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignRequestBlock