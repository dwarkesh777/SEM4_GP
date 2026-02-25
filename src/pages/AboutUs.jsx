import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Shield, Users, Sparkles, Target, BarChart, Globe } from "lucide-react";

const AboutUs = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const stagger = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="relative py-24 overflow-hidden bg-[#0070E0]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0070E0] via-[#005bb5] to-[#1e3a8a] opacity-90" />
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20" />

                    <div className="container relative z-10 text-center">
                        <motion.h1
                            {...fadeIn}
                            className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
                        >
                            Redefining <span className="text-blue-200">Student Living</span>
                        </motion.h1>
                        <motion.p
                            {...fadeIn}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-blue-100 max-w-3xl mx-auto font-medium leading-relaxed"
                        >
                            India's most trusted platform for finding modern, safe, and community-driven
                            accommodation for students and young professionals.
                        </motion.p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-24 container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div {...fadeIn}>
                            <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <Target className="text-primary w-8 h-8" />
                                Our Mission
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                At BedBuddy, we believe that your living space is the canvas for your dreams.
                                Our mission is to simplify the hunt for perfect accommodation by bringing
                                transparency, safety, and modern convenience to the traditional hostel industry.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                We're not just a listing site; we're your partner in navigating the big city transition,
                                ensuring you find a place where you truly belong.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div className="bg-blue-50 p-8 rounded-3xl text-center">
                                <Users className="w-10 h-10 text-primary mx-auto mb-4" />
                                <div className="text-3xl font-bold text-primary mb-1">50k+</div>
                                <div className="text-sm font-semibold text-blue-800 uppercase tracking-wider">Students Housed</div>
                            </div>
                            <div className="bg-pink-50 p-8 rounded-3xl text-center mt-8">
                                <Globe className="w-10 h-10 text-[#FF66AA] mx-auto mb-4" />
                                <div className="text-3xl font-bold text-[#FF66AA] mb-1">20+</div>
                                <div className="text-sm font-semibold text-pink-800 uppercase tracking-wider">Cities Covered</div>
                            </div>
                            <div className="bg-purple-50 p-8 rounded-3xl text-center">
                                <Shield className="w-10 h-10 text-purple-600 mx-auto mb-4" />
                                <div className="text-3xl font-bold text-purple-600 mb-1">100%</div>
                                <div className="text-sm font-semibold text-purple-800 uppercase tracking-wider">Verified Hosts</div>
                            </div>
                            <div className="bg-orange-50 p-8 rounded-3xl text-center mt-8">
                                <Sparkles className="w-10 h-10 text-orange-500 mx-auto mb-4" />
                                <div className="text-3xl font-bold text-orange-500 mb-1">4.8</div>
                                <div className="text-sm font-semibold text-orange-800 uppercase tracking-wider">Avg Rating</div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-24 bg-secondary/30">
                    <div className="container">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">The BedBuddy Promise</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                We built our platform on three core pillars that prioritize your comfort and peace of mind.
                            </p>
                        </div>

                        <motion.div
                            variants={stagger}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            <motion.div variants={fadeIn} className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                                    <Sparkles className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Modern Living</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Premium rooms equipped with high-speed WiFi, smart laundry,
                                    and AC options designed for the Gen-Z lifestyle.
                                </p>
                            </motion.div>

                            <motion.div variants={fadeIn} className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mb-6">
                                    <Shield className="w-8 h-8 text-[#FF66AA]" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Safe & Secure</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    CCTV surveillance, bio-metric entries, and 24/7 on-ground assistance
                                    to ensure you feel safe at all times.
                                </p>
                            </motion.div>

                            <motion.div variants={fadeIn} className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                                    <Users className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Community First</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Access to common hubs, gaming zones, and networking events
                                    that turn roommates into lifelong friends.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default AboutUs;
