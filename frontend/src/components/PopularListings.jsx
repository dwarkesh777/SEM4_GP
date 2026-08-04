import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, MapPin, Sparkles, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/api";
import { useState } from "react";
import ShowAllProperties from "./ShowAllProperties";
import ImageGallery from "./ImageGallery";
import HorizontalFilterBar from "./HorizontalFilterBar";

const fetchProperties = async (searchQuery = "", lat = null, lng = null, filters = {}, limit = null) => {
    let url = `${API_URL}/api/public/properties/list/?appid=nestnode-readonly-key-2026&`;
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
    const data = await res.json();
    
    let propertiesList = data.results || data;
    if (Array.isArray(propertiesList)) {
        propertiesList = propertiesList.filter(p => {
            const type = p.type?.toLowerCase();
            return type === 'hostel' || type === 'pg';
        });
    }
    return propertiesList;
};

const PopularListings = ({ searchQuery = "", collegeCoords = null, filters = {}, showAll, setShowAll, onResetCity, onFilterChange, onClearAll }) => {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    
    const { data: properties, isLoading, error, refetch } = useQuery({
        queryKey: ["properties", searchQuery, collegeCoords, filters, showAll],
        queryFn: () => fetchProperties(
            searchQuery,
            collegeCoords?.lat,
            collegeCoords?.lng,
            filters,
            showAll ? null : 8 // Show only 8 properties initially, all when showAll is true
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
            <p className="text-slate-500 mb-4">We couldn't load the listings. Please try again later.</p>
            <Button onClick={() => refetch()} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" /> Try Again
            </Button>
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

    const hasNoProperties = !properties || properties.length === 0;

    return (
        <section id="listings" className="relative py-8 bg-transparent overflow-visible z-20">

            <div className="w-full relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Top Picks
                        </div>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 leading-tight">
                            {searchQuery ? (
                                <>Accommodations in <span className="text-primary italic">{searchQuery}</span></>
                            ) : (
                                <>Explore <span className="text-primary italic">Popular</span> Living Spaces</>
                            )}
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
                            onClick={() => setIsGalleryOpen(true)}
                            variant="outline" 
                            className="rounded-full px-6 py-6 border-slate-200 hover:border-primary hover:bg-primary/5 text-slate-700 font-bold text-sm shadow-sm transition-all gap-2"
                        >
                            Explore Gallery
                            <ArrowRight className="w-4 h-4 text-primary" />
                        </Button>
                    </motion.div>
                </div>

                {/* Horizontal Filter Bar right after title */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative z-40"
                >
                    <HorizontalFilterBar
                        filters={filters}
                        onFilterChange={onFilterChange}
                        onClearAll={onClearAll}
                    />
                </motion.div>

                {/* City Filter Badge */}
                {searchQuery && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex items-center justify-between p-4 rounded-2xl bg-blue-50 border border-blue-100 text-blue-900"
                    >
                        <div className="flex items-center gap-2 text-sm font-extrabold">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            Showing results for: <span className="text-blue-700 font-black underline">{searchQuery}</span>
                        </div>
                        {onResetCity && (
                            <button
                                onClick={onResetCity}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors shadow-sm"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Clear Filter
                            </button>
                        )}
                    </motion.div>
                )}

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
                                Found <span className="text-indigo-600 font-bold">{properties?.length || 0}</span> hostels & PGs within 30km radius {showAll ? "" : "(showing top 8)"}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Empty State when 0 properties match city search */}
                {hasNoProperties ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="py-16 px-6 text-center bg-slate-50/90 rounded-[2.5rem] border border-slate-200/90 shadow-sm max-w-2xl mx-auto my-8"
                    >
                        <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Building2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
                            Sorry, no PG and hostel found in {searchQuery || "this city"}
                        </h3>
                        <p className="text-slate-500 font-medium text-base mb-8 max-w-md mx-auto leading-relaxed">
                            We haven't launched verified accommodations in <span className="font-bold text-slate-800">{searchQuery || "this city"}</span> yet. Explore available listings in major hubs like Pune, Ahmedabad, Mumbai, or Delhi!
                        </p>
                        {onResetCity && (
                            <Button
                                onClick={onResetCity}
                                className="h-12 px-8 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                            >
                                View All Available Cities
                            </Button>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
                    >
                        {properties?.map((property, index) => (
                            <motion.div key={property.id} variants={itemVariants}>
                                <PropertyCard {...property} index={index} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {!hasNoProperties && (
                    <ShowAllProperties 
                        showAll={showAll} 
                        onShowAll={setShowAll ? () => setShowAll(true) : undefined}
                        propertiesCount={properties?.length || 0}
                        onBackToHome={setShowAll ? () => {
                            setShowAll(false);
                            setTimeout(() => {
                                const el = document.getElementById('listings');
                                if (el) {
                                    const y = el.getBoundingClientRect().top + window.scrollY - 100;
                                    window.scrollTo({ top: y, behavior: 'smooth' });
                                }
                            }, 50);
                        } : undefined}
                    />
                )}
            </div>
            
            <ImageGallery 
                isOpen={isGalleryOpen} 
                onClose={() => setIsGalleryOpen(false)} 
            />
        </section>
    );
};

export default PopularListings;
