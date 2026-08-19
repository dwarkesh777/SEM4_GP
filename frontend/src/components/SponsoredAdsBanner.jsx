import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Megaphone, MapPin, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/api";

const DEFAULT_SPONSORED_ADS = [
    {
        id: "default-ad-1",
        propertyName: "Royal Palms Luxury PG & Hostel",
        headline: "⚡ 20% OFF First Month — AC Rooms!",
        badgeText: "Sponsored • Top Featured",
        location: "Navrangpura, Ahmedabad",
        price: 8500,
        originalPrice: 10500,
        rating: 0,
        reviewsCount: 0,
        type: "PG",
        gender: "Co-ed",
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
        targetUrl: "/hostel/demo-1",
        latestReview: null
    },
    {
        id: "default-ad-2",
        propertyName: "Starlight Heights Boys Hostel",
        headline: "🔥 Zero Booking Fee — Wi-Fi Included!",
        badgeText: "Sponsored • Recommended",
        location: "SG Highway, Ahmedabad",
        price: 7200,
        originalPrice: 9000,
        rating: 0,
        reviewsCount: 0,
        type: "Hostel",
        gender: "Boys",
        image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800",
        targetUrl: "/hostel/demo-2",
        latestReview: null
    },
    {
        id: "default-ad-3",
        propertyName: "Greenwood Co-Living Spaces",
        headline: "🌟 Special Student Discount: 15% OFF!",
        badgeText: "Sponsored • Hot Deal",
        location: "Satellite, Ahmedabad",
        price: 9500,
        originalPrice: 11000,
        rating: 0,
        reviewsCount: 0,
        type: "PG",
        gender: "Girls",
        image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
        targetUrl: "/hostel/demo-3",
        latestReview: null
    },
    {
        id: "default-ad-4",
        propertyName: "Comfort Haven Student Stay",
        headline: "🎉 Free Breakfast & Laundry Included!",
        badgeText: "Sponsored • Best Value",
        location: "Bodakdev, Ahmedabad",
        price: 7800,
        originalPrice: 9200,
        rating: 0,
        reviewsCount: 0,
        type: "Hostel",
        gender: "Co-ed",
        image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800",
        targetUrl: "/hostel/demo-4",
        latestReview: null
    }
];

