import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserReducer } from "../Reducers/UserReducer";

const NavigationBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activePage, setActivePage] = useState(localStorage.getItem("activePage") || "Home");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user, loading, logout } = useUserReducer()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        localStorage.setItem("activePage", activePage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [activePage]);

    useEffect(() => {
        const pageName = location.pathname === "/" ? "Home" : location.pathname.substring(1);
        setActivePage(pageName);
    }, [location.pathname]);

    const handleClick = (link) => {
        setActivePage(link);
        navigate(link === "Home" ? "/" : `/${link}`);
    };

    const handleLogout = () => {
        logout()
        setDropdownOpen(false);
        navigate("/")
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto"; // Cleanup on unmount
        };
    }, [isOpen]);

    const handleProfileButton = () => {
        if (user && user?.userId?.role === "Student") navigate("/parent-dash")
        else if (user && user?.userId?.role === "Instructor") navigate("/tutor-dash")
        else {
            navigate("/get-started/signup")
        }
        setDropdownOpen(false);
    }

    const navLinks = ["Home", "Tutors", "About", "Contact"];

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`fixed top-0 left-0 w-full transition-all duration-300 z-50 backdrop-blur-lg
                        ${isScrolled || activePage !== "Home" ? "bg-orange-400/80 shadow-md py-3" : "bg-orange-200 py-5"}`}
        >
            <div className="container mx-auto flex justify-between items-center px-6 md:px-12">
                {/* Logo */}
                <motion.img
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    src="/logo.png"
                    className={`transition-all duration-500 ${isScrolled || activePage !== "Home" ? "w-30" : "w-44"}`}
                    alt="Logo"
                />

                {/* Desktop Navigation */}
                <div className="hidden md:flex space-x-8 items-center">
                    <ul className="flex space-x-8">
                        {navLinks.map((link, index) => (
                            <motion.li
                                key={index}
                                whileHover={{ scale: 1.1, y: -2 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className={`cursor-pointer text-black font-semibold text-lg relative 
                                            transition-all duration-300 ${activePage === link ? "text-black" : "hover:text-orange-500"}`}
                                onClick={() => handleClick(link)}
                            >
                                {link}
                                {activePage === link && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="absolute left-0 right-0 -bottom-1 h-[3px] bg-orange-600 rounded shadow-lg"
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </motion.li>
                        ))}
                    </ul>

                    {/* User Authentication Section */}
                    {user ? (
                        <div className="relative">
                            <button
                                className="flex items-center text-black font-semibold text-lg px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-500 transition"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                Hi, {user.userId.firstName} <ChevronDown size={18} className="ml-1" />
                            </button>

                            {/* Dropdown */}
                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden"
                                    >
                                        <button
                                            className="w-full flex items-center px-4 py-2 text-black hover:bg-orange-500"
                                            onClick={handleProfileButton}
                                        >
                                            <User size={18} className="mr-2" /> Profile
                                        </button>
                                        <button
                                            className="w-full flex items-center px-4 py-2 text-black hover:bg-orange-500"
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={18} className="mr-2" /> Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="ml-6 bg-gradient-to-r from-orange-400 to-orange-500 text-black px-6 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition duration-300"
                            onClick={() => navigate("/get-started/login")}
                        >
                           Login
                        </motion.button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-black">
                        {isOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden fixed top-16 left-0 w-full h-screen bg-orange-200 p-6 shadow-lg flex flex-col items-center justify-start pt-16"
                    >
                        <ul className="space-y-6 text-center">
                            {navLinks.map((link, index) => (
                                <motion.li
                                    key={index}
                                    whileTap={{ scale: 0.95 }}
                                    className={`cursor-pointer text-black text-2xl font-bold ${activePage === link ? "text-orange-500" : "hover:text-orange-600"}`}
                                    onClick={() => {
                                        handleClick(link);
                                        setIsOpen(false);
                                    }}
                                >
                                    {link}
                                </motion.li>
                            ))}
                        </ul>

                        {/* Mobile User Section */}
                        {user ? (
                            <div className="text-center mt-12">
                                <button
                                    className="w-full bg-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-orange-600 transition duration-300"
                                    onClick={() => {
                                        handleProfileButton()
                                        setIsOpen(false);
                                    }}
                                >
                                    Go to Profile
                                </button>
                                <button
                                    className="mt-4 w-full bg-orange-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-orange-700 transition duration-300"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-12 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition duration-300"
                                onClick={() => {
                                    navigate("/get-started/login");
                                    setIsOpen(false);
                                }}
                            >
                                Login
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default NavigationBar;
