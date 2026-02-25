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

    // Combine main image and extra images
    const slideshowImages = [
        main_image,
        ...(images?.map(img => img.image) || [])
    ].filter(Boolean);

    useEffect(() => {
        let interval;
        if (isHovered && slideshowImages.length > 1) {
            interval = setInterval(() => {
                setCurrentImgIndex((prev) => (prev + 1) % slideshowImages.length);
            }, 1500); // Change image every 1.5s
        } else {
            setCurrentImgIndex(0);
        }
        return () => clearInterval(interval);
    }, [isHovered, slideshowImages.length]);

    const genderColor = gender === "Boys" ? "bg-blue-500" : gender === "Girls" ? "bg-pink-500" : "bg-accent";

    return (
        <Link to={`/hostel/${id}`}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="bg-card rounded-xl overflow-hidden card-elevated group cursor-pointer"
            >
                <div className="relative h-52 overflow-hidden">
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
                    <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-primary text-primary-foreground text-xs font-semibold">
                            {type.toUpperCase()}
                        </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                        <Badge className={`${genderColor} text-primary-foreground text-xs`}>
                            {gender}
                        </Badge>
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="font-heading font-semibold text-card-foreground text-base line-clamp-1 mb-1">
                        {name}
                    </h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span className="line-clamp-1">{location}</span>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="text-sm font-semibold text-card-foreground">{rating.toFixed(1)}/5</span>
                        {reviews > 0 && (
                            <span className="text-xs text-muted-foreground">({reviews})</span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {amenities.slice(0, 4).map((amenity) => (
                            <span
                                key={amenity}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs"
                            >
                                {amenityIcons[amenity]}
                                {amenity}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-baseline gap-2 pt-3 border-t border-border">
                        {originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">₹{originalPrice.toLocaleString()}/-</span>
                        )}
                        <span className="text-xl font-heading font-bold text-primary">₹{price.toLocaleString()}/-</span>
                        <span className="text-xs text-muted-foreground">Monthly Rent</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default PropertyCard;
