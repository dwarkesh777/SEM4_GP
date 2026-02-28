import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, ArrowRight, MapPin, Star, Phone, Mail, Wifi, Sofa, Droplets, Shield,
    Car, Tv, Wind, ChevronLeft, ChevronRight, Users, Check, X as XIcon,
    Shirt, Sparkles, BedDouble, Heart, Share2, Calendar, ShieldCheck,
    Coffee, Utensils, Zap, Lock, Info, Clock, ExternalLink, LayoutDashboard, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const API_URL = `http://${window.location.hostname}:8000`;

const amenityDetails = {
    wifi: { icon: <Wifi className="w-5 h-5" />, label: "Wi-Fi", category: "Essentials" },
    "fully furnished": { icon: <Sofa className="w-5 h-5" />, label: "Fully Furnished", category: "Basics" },
    hot_water: { icon: <Droplets className="w-5 h-5" />, label: "Hot Water", category: "Essentials" },
    security: { icon: <Shield className="w-5 h-5" />, label: "24/7 Security", category: "Safety" },
    laundry: { icon: <Shirt className="w-5 h-5" />, label: "Laundry", category: "Essentials" },
    parking: { icon: <Car className="w-5 h-5" />, label: "Parking", category: "Basics" },
    ac: { icon: <Wind className="w-5 h-5" />, label: "Air Conditioning", category: "Essentials" },
    tv: { icon: <Tv className="w-5 h-5" />, label: "Television", category: "Entertainment" },
    house_keeping: { icon: <Sparkles className="w-5 h-5" />, label: "House Keeping", category: "Essentials" },
    mattress: { icon: <BedDouble className="w-5 h-5" />, label: "Premium Mattress", category: "Basics" },
    drinking_water: { icon: <Droplets className="w-5 h-5" />, label: "Filtered Water", category: "Essentials" },
    meals: { icon: <Utensils className="w-5 h-5" />, label: "Daily Meals", category: "Essentials" },
};

