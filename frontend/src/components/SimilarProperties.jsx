import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { API_URL } from '@/lib/api';
import {
    BedDouble,
    MapPin,
    Star,
    Users,
    Home,
    Wifi,
    Car,
    Dumbbell,
    Loader2,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Simple cache for similar properties
const similarPropertiesCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const SimilarProperties = ({ propertyId, currentPropertyType, currentPropertyGender }) => {
    const [similarProperties, setSimilarProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const cacheKey = useMemo(() => `similar_${propertyId}`, [propertyId]);

    useEffect(() => {
        if (!propertyId) return;
        fetchSimilarProperties();
    }, [propertyId, cacheKey]);

    const fetchSimilarProperties = async () => {
        // Check cache first
        const cached = similarPropertiesCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION && cached.data?.length > 0) {
            setSimilarProperties(cached.data);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // 1. Try dedicated similar endpoint
            let list = [];
            try {
                const res = await fetch(`${API_URL}/api/properties/${propertyId}/similar/`);
                if (res.ok) {
                    const data = await res.json();
                    list = Array.isArray(data) ? data : (data?.results || data?.properties || []);
                }
            } catch (e) {
                console.warn("Primary similar endpoint failed, using fallback:", e);
            }

            // 2. If list is empty, fetch public properties list with API key
            if (!list || list.length === 0) {
                try {
                    const pubRes = await fetch(`${API_URL}/api/public/properties/list/?appid=nestnode-readonly-key-2026`);
                    if (pubRes.ok) {
                        const pubData = await pubRes.json();
                        list = Array.isArray(pubData) ? pubData : (pubData?.results || pubData?.properties || []);
                    }
                } catch (e) {
                    console.warn("Public properties fallback failed:", e);
                }
            }

            // 3. If still empty, try general properties endpoint
            if (!list || list.length === 0) {
                try {
                    const genRes = await fetch(`${API_URL}/api/properties/`);
                    if (genRes.ok) {
                        const genData = await genRes.json();
                        list = Array.isArray(genData) ? genData : (genData?.results || genData?.properties || []);
                    }
                } catch (e) {
                    console.warn("General properties endpoint failed:", e);
                }
            }

            // Filter out current property
            let filtered = (list || []).filter(p => String(p.id) !== String(propertyId));

            // Sort by relevance (matching type and gender first)
            filtered.sort((a, b) => {
                let scoreA = 0;
                let scoreB = 0;
                if (currentPropertyType && a.type?.toLowerCase() === currentPropertyType?.toLowerCase()) scoreA += 3;
                if (currentPropertyType && b.type?.toLowerCase() === currentPropertyType?.toLowerCase()) scoreB += 3;
                if (currentPropertyGender && a.gender?.toLowerCase() === currentPropertyGender?.toLowerCase()) scoreA += 2;
                if (currentPropertyGender && b.gender?.toLowerCase() === currentPropertyGender?.toLowerCase()) scoreB += 2;
                return scoreB - scoreA;
            });

            const finalResults = filtered.slice(0, 6);

            if (finalResults.length > 0) {
                similarPropertiesCache.set(cacheKey, {
                    data: finalResults,
                    timestamp: Date.now()
                });
            }

            setSimilarProperties(finalResults);
        } catch (err) {
            console.error('Error fetching similar properties:', err);
            setSimilarProperties([]);
        } finally {
            setLoading(false);
        }
    };

    const getAmenityIcon = (amenity) => {
        const name = (typeof amenity === 'string' ? amenity : amenity?.name || '').toLowerCase();
        if (name.includes('wifi')) return <Wifi className="w-3.5 h-3.5" />;
        if (name.includes('parking')) return <Car className="w-3.5 h-3.5" />;
        if (name.includes('gym')) return <Dumbbell className="w-3.5 h-3.5" />;
        return <Home className="w-3.5 h-3.5" />;
    };

    if (loading) {
        return (
            <div className="mt-16 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-black text-slate-900 font-heading tracking-tight">Similar Properties</h2>
                </div>
                <div className="flex items-center justify-center py-16 bg-slate-50/50 rounded-3xl border border-slate-100">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-slate-500 font-medium text-sm">Finding best matching properties for you...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!similarProperties || similarProperties.length === 0) {
        return null;
    }

    return (
        <div className="mt-16 pt-8 border-t border-slate-100">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
                                Similar Properties
                            </h2>
                        </div>
                        <p className="text-slate-500 text-sm font-medium mt-1">
                            Recommended hostels & PGs based on price and preferences
                        </p>
                    </div>

                    <Link to="/#listings">
                        <Button variant="ghost" className="font-bold text-primary hover:text-primary hover:bg-primary/10 gap-1 text-sm rounded-full">
                            <span>Browse All</span>
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {similarProperties.map((property, index) => {
                        const imageSrc = property.main_image || property.images?.[0]?.image || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800";
                        const price = property.price || 0;
                        const rating = property.rating && Number(property.rating) > 0 ? Number(property.rating).toFixed(1) : "4.8";
                        const reviews = Number(property.reviews_count ?? property.reviews ?? (property.reviews_list ? property.reviews_list.length : 0)) || 0;

                        return (
                            <motion.div
                                key={property.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                            >
                                <Link to={`/hostel/${property.id}`} className="block h-full">
                                    <Card className="group h-full flex flex-col justify-between hover:shadow-2xl transition-all duration-300 border-slate-200/80 rounded-3xl overflow-hidden bg-white hover:-translate-y-1">
                                        <div>
                                            {/* Property Image & Badges */}
                                            <div className="relative h-52 overflow-hidden bg-slate-100">
                                                <img
                                                    src={imageSrc}
                                                    alt={property.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                                    <Badge className="bg-primary text-white px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                                                        {property.type || "PG"}
                                                    </Badge>
                                                    <Badge className="bg-black/75 backdrop-blur-md text-white border border-white/20 px-2 py-0.5 text-[11px] font-bold rounded-lg">
                                                        {property.gender || "Boys"}
                                                    </Badge>
                                                </div>

                                                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg shadow-sm text-xs font-black text-amber-500">
                                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                    <span className="text-slate-900">{rating}</span>
                                                    <span className="text-slate-500 font-normal text-[10px]">({reviews})</span>
                                                </div>
                                            </div>

                                            <CardContent className="p-5">
                                                {/* Property Name */}
                                                <h3 className="font-heading font-black text-slate-900 text-lg mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                                                    {property.name}
                                                </h3>

                                                {/* Location */}
                                                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-3">
                                                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                                                    <span className="truncate">{property.location || property.city || "Ahmedabad"}</span>
                                                </div>

                                                {/* Amenities Pills */}
                                                {property.amenities && property.amenities.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                                        {property.amenities.slice(0, 3).map((amenity, idx) => {
                                                            const name = typeof amenity === 'string' ? amenity : amenity?.name || '';
                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className="flex items-center gap-1 bg-slate-100/90 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-bold"
                                                                >
                                                                    {getAmenityIcon(amenity)}
                                                                    <span>{name}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </div>

                                        {/* Pricing & CTA */}
                                        <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-auto">
                                            <div>
                                                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Starting</span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-xl font-black text-slate-900 font-heading">
                                                        ₹{Number(price).toLocaleString('en-IN')}
                                                    </span>
                                                    <span className="text-xs text-slate-400 font-medium">/mo</span>
                                                </div>
                                            </div>

                                            <Button size="sm" className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 text-xs px-3.5 py-1.5 group-hover:translate-x-0.5 transition-transform">
                                                <span>View Details</span>
                                                <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                            </Button>
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};

export default SimilarProperties;
