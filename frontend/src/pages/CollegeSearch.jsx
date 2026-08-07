import { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchByCollege from "@/components/SearchByCollege";
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
        <div className="min-h-screen bg-transparent">
            <Navbar />
            <main className="pt-0">
                <SearchByCollege onCollegeSearch={handleCollegeSearch} />
                <div className="bg-transparent">
                    <div className="w-full px-4 sm:px-6 lg:px-10 py-4">
                        <PopularListings
                            collegeCoords={collegeCoords}
                            filters={filters}
                            showAll={true}
                            onFilterChange={handleFilterChange}
                            onClearAll={handleClearAll}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CollegeSearch;
