import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Megaphone, Star, MapPin, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DEFAULT_SPONSORED_ADS = [
    {
        id: "default-ad-1",
        propertyName: "Royal Palms Luxury PG & Hostel",
        headline: "⚡ 20% OFF First Month — AC Rooms!",
        badgeText: "Sponsored • Top Featured",
        location: "Navrangpura, Ahmedabad",
        price: 8500,
        originalPrice: 10500,
        rating: 4.9,
        reviewsCount: 128,
        type: "PG",
        gender: "Co-ed",
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
        targetUrl: "/hostel/demo-1",
        clicks: 342,
        impressions: 1840,
    },
    {
        id: "default-ad-2",
        propertyName: "Starlight Heights Boys Hostel",
        headline: "🔥 Zero Booking Fee — Wi-Fi Included!",
        badgeText: "Sponsored • Recommended",
        location: "SG Highway, Ahmedabad",
        price: 7200,
        originalPrice: 9000,
        rating: 4.8,
        reviewsCount: 94,
        type: "Hostel",
        gender: "Boys",
        image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800",
        targetUrl: "/hostel/demo-2",
        clicks: 215,
        impressions: 1290,
    },
    {
        id: "default-ad-3",
        propertyName: "Greenwood Co-Living Spaces",
        headline: "🌟 Special Student Discount: 15% OFF!",
        badgeText: "Sponsored • Hot Deal",
        location: "Satellite, Ahmedabad",
        price: 9500,
        originalPrice: 11000,
        rating: 4.9,
        reviewsCount: 156,
        type: "PG",
        gender: "Girls",
        image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
        targetUrl: "/hostel/demo-3",
        clicks: 180,
        impressions: 1100,
    },
    {
        id: "default-ad-4",
        propertyName: "Comfort Haven Student Stay",
        headline: "🎉 Free Breakfast & Laundry Included!",
        badgeText: "Sponsored • Best Value",
        location: "Bodakdev, Ahmedabad",
        price: 7800,
        originalPrice: 9200,
        rating: 4.7,
        reviewsCount: 88,
        type: "Hostel",
        gender: "Co-ed",
        image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800",
        targetUrl: "/hostel/demo-4",
        clicks: 140,
        impressions: 950,
    }
];

