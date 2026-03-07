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
    Loader2
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
    const [error, setError] = useState(null);

    // Memoize cache key
    const cacheKey = useMemo(() => `similar_${propertyId}`, [propertyId]);

    useEffect(() => {
        fetchSimilarProperties();
    }, [propertyId, cacheKey]);

    const fetchSimilarProperties = async () => {
        // Check cache first
        const cached = similarPropertiesCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            setSimilarProperties(cached.data);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

            const response = await fetch(`${API_URL}/api/properties/${propertyId}/similar/`, {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                
                // Cache the result
                similarPropertiesCache.set(cacheKey, {
                    data,
                    timestamp: Date.now()
                });
                
                setSimilarProperties(data);
            } else {
                throw new Error('Failed to load similar properties');
            }
        } catch (err) {
            console.error('Error fetching similar properties:', err);
            setError(err.name === 'AbortError' ? 'Request timeout' : 'Failed to load similar properties');
        } finally {
            setLoading(false);
        }
    };

    const getAmenityIcon = (amenity) => {
        const icons = {
            'wifi': <Wifi className="w-4 h-4" />,
            'parking': <Car className="w-4 h-4" />,
            'gym': <Dumbbell className="w-4 h-4" />,
        };
        return icons[amenity.toLowerCase()] || <Home className="w-4 h-4" />;
    };

    if (loading) {
        return (
            <div className="mt-16">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Similar Properties</h2>
                <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <p className="text-slate-500 font-medium">Finding similar properties...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-16">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Similar Properties</h2>
                <div className="text-center py-12">
                    <p className="text-slate-500">{error}</p>
                    <Button 
                        onClick={fetchSimilarProperties} 
                        className="mt-4"
                        variant="outline"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    if (similarProperties.length === 0) {
        return (
            <div className="mt-16">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Similar Properties</h2>
                <div className="text-center py-12">
                    <p className="text-slate-500">No similar properties found at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Similar Properties</h2>
                    <p className="text-slate-500">Based on price range and preferences</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {similarProperties.map((property, index) => (
                        <motion.div
                            key={property.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link to={`/hostel/${property.id}`}>
                                <Card className="group hover:shadow-xl transition-all duration-300 border-slate-100 overflow-hidden">
                                    {/* Property Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={property.main_image || '/placeholder-property.jpg'}
                                            alt={property.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-blue-600 text-white px-3 py-1 text-xs font-bold">
                                                {property.type}
                                            </Badge>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <Badge className="bg-white/90 text-slate-800 px-3 py-1 text-xs font-bold">
                                                {property.gender}
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardContent className="p-4">
                                        {/* Property Name and Rating */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-1">
                                                    {property.name}
                                                </h3>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-sm font-semibold text-slate-700">
                                                        {property.rating || '4.5'}
                                                    </span>
                                                    <span className="text-sm text-slate-500">
                                                        ({property.reviews_count || 0} reviews)
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    ₹{property.price?.toLocaleString('en-IN')}
                                                </div>
                                                <div className="text-xs text-slate-500">per month</div>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-center gap-2 text-slate-600 mb-3">
                                            <MapPin className="w-4 h-4" />
                                            <span className="text-sm line-clamp-1">
                                                {property.location}, {property.city}
                                            </span>
                                        </div>

                                        {/* Key Features */}
                                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                <span>{property.occupancy || '2'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BedDouble className="w-4 h-4" />
                                                <span>{property.beds || '1'} Bed</span>
                                            </div>
                                        </div>

                                        {/* Amenities */}
                                        {property.amenities && property.amenities.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {property.amenities.slice(0, 3).map((amenity, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full text-xs text-slate-600"
                                                    >
                                                        {getAmenityIcon(amenity)}
                                                        <span>{amenity}</span>
                                                    </div>
                                                ))}
                                                {property.amenities.length > 3 && (
                                                    <span className="text-xs text-slate-500">
                                                        +{property.amenities.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* View Button */}
                                        <Button className="w-full group-hover:bg-blue-700 transition-colors">
                                            View Details
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* View More Button */}
                <div className="text-center mt-8">
                    <Button 
                        variant="outline" 
                        className="px-8"
                        onClick={() => window.location.href = '/'}
                    >
                        View All Properties
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default SimilarProperties;
