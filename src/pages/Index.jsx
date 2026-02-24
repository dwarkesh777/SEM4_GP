import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PopularListings from "@/components/PopularListings";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";

const Index = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main>
                <HeroSection />
                <PopularListings />
                <WhyChooseUs />
            </main>
            <Footer />
        </div>
    );
};

export default Index;
