import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PopularListings from "@/components/PopularListings";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";
import SponsoredAdsBanner from "@/components/SponsoredAdsBanner";
import ImageMarquee from "@/components/ImageMarquee";
import FeatureTicker from "@/components/FeatureTicker";

const Index = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({ ordering: "created_at_desc" });
    const [showAll, setShowAll] = useState(() => {
        return sessionStorage.getItem('home_showAll') === 'true';
    });

    // Persist showAll state
    useEffect(() => {
        sessionStorage.setItem('home_showAll', showAll);
    }, [showAll]);

    // ── Listen for search events fired from the HeroSection search bar ──
    useEffect(() => {
        const handleHeroSearch = (e) => {
            const { query = "", type = "" } = e.detail || {};
            setSearchQuery(query);
            // Apply the property type filter if selected
            if (type) {
                setFilters(prev => ({ ...prev, type: [type] }));
            }
            // Scroll to listings
            const listingsElement = document.getElementById("listings");
            if (listingsElement) {
                listingsElement.scrollIntoView({ behavior: "smooth" });
            }
        };
        window.addEventListener("hero-search", handleHeroSearch);
        return () => window.removeEventListener("hero-search", handleHeroSearch);
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        // Scroll to listings section
        const listingsElement = document.getElementById("listings");
        if (listingsElement) {
            listingsElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleClearAll = () => {
        setFilters({ ordering: "created_at_desc" });
    };

    return (
        <div className="min-h-screen bg-transparent">
            <Navbar />
            <main>
                <HeroSection onSearch={handleSearch} />

                {/* White Container — sits flush below HeroSection wave */}
                <div 
                    className="relative z-20 bg-slate-50 mt-0 pt-8 sm:pt-12 pb-4 sm:pb-8"
                >
                    <section className="w-full text-center px-4">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            Spaces that Feel Right <span className="text-blue-600">From Day One</span>
                        </h2>
                        <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-slate-600 font-medium max-w-3xl mx-auto">
                            Standalone properties designed for <span className="font-bold text-slate-800">students & professionals.</span>
                        </p>
                    </section>
                    
                    <ImageMarquee />
                    <FeatureTicker />
                </div>

                <div className="w-full px-4 sm:px-6 lg:px-10 py-4">
                    <SponsoredAdsBanner />
                    <PopularListings
                        searchQuery={searchQuery}
                        filters={filters}
                        showAll={showAll}
                        setShowAll={setShowAll}
                        onResetCity={() => setSearchQuery("")}
                        onFilterChange={handleFilterChange}
                        onClearAll={handleClearAll}
                    />
                </div>
                <WhyChooseUs />
            </main>
            <Footer />
        </div>
    );
};

export default Index;
