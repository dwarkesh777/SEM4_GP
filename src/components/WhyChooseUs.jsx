import { motion } from "framer-motion";
import { Search, ShieldCheck, BadgeIndianRupee, Headphones, GraduationCap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
    {
        icon: Search,
        title: "Easy Search",
        description: "Find the perfect accommodation with our advanced search filters and user-friendly interface",
    },
    {
        icon: ShieldCheck,
        title: "Verified Listings",
        description: "All properties are verified by our team to ensure authenticity and quality standards",
    },
    {
        icon: BadgeIndianRupee,
        title: "Best Price",
        description: "Get competitive prices and exclusive deals on accommodations across India",
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        description: "Round-the-clock customer support to help you with any queries or issues",
    },
    {
        icon: GraduationCap,
        title: "Near Colleges",
        description: "Find accommodations located near your college or university for convenience",
    },
    {
        icon: Star,
        title: "Top Rated",
        description: "Access highly-rated properties with genuine reviews from verified students",
    },
];

const WhyChooseUs = () => {
    return (
        <section className="relative py-32 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-gradient-to-br from-primary/20 to-indigo-600/20 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-gradient-to-br from-purple-500/15 to-pink-500/10 blur-[120px] rounded-full translate-y-1/3 -translate-x-1/4" />

            <div className="container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-indigo-600/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                        The NestNode Advantage
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-slate-900 mb-6">
                        Why Thousands of <span className="text-gradient">Students</span> Trust Us
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-primary/20 to-indigo-600/20 mx-auto rounded-full overflow-hidden">
                        <motion.div
                            initial={{ x: "-100%" }}
                            whileInView={{ x: "0%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="w-full h-full bg-gradient-to-r from-primary to-indigo-600"
                        />
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group relative p-8 rounded-[2.5rem] bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-primary/15 transition-all duration-500 overflow-hidden"
                        >
                            {/* Decorative Background Element */}
                            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-gradient-to-br from-primary/10 to-indigo-600/10 rounded-full blur-2xl group-hover:from-primary/20 group-hover:to-indigo-600/20 transition-all duration-700" />

                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 p-[1px] mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-primary/20">
                                    <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                                        <feature.icon className="w-8 h-8 text-primary group-hover:text-indigo-600 transition-colors" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-heading font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-500 leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA / Highlight */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-24 p-1 rounded-[3rem] bg-gradient-to-r from-primary/20 via-indigo-600/10 to-purple-600/10 border border-white"
                >
                    <div className="bg-white/90 backdrop-blur-xl p-10 md:p-12 rounded-[2.85rem] flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-100">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-2">Ready to find your next home?</h3>
                            <p className="text-slate-500 font-medium italic">Join over 10,000 students already living their best life.</p>
                        </div>
                        <Button className="h-16 px-12 rounded-[2rem] bg-gradient-to-r from-primary to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white shadow-2xl shadow-primary/30 transition-all text-lg font-bold hover:shadow-3xl hover:shadow-primary/40">
                            Get Started Now
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
