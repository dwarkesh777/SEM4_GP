import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, Wifi, Sofa, Droplets, Shield, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const amenityIcons = {
    WIFI: <Wifi className="w-3.5 h-3.5" />,
    "FULLY FURNISHED": <Sofa className="w-3.5 h-3.5" />,
    "HOT WATER": <Droplets className="w-3.5 h-3.5" />,
    SECURITY: <Shield className="w-3.5 h-3.5" />,
};

const PropertyCard = ({
    id, main_image, images, name, location, type, gender, rating, reviews, price, originalPrice, amenities, index, distance
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const navigate = useNavigate();

    const slideshowImages = [
        main_image,
        ...(images?.map(img => img.image) || [])
    ].filter(Boolean);

    useEffect(() => {
        let interval;
        if (isHovered && slideshowImages.length > 1) {
            interval = setInterval(() => {
                setCurrentImgIndex((prev) => (prev + 1) % slideshowImages.length);
            }, 1800);
        } else {
            setCurrentImgIndex(0);
        }
        return () => clearInterval(interval);
    }, [isHovered, slideshowImages.length]);

    const handleHoverStart = () => {
        setIsHovered(true);
        setShowDetailsPopup(true);
    };

    const handleHoverEnd = () => {
        setIsHovered(false);
        setShowDetailsPopup(false);
    };

    const handleCardClick = (event) => {
        if (event.target.closest("button, a")) return;
        navigate(`/hostel/${id}`);
    };

    return (
        <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
                onMouseEnter={handleHoverStart}
                onMouseLeave={handleHoverEnd}
                onClick={handleCardClick}
                whileHover={{
                    y: -8,
                    scale: 1.01,
                    boxShadow: "0 30px 60px -20px rgba(15, 23, 42, 0.25)",
                    transition: { duration: 0.25, ease: "easeOut" }
                }}
                className="group relative cursor-pointer bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 card-elevated flex flex-col h-full transform-gpu ring-1 ring-slate-900/5 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.22)]"
            >
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden m-3.5 rounded-[2rem] flex-shrink-0 z-10 transition-transform duration-500 group-hover:scale-[0.985]">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImgIndex}
                            src={slideshowImages[currentImgIndex]}
                            alt={name}
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            loading="lazy"
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 rounded-[2rem] border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* High Contrast Overlays */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {distance !== undefined && distance !== null && (
                            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-none font-black text-[10px] uppercase tracking-wide py-1.5 px-3 rounded-full shadow-lg shadow-emerald-500/30 flex items-center gap-1 w-fit">
                                <MapPin className="w-3 h-3" />
                                {distance} km
                            </Badge>
                        )}
                        <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-none font-black text-[10px] uppercase tracking-[0.1em] py-1.5 px-4 rounded-full shadow-lg shadow-pink-500/30 w-fit">
                            {type}
                        </Badge>
                    </div>

                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <Badge className="bg-slate-900/80 backdrop-blur-sm hover:bg-slate-900 text-white border-none font-bold text-[10px] py-1.5 px-3.5 rounded-full shadow-lg flex items-center gap-1">
                            <span className="text-xs opacity-70">{gender === 'Boys' ? '♂' : '♀'}</span>
                            {gender}
                        </Badge>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {slideshowImages.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImgIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-6 pb-6 pt-3 flex-grow flex flex-col relative">
                    <div className="mb-3">
                        <h3 className="text-xl font-black text-slate-900 leading-tight transition-colors duration-300 group-hover:text-primary">
                            <span className="text-gradient inline-block">{name}</span>
                        </h3>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 border border-slate-200">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-black text-slate-900">
                                {typeof rating === 'number' ? rating.toFixed(1) : '4.5'}
                            </span>
                        </div>
                        <div className="text-xl font-black text-slate-900">₹{price.toLocaleString()}</div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 mb-3">
                        <div className="p-1.5 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 text-primary">
                            <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold tracking-tight">{location}</span>
                    </div>

                    <div className="mt-auto rounded-2xl border border-slate-200/70 bg-slate-50/70 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Hover to view full details
                    </div>

                    <AnimatePresence>
                        {showDetailsPopup && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-x-4 bottom-4 z-20 rounded-[1.4rem] border border-slate-200 bg-white/95 p-4 shadow-2xl shadow-slate-900/15 backdrop-blur"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Property Details</p>
                                            <h4 className="text-base font-black text-slate-900">{name}</h4>
                                        </div>
                                        <Badge className="bg-gradient-to-r from-primary/10 to-indigo-600/10 text-primary border-primary/20 font-semibold">
                                            {type}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span>{location}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <span>{typeof rating === 'number' ? rating.toFixed(1) : '4.5'} · {reviews || 24} reviews</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {amenities?.slice(0, 4).map((amenity) => (
                                            <div key={amenity} className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                                                {amenityIcons[amenity.toUpperCase()] || <Wifi className="w-3 h-3" />}
                                                <span>{amenity}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Starting From</p>
                                            <p className="text-lg font-black text-primary">₹{price.toLocaleString()}/mo</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                navigate(`/hostel/${id}`);
                                            }}
                                            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 px-4 py-2.5 text-sm font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]"
                                        >
                                            Book Now
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
    );
};

export default PropertyCard;
