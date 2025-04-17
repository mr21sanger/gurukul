import React from "react";

const InstructorInfoCard = ({ instructor }) => {
  const {
    userId,
    isVerified,
    verificationStatus,
    assignedParents,
    documents,
    hourlyRate,
    availability,
    subjects,
    experience,
    qualifications,
    schedules,
  } = instructor || {};

  const fullName = `${userId?.firstName || "N/A"} ${userId?.lastName || ""}`;
  const email = userId?.email || "N/A";
  const phone = userId?.phone || "N/A";
  const aadhar = documents?.[0]?.aadhar;
  const selfie = documents?.[0]?.selfie;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 w-full h-full">
      <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
        {/* Selfie Image */}
        <div className="shrink-0">
          {selfie ? (
            <img
              src={selfie}
              alt="Selfie"
              className="w-28 h-28 rounded-full object-cover border-4 border-purple-500 shadow"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium shadow">
              No Image
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 w-full space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-xl font-semibold text-purple-800">{fullName}</h2>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full w-fit ${
                isVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {verificationStatus || "Not Verified"}
            </span>
          </div>

          {/* Contact Info */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>📧 {email}</p>
            <p>📞 {phone}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Assigned Parents:</span>{" "}
              {assignedParents?.length || 0}
            </div>
            <div>
              <span className="font-medium text-gray-700">Hourly Rate:</span>{" "}
              ₹{hourlyRate || "Not set"}
            </div>
            <div>
              <span className="font-medium text-gray-700">Subjects:</span>{" "}
              {subjects?.length ? subjects.join(", ") : "N/A"}
            </div>

            {/* Experience */}
            <div>
              <span className="font-medium text-gray-700">Experience:</span>
              <ul className="list-disc ml-5">
                {experience?.length ? (
                  experience.map((exp, idx) => (
                    <li key={idx}>
                      {exp.years || "N/A"} years at {exp.organization || "Unknown Org"}
                    </li>
                  ))
                ) : (
                  <li>N/A</li>
                )}
              </ul>
            </div>

            {/* Qualifications */}
            <div>
              <span className="font-medium text-gray-700">Qualifications:</span>
              <ul className="list-disc ml-5">
                {qualifications?.length ? (
                  qualifications.map((q, idx) => (
                    <li key={idx}>
                      {q.degree || "N/A"}, {q.institution || "N/A"} ({q.fromYear || "?"} -{" "}
                      {q.toYear || "?"})
                    </li>
                  ))
                ) : (
                  <li>N/A</li>
                )}
              </ul>
            </div>

            {/* Availability / Schedule */}
            <div>
              <span className="font-medium text-gray-700">Availability:</span>
              <ul className="list-disc ml-5">
                {schedules?.length ? (
                  schedules.map((s, idx) => (
                    <li key={idx}>
                      {s.day} - {s.time}
                    </li>
                  ))
                ) : availability?.length ? (
                  availability.map((a, idx) => <li key={idx}>{a}</li>)
                ) : (
                  <li>N/A</li>
                )}
              </ul>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Documents:</h3>
            {aadhar ? (
              <img
                src={aadhar}
                alt="Aadhar"
                className="w-32 h-20 object-cover rounded-lg border border-gray-200 shadow"
              />
            ) : (
              <p className="text-sm text-gray-500">No Aadhar Provided</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorInfoCard;
