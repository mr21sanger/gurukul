import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // Import menu icons
import { motion } from "framer-motion"; // Import animation library
import { useAdmin } from "../../Reducers/AdminReducer";

function AdminNavbar({ setActiveSection, activeSection, name = "Admin" }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const { admin } = useAdmin()

    // Navigation Links
    const navLinks = ["Dashboard", "Verifications", "Complaints", "Assign Tutor", "Verified Tutors"];

    return (
        <nav className="bg-white z-50 text-gray-800 shadow-md px-6 py-4 flex justify-between items-center">
            {/* Logo */}
            <img src="/logo.webp" alt="Logo" className="h-10 cursor-pointer" />

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
                {navLinks.map((section) => (
                    <button
                        key={section}
                        onClick={() => setActiveSection(section)}
                        className={`relative text-gray-600 font-medium transition-all duration-300 hover:text-blue-600 ${activeSection === section ? "text-blue-600" : ""
                            }`}
                    >
                        {section}
                        {activeSection === section && (
                            <motion.div
                                layoutId="underline"
                                className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500"
                            />
                        )}
                    </button>
                ))}

                {/* Hi, Admin (Desktop) */}
                <span className="text-blue-700 font-bold text-lg">Hi, {name}</span>

                {/* Admin Profile */}
                <img src="/admin-avatar.png" alt="Admin" className="h-10 w-10 rounded-full border-2 border-blue-500" />
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-gray-800 text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FiX /> : <FiMenu />}
            </button>

            {/* Mobile Menu Animation */}
            {menuOpen && (
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", stiffness: 80 }}
                    className="fixed top-0 left-0 w-2/3 h-full bg-white shadow-md flex flex-col items-start space-y-6 py-10 px-6 z-50"
                >
                    {/* Hi, Admin (Mobile) */}
                    <span className="text-gray-700 font-semibold text-lg">Hi, {name}</span>

                    {navLinks.map((section) => (
                        <button
                            key={section}
                            onClick={() => {
                                setActiveSection(section);
                                setMenuOpen(false); // Close menu on selection
                            }}
                            className={`text-gray-600 font-semibold text-lg hover:text-blue-600 transition-all ${activeSection === section ? "text-blue-600" : ""
                                }`}
                        >
                            {section}
                        </button>
                    ))}
                </motion.div>
            )}
        </nav>
    );
}

export default AdminNavbar;
