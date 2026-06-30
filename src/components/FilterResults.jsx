import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ChevronDown, Check, X, Users, Building, Sparkles, SortAsc, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const FilterResults = ({ onFilterChange, onClearAll }) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [filters, setFilters] = useState({
        gender: [],
        type: [],
        amenities: [],
        ordering: "distance_asc"
    });

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleFilter = (category, value) => {
        setFilters(prev => {
            const current = prev[category];
            const updated = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [category]: updated };
        });
    };

    const setOrdering = (value) => {
        setFilters(prev => ({ ...prev, ordering: value }));
    };

    const handleApply = () => {
        onFilterChange(filters);
        setOpenDropdown(null);
    };

    const handleClear = () => {
        const resetFilters = {
            gender: [],
            type: [],
            amenities: [],
            ordering: "distance_asc"
        };
        setFilters(resetFilters);
        onClearAll();
        setOpenDropdown(null);
    };

    const GENDER_OPTIONS = ["Boys", "Girls", "Co-ed"];
    const TYPE_OPTIONS = ["Hostel", "PG", "Flat", "Dormitory"];
    const AMENITIES_CATEGORIES = [
        {
            label: "FOOD",
            options: ["Veg", "Non-veg"]
        },
        {
            label: "BATHROOM",
            options: ["Common", "Attached"]
        },
        {
            label: "OTHERS",
            options: ["Hot Water", "Water Purifier", "Laundry", "Transport"]
        }
    ];
    const SORT_OPTIONS = [
        { label: "Distance", value: "distance_asc" },
        { label: "Price: Low to High", value: "price_asc" },
        { label: "Price: High to Low", value: "price_desc" },
        { label: "Highest Rated", value: "rating_desc" }
    ];

    const DropdownWrapper = ({ id, label, icon: Icon, children, isActive }) => (
        <div className="relative">
            <button
                onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all duration-300 font-semibold text-sm ${isActive
                    ? "bg-gradient-to-r from-primary/10 to-indigo-600/10 border-primary/30 text-primary shadow-lg shadow-primary/20"
                    : "bg-white border-slate-200 text-slate-600 hover:border-primary/30 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white"
                    }`}
            >
                <Icon className="w-4 h-4" />
                {label}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdown === id ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
                {openDropdown === id && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200/50 p-4 z-50 overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto px-4 mb-12" ref={dropdownRef}>
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-slate-200/50 p-8 shadow-xl shadow-slate-200/30">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3 self-start md:self-center">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-indigo-600/10 text-primary">
                            <Filter className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Filter Results</h3>
                    </div>

                    <button
                        onClick={handleClear}
                        className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-red-500 transition-colors py-2 px-4 rounded-xl hover:bg-red-50"
                    >
                        <X className="w-4 h-4" />
                        Clear All
                    </button>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                    <DropdownWrapper
                        id="gender"
                        label="Gender"
                        icon={Users}
                        isActive={filters.gender.length > 0}
                    >
                        <div className="flex flex-col gap-3">
                            {GENDER_OPTIONS.map(opt => (
                                <div key={opt} className="flex items-center space-x-3 group cursor-pointer" onClick={() => toggleFilter("gender", opt)}>
                                    <Checkbox
                                        id={`gender-${opt}`}
                                        checked={filters.gender.includes(opt)}
                                        className="rounded-md border-slate-300 data-[state=checked]:bg-indigo-600"
                                    />
                                    <Label className="text-sm font-bold text-slate-700 cursor-pointer group-hover:text-indigo-600 transition-colors">
                                        {opt}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </DropdownWrapper>

                    <DropdownWrapper
                        id="type"
                        label="Accommodation Type"
                        icon={Building}
                        isActive={filters.type.length > 0}
                    >
                        <div className="flex flex-col gap-3">
                            {TYPE_OPTIONS.map(opt => (
                                <div key={opt} className="flex items-center space-x-3 group cursor-pointer" onClick={() => toggleFilter("type", opt)}>
                                    <Checkbox
                                        id={`type-${opt}`}
                                        checked={filters.type.includes(opt)}
                                        className="rounded-md border-slate-300 data-[state=checked]:bg-indigo-600"
                                    />
                                    <Label className="text-sm font-bold text-slate-700 cursor-pointer group-hover:text-indigo-600 transition-colors">
                                        {opt}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </DropdownWrapper>

                    <DropdownWrapper
                        id="amenities"
                        label="Amenities"
                        icon={Sparkles}
                        isActive={filters.amenities.length > 0}
                    >
                        <div className="flex flex-col gap-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {AMENITIES_CATEGORIES.map(cat => (
                                <div key={cat.label} className="flex flex-col gap-3">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.label}</p>
                                    <div className="flex flex-col gap-3">
                                        {cat.options.map(opt => (
                                            <div key={opt} className="flex items-center space-x-3 group cursor-pointer" onClick={() => toggleFilter("amenities", opt)}>
                                                <Checkbox
                                                    id={`amenity-${opt}`}
                                                    checked={filters.amenities.includes(opt)}
                                                    className="rounded-md border-slate-300 data-[state=checked]:bg-indigo-600"
                                                />
                                                <Label className="text-sm font-bold text-slate-700 cursor-pointer group-hover:text-indigo-600 transition-colors">
                                                    {opt}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DropdownWrapper>

                    <DropdownWrapper
                        id="sort"
                        label="Sort"
                        icon={SortAsc}
                        isActive={filters.ordering !== "distance_asc"}
                    >
                        <RadioGroup value={filters.ordering} onValueChange={setOrdering} className="flex flex-col gap-3">
                            {SORT_OPTIONS.map(opt => (
                                <div key={opt.value} className="flex items-center space-x-3 group cursor-pointer">
                                    <RadioGroupItem value={opt.value} id={`sort-${opt.value}`} className="border-slate-300 text-indigo-600" />
                                    <Label htmlFor={`sort-${opt.value}`} className="text-sm font-bold text-slate-700 cursor-pointer group-hover:text-indigo-600 transition-colors">
                                        {opt.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </DropdownWrapper>

                    <div className="ml-auto w-full md:w-auto">
                        <Button
                            onClick={handleApply}
                            className="w-full md:w-auto h-12 bg-gradient-to-r from-primary to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white rounded-2xl px-10 font-bold shadow-xl shadow-primary/30 flex items-center gap-2 group transition-all hover:shadow-2xl hover:shadow-primary/40"
                        >
                            <Filter className="w-4 h-4 transition-transform group-hover:rotate-12" />
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterResults;
