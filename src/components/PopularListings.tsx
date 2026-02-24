import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import hostel1 from "@/assets/hostel-1.jpg";
import hostel2 from "@/assets/hostel-2.jpg";
import hostel3 from "@/assets/hostel-3.jpg";
import hostel4 from "@/assets/hostel-4.jpg";
import hostel5 from "@/assets/hostel-5.jpg";
import hostel6 from "@/assets/hostel-6.jpg";

const properties = [
  {
    image: hostel1,
    name: "Sunrise Boys Hostel",
    location: "Navrangpura, Ahmedabad",
    type: "Hostel" as const,
    gender: "Boys" as const,
    rating: 4.5,
    reviews: 12,
    price: 5000,
    originalPrice: 7000,
    amenities: ["WIFI", "FULLY FURNISHED", "HOT WATER", "SECURITY"],
  },
  {
    image: hostel2,
    name: "Green Valley PG",
    location: "Memnagar, Ahmedabad",
    type: "PG" as const,
    gender: "Boys" as const,
    rating: 4.0,
    reviews: 8,
    price: 7000,
    originalPrice: 9000,
    amenities: ["WIFI", "FULLY FURNISHED"],
  },
  {
    image: hostel3,
    name: "NestHub Co-Living",
    location: "Makarba, Ahmedabad",
    type: "Hostel" as const,
    gender: "Co-ed" as const,
    rating: 4.8,
    reviews: 24,
    price: 12000,
    originalPrice: 16500,
    amenities: ["WIFI", "FULLY FURNISHED", "HOT WATER"],
  },
  {
    image: hostel4,
    name: "Sakhi Girls Hostel",
    location: "Satellite, Ahmedabad",
    type: "Hostel" as const,
    gender: "Girls" as const,
    rating: 4.5,
    reviews: 15,
    price: 6000,
    amenities: ["FULLY FURNISHED", "HOT WATER", "SECURITY"],
  },
  {
    image: hostel5,
    name: "Budget Stay Hostel",
    location: "Nikol, Ahmedabad",
    type: "Hostel" as const,
    gender: "Boys" as const,
    rating: 3.8,
    reviews: 6,
    price: 3500,
    originalPrice: 5000,
    amenities: ["WIFI", "FULLY FURNISHED"],
  },
  {
    image: hostel6,
    name: "Royal Comfort PG",
    location: "Prahlad Nagar, Ahmedabad",
    type: "PG" as const,
    gender: "Co-ed" as const,
    rating: 4.7,
    reviews: 19,
    price: 15000,
    originalPrice: 18000,
    amenities: ["WIFI", "FULLY FURNISHED", "HOT WATER", "SECURITY"],
  },
];

const PopularListings = () => {
  return (
    <section id="listings" className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
            Popular Hostels & PGs
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <PropertyCard key={property.name} {...property} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <Button size="lg" className="gap-2 rounded-full px-8">
            Show All PG/Hostels
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularListings;
