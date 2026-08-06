import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ChevronDown, Check, RotateCcw, ArrowUpDown, Filter, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const GENDER_OPTIONS = [
    { label: "All Gender", value: "all" },
    { label: "Boys 🔵", value: "Boys" },
    { label: "Girls 🩷", value: "Girls" },
    { label: "Co-ed 🟣", value: "Co-ed" },
];

const TYPE_OPTIONS = [
    { label: "All Types", value: "all" },
    { label: "Hostel 🏠", value: "Hostel" },
    { label: "PG 🛏️", value: "PG" },
];

const SORT_OPTIONS = [
    { label: "Latest First 🆕", value: "created_at_desc" },
    { label: "Top Rated ⭐", value: "rating_desc" },
    { label: "Price: Low → High 💰", value: "price_asc" },
    { label: "Price: High → Low 💎", value: "price_desc" },
];

const AMENITIES_OPTIONS = [
    "Veg", "Non-veg", "Attached", "Common", "Hot Water", "Water Purifier", "Laundry", "Transport"
];

const HorizontalFilterBar = ({ filters = {}, onFilterChange, onClearAll }) => {
    const [openDropdown, setOpenDropdown] = useState(null); // 'amenities', 'sort', null
    const containerRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentGender = filters.gender?.[0] || "all";
    const currentType = filters.type?.[0] || "all";
    const currentSort = filters.ordering || "created_at_desc";
    const selectedAmenities = filters.amenities || [];

    const handleGenderSelect = (val) => {
        onFilterChange({
            ...filters,
            gender: val === "all" ? [] : [val]
        });
    };

    const handleTypeSelect = (val) => {
        onFilterChange({
            ...filters,
            type: val === "all" ? [] : [val]
        });
    };

    const handleSortSelect = (val) => {
        onFilterChange({
            ...filters,
            ordering: val
        });
        setOpenDropdown(null);
    };

    const handleAmenityToggle = (amenity) => {
        const updated = selectedAmenities.includes(amenity)
            ? selectedAmenities.filter(a => a !== amenity)
            : [...selectedAmenities, amenity];

        onFilterChange({
            ...filters,
            amenities: updated
        });
    };

    const activeFilterCount =
        (currentGender !== "all" ? 1 : 0) +
        (currentType !== "all" ? 1 : 0) +
        selectedAmenities.length +
        (currentSort !== "created_at_desc" ? 1 : 0);

    return (
        <div ref={containerRef} className={`w-full my-6 p-3 sm:p-4 bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-900/5 relative ${openDropdown ? "z-50" : "z-30"}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">

                {/* Left group: Filter Chips */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-slate-500 bg-slate-100/80 rounded-xl mr-1">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                        <span>Filter By</span>
                    </div>

                    {/* Gender Chips */}
                    <div className="flex items-center p-1 bg-slate-100/70 rounded-2xl border border-slate-200/50">
                        {GENDER_OPTIONS.map((g) => (
                            <button
                                key={g.value}
                                onClick={() => handleGenderSelect(g.value)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                                    currentGender === g.value
                                        ? "bg-white text-primary shadow-sm shadow-primary/10 font-extrabold"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                {g.label}
                            </button>
                        ))}
                    </div>

                    {/* Accommodation Type Chips */}
                    <div className="flex items-center p-1 bg-slate-100/70 rounded-2xl border border-slate-200/50">
                        {TYPE_OPTIONS.map((t) => (
                            <button
                                key={t.value}
                                onClick={() => handleTypeSelect(t.value)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                                    currentType === t.value
                                        ? "bg-white text-primary shadow-sm shadow-primary/10 font-extrabold"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Amenities Dropdown Button */}
                    <div className="relative">
                        <button
                            onClick={() => setOpenDropdown(openDropdown === "amenities" ? null : "amenities")}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all ${
                                selectedAmenities.length > 0
                                    ? "bg-primary/10 border-primary/30 text-primary font-black"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                            <span>Amenities</span>
                            {selectedAmenities.length > 0 && (
                                <Badge className="h-4 px-1.5 bg-primary text-white text-[10px] font-black rounded-full">
                                    {selectedAmenities.length}
                                </Badge>
                            )}
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === "amenities" ? "rotate-180" : ""}`} />
                        </button>

                        {/* Amenities Popover */}
                        <AnimatePresence>
                            {openDropdown === "amenities" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                    className="absolute left-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-900/20 z-50 p-4 space-y-2"
                                >
                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 border-b border-slate-100 mb-1">
                                        Select Amenities
                                    </div>
                                    <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-1">
                                        {AMENITIES_OPTIONS.map((item) => {
                                            const isChecked = selectedAmenities.includes(item);
                                            return (
                                                <button
                                                    key={item}
                                                    onClick={() => handleAmenityToggle(item)}
                                                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                                                        isChecked
                                                            ? "bg-primary/10 text-primary font-bold"
                                                            : "hover:bg-slate-100 text-slate-700"
                                                    }`}
                                                >
                                                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                                                        isChecked ? "border-primary bg-primary text-white" : "border-slate-300"
                                                    }`}>
                                                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                                    </div>
                                                    <span>{item}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right group: Sort By & Reset */}
                <div className="flex items-center gap-2 ml-auto">
                    {/* Sort Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                            <span>{SORT_OPTIONS.find(s => s.value === currentSort)?.label || "Sort By"}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === "sort" ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                            {openDropdown === "sort" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-1.5 space-y-0.5"
                                >
                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 border-b border-slate-100 mb-1">
                                        Sort Listings
                                    </div>
                                    {SORT_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleSortSelect(opt.value)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                                                currentSort === opt.value
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-slate-700 hover:bg-slate-100"
                                            }`}
                                        >
                                            <span>{opt.label}</span>
                                            {currentSort === opt.value && <Check className="w-3.5 h-3.5 text-primary stroke-[3]" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Reset Button */}
                    {activeFilterCount > 0 && (
                        <Button
                            onClick={onClearAll}
                            variant="ghost"
                            size="sm"
                            className="h-9 px-3 rounded-2xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 gap-1.5"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset ({activeFilterCount})</span>
                        </Button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default HorizontalFilterBar;
