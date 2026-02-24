import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, MapPin, Star, Phone, Mail, Wifi, Sofa, Droplets, Shield,
    Car, Tv, Wind, ChevronLeft, ChevronRight, Users, Check, X as XIcon,
    Shirt, Sparkles, BedDouble,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const amenityDetails = {
    WIFI: { icon: <Wifi className="w-5 h-5" />, label: "Wi-Fi" },
    "FULLY FURNISHED": { icon: <Sofa className="w-5 h-5" />, label: "Fully Furnished" },
    "HOT WATER": { icon: <Droplets className="w-5 h-5" />, label: "Hot Water" },
    SECURITY: { icon: <Shield className="w-5 h-5" />, label: "24/7 Security" },
    LAUNDRY: { icon: <Shirt className="w-5 h-5" />, label: "Laundry" },
    PARKING: { icon: <Car className="w-5 h-5" />, label: "Parking" },
    AC: { icon: <Wind className="w-5 h-5" />, label: "Air Conditioning" },
    TV: { icon: <Tv className="w-5 h-5" />, label: "Television" },
    "HOUSE KEEPING": { icon: <Sparkles className="w-5 h-5" />, label: "House Keeping" },
    "MATTRESS": { icon: <BedDouble className="w-5 h-5" />, label: "Mattress" },
};

const fetchProperty = async (id) => {
    const res = await fetch(`http://localhost:8000/api/properties/${id}/`);
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
};

