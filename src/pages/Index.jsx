import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PopularListings from "@/components/PopularListings";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";

const Index = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (query) => {
        setSearchQuery(query);
        // Scroll to listings section
        const listingsElement = document.getElementById("listings");
        if (listingsElement) {
            listingsElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main>
                <HeroSection onSearch={handleSearch} />
                <PopularListings searchQuery={searchQuery} />
                <WhyChooseUs />
            </main>
            <Footer />
        </div>
    );
};

export default Index;