const fetchProperty = async (id) => {
    const res = await fetch(`${API_URL}/api/properties/${id}/`);
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
    const scrollToBooking = () => {
        const element = document.getElementById("booking-sidebar");
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            // Add a subtle highlight effect to the sidebar
            element.classList.add("ring-4", "ring-primary/20");
            setTimeout(() => element.classList.remove("ring-4", "ring-primary/20"), 2000);
        }
    };




    const mapContainerStyle = {
        width: "100%",
        height: "400px",
        borderRadius: "2rem",
    };

    const mapOptions = {
        disableDefaultUI: false,
        zoomControl: true,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
            },
        ],
    };

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

    const nextImage = () => {
        if (property.images?.length > 0) {
            setCurrentImage((p) => (p + 1) % property.images.length);
        }
    };
    const prevImage = () => {
        if (property.images?.length > 0) {
            setCurrentImage((p) => (p - 1 + property.images.length) % property.images.length);
        }
    };

    const handleBooking = (e) => {
        e.preventDefault();
        toast({ title: "Booking Request Sent!", description: "We'll get back to you within 24 hours." });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar />

            {/* Premium Header / Progress Bar could go here */}

            <main className="pt-24 pb-20">
                <div className="container max-w-7xl">
                    {/* Navigation and Actions */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:text-primary hover:border-primary/30 transition-all shadow-sm active:scale-95"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Explorations
                            </Link>
                        </motion.div>

                        <div className="flex items-center gap-3">
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-3 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 transition-colors shadow-sm active:scale-95"
                            >
                                <Heart className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="p-3 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-primary transition-colors shadow-sm active:scale-95"
                            >
                                <Share2 className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* LEFT COLUMN: Main Content */}
                        <div className="lg:col-span-8 space-y-12">

                            {/* CINEMATIC GALLERY SECTION */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="group relative"
                            >
                                <div className="relative aspect-[16/10] sm:aspect-[21/9] lg:aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl bg-slate-200 ring-1 ring-black/5">
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={currentImage}
                                            src={property.images && property.images.length > 0 ? property.images[currentImage]?.image : property.main_image}
                                            alt={property.name}
                                            className="w-full h-full object-cover"
                                            initial={{ opacity: 0, scale: 1.1 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.6 }}
                                        />
                                    </AnimatePresence>

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                                    {/* Gallery Controls */}
                                    <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={prevImage} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all active:scale-90 shadow-xl">
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button onClick={nextImage} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all active:scale-90 shadow-xl">
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {/* Property Badges (Floating on image) */}
                                    <div className="absolute top-6 left-6 flex items-center gap-3">
                                        <Badge className="bg-primary hover:bg-primary px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-full shadow-lg border-none">
                                            {property.type}
                                        </Badge>
                                        <Badge className={`${genderColor} px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-full shadow-lg border-none`}>
                                            {property.gender}
                                        </Badge>
                                        {property.verified && (
                                            <Badge className="bg-green-500 px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-full shadow-lg border-none flex items-center gap-1.5">
                                                <ShieldCheck className="w-3.5 h-3.5" /> Verified
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Thumbnail Strip (Overlay) */}
                                    <div className="absolute bottom-6 left-6 right-6 hidden sm:flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                        {property.images?.map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentImage(i)}
                                                className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 ${i === currentImage ? "border-primary scale-110 shadow-xl" : "border-white/20 opacity-60 hover:opacity-100 hover:scale-105"}`}
                                            >
                                                <img src={img.image} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>

                                    {/* Status Dots (for mobile) */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:hidden">
                                        {property.images?.map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImage ? "bg-white w-8 shadow-glow" : "bg-white/40 w-1.5"}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* TITLE & QUICK INFO */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                <div className="flex flex-col gap-4">
                                    <h1 className="text-4xl md:text-5xl font-heading font-black text-slate-900 tracking-tight leading-none">
                                        {property.name}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex items-center gap-2 p-1.5 pr-4 bg-white rounded-full border border-slate-100 shadow-sm transition-all hover:bg-slate-50">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-600">{property.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 p-1.5 px-4 bg-amber-50 rounded-full border border-amber-100/50 shadow-sm">
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            <span className="text-sm font-black text-amber-700">{property.rating?.toFixed(1) || "0.0"}</span>
                                            <span className="mx-1 text-amber-300">|</span>
                                            <span className="text-sm font-bold text-amber-700/70">{property.reviews || 0} Professional Reviews</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                                        <Info className="w-12 h-12" />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                                        <ArrowRight className="w-3 h-3 text-primary" /> About Property
                                    </h3>
                                    <p className="text-lg text-slate-600 font-medium leading-relaxed relative z-10">
                                        {property.description}
                                    </p>
                                </div>
                            </motion.div>

                            {/* AMENITIES SECTION - REDESIGNED */}
                            <motion.section
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-heading font-black text-slate-900 tracking-tight">
                                        Lifestyle <span className="text-primary italic">Amenities</span>
                                    </h2>
                                    <Badge variant="outline" className="px-3 py-1 border-slate-200 text-slate-400 font-bold uppercase tracking-tighter">
                                        {property.amenities?.length}+ Included
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {property.amenities?.map((amenity, i) => {
                                        const detail = amenityDetails[amenity];
                                        return (
                                            <motion.div
                                                key={amenity}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.05 }}
                                                className="group p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-inner mb-4">
                                                    {detail?.icon || <Check className="w-6 h-6" />}
                                                </div>
                                                <p className="font-black text-slate-800 tracking-tight">{detail?.label || amenity}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                    {detail?.category || "Standard"}
                                                </p>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.section>

                            {/* ROOM TYPES SECTION */}
                            <motion.section
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-3xl font-heading font-black text-slate-900 mb-8 tracking-tight">
                                    Selection of <span className="text-primary italic">Spaces</span>
                                </h2>
                                <div className="space-y-4">
                                    {property.rooms?.map((room, i) => (
                                        <motion.div
                                            key={room.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="group relative overflow-hidden p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                        <Users className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-black text-slate-900 tracking-tight">{room.name}</h4>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                                                <BedDouble className="w-3.5 h-3.5" />
                                                                {room.beds} Beds
                                                            </div>
                                                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                                                <LayoutDashboard className="w-3.5 h-3.5" />
                                                                {room.occupancy}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between sm:justify-end gap-10">
                                                    <div className="text-right">
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-2xl font-black text-primary tracking-tighter">₹{room.price?.toLocaleString()}</span>
                                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/mo</span>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">All-Inclusive Rent</p>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row items-center gap-3 min-w-[120px]">
                                                        {room.available ? (
                                                            <>
                                                                <div className="w-full sm:w-auto px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase tracking-tighter flex items-center justify-center gap-2 border border-emerald-100 whitespace-nowrap">
                                                                    <Check className="w-3.5 h-3.5" /> Live Now
                                                                </div>
                                                                <Button
                                                                    onClick={scrollToBooking}
                                                                    className="w-full sm:w-auto h-10 px-6 rounded-xl bg-slate-900 hover:bg-primary text-white font-bold text-xs transition-all active:scale-95 shadow-lg shadow-slate-200 hover:shadow-primary/20"
                                                                >
                                                                    Book Now
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <div className="w-full px-4 py-2 rounded-full bg-red-50 text-red-600 font-black text-[10px] uppercase tracking-tighter flex items-center justify-center gap-2 border border-red-100 whitespace-nowrap">
                                                                <XIcon className="w-3.5 h-3.5" /> Sold Out
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Decoration */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 pointer-events-none" />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>

                            {/* LOCATION & MAP SECTION */}
                            <motion.section
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="space-y-8"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-heading font-black text-slate-900 tracking-tight">Location & <span className="text-primary italic">Surroundings</span></h2>
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm font-bold text-slate-600 text-sm">
                                        <MapPin className="w-4 h-4 text-primary" /> {property.city}, {property.location}
                                    </div>
                                </div>

                                <div className="p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl group relative">
                                    <div className="flex flex-wrap gap-4 items-center">
                                        <div className="flex-1 min-w-[200px] p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Full Address</p>
                                            <p className="text-sm font-bold text-slate-700 leading-tight">{property.address}</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="h-auto py-4 px-6 rounded-2xl border-slate-200 hover:border-primary hover:text-primary transition-all font-bold gap-2"
                                            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`, "_blank")}
                                        >
                                            <ExternalLink className="w-4 h-4" /> Get Directions
                                        </Button>
                                    </div>
                                </div>
                            </motion.section>

                            {/* REVIEWS SECTION - POLISHED */}
                            <motion.section
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="pb-10"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-heading font-black text-slate-900 tracking-tight">Verified <span className="text-primary italic">Reviews</span></h2>
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm font-bold text-slate-600">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        {property.rating?.toFixed(1)} <span className="text-slate-200">|</span> {property.reviews_list?.length || 0} Ratings
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {property.reviews_list?.map((review, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm relative overflow-hidden group"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg shadow-inner">
                                                        {review.name?.[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-slate-800 tracking-tight">{review.name}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {review.date ? new Date(review.date).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "Verified Student"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-0.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                                                    {Array.from({ length: 5 }).map((_, s) => (
                                                        <Star key={s} className={`w-3 h-3 ${s < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                                                "{review.comment}"
                                            </p>

                                            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform">
                                                <Star className="w-8 h-8" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        </div>

                        {/* RIGHT COLUMN: Glassmorphism Booking Sidebar */}
                        <div className="lg:col-span-4 lg:relative" id="booking-sidebar">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="lg:sticky lg:top-28 space-y-6"
                            >
                                <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white/40 backdrop-blur-3xl ring-1 ring-white/50">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-primary-foreground" />
                                    <div className="p-8">
                                        <div className="flex flex-col gap-1 mb-8">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-black text-primary tracking-tighter">₹{property.price?.toLocaleString()}</span>
                                                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Starting /mo</span>
                                            </div>
                                            {property.originalPrice && (
                                                <span className="text-sm text-slate-400 line-through font-bold">₹{property.originalPrice.toLocaleString()} - Market Rate</span>
                                            )}
                                        </div>

                                        <form onSubmit={handleBooking} className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="group relative">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1 block group-focus-within:text-primary transition-colors">Your Contact Name</Label>
                                                    <div className="relative">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary" />
                                                        <Input placeholder="E.g. Dwarkesh Patel" className="pl-12 h-14 rounded-2xl bg-white/50 border-slate-100 focus:bg-white focus:ring-primary/20 transition-all font-bold text-slate-700" required />
                                                    </div>
                                                </div>

                                                <div className="group relative">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1 block group-focus-within:text-primary transition-colors">Connect via Phone</Label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary" />
                                                        <Input type="tel" placeholder="+91 XXXXX XXXXX" className="pl-12 h-14 rounded-2xl bg-white/50 border-slate-100 focus:bg-white focus:ring-primary/20 transition-all font-bold text-slate-700" required />
                                                    </div>
                                                </div>

                                                <div className="group relative">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1 block group-focus-within:text-primary transition-colors">Any Specific Request?</Label>
                                                    <Textarea placeholder="E.g. Prefer corner room, need single occupancy..." className="min-h-[100px] rounded-2xl bg-white/50 border-slate-100 focus:bg-white focus:ring-primary/20 transition-all font-bold text-slate-700 p-4 resize-none" />
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <Button type="submit" className="w-full h-16 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:via-indigo-800 hover:to-violet-800 text-white font-black text-lg shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-300 active:scale-[0.98] group border-none">
                                                    Check Availability
                                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                                </Button>
                                                <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                                                    <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> Response Time &lt; 2 Hours
                                                </p>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Trust Badges */}
                                    <div className="bg-slate-50 p-6 flex flex-col gap-4">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary">
                                                <ShieldCheck className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black tracking-tight tracking-tight uppercase tracking-tighter leading-none">Safe & Secure Booking</p>
                                                <p className="text-[10px] text-slate-400 font-bold">Payment via BedBuddy Direct</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black tracking-tight uppercase tracking-tighter leading-none">Instant Site Visit</p>
                                                <p className="text-[10px] text-slate-400 font-bold">Schedule for Free within 24h</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <div className="p-8 rounded-[2.5rem] bg-indigo-900 overflow-hidden relative group">
                                    <div className="relative z-10 text-white space-y-4">
                                        <h4 className="text-xl font-black tracking-tight">Need Expert Advice?</h4>
                                        <p className="text-sm font-medium text-indigo-100/80 leading-relaxed">
                                            Our student consultants help you find the best hostels based on your college location.
                                        </p>
                                        <Button className="w-full rounded-xl bg-white text-indigo-900 border-none hover:bg-indigo-50 font-bold">
                                            Talk to Consultant
                                        </Button>
                                    </div>

                                    {/* Decoration */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform" />
                                    <Coffee className="absolute bottom-4 right-4 w-12 h-12 text-white/10 group-hover:rotate-12 transition-transform" />
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
