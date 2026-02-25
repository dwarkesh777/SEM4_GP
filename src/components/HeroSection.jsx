import { motion } from "framer-motion";
import { Search, MapPin, Building, Users } from "lucide-react";
import { useState } from "react";

const HeroSection = () => {
    const [query, setQuery] = useState("");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20 pb-20 bg-slate-950">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-primary/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.15),transparent_50%)]" />
            </div>

            {/* Decorative Elements */}
            <motion.div
                animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-40 left-[10%] w-64 h-64 bg-primary/20 blur-[100px] rounded-full hidden lg:block"
            />
            <motion.div
                animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-40 right-[10%] w-80 h-80 bg-accent/20 blur-[120px] rounded-full hidden lg:block"
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative z-10 container text-center px-4"
            >
                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs md:text-sm font-bold tracking-widest uppercase mb-6 shadow-xl leading-none">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Trusted by 10,000+ Students
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold text-white leading-[1.1] mb-8 tracking-tight"
                >
                    Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-100 to-indigo-200">Perfect</span> <br className="hidden md:block" /> Second Home
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
                >
                    Premium student housing, luxury hostels & verified PGs <br className="hidden sm:block" />
                    designed for the modern academic journey.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="max-w-3xl mx-auto relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-indigo-500/50 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                    <div className="relative flex items-center bg-white rounded-[2.2rem] shadow-2xl overflow-hidden p-2 md:p-3 border border-white/20">
                        <div className="hidden sm:flex items-center pl-6 pr-2 text-slate-400 border-r border-slate-100 shrink-0">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter city, college, or area..."
                            className="flex-1 px-6 md:px-8 py-4 bg-transparent text-slate-800 placeholder:text-slate-400 outline-none text-base md:text-lg font-medium"
                        />
                        <button className="flex items-center gap-3 px-8 md:px-12 py-4 md:py-5 rounded-[1.8rem] bg-slate-900 text-white font-bold text-base md:text-lg hover:bg-black transition-all shadow-xl active:scale-95 group/btn">
                            <Search className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                            Search
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="flex flex-wrap items-center justify-center gap-8 md:gap-20 mt-20"
                >
                    {[
                        { value: "500+", label: "Verified Hubs", icon: <Building className="w-5 h-5" /> },
                        { value: "50+", label: "Cities Covered", icon: <MapPin className="w-5 h-5" /> },
                        { value: "10K+", label: "Happy Residents", icon: <Users className="w-5 h-5" /> },
                    ].map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center gap-2 group cursor-default">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/80 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    {stat.icon}
                                </div>
                                <span className="text-3xl md:text-4xl font-heading font-extrabold text-white">{stat.value}</span>
                            </div>
                            <p className="text-xs md:text-sm font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
