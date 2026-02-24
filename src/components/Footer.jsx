import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
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
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-heading font-bold text-sm">N</span>
                            </div>
                            <span className="font-heading font-bold text-xl text-background">NestNode</span>
                        </div>
                        <p className="text-sm text-background/60 leading-relaxed">
                            Your trusted platform for finding student housing, hostels & PGs across India.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold text-background mb-4">Quick Links</h4>
                        <ul className="space-y-2.5 text-sm text-background/60">
                            {["About Us", "All Hostels", "All PGs", "Search by College", "For Owners"].map((link) => (
                                <li key={link}>
                                    <a href="#" className="hover:text-primary transition-colors">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold text-background mb-4">Support</h4>
                        <ul className="space-y-2.5 text-sm text-background/60">
                            {["Help Center", "Safety Info", "Cancellation Policy", "Terms of Service", "Privacy Policy"].map((link) => (
                                <li key={link}>
                                    <a href="#" className="hover:text-primary transition-colors">{link}</a>
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
                                <span>hello@nestnode.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-background/10 mt-10 pt-6 text-center text-sm text-background/40">
                    © {new Date().getFullYear()} NestNode. All rights reserved.
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;
