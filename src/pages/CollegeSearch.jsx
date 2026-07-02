import { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchByCollege from "@/components/SearchByCollege";
import FilterResults from "@/components/FilterResults";
import PopularListings from "@/components/PopularListings";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const CollegeSearch = () => {
    const [collegeCoords, setCollegeCoords] = useState(null);
    const [filters, setFilters] = useState({});

    const handleCollegeSearch = (college) => {
        setCollegeCoords({
            lat: college.Latitude,
            lng: college.Longitude,
            name: college.Name
        });

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
            <main className="pt-16">
                <SearchByCollege onCollegeSearch={handleCollegeSearch} />
                <div className="bg-white">
                    <div className="w-full px-0 py-2 lg:flex lg:gap-2 lg:items-start">
                        <div className="mb-4 lg:mb-0 lg:w-72 xl:w-80 lg:shrink-0 lg:sticky lg:top-24 lg:self-start">
                            <FilterResults
                                onFilterChange={handleFilterChange}
                                onClearAll={handleClearAll}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <PopularListings
                                collegeCoords={collegeCoords}
                                filters={filters}
                            />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CollegeSearch;
