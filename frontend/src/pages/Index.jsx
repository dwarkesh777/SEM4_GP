import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PopularListings from "@/components/PopularListings";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";
import SponsoredAdsBanner from "@/components/SponsoredAdsBanner";

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
