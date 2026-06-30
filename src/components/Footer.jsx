import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
    const quickLinks = [
        { name: "About Us", path: "/about" },
        { name: "All Hostels", path: "/#listings" },
        { name: "All PGs", path: "/#listings" },
        { name: "Search by College", path: "/#listings" },
        { name: "For Owners", path: "/owner/login" }
    ];

    const supportLinks = [
        { name: "Help Center", path: "/help" },
        { name: "Safety Info", path: "/safety" },
        { name: "Cancellation Policy", path: "/cancellation" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Privacy Policy", path: "/privacy" }
    ];

    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950 z-0" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <div className="container py-16 relative z-10 border-t border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2.5 mb-6">
                            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-primary/20 to-indigo-600/20 backdrop-blur-xl border border-white/20 shadow-xl shadow-primary/20">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl tracking-tight font-heading">
                                <span className="font-medium text-white">Nest</span>
                                <span className="font-black text-gradient">Node</span>
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            Your trusted platform for finding premium student housing, luxury hostels & verified PGs across India.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-heading font-bold text-white mb-6 tracking-wide">Quick Links</h4>
                        <ul className="space-y-3 text-sm text-slate-400 font-medium">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="hover:text-primary transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-indigo-500 transition-colors" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-bold text-white mb-6 tracking-wide">Support</h4>
                        <ul className="space-y-3 text-sm text-slate-400 font-medium">
                            {supportLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="hover:text-primary transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-indigo-500 transition-colors" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-bold text-white mb-6 tracking-wide">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-slate-400 font-medium">
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                                    <MapPin className="w-4 h-4 text-primary" />
                                </div>
                                <span className="mt-1">Ahmedabad, Gujarat, India</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                                    <Phone className="w-4 h-4 text-primary" />
                                </div>
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                                    <Mail className="w-4 h-4 text-primary" />
                                </div>
                                <span>hello@nestnode.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-16 pt-8 text-center flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-slate-400 font-medium">
                        © {new Date().getFullYear()} NestNode. All rights reserved.
                    </div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 flex items-center justify-center hover:from-primary hover:to-indigo-600 transition-all duration-300 cursor-pointer text-slate-400 hover:text-white group">
                            <span className="font-bold group-hover:scale-110 transition-transform">X</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 flex items-center justify-center hover:from-primary hover:to-indigo-600 transition-all duration-300 cursor-pointer text-slate-400 hover:text-white group">
                            <span className="font-bold group-hover:scale-110 transition-transform">IN</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 flex items-center justify-center hover:from-primary hover:to-indigo-600 transition-all duration-300 cursor-pointer text-slate-400 hover:text-white group">
                            <span className="font-bold group-hover:scale-110 transition-transform">IG</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;
