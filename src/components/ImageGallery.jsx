import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MapPin, Calendar, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/lib/api';

const fetchReviewImages = async () => {
    console.log('Fetching review images from:', `${API_URL}/api/review-images/`);
    const response = await fetch(`${API_URL}/api/review-images/`);
    if (!response.ok) {
        console.error('Failed to fetch review images:', response.status, response.statusText);
        throw new Error('Failed to fetch review images');
    }
    const data = await response.json();
    console.log('Review images data:', data);
    return data;
};

const ImageGallery = ({ isOpen, onClose }) => {
    const [hoveredImage, setHoveredImage] = useState(null);
    
    console.log('API_URL being used:', API_URL);
    
    const { data: imagesData, isLoading, error } = useQuery({
        queryKey: ['review-images'],
        queryFn: fetchReviewImages,
        enabled: isOpen,
    });
    
    const images = imagesData?.data || [];
    console.log('Images array:', images);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full h-full max-w-7xl max-h-[90vh] bg-white rounded-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Review Gallery</h2>
                            <p className="text-slate-600 mt-1">Real photos shared by our verified users</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-6 h-6 text-slate-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-slate-600">Failed to load images. Please try again.</p>
                            </div>
                        ) : images.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-slate-600">No review images available yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {images.map((image, index) => (
                                    <motion.div
                                        key={image.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative group cursor-pointer"
                                        onMouseEnter={() => setHoveredImage(image.id)}
                                        onMouseLeave={() => setHoveredImage(null)}
                                    >
                                        {/* Image Container */}
                                        <div className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                                            <img
                                                src={image.image}
                                                alt={`${image.property_name} - Review by ${image.reviewer_name}`}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Hover Overlay */}
                                        <AnimatePresence>
                                            {hoveredImage === image.id && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-xl p-4 flex flex-col justify-end"
                                                >
                                                    {/* Property Name */}
                                                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">
                                                        {image.property_name}
                                                    </h3>

                                                    {/* Rating */}
                                                    <div className="flex items-center gap-1 mb-2">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-white font-semibold">{image.rating}</span>
                                                        <span className="text-white/80 text-sm">({image.reviewer_name})</span>
                                                    </div>

                                                    {/* Review Comment */}
                                                    <p className="text-white/90 text-sm line-clamp-3">
                                                        {image.comment}
                                                    </p>

                                                    {/* Date */}
                                                    <div className="flex items-center gap-1 mt-2 text-white/70 text-xs">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{image.date}</span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Quick Info Badge (always visible) */}
                                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                <span className="text-white text-xs font-semibold">{image.rating}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {images.length > 0 && (
                        <div className="p-4 border-t border-slate-200 bg-slate-50">
                            <p className="text-center text-slate-600 text-sm">
                                Showing {images.length} review images • Hover over images for details
                            </p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ImageGallery;
