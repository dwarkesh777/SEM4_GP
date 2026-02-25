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
        <section className="relative py-32 bg-slate-50 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-100/30 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full translate-y-1/3 -translate-x-1/4" />

            <div className="container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200/50 text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                        The BedBuddy Advantage
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-slate-900 mb-6">
                        Why Thousands of <span className="text-primary">Students</span> Trust Us
                    </h2>
                    <div className="w-24 h-1.5 bg-primary/20 mx-auto rounded-full overflow-hidden">
                        <motion.div
                            initial={{ x: "-100%" }}
                            whileInView={{ x: "0%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="w-full h-full bg-primary"
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
                            className="group relative p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden"
                        >
                            {/* Decorative Background Element */}
                            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-700" />

                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 p-[1px] mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-primary/20">
                                    <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                                        <feature.icon className="w-8 h-8 text-primary group-hover:text-blue-600 transition-colors" />
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
                    className="mt-24 p-1 rounded-[3rem] bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-white"
                >
                    <div className="bg-white/80 backdrop-blur-md p-10 md:p-12 rounded-[2.85rem] flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-100">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-2">Ready to find your next home?</h3>
                            <p className="text-slate-500 font-medium italic">Join over 10,000 students already living their best life.</p>
                        </div>
                        <Button className="h-16 px-12 rounded-[2rem] bg-slate-900 text-white hover:bg-black shadow-2xl shadow-black/20 transition-all text-lg font-bold">
                            Get Started Now
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
