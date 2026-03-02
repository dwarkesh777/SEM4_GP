import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, Wifi, Sofa, Droplets, Shield, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const amenityIcons = {
    WIFI: <Wifi className="w-3.5 h-3.5" />,
    "FULLY FURNISHED": <Sofa className="w-3.5 h-3.5" />,
    "HOT WATER": <Droplets className="w-3.5 h-3.5" />,
    SECURITY: <Shield className="w-3.5 h-3.5" />,
};

const PropertyCard = ({
    id, main_image, images, name, location, type, gender, rating, reviews, price, originalPrice, amenities, index,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);

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

    return (
        <Link to={`/hostel/${id}`} className="block h-full">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 card-elevated flex flex-col h-full transform-gpu ring-1 ring-black/5 shadow-xl shadow-slate-200/50"
            >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden m-3.5 rounded-[2rem] flex-shrink-0 z-10 transition-transform duration-500 group-hover:scale-[0.98]">
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

                    {/* High Contrast Overlays */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-[#FF0080] hover:bg-[#FF0080] text-white border-none font-black text-[10px] uppercase tracking-[0.1em] py-1.5 px-4 rounded-full shadow-lg">
                            {type}
                        </Badge>
                    </div>

                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <Badge className="bg-[#1A1A1A] hover:bg-[#1A1A1A] text-white border-none font-bold text-[10px] py-1.5 px-3.5 rounded-full shadow-lg flex items-center gap-1">
                            <span className="text-xs opacity-70">{gender === 'Boys' ? '♂' : '♀'}</span>
                            {gender}
                        </Badge>
                    </div>

                    <div className="absolute bottom-4 right-4 z-20">
                        <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.preventDefault();
                                setIsWishlisted(!isWishlisted);
                            }}
                            className={`flex items-center justify-center aspect-square w-11 rounded-full backdrop-blur-md border border-white/30 transition-all shadow-lg ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-900 hover:bg-white'}`}
                        >
                            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                        </motion.button>
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
                <div className="px-7 pb-7 pt-3 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors duration-300">
                            <span className="text-gradient inline-block">{name}</span>
                        </h3>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 mb-5">
                        <div className="p-1.5 rounded-full bg-slate-100 text-primary">
                            <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold tracking-tight">{location}</span>
                    </div>

                    <div className="flex items-center gap-4 mb-7 bg-slate-50 border border-slate-100 p-2.5 rounded-2xl w-fit">
                        <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                            <span className="text-sm font-black text-slate-900">
                                {typeof rating === 'number' ? rating.toFixed(1) : '4.5'}
                            </span>
                        </div>
                        <div className="w-px h-4 bg-slate-200" />
                        <span className="text-[10px] font-black text-slate-400 underline decoration-slate-200 underline-offset-4 uppercase tracking-[0.1em]">
                            {reviews || 24} Reviews
                        </span>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2.5 mb-8 items-center min-h-[2.5rem]">
                        {amenities?.slice(0, 3).map((amenity) => (
                            <div
                                key={amenity}
                                className="group/pill flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-primary/40 hover:bg-white hover:shadow-md transition-all duration-300"
                            >
                                <span className="text-primary group-hover/pill:scale-110 transition-transform">
                                    {amenityIcons[amenity.toUpperCase()] || <Wifi className="w-3.5 h-3.5" />}
                                </span>
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight group-hover/pill:text-primary">
                                    {amenity}
                                </span>
                            </div>
                        ))}
                        {amenities?.length > 3 && (
                            <span className="text-[11px] font-black text-primary/80 bg-primary/5 px-2.5 py-1.5 rounded-lg border border-primary/10 ml-1">+{amenities.length - 3}</span>
                        )}
                    </div>

                    {/* Pricing and Button */}
                    <div className="mt-auto flex items-end justify-between gap-4 pt-4 border-t border-slate-100">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Monthly Rent</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-[#0070E0] tracking-tighter">₹{price.toLocaleString()}</span>
                                <span className="text-xs font-black text-slate-400 uppercase">/mo</span>
                            </div>
                            {originalPrice && (
                                <span className="text-xs text-slate-400 line-through font-bold opacity-50">₹{originalPrice.toLocaleString()}</span>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(0 112 224 / 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#0070E0] hover:bg-[#005bb5] text-white text-xs font-black uppercase tracking-[0.2em] py-4 px-8 rounded-2xl shadow-xl shadow-primary/30 transition-all duration-300 flex items-center gap-2.5 group/btn"
                        >
                            Explore
                            <motion.span
                                animate={{ x: [0, 4, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            >
                                →
                            </motion.span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default PropertyCard;
