import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, Wifi, Sofa, Droplets, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const amenityIcons = {
    WIFI: <Wifi className="w-3 h-3" />,
    "FULLY FURNISHED": <Sofa className="w-3 h-3" />,
    "HOT WATER": <Droplets className="w-3 h-3" />,
    SECURITY: <Shield className="w-3 h-3" />,
};

const PropertyCard = ({
    id, main_image, images, name, location, type, gender, rating, reviews, price, originalPrice, amenities, index,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    const slideshowImages = [
        main_image,
        ...(images?.map(img => img.image) || [])
    ].filter(Boolean);

    useEffect(() => {
        let interval;
        if (isHovered && slideshowImages.length > 1) {
            interval = setInterval(() => {
                setCurrentImgIndex((prev) => (prev + 1) % slideshowImages.length);
            }, 1500);
        } else {
            setCurrentImgIndex(0);
        }
        return () => clearInterval(interval);
    }, [isHovered, slideshowImages.length]);

    return (
        <Link to={`/hostel/${id}`}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-md transition-shadow duration-300 group cursor-pointer h-full flex flex-col"
            >
                <div className="relative h-60 min-h-[240px] overflow-hidden m-3 rounded-xl flex-shrink-0">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImgIndex}
                            src={slideshowImages[currentImgIndex]}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            loading="lazy"
                        />
                    </AnimatePresence>
                    <div className="absolute top-3 left-3">
                        <Badge className="bg-[#FF66AA] hover:bg-[#FF66AA] text-white border-none rounded-lg px-3 py-1 text-sm font-bold uppercase">
                            {type}
                        </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                        <Badge className="bg-[#2D2D2D] hover:bg-[#2D2D2D] text-white border-none rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1.5">
                            <span className="text-xs">♂</span> {gender}
                        </Badge>
                    </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-1 line-clamp-1 min-h-[1.75rem]">
                        {name}
                    </h3>

                    <div className="flex items-center gap-1 text-[#6B7280] mb-3">
                        <MapPin className="w-4 h-4 text-[#6B7280]" />
                        <span className="text-sm font-medium line-clamp-1">{location}</span>
                    </div>

                    <div className="flex items-center gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                className={`w-4 h-4 ${s <= Math.round(rating) ? "fill-[#FFB800] text-[#FFB800]" : "fill-[#E5E7EB] text-[#E5E7EB]"}`}
                            />
                        ))}
                        <span className="ml-2 text-sm font-semibold text-[#1A1A1A]">
                            {typeof rating === 'number' ? rating.toFixed(1) : '0.0'}/5 ({reviews || 0})
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6 min-h-[4rem]">
                        {amenities?.slice(0, 5).map((amenity) => (
                            <span
                                key={amenity}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E6F2FF] text-[#0070E0] text-xs font-bold uppercase tracking-wider h-fit"
                            >
                                {amenityIcons[amenity.toUpperCase()] || <Wifi className="w-3 h-3" />}
                                {amenity}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col mb-4 mt-auto">
                        <div className="flex items-baseline gap-2">
                            {originalPrice && (
                                <span className="text-sm text-[#9CA3AF] line-through font-medium">₹{originalPrice.toLocaleString()}/-</span>
                            )}
                            <span className="text-2xl font-extrabold text-[#0070E0]">₹{price.toLocaleString()}/-</span>
                        </div>
                        <span className="text-sm text-[#6B7280] font-medium mt-1">Monthly Rent From</span>
                    </div>

                    <button className="w-full bg-[#0070E0] hover:bg-[#005bb5] text-white font-bold py-3.5 rounded-xl transition-colors duration-200">
                        View Details
                    </button>
                </div>
            </motion.div>
        </Link>
    );
};

export default PropertyCard;
