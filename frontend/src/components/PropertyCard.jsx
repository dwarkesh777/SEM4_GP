import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PropertyCard = ({
    id, main_image, name, location, type, gender, price, rating, index, distance, onHoverState
}) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    // Simulate active views
    const activeViews = Math.floor(Math.random() * 5) + 3;
    const finalRating = typeof rating === "number" ? rating.toFixed(1) : "4.8";

    const handleExplore = (e) => {
        if (e) e.stopPropagation();
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first to explore properties!");
            navigate("/login");
            return;
        }
        navigate(`/hostel/${id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
            onMouseEnter={() => {
                setIsHovered(true);
                if (onHoverState) onHoverState(true);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                if (onHoverState) onHoverState(false);
            }}
            onClick={() => handleExplore()}
            className="group relative cursor-pointer h-[500px] w-full rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-100/50 shadow-lg shadow-slate-950/5 hover:shadow-2xl flex flex-col justify-between p-6 select-none transition-all duration-500"
        >
            {/* ── Background Image Layer ── */}
            <div className="absolute inset-0 z-0">
                <img
                    src={main_image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Smooth Dark Gradient Mask matching Mockup Card overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20" />
            </div>

            {/* ── Top Badges Row (Fades out on Hover) ── */}
            <div className="relative z-10 flex flex-col items-start gap-2.5 w-full transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2 group-hover:pointer-events-none">
                <div className="flex justify-between items-start w-full">
                    <div className="flex items-center gap-2">
                        <span className="px-3.5 py-1.5 rounded-full bg-white text-slate-800 text-[11px] font-extrabold uppercase tracking-wide shadow-sm">
                            {type}
                        </span>
                        <span className="px-3.5 py-1.5 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-wide backdrop-blur-md">
                            {gender}
                        </span>
                    </div>
                    {distance !== undefined && distance !== null && (
                        <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/90 text-white text-[11px] font-extrabold uppercase tracking-wide backdrop-blur-md shadow-sm border border-indigo-400/30 flex items-center gap-1.5 whitespace-nowrap">
                            <MapPin className="w-3.5 h-3.5" />
                            {distance} km
                        </span>
                    )}
                </div>

                {/* Viewing Now Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-md text-[11px] font-bold tracking-tight">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span>{activeViews} viewing now</span>
                </div>
            </div>

            {/* ── Bottom Content Panel ── */}
            <div className="relative z-10 space-y-4 text-left">
                
                <div className="space-y-1">
                  {/* Location (e.g. MAHALUNGE, PUNE) */}
                  <p className="text-[10px] font-black uppercase text-slate-400/90 tracking-widest leading-none">
                      {location.toUpperCase()}
                  </p>
                  
                  {/* Title (Property Name) */}
                  <h3 className="text-xl font-black text-white leading-tight">
                      {name}
                  </h3>
                </div>

                {/* Pricing & Button/Rating Row */}
                <div className="space-y-3 pt-1.5">
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">STARTING</p>
                        <p className="text-2xl font-black text-white">
                            ₹{price.toLocaleString()}
                            <span className="text-[11px] font-bold text-slate-400">/mo</span>
                        </p>
                    </div>

                    {/* Hover state elements: Rating badge & Explore button */}
                    <div className="h-0 opacity-0 overflow-hidden group-hover:h-11 group-hover:opacity-100 transition-all duration-300 ease-out flex items-center gap-2">
                        <div className="flex items-center gap-1 px-3 py-3 h-full rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-amber-400 font-extrabold text-xs shrink-0 select-none">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-white">{finalRating}</span>
                        </div>
                        <button
                            onClick={handleExplore}
                            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-full text-xs font-black text-slate-900 bg-white hover:bg-slate-50 transition-colors shadow-sm h-full"
                        >
                            <span>Explore home</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default PropertyCard;
