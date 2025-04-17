import { Facebook, Twitter, Linkedin, Mail, Phone, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"

const Footer = () => {

    const navigate = useNavigate()
    
    return (
        <footer className="bg-[#a33e13] text-white pt-10 pb-6">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center md:text-left">
                    {/* Left Section */}
                    <div>
                        <p className="text-lg font-medium">
                            Stay connected with Gurukul! Get the latest updates, expert tips, and exclusive offers. Join our thriving community for valuable educational resources, inspiring success stories, and more. Follow us today and be a part of the journey to excellence!
                        </p>
                        {/* Social Icons */}
                        <div className="flex justify-center md:justify-start gap-4 mt-4">
                            <a href="https://www.facebook.com/profile.php?id=61574452371503" className="bg-orange-500 p-3 rounded-full hover:bg-orange-600 transition" target="_blank">
                                <Facebook className="text-white" size={20} />
                            </a>
                            <a href="#" className="bg-orange-500 p-3 rounded-full hover:bg-orange-600 transition" target="_blank">
                                <Twitter className="text-white" size={20} />
                            </a>
                            <a href="https://www.linkedin.com/company/gurukul-learn/posts/?feedView=all" className="bg-orange-500 p-3 rounded-full hover:bg-orange-600 transition" target="_blank">
                                <Linkedin className="text-white" size={20} />
                            </a>
                            <a href="https://www.instagram.com/gurukul.learn_/?next=%2F" className="bg-orange-500 p-3 rounded-full hover:bg-orange-600 transition" target="_blank">
                                <MessageCircle className="text-white" size={20} /> {/* Instagram Placeholder */}
                            </a>
                        </div>
                    </div>

                    {/* Right Section - Contact Info */}
                    <div>
                        <h3 className="font-semibold text-lg">Have a question? Contact us</h3>
                        <div className="flex flex-col gap-2 mt-3 text-sm">
                            <p className="flex items-center justify-center md:justify-start gap-2">
                                <Phone size={18} /> +91 97111 76093 (Mon-Sat 9am-6pm IST)
                            </p>
                            <p className="flex items-center justify-center md:justify-start gap-2">
                                <Mail size={18} /> gurukulorganisation@gmail.com
                            </p>
                            <p className="flex items-center justify-center md:justify-start gap-2">
                                <MessageCircle size={18} /> WhatsApp: +91 97111 76093
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t bg-[#7f370a] w-full px-6 py-4 mt-6 flex flex-col md:flex-row justify-between items-center text-sm text-center">
                    <p>© 2019 - 2025 Gurukul. All Rights Reserved.</p>

                    <div className="flex gap-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-orange-400 transition">Terms of Use</a>
                        <a href="#" className="hover:text-orange-400 transition">Privacy Policy</a>
                    </div>

                    <button className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 transition mt-4 md:mt-0" onClick={() => navigate("/get-started/signup")}>
                        Get Started
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
