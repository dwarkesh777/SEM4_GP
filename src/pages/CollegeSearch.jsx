import { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchByCollege from "@/components/SearchByCollege";
import PopularListings from "@/components/PopularListings";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const CollegeSearch = () => {
    const [collegeCoords, setCollegeCoords] = useState(null);

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

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-16">
                <SearchByCollege onCollegeSearch={handleCollegeSearch} />
                <div className="bg-white">
                    <PopularListings collegeCoords={collegeCoords} />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CollegeSearch;
