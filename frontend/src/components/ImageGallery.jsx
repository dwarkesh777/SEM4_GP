import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MapPin, Calendar, User, Sparkles, RefreshCw, MessageSquareQuote } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const fetchReviewImages = async () => {
    try {
        const response = await fetch(`${API_URL}/api/reviews/`);
        if (!response.ok) {
            return [];
        }
        const data = await response.json();
        
        // Filter reviews that have images
        const reviewsWithImages = Array.isArray(data) ? data.filter(review => {
            const hasImage = review.image || review.image_url || review.uploaded_image || review.review_image || review.photo;
            return Boolean(hasImage);
        }) : [];
        
        return reviewsWithImages;
    } catch (error) {
        console.error('Error fetching review images:', error);
        return [];
    }
};

const ImageGallery = ({ isOpen, onClose }) => {
    const [hoveredImage, setHoveredImage] = useState(null);
    
    // Close on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const { data: imagesData, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['reviews'],
        queryFn: fetchReviewImages,
        enabled: isOpen,
        retry: 2,
        retryDelay: 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });
    
    const images = Array.isArray(imagesData) ? imagesData : [];

    // Helper function to find image URL from review object
    const getImageUrl = (review) => {
        const imageFields = ['image', 'image_url', 'uploaded_image', 'review_image', 'photo', 'photo_url'];
        
        for (const field of imageFields) {
            if (review[field] && typeof review[field] === 'string') {
                return review[field].startsWith('http') ? review[field] : `${API_URL}${review[field]}`;
            }
        }
        
        for (const [key, value] of Object.entries(review)) {
            if (typeof value === 'string' && (value.includes('http') || value.includes('/media/'))) {
                return value.startsWith('http') ? value : `${API_URL}${value}`;
            }
        }
        
        return null;
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-5 md:p-8"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 15 }}
                    transition={{ type: "spring", damping: 26, stiffness: 320 }}
                    className="relative w-full max-w-6xl max-h-[88vh] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-slate-200/80"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 bg-white/95 backdrop-blur-md sticky top-0 z-20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
                                        Review Gallery
                                    </h2>
                                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5">
                                        Verified Photos
                                    </Badge>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                                    Real photos shared by our verified student residents
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all shadow-sm active:scale-95 border border-slate-200/50"
                            aria-label="Close Gallery"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Modal Content / Photo Grid */}
                    <div className="flex-1 overflow-y-auto p-5 sm:p-6 md:p-8 bg-slate-50/50">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-72 gap-3">
                                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                <p className="text-slate-500 text-sm font-medium">Loading verified review photos...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-16 bg-white rounded-3xl border border-red-100 p-8">
                                <p className="text-slate-800 font-bold mb-2">Unable to load gallery photos.</p>
                                <p className="text-slate-500 text-xs mb-4">Please verify connection or retry.</p>
                                <Button 
                                    onClick={() => refetch()}
                                    className="rounded-xl font-bold bg-primary text-white text-xs px-5 py-2"
                                >
                                    Retry Loading
                                </Button>
                            </div>
                        ) : images.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 max-w-md mx-auto">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-3">
                                    <MessageSquareQuote className="w-7 h-7" />
                                </div>
                                <p className="text-slate-800 font-bold text-base">No review photos available yet</p>
                                <p className="text-slate-500 text-xs mt-1">Be the first student to post photos of your hostel room!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                {images.map((image, index) => {
                                    const imageUrl = getImageUrl(image);
                                    if (!imageUrl) return null;
                                    
                                    const rating = image.rating ? Number(image.rating).toFixed(1) : "5.0";
                                    const reviewer = image.name || image.user_name || image.reviewer_name || "Verified Student";
                                    const propertyName = image.property_name || image.property || "Hostel Living";

                                    return (
                                        <motion.div
                                            key={image.id || index}
                                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            transition={{ duration: 0.35, delay: index * 0.04 }}
                                            className="relative group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200/70 flex flex-col"
                                            onMouseEnter={() => setHoveredImage(image.id || index)}
                                            onMouseLeave={() => setHoveredImage(null)}
                                        >
                                            {/* Photo Container */}
                                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                                <img
                                                    src={imageUrl}
                                                    alt={`${propertyName} - ${reviewer}`}
                                                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        const parent = e.target.parentElement;
                                                        if (parent) {
                                                            parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-400 text-xs font-semibold p-4">Image preview unavailable</div>';
                                                        }
                                                    }}
                                                />

                                                {/* Top Star Rating Badge */}
                                                <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/20 shadow-sm flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                    <span className="text-white text-xs font-black">{rating}</span>
                                                </div>

                                                {/* Floating Property Name Badge */}
                                                <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-lg shadow-sm border border-slate-200/60 max-w-[85%]">
                                                    <p className="text-[11px] font-black text-slate-900 truncate">
                                                        {propertyName}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Review details */}
                                            <div className="p-3.5 bg-white flex-1 flex flex-col justify-between">
                                                {image.comment ? (
                                                    <p className="text-xs font-medium text-slate-700 line-clamp-2 italic mb-2">
                                                        "{image.comment}"
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-slate-400 italic mb-2">
                                                        Verified student stay photo
                                                    </p>
                                                )}

                                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                                                    <span className="font-bold text-slate-800 truncate max-w-[130px]">
                                                        {reviewer}
                                                    </span>
                                                    <span>
                                                        {image.created_at ? new Date(image.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Verified'}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Modal Footer */}
                    {images.length > 0 && (
                        <div className="px-6 py-3.5 border-t border-slate-100 bg-white flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-600">
                                Showing <span className="text-primary font-black">{images.length}</span> verified review photos
                            </p>

                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => refetch()}
                                disabled={isFetching}
                                className="rounded-xl font-bold text-xs gap-1.5 h-8 px-3.5 border-slate-200 hover:bg-slate-50"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                                <span>{isFetching ? 'Refreshing...' : 'Refresh'}</span>
                            </Button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ImageGallery;
