import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const fetchProperties = async () => {
    const res = await fetch("http://localhost:8000/api/properties/");
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
};

const PopularListings = () => {
    const { data: properties, isLoading, error } = useQuery({
        queryKey: ["properties"],
        queryFn: fetchProperties,
    });

    if (isLoading) return <div className="py-20 text-center">Loading properties...</div>;
    if (error) return <div className="py-20 text-center text-destructive">Error loading properties</div>;

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
                    {properties?.map((property, index) => (
                        <PropertyCard key={property.id} {...property} index={index} />
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
