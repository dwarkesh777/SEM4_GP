import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FilterResults from "@/components/FilterResults";
import PopularListings from "@/components/PopularListings";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";

const Index = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({});
    const [showAll, setShowAll] = useState(() => {
        return sessionStorage.getItem('home_showAll') === 'true';
    });

    // Persist showAll state
    useEffect(() => {
        sessionStorage.setItem('home_showAll', showAll);
    }, [showAll]);
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
        setFilters({});
    };

    return (
        <div className="min-h-screen bg-transparent">
            <Navbar />
            <main>
                <HeroSection onSearch={handleSearch} />

                <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                    <div className="lg:flex lg:gap-8 lg:items-start">
                        {showAll && (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-8 lg:mb-0 lg:w-72 xl:w-80 lg:shrink-0 lg:sticky lg:top-24 lg:self-start"
                            >
                                <FilterResults
                                    onFilterChange={handleFilterChange}
                                    onClearAll={handleClearAll}
                                />
                            </motion.div>
                        )}
                        <div className="flex-1 min-w-0">
                            <PopularListings
                                searchQuery={searchQuery}
                                filters={filters}
                                showAll={showAll}
                                setShowAll={setShowAll}
                                onResetCity={() => setSearchQuery("")}
                            />
                        </div>
                    </div>
                </div>
                <WhyChooseUs />
            </main>
            <Footer />
        </div>
    );
};

export default Index;
