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
                <div className="w-full px-0 py-2 lg:flex lg:gap-2 lg:items-start">
                    <div className="mb-4 lg:mb-0 lg:w-72 xl:w-80 lg:shrink-0 lg:sticky lg:top-24 lg:self-start">
                        <FilterResults
                            onFilterChange={handleFilterChange}
                            onClearAll={handleClearAll}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <PopularListings
                            searchQuery={searchQuery}
                            filters={filters}
                        />
                    </div>
                </div>
                <WhyChooseUs />
            </main>
            <Footer />
        </div>
    );
};


export default Index;