const SponsoredAdsBanner = () => {
    const [ads, setAds] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Load active real property ads or fallback with exact review counts (0 if no reviews)
    useEffect(() => {
        const loadAds = async () => {
            try {
                // 1. Fetch live properties from API
                const res = await fetch(`${API_URL}/api/public/properties/list/?appid=nestnode-readonly-key-2026`);
                if (res.ok) {
                    const data = await res.json();
                    const realProps = data.results || data;
                    if (Array.isArray(realProps) && realProps.length > 0) {
                        const mappedProps = realProps.slice(0, 6).map((p, idx) => {
                            const revCount = Number(p.reviews_count ?? p.reviews ?? (p.reviews_list ? p.reviews_list.length : 0)) || 0;
                            const revRating = p.rating && Number(p.rating) > 0 ? Number(p.rating).toFixed(1) : "0";
                            const firstReview = p.reviews_list && p.reviews_list.length > 0 ? p.reviews_list[0] : null;

                            return {
                                id: p.id,
                                propertyId: p.id,
                                propertyName: p.name || "Student Living Stay",
                                headline: p.description?.slice(0, 50) || "⚡ Special Offer: 15% OFF for First Month!",
                                badgeText: "AD • SPONSORED • RECO...",
                                location: p.location || p.city || "Ahmedabad",
                                price: p.price || 9700,
                                originalPrice: p.originalPrice || p.original_price || (Number(p.price || 9700) + 1500),
                                rating: revRating,
                                reviewsCount: revCount,
                                type: p.type || "PG",
                                gender: p.gender || "Boys",
                                image: p.main_image || p.images?.[0]?.image || DEFAULT_SPONSORED_ADS[idx % DEFAULT_SPONSORED_ADS.length].image,
                                targetUrl: `/hostel/${p.id}`,
                                latestReview: firstReview
                            };
                        });
                        setAds(mappedProps);
                        return;
                    }
                }

                // 2. Check local owner campaigns
                const storedCampaigns = JSON.parse(localStorage.getItem("owner_ads_campaigns") || "[]");
                const activeOwnerAds = storedCampaigns.filter(ad => ad.status === "Active");
                if (activeOwnerAds.length > 0) {
                    const sanitized = activeOwnerAds.map(ad => ({
                        ...ad,
                        reviewsCount: Number(ad.reviewsCount || ad.reviews_count || 0) || 0,
                        rating: ad.rating && Number(ad.rating) > 0 ? Number(ad.rating).toFixed(1) : "0"
                    }));
                    setAds(sanitized);
                } else {
                    setAds(DEFAULT_SPONSORED_ADS);
                }
            } catch {
                setAds(DEFAULT_SPONSORED_ADS);
            }
        };

        loadAds();
    }, []);

    // Automatic slide transition every 4.5 seconds (pauses on hover)
    useEffect(() => {
        if (ads.length <= 3 || isHovered) return;

        const autoPlayTimer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
        }, 4500);

        return () => clearInterval(autoPlayTimer);
    }, [ads.length, isHovered]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
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
                                    AD • VERIFIED
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
                        {visibleAds.map((ad, idx) => {
                            const count = Number(ad.reviewsCount || 0);
                            const ratingVal = ad.rating && Number(ad.rating) > 0 ? Number(ad.rating).toFixed(1) : "0";

                            return (
                                <motion.div
                                    key={ad.id || `${currentIndex}-${idx}`}
                                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                                    transition={{ duration: 0.35, delay: idx * 0.08 }}
                                    className="bg-white rounded-2xl border border-indigo-100 p-4 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group hover:border-indigo-400 overflow-hidden"
                                >
                                    {/* Subtle background glow */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/10 to-transparent pointer-events-none rounded-tr-2xl" />

                                    <div>
                                        {/* Property Image with Ad Badge */}
                                        <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-100 mb-3">
                                            <img
                                                src={ad.image}
                                                alt={ad.propertyName}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 backdrop-blur-md text-indigo-200 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-indigo-400/40 uppercase tracking-wider">
                                                <span>{ad.badgeText || "AD • SPONSORED • RECO..."}</span>
                                            </div>
                                        </div>

                                        {/* Category Badge */}
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <Badge variant="outline" className="text-[11px] font-bold border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-lg bg-slate-50">
                                                {ad.gender || "Boys"} • {ad.type || "PG"}
                                            </Badge>
                                        </div>

                                        <h4 className="font-heading font-black text-slate-900 text-lg uppercase tracking-wide leading-tight group-hover:text-indigo-600 transition-colors">
                                            {ad.propertyName}
                                        </h4>

                                        <p className="text-xs font-bold text-indigo-900 bg-indigo-50/90 p-2.5 rounded-xl my-2.5 border border-indigo-200/70 flex items-center gap-1.5">
                                            <span className="text-amber-500">⚡</span>
                                            <span className="truncate">{ad.headline || "Special Offer: 15% OFF for First Month!"}</span>
                                        </p>

                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">{ad.location}</span>
                                        </div>
                                    </div>

                                    {/* Footer & Price */}
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                        <div>
                                            <span className="text-xs text-slate-400 line-through mr-1.5 font-medium">
                                                ₹{ad.originalPrice || 11200}
                                            </span>
                                            <span className="text-xl font-black text-slate-900 font-heading">
                                                ₹{ad.price || 9700}
                                            </span>
                                            <span className="text-xs text-slate-400 font-bold">/mo</span>
                                        </div>

                                        <Link
                                            to={ad.propertyId ? `/hostel/${ad.propertyId}` : (ad.targetUrl || "#")}
                                        >
                                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-600/25 text-xs gap-1.5 px-4 py-2">
                                                View
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
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
