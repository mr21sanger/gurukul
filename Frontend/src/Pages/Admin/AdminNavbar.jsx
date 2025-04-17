import React, { useState } from "react";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import { useAdmin } from "../../Reducers/AdminReducer";

function AdminNavbar({ setActiveSection, activeSection, name = "Admin" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { admin } = useAdmin();

  const navLinks = ["Dashboard", "Verifications", "Complaints", "Assign Tutor", "Verified Tutors"];

  const handleLogout = () => {
    // Add your logout logic here (clear auth, redirect, etc.)
    console.log("Logging out...");
  };

  return (
    <nav className="bg-white sticky top-0 z-50 text-gray-800 shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img src="/logo.png" alt="Logo" className="h-10 cursor-pointer" />
        <span className="text-xl font-semibold text-blue-700 hidden sm:inline">Admin Panel</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 items-center">
        {navLinks.map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`relative text-sm font-medium px-2 py-1 transition-all duration-200 rounded-md ${
              activeSection === section
                ? "text-blue-700 bg-blue-100"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
            }`}
          >
            {section}
            {activeSection === section && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 rounded-full"
              />
            )}
          </button>
        ))}

        {/* Hi, Admin */}
        <span className="text-blue-700 font-semibold text-base">Hi, {name}</span>

        {/* Avatar */}
        <img
          src="/admin-avatar.png"
          alt="Admin"
          className="h-10 w-10 rounded-full border-2 border-blue-500 shadow-sm"
        />
      </div>

      {/* Mobile Menu Icon */}
      <button
        className="md:hidden text-gray-800 text-2xl focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Slide Menu */}
      {menuOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 80 }}
          className="fixed top-0 left-0 w-2/3 h-full bg-white shadow-lg flex flex-col items-start space-y-6 py-10 px-6 z-50"
        >
          {/* Greeting */}
          <span className="text-gray-800 font-semibold text-lg">Hi, {name}</span>

          {/* Navigation Links */}
          {navLinks.map((section) => (
            <button
              key={section}
              onClick={() => {
                setActiveSection(section);
                setMenuOpen(false);
              }}
              className={`text-left w-full text-gray-700 text-base font-medium px-2 py-2 rounded-md ${
                activeSection === section ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`}
            >
              {section}
            </button>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-2 text-red-600 text-base font-medium px-2 py-2 hover:bg-red-50 rounded-md"
          >
            <FiLogOut className="text-xl" />
            Logout
          </button>
        </motion.div>
      )}
    </nav>
  );
}

export default AdminNavbar;
