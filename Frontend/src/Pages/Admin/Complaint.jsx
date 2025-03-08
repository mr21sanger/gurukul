import React from "react";

const Complaint = ({ complaint }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mt-8">Complaint</h2>
      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg text-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border p-3">User</th>
              <th className="border p-3">Issue</th>
              <th className="border p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {complaint?.map((complaint) => (
              <tr key={complaint?.id} className="text-center hover:bg-gray-100">
                <td className="border p-3">{complaint?.user}</td>
                <td className="border p-3">{complaint?.issue}</td>
                <td className="border p-3">
                  <span className={`px-3 py-1 rounded-md ${complaint?.status === "Resolved" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                    {complaint?.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Complaint;
