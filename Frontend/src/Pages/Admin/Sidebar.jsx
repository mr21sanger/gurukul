import React from "react";

const Sidebar = ({ activeSection, onNavigate }) => {
  const menuItems = ["Dashboard", "Verifications", "Assign Tutor", "Complaints", "User Management", "Reports"];

  return (
    <div className="w-full md:w-64 bg-orange-600 text-white p-6 shadow-lg md:h-full">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li
            key={item}
            className={`cursor-pointer p-2 text-lg rounded-md ${activeSection === item ? "bg-white/60 text-black font-bold" : "hover:bg-orange-700"
              }`}
            onClick={() => onNavigate(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