const SponsoredAdsBanner = () => {
    const [ads, setAds] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Load active owner ads or fallback sample ads
    useEffect(() => {
        const loadAds = () => {
            try {
                const storedCampaigns = JSON.parse(localStorage.getItem("owner_ads_campaigns") || "[]");
                const activeOwnerAds = storedCampaigns.filter(ad => ad.status === "Active");

                if (activeOwnerAds.length > 0) {
                    setAds(activeOwnerAds);
                } else {
                    setAds(DEFAULT_SPONSORED_ADS);
                }
            } catch {
                setAds(DEFAULT_SPONSORED_ADS);
            }
        };

        loadAds();
        const pollInterval = setInterval(loadAds, 3000);
        return () => clearInterval(pollInterval);
    }, []);

    // Automatic slide transition every 4 seconds (pauses on hover)
    useEffect(() => {
        if (ads.length <= 3 || isHovered) return;

        const autoPlayTimer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
        }, 4000);

        return () => clearInterval(autoPlayTimer);
    }, [ads.length, isHovered]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    };

    const handleAdClick = (adId) => {
        try {
            const storedCampaigns = JSON.parse(localStorage.getItem("owner_ads_campaigns") || "[]");
            const updated = storedCampaigns.map(ad => {
                if (ad.id === adId) {
                    return { ...ad, clicks: (ad.clicks || 0) + 1 };
                }
                return ad;
            });
            localStorage.setItem("owner_ads_campaigns", JSON.stringify(updated));
        } catch (e) {
            console.error("Ad click error:", e);
        }
    };

    if (ads.length === 0) return null;

    // Get 3 ads for the single row view
    const getVisibleAds = () => {
        if (ads.length <= 3) return ads;
        const visible = [];
        for (let i = 0; i < 3; i++) {
            visible.push(ads[(currentIndex + i) % ads.length]);
        }
        return visible;
    };

    const visibleAds = getVisibleAds();

    return (
        <section className="w-full my-6 px-4 sm:px-6 md:px-10 lg:px-12 max-w-7xl mx-auto">
            <div 
                className="bg-gradient-to-r from-indigo-600/10 via-indigo-600/5 to-purple-600/10 border border-indigo-500/20 rounded-[2rem] p-3 sm:p-4 md:p-5 backdrop-blur-md relative overflow-hidden shadow-xl shadow-indigo-500/5"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                
                {/* Top header bar for Ads Section */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-indigo-500/15">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-600 shadow-sm">
                            <Megaphone className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-heading font-black text-slate-900 tracking-tight">
                                    Promoted & Sponsored Listings
                                </h3>
                                <Badge className="bg-indigo-500/15 text-indigo-700 border-indigo-500/30 font-bold uppercase tracking-wider text-[10px] px-2 py-0.5">
                                    Ad • Verified
                                </Badge>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">
                                Verified partner properties featured for students
                            </p>
                        </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-500/10 px-3 py-1.5 rounded-full font-bold border border-indigo-500/20 mr-2">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                            Featured Promotions
                        </div>

                        {ads.length > 3 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrev}
                                    className="w-9 h-9 rounded-xl bg-white border border-indigo-200 text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 flex items-center justify-center transition-all shadow-sm active:scale-95"
                                    aria-label="Previous Ads"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-xs font-bold text-slate-500 px-1 font-mono">
                                    {currentIndex + 1}/{ads.length}
                                </span>
                                <button
                                    onClick={handleNext}
                                    className="w-9 h-9 rounded-xl bg-white border border-indigo-200 text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 flex items-center justify-center transition-all shadow-sm active:scale-95"
                                    aria-label="Next Ads"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Single Row 3-Card Carousel */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <AnimatePresence mode="popLayout">
                        {visibleAds.map((ad, idx) => (
                            <motion.div
                                key={ad.id || `${currentIndex}-${idx}`}
                                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                                transition={{ duration: 0.35, delay: idx * 0.08 }}
                                className="bg-white rounded-2xl border border-indigo-100 p-4 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group hover:border-indigo-400 overflow-hidden"
                            >
                                {/* Subtle Google Ads background glow */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/10 to-transparent pointer-events-none rounded-tr-2xl" />

                                <div>
                                    {/* Property Image with Ad Badge */}
                                    <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-100 mb-3">
                                        <img
                                            src={ad.image || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800"}
                                            alt={ad.propertyName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/75 backdrop-blur-md text-indigo-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-indigo-400/40 uppercase tracking-wider">
                                            <span>Ad</span>
                                            <span>•</span>
                                            <span className="truncate max-w-[120px]">{ad.badgeText || ad.badge || "Sponsored"}</span>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                        <Badge variant="outline" className="text-[10px] font-bold border-slate-200 text-slate-600 px-2 py-0">
                                            {ad.gender || "Co-ed"} • {ad.type || "Hostel"}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                            <span>{ad.rating || "4.8"}</span>
                                            <span className="text-slate-400 font-normal">({ad.reviewsCount || 42})</span>
                                        </div>
                                    </div>

                                    <h4 className="font-heading font-extrabold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                        {ad.propertyName}
                                    </h4>

                                    <p className="text-xs font-bold text-indigo-900 bg-indigo-50/80 p-2 rounded-lg my-2 border border-indigo-200/60 line-clamp-1">
                                        {ad.headline}
                                    </p>

                                    <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mb-3">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span className="truncate">{ad.location}</span>
                                    </div>
                                </div>

                                {/* Footer & Price */}
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <div>
                                        <span className="text-[11px] text-slate-400 line-through mr-1">
                                            ₹{ad.originalPrice || Number(ad.price) + 1500}
                                        </span>
                                        <span className="text-lg font-black text-slate-900 font-heading">
                                            ₹{ad.price}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">/mo</span>
                                    </div>

                                    <Link
                                        to={ad.propertyId ? `/hostel/${ad.propertyId}` : (ad.targetUrl || "#")}
                                        onClick={() => handleAdClick(ad.id)}
                                    >
                                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-500/20 text-xs gap-1.5 px-3 py-1.5">
                                            View
                                            <ExternalLink className="w-3 h-3" />
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Bottom Pagination Dots */}
                {ads.length > 3 && (
                    <div className="flex justify-center items-center gap-1.5 mt-5">
                        {ads.map((ad, idx) => (
                            <button
                                key={ad.id || idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    currentIndex === idx ? "w-6 bg-indigo-600" : "w-2 bg-indigo-200 hover:bg-indigo-300"
                                }`}
                                aria-label={`Go to ad ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default SponsoredAdsBanner;
