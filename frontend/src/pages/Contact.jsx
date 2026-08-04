import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
    return (
        <div className="min-h-screen bg-transparent">
            <Navbar />
            <main>
                <section className="bg-slate-900 pt-32 pb-24 border-b border-slate-800 text-white">
                    <div className="container max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 font-heading">Get in Touch</h1>
                            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                                Have questions about NestNode? Our team is here to help you with your bookings, property listings, and more.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="container max-w-5xl py-20">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-6">Contact Information</h2>
                                <p className="text-slate-500 mb-8">Fill out the form and our team will get back to you within 24 hours.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">Phone</h3>
                                        <p className="text-slate-500 mt-1">+91 63528 96141</p>
                                        <p className="text-sm text-slate-400 mt-1">Mon-Fri, 9am - 9pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">Email</h3>
                                        <p className="text-slate-500 mt-1">support@nestnode.com</p>
                                        <p className="text-sm text-slate-400 mt-1">Online support 24/7</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">Office</h3>
                                        <p className="text-slate-500 mt-1">Ahmedabad, Gujarat</p>
                                        <p className="text-sm text-slate-400 mt-1">India</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40"
                        >
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-slate-50 focus:bg-white" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-slate-50 focus:bg-white" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                                    <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-slate-50 focus:bg-white resize-none" placeholder="How can we help you?"></textarea>
                                </div>
                                <Button className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-200 transition-all">
                                    <Send className="w-5 h-5 mr-2" /> Send Message
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
