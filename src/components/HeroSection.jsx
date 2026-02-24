import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
    const [query, setQuery] = useState("");

    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src={heroBg}
                    alt="Modern hostel building"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 hero-overlay opacity-80" />
            </div>

            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 left-10 w-32 h-32 rounded-full border border-primary-foreground/10 hidden lg:block"
            />
            <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-32 right-16 w-24 h-24 rounded-full border border-primary-foreground/10 hidden lg:block"
            />
            <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-40 right-32 w-16 h-16 rounded-full bg-primary-foreground/5 hidden lg:block"
            />

            <div className="relative z-10 container text-center px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-primary-foreground leading-tight mb-6"
                >
                    Find Your Second Home
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10"
                >
                    Book student housing, hostels & PGs across India with NestNode
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="flex items-center bg-card rounded-full shadow-2xl overflow-hidden p-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by city, locality, or property name..."
                            className="flex-1 px-6 py-4 bg-transparent text-card-foreground placeholder:text-muted-foreground outline-none text-sm md:text-base"
                        />
                        <button className="flex items-center gap-2 px-6 md:px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium text-sm md:text-base hover:opacity-90 transition-opacity animate-pulse-glow">
                            <Search className="w-4 h-4" />
                            <span className="hidden sm:inline">Search</span>
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="flex items-center justify-center gap-8 md:gap-12 mt-12"
                >
                    {[
                        { value: "500+", label: "Properties" },
                        { value: "50+", label: "Cities" },
                        { value: "10K+", label: "Happy Students" },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground">{stat.value}</p>
                            <p className="text-xs md:text-sm text-primary-foreground/60">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
