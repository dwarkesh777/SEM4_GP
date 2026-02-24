import { motion } from "framer-motion";
import { MapPin, Star, Wifi, Sofa, Droplets, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  image: string;
  name: string;
  location: string;
  type: "Hostel" | "PG";
  gender: "Boys" | "Girls" | "Co-ed";
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  amenities: string[];
  index: number;
}

const amenityIcons: Record<string, React.ReactNode> = {
  WIFI: <Wifi className="w-3 h-3" />,
  "FULLY FURNISHED": <Sofa className="w-3 h-3" />,
  "HOT WATER": <Droplets className="w-3 h-3" />,
  SECURITY: <Shield className="w-3 h-3" />,
};

const PropertyCard = ({
  image, name, location, type, gender, rating, reviews, price, originalPrice, amenities, index,
}: PropertyCardProps) => {
  const genderColor = gender === "Boys" ? "bg-blue-500" : gender === "Girls" ? "bg-pink-500" : "bg-accent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card rounded-xl overflow-hidden card-elevated group cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
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

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading font-semibold text-card-foreground text-base line-clamp-1 mb-1">
          {name}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span className="text-sm font-semibold text-card-foreground">{rating.toFixed(1)}/5</span>
          {reviews > 0 && (
            <span className="text-xs text-muted-foreground">({reviews})</span>
          )}
        </div>

        {/* Amenities */}
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

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-3 border-t border-border">
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">₹{originalPrice.toLocaleString()}/-</span>
          )}
          <span className="text-xl font-heading font-bold text-primary">₹{price.toLocaleString()}/-</span>
          <span className="text-xs text-muted-foreground">Monthly Rent</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
