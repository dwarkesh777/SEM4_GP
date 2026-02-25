import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, PhoneCall, CheckCircle2, AlertTriangle, Scale } from "lucide-react";

const SafetyInfo = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const safetyFeatures = [
        {
            icon: <Shield className="w-10 h-10" />,
            title: "Verified Listings",
            desc: "Every property goes through a multi-step verification process, including owner identity and property documents.",
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            icon: <Lock className="w-10 h-10" />,
            title: "Data Protection",
            desc: "Your personal data is encrypted and never shared. We prioritize your privacy above everything else.",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            icon: <Eye className="w-10 h-10" />,
            title: "Transparent Reviews",
            desc: "Trust real feedback from actual residents. We ensure reviews are authentic and unbiased.",
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            icon: <PhoneCall className="w-10 h-10" />,
            title: "24/7 Support",
            desc: "Our dedicated safety team is available around the clock to assist you with any on-ground concerns.",
            color: "text-pink-600",
            bg: "bg-pink-50"
        },
    ];

    return (
        <div className="min-h-screen bg-background text-[#1A1A1A]">
            <Navbar />
            <main>
                {/* Hero Header */}
                <section className="bg-gradient-to-br from-emerald-50 via-blue-50 to-white pt-24 pb-20 overflow-hidden">
                    <div className="container relative text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8 text-emerald-600"
                        >
                            <Shield className="w-12 h-12" />
                        </motion.div>
                        <motion.h1
                            {...fadeIn}
                            className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight"
                        >
                            Your Safety is Our <span className="text-emerald-600">Top Priority</span>
                        </motion.h1>
                        <motion.p
                            {...fadeIn}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                        >
                            Building a community where every student feels secure and at home.
                            Explore our comprehensive safety measures and guidelines.
                        </motion.p>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="container py-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {safetyFeatures.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-10 rounded-[2.5rem] border border-border/50 bg-white hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
                            >
                                <div className={`w-16 h-16 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Safety Checklist Section */}
                <section className="py-24 bg-[#0A0A0A] text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />

                    <div className="container relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                            >
                                <span className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-sm mb-4 block">Manual for students</span>
                                <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
                                    The Essential Safety <br />Checklist for Teneants
                                </h2>
                                <p className="text-gray-400 mb-10 text-lg">
                                    Before you commit to your next home, make sure to follow these essential
                                    ground rules for a secure stay.
                                </p>

                                <div className="space-y-6">
                                    {[
                                        "Always visit the property in person before paying",
                                        "Check for emergency exits and fire safety equipment",
                                        "Verify the owner's identity during the visit",
                                        "Read and understand every clause in the agreement",
                                        "Report any listing that looks too good to be true"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <div className="mt-1 w-6 h-6 rounded-full border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                            </div>
                                            <span className="text-gray-300 font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="relative"
                            >
                                <div className="bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 p-12 rounded-[3rem] border border-white/10 backdrop-blur-sm">
                                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <AlertTriangle className="text-orange-400" />
                                        Reporting Concerns
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed mb-8">
                                        Found something suspicious? Our Trust & Safety team investigates
                                        every report within 24 hours. Your anonymity is guaranteed.
                                    </p>
                                    <button className="bg-white text-black font-bold py-4 px-10 rounded-2xl hover:bg-emerald-400 hover:text-white transition-all transform hover:scale-105 active:scale-95">
                                        Report Suspicious Listing
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Legal Assurance */}
                <section className="container py-24 text-center">
                    <Scale className="w-12 h-12 text-primary mx-auto mb-6" />
                    <h2 className="text-2xl font-bold mb-4">Legally Protected Bookings</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto items-center">
                        All our standard agreements are drafted by legal experts to protect the
                        interests of both students and owners, ensuring a fair and safe living arrangement.
                    </p>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default SafetyInfo;
