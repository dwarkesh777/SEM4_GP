import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FilterResults from "@/components/FilterResults";
import PopularListings from "@/components/PopularListings";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";

const Index = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({});

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
        <div className="min-h-screen bg-background">
            <Navbar />
            <main>
                <HeroSection onSearch={handleSearch} />
                <FilterResults
                    onFilterChange={handleFilterChange}
                    onClearAll={handleClearAll}
                />
                <PopularListings
                    searchQuery={searchQuery}
                    filters={filters}
                />
                <WhyChooseUs />
            </main>
            <Footer />
        </div>
    );
};


export default Index;
