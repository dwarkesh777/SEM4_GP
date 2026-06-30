import { motion } from "framer-motion";
import { Search, MapPin, Building, Users, ChevronRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = ({ onSearch }) => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (onSearch) {
            onSearch(query);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-28 pb-20 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-black" />
                <div className="absolute top-0 left-0 right-0 h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(102,126,234,0.15),transparent_60%)]" />
                
                {/* Glowing Orbs */}
                <motion.div
                    animate={{ y: [0, -40, 0], x: [0, 30, 0], scale: [1, 1.15, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-primary/30 to-indigo-600/20 blur-[150px] rounded-full mix-blend-screen"
                />
                <motion.div
                    animate={{ y: [0, 40, 0], x: [0, -30, 0], scale: [1, 1.25, 1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[5%] right-[10%] w-[600px] h-[600px] bg-gradient-to-br from-purple-500/20 to-pink-500/10 blur-[180px] rounded-full mix-blend-screen"
                />
                <motion.div
                    animate={{ y: [0, -20, 0], x: [0, -15, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-cyan-500/15 blur-[120px] rounded-full mix-blend-screen"
                />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBmaWxsPSJub25lIj48cGF0aCBkPSJNMCA0MGw0MC00TTAgMGg0MHY0MEgwem0wIDIwaDQweiIgLz48L2c+PC9zdmc+')] z-0 opacity-40" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 container mx-auto px-4 lg:px-8 flex flex-col items-center text-center"
            >
                {/* Top Badge */}
                <motion.div variants={itemVariants} className="mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-all cursor-pointer group shadow-xl shadow-black/20">
                        <Sparkles className="w-4 h-4 text-gradient group-hover:animate-spin" />
                        <span>The new standard in student housing</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                </motion.div>

                {/* Hero Title */}
                <motion.h1
                    variants={itemVariants}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black text-white leading-[1.05] mb-6 tracking-tight"
                >
                    Find your perfect <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient">
                        second home.
                    </span>
                </motion.h1>

                {/* Hero Subtitle */}
                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
                >
                    Discover premium hostels, luxury PGs, and verified student accommodations. Designed for modern academic living.
                </motion.p>

                {/* Search Component */}
                <motion.div
                    variants={itemVariants}
                    className="w-full max-w-4xl mx-auto relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 via-indigo-500/40 to-purple-500/40 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition duration-500" />
                    <div className="relative flex flex-col sm:flex-row items-center bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] p-2 md:p-3 border border-white/10 shadow-2xl">
                        <div className="flex w-full sm:w-auto items-center flex-1">
                            <div className="pl-6 pr-3 text-slate-400 shrink-0">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search by city, college, or area..."
                                className="w-full px-2 py-4 bg-transparent text-white placeholder:text-slate-500 outline-none text-lg font-medium"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="w-full sm:w-auto mt-2 sm:mt-0 flex justify-center items-center gap-2 px-8 py-4 md:py-4 rounded-[1.5rem] bg-gradient-to-r from-primary to-indigo-600 text-white font-bold text-lg hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95 shrink-0"
                        >
                            <Search className="w-5 h-5" />
                            Search Now
                        </button>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-wrap items-center justify-center gap-6 md:gap-16 mt-20 pt-10 border-t border-white/10 w-full max-w-4xl"
                >
                    {[
                        { value: "500+", label: "Verified Properties", icon: Building },
                        { value: "50+", label: "Cities Covered", icon: MapPin },
                        { value: "10K+", label: "Happy Students", icon: Users },
                    ].map((stat) => (
                        <div key={stat.label} className="flex items-center gap-4 group cursor-default">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-sm flex items-center justify-center text-slate-400 group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-indigo-600/20 group-hover:text-primary transition-all duration-300 border border-white/10">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <div className="text-2xl md:text-3xl font-heading font-black text-white">{stat.value}</div>
                                <div className="text-sm font-medium text-slate-400">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
