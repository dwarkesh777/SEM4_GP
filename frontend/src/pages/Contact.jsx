import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Contact = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast({
                title: "Please fill all fields",
                description: "Full name, email address, and message are required.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast({
                title: "Message Sent Successfully! 🎉",
                description: "Thank you for reaching out. Our support team will get back to you within 24 hours.",
            });
            setFormData({ name: "", email: "", message: "" });
        }, 600);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-1">
                {/* Hero Header */}
                <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-28 pb-20">
                    <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="container max-w-5xl mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                                <MessageSquare className="w-4 h-4" />
                                <span>24/7 Support Desk</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-heading">
                                Get in Touch With Us
                            </h1>
                            <p className="mt-3 text-slate-400 text-base sm:text-lg max-w-2xl font-medium">
                                Have questions about booking student accommodation, property hosting, or partnership inquiries? We are here to help.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Main Contact Section */}
                <section className="py-16 sm:py-20">
                    <div className="container max-w-5xl mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            
                            {/* Contact Info Cards */}
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                                        Contact Information
                                    </h2>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                        Reach out to our customer happiness team directly or send us a message using the form.
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 font-bold">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-slate-900 text-base">Call Support</h3>
                                            <p className="text-slate-700 font-bold mt-0.5 text-sm">+91 78599 88312</p>
                                            <p className="text-xs text-slate-400 font-medium mt-0.5">Mon - Sat, 9:00 AM to 9:00 PM IST</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 font-bold">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-slate-900 text-base">Email Us</h3>
                                            <p className="text-slate-700 font-bold mt-0.5 text-sm">support@nestnode.com</p>
                                            <p className="text-xs text-slate-400 font-medium mt-0.5">24/7 Priority Email Assistance</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 font-bold">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-slate-900 text-base">Headquarters</h3>
                                            <p className="text-slate-700 font-bold mt-0.5 text-sm">Ahmedabad, Gujarat, India</p>
                                            <p className="text-xs text-slate-400 font-medium mt-0.5">Serving 20+ Major Educational Hubs</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Contact Form */}
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50"
                            >
                                <h3 className="text-xl font-black text-slate-900 mb-6">Send Us a Message</h3>
                                <form className="space-y-5" onSubmit={handleSubmit}>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-slate-50 focus:bg-white text-sm font-medium text-slate-900" 
                                            placeholder="Enter your full name" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-slate-50 focus:bg-white text-sm font-medium text-slate-900" 
                                            placeholder="you@example.com" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Message</label>
                                        <textarea 
                                            rows={4} 
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-slate-50 focus:bg-white text-sm font-medium text-slate-900 resize-none" 
                                            placeholder="How can our support team assist you today?" 
                                        />
                                    </div>
                                    <Button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-600/25 transition-transform active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" /> Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </motion.div>

                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
