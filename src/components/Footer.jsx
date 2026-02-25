import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
    const quickLinks = [
        { name: "About Us", path: "/about" },
        { name: "All Hostels", path: "/#listings" },
        { name: "All PGs", path: "/#listings" },
        { name: "Search by College", path: "/#listings" },
        { name: "For Owners", path: "/owner-login" }
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
            className="bg-foreground text-background"
        >
            <div className="container py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2.5 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary shadow-lg shadow-primary/20">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl tracking-tight font-heading">
                                <span className="font-medium text-white">Bed</span>
                                <span className="font-black text-primary">Buddy</span>
                            </span>
                        </div>
                        <p className="text-sm text-background/60 leading-relaxed">
                            Your trusted platform for finding student housing, hostels & PGs across India.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold text-background mb-4">Quick Links</h4>
                        <ul className="space-y-2.5 text-sm text-background/60">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold text-background mb-4">Support</h4>
                        <ul className="space-y-2.5 text-sm text-background/60">
                            {supportLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold text-background mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-sm text-background/60">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                                <span>Ahmedabad, Gujarat, India</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary shrink-0" />
                                <span>hello@bedbuddy.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-background/10 mt-10 pt-6 text-center text-sm text-background/40">
                    © {new Date().getFullYear()} BedBuddy. All rights reserved.
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;
