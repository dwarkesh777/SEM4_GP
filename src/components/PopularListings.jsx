import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/api";
import { useState } from "react";
import ShowAllProperties from "./ShowAllProperties";
import ImageGallery from "./ImageGallery";

const fetchProperties = async (searchQuery = "", lat = null, lng = null, filters = {}, limit = null) => {
    let url = `${API_URL}/api/properties/?`;
    if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
    if (lat && lng) url += `lat=${lat}&lng=${lng}&`;
    
    // Default to rating_desc ordering for top properties
    if (!filters.ordering && (!lat || !lng)) {
        url += `ordering=rating_desc&`;
    }
    
    // Add limit parameter if specified
    if (limit) {
        url += `limit=${limit}&`;
    }

    // Add advanced filters
    if (filters.gender?.length > 0) {
        filters.gender.forEach(g => url += `gender=${g}&`);
    }
    if (filters.type?.length > 0) {
        filters.type.forEach(t => url += `type=${t}&`);
    }
    if (filters.amenities?.length > 0) {
        filters.amenities.forEach(a => url += `amenities=${a}&`);
    }
    if (filters.ordering) {
        url += `ordering=${filters.ordering}&`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
};

const PopularListings = ({ searchQuery = "", collegeCoords = null, filters = {}, showAll, setShowAll }) => {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    
    const { data: properties, isLoading, error, refetch } = useQuery({
        queryKey: ["properties", searchQuery, collegeCoords, filters, showAll],
        queryFn: () => fetchProperties(
            searchQuery,
            collegeCoords?.lat,
            collegeCoords?.lng,
            filters,
            showAll ? null : 6 // Show only 6 properties initially, all when showAll is true
        ),
    });

    if (isLoading) return (
        <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">Finding the best homes for you...</p>
        </div>
    );

    if (error) return (
        <div className="py-24 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive mb-4">
                <ArrowRight className="w-8 h-8 rotate-45" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-slate-500">We couldn't load the listings. Please try again later.</p>
        </div>
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <section id="listings" className="relative py-8 bg-transparent overflow-hidden">

            <div className="container relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Top Picks
                        </div>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 leading-tight">
                            Explore <span className="text-primary italic">Popular</span> Living Spaces
                        </h2>
                        <p className="mt-4 text-lg text-slate-500 font-medium">
                            Highly rated properties curated specifically for your comfort and needs.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Button 
                            variant="outline" 
                            className="h-14 px-8 rounded-2xl font-bold border-slate-200 hover:border-primary hover:text-primary transition-all group"
                            onClick={() => setIsGalleryOpen(true)}
                        >
                            Explore Gallery
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>
                </div>

                {/* College Search Summary */}
                {collegeCoords && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 p-6 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col md:flex-row items-center gap-6"
                    >
                        <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                            <Building2 className="w-7 h-7" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-bold text-slate-900 mb-1">{collegeCoords.name}</h3>
                            <p className="text-slate-600 font-medium">
                                Found <span className="text-indigo-600 font-bold">{properties?.length || 0}</span> hostels & PGs within 30km radius {showAll ? "" : "(showing top 6)"}
                            </p>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className={`grid gap-8 ${
                        showAll 
                            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    }`}
                >
                    {properties?.map((property, index) => (
                        <motion.div key={property.id} variants={itemVariants}>
                            <PropertyCard {...property} index={index} />
                        </motion.div>
                    ))}
                </motion.div>

                <ShowAllProperties 
                    showAll={showAll} 
                    onShowAll={setShowAll ? () => setShowAll(true) : undefined}
                    propertiesCount={properties?.length || 0}
                    onBackToHome={setShowAll ? () => setShowAll(false) : undefined}
                />
            </div>
            
            <ImageGallery 
                isOpen={isGalleryOpen} 
                onClose={() => setIsGalleryOpen(false)} 
            />
        </section>
    );
};

export default PopularListings;