const HostelDetail = () => {
    const { id } = useParams();
    const { data: property, isLoading, error } = useQuery({
        queryKey: ["property", id],
        queryFn: () => fetchProperty(id),
        enabled: !!id,
    });
    const [currentImage, setCurrentImage] = useState(0);
    const { toast } = useToast();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Loading details...</p>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
                <h1 className="text-2xl font-heading font-bold text-foreground">Property Not Found</h1>
                <Link to="/">
                    <Button variant="default" className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Button>
                </Link>
            </div>
        );
    }

    const genderColor = property.gender === "Boys" ? "bg-blue-500" : property.gender === "Girls" ? "bg-pink-500" : "bg-accent";

    const nextImage = () => setCurrentImage((p) => (p + 1) % property.images.length);
    const prevImage = () => setCurrentImage((p) => (p - 1 + property.images.length) % property.images.length);

    const handleBooking = (e) => {
        e.preventDefault();
        toast({ title: "Booking Request Sent!", description: "We'll get back to you within 24 hours." });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-20 pb-16">
                <div className="container">
                    {/* Back button */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
                        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to listings
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Image Gallery */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="relative rounded-2xl overflow-hidden bg-card"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={currentImage}
                                            src={property.images[currentImage]}
                                            alt={`${property.name} - Image ${currentImage + 1}`}
                                            className="w-full h-full object-cover"
                                            initial={{ opacity: 0, scale: 1.05 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </AnimatePresence>

                                    {/* Navigation */}
                                    <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center text-card-foreground hover:bg-card transition-colors">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center text-card-foreground hover:bg-card transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>

                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <Badge className="bg-primary text-primary-foreground font-semibold">{property.type.toUpperCase()}</Badge>
                                        <Badge className={`${genderColor} text-primary-foreground`}>{property.gender}</Badge>
                                    </div>

                                    {/* Dots */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        {property.images?.map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentImage(i)}
                                                className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentImage ? "bg-primary-foreground w-6" : "bg-primary-foreground/50"}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Thumbnails */}
                                <div className="flex gap-2 p-3">
                                    {property.images?.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentImage(i)}
                                            className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === currentImage ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Title & Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">{property.name}</h1>
                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span className="text-sm">{property.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-accent text-accent" />
                                        <span className="text-sm font-semibold">{property.rating?.toFixed(1) || "0.0"}/5</span>
                                        <span className="text-xs text-muted-foreground">({property.reviews || 0} reviews)</span>
                                    </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                            </motion.div>

                            {/* Video Section */}
                            {property.video_url && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.15 }}
                                >
                                    <h2 className="text-xl font-heading font-bold text-foreground mb-4">Property Video Tour</h2>
                                    <div className="relative rounded-2xl overflow-hidden bg-card aspect-video border border-border shadow-sm">
                                        <video
                                            controls
                                            className="w-full h-full object-cover"
                                            poster={property.images?.[0] || ""}
                                        >
                                            <source src={property.video_url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </motion.div>
                            )}

                            {/* Amenities */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <h2 className="text-xl font-heading font-bold text-foreground mb-4">Amenities</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {property.amenities?.map((amenity) => {
                                        const detail = amenityDetails[amenity];
                                        return (
                                            <div key={amenity} className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
                                                <div className="text-primary">{detail?.icon}</div>
                                                <span className="text-sm font-medium text-secondary-foreground">{detail?.label || amenity}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            {/* Room Types */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <h2 className="text-xl font-heading font-bold text-foreground mb-4">Room Types</h2>
                                <div className="space-y-3">
                                    {property.rooms?.map((room) => (
                                        <div key={room.name} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border card-elevated">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <Users className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-card-foreground">{room.name}</p>
                                                    <p className="text-xs text-muted-foreground">{room.occupancy}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-lg font-heading font-bold text-primary">₹{room.price?.toLocaleString() || "0"}</p>
                                                    <p className="text-xs text-muted-foreground">/month</p>
                                                </div>
                                                {room.available ? (
                                                    <Badge className="bg-green-100 text-green-700 gap-1"><Check className="w-3 h-3" />Available</Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="gap-1 text-destructive"><XIcon className="w-3 h-3" />Full</Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Reviews */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <h2 className="text-xl font-heading font-bold text-foreground mb-4">
                                    Reviews ({property.reviewsList?.length || 0})
                                </h2>
                                <div className="space-y-4">
                                    {property.reviewsList?.map((review, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-4 rounded-xl bg-card border border-border"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-sm">
                                                        {review.name?.[0] || "?"}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm text-card-foreground">{review.name}</p>
                                                        <p className="text-xs text-muted-foreground">{review.date ? new Date(review.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Date unknown"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-0.5">
                                                    {Array.from({ length: 5 }).map((_, s) => (
                                                        <Star key={s} className={`w-3.5 h-3.5 ${s < review.rating ? "fill-accent text-accent" : "text-border"}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column - Booking Sidebar */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="sticky top-24 space-y-6"
                            >
                                {/* Price Card */}
                                <div className="bg-card rounded-2xl p-6 border border-border card-elevated">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        {property.originalPrice && (
                                            <span className="text-lg text-muted-foreground line-through">₹{property.originalPrice.toLocaleString()}</span>
                                        )}
                                        <span className="text-3xl font-heading font-bold text-primary">₹{property.price.toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-6">Monthly Rent Starting From</p>

                                    <form onSubmit={handleBooking} className="space-y-4">
                                        <div>
                                            <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                                            <Input id="name" placeholder="Your full name" required maxLength={100} className="mt-1" />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                                            <Input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" required maxLength={15} className="mt-1" />
                                        </div>
                                        <div>
                                            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                            <Input id="email" type="email" placeholder="your@email.com" required maxLength={255} className="mt-1" />
                                        </div>
                                        <div>
                                            <Label htmlFor="message" className="text-sm font-medium">Message (Optional)</Label>
                                            <Textarea id="message" placeholder="Any specific requirements..." maxLength={500} rows={3} className="mt-1 resize-none" />
                                        </div>
                                        <Button type="submit" size="lg" className="w-full rounded-full font-semibold">
                                            Book Now
                                        </Button>
                                    </form>
                                </div>

                                {/* Contact Card */}
                                <div className="bg-card rounded-2xl p-6 border border-border">
                                    <h3 className="font-heading font-semibold text-card-foreground mb-4">Contact Info</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                            <span className="text-muted-foreground">{property.address}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-4 h-4 text-primary shrink-0" />
                                            <span className="text-muted-foreground">{property.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-4 h-4 text-primary shrink-0" />
                                            <span className="text-muted-foreground">{property.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HostelDetail;
