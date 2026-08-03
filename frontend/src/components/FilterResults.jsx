import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Filter, ChevronDown, X, Users, Building2, Sparkles,
    ArrowUpDown, Check, SlidersHorizontal, RotateCcw
} from "lucide-react";

/* ─── Option Data ─────────────────────────────────────────────────────────── */
const GENDER_OPTIONS = [
    { value: "Boys", emoji: "🔵", color: "from-blue-500 to-cyan-500" },
    { value: "Girls", emoji: "🩷", color: "from-pink-500 to-rose-500" },
    { value: "Co-ed", emoji: "🟣", color: "from-violet-500 to-purple-500" },
];

const TYPE_OPTIONS = [
    { value: "Hostel", emoji: "🏠" },
    { value: "PG", emoji: "🛏️" },
    { value: "Flat", emoji: "🏢" },
    { value: "Dormitory", emoji: "🏨" },
];

const AMENITIES_CATEGORIES = [
    {
        label: "Food",
        emoji: "🍽️",
        options: ["Veg", "Non-veg"],
    },
    {
        label: "Bathroom",
        emoji: "🚿",
        options: ["Common", "Attached"],
    },
    {
        label: "Facilities",
        emoji: "✨",
        options: ["Hot Water", "Water Purifier", "Laundry", "Transport"],
    },
];

const SORT_OPTIONS = [
    { label: "Nearest First", value: "distance_asc", icon: "📍" },
    { label: "Price: Low → High", value: "price_asc", icon: "💰" },
    { label: "Price: High → Low", value: "price_desc", icon: "💎" },
    { label: "Top Rated", value: "rating_desc", icon: "⭐" },
];

/* ─── Default Filters ─────────────────────────────────────────────────────── */
const DEFAULT_FILTERS = {
    gender: [],
    type: [],
    amenities: [],
    ordering: "distance_asc",
};

/* ─── Pill chip for selected values shown in button ─────────────────────── */
const ActiveBadge = ({ count }) =>
    count > 0 ? (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white shadow-sm">
            {count}
        </span>
    ) : null;

/* ─── Single Checkbox Row ────────────────────────────────────────────────── */
const CheckRow = ({ id, label, checked, onChange, emoji }) => (
    <label
        htmlFor={id}
        className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 select-none
            ${checked
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
    >
        <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200
                ${checked
                    ? "border-indigo-600 bg-indigo-600"
                    : "border-slate-300 bg-white"
                }`}
        >
            <AnimatePresence>
                {checked && (
                    <motion.div
                        key="check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        <input id={id} type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        {emoji && <span className="text-sm">{emoji}</span>}
        <span className="text-sm font-semibold">{label}</span>
    </label>
);

/* ─── Radio Row ──────────────────────────────────────────────────────────── */
const RadioRow = ({ id, label, checked, onChange, icon }) => (
    <label
        htmlFor={id}
        className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 select-none
            ${checked
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
    >
        <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200
                ${checked ? "border-indigo-600" : "border-slate-300 bg-white"}`}
        >
            {checked && (
                <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
            )}
        </div>
        <input id={id} type="radio" className="sr-only" checked={checked} onChange={onChange} />
        <span className="text-sm">{icon}</span>
        <span className="text-sm font-semibold">{label}</span>
    </label>
);

/* ─── Dropdown Panel ─────────────────────────────────────────────────────── */
const DropdownPanel = ({ id, label, icon: Icon, children, isActive, openDropdown, setOpenDropdown, badge }) => {
    const isOpen = openDropdown === id;

    return (
        <div className="flex flex-col gap-0">
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setOpenDropdown(isOpen ? null : id)}
                className={`group flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-200
                    ${isActive
                        ? "border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-600"
                    }
                    ${isOpen ? "rounded-b-none border-b-0 border-indigo-300 ring-2 ring-indigo-100" : ""}
                `}
            >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors duration-200
                    ${isActive || isOpen
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                    }`}>
                    <Icon className="h-4 w-4" />
                </span>

                <span className="flex-1 text-left">{label}</span>

                {badge}

                <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300
                        ${isOpen ? "rotate-180 text-indigo-500" : ""}
                    `}
                />
            </button>

            {/* Inline Accordion Panel — expands in-flow, never clipped */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden rounded-b-2xl border border-t-0 border-indigo-300 bg-slate-50/70 ring-2 ring-indigo-100"
                    >
                        <div className="p-3">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const FilterResults = ({ onFilterChange, onClearAll }) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const wrapperRef = useRef(null);

    /* Close on outside click */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* Helpers */
    const toggleMulti = (category, value) => {
        setFilters((prev) => {
            const cur = prev[category];
            return {
                ...prev,
                [category]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value],
            };
        });
    };

    const setOrdering = (value) => setFilters((prev) => ({ ...prev, ordering: value }));

    const handleApply = () => {
        onFilterChange(filters);
        setOpenDropdown(null);
    };

    const handleClear = () => {
        setFilters(DEFAULT_FILTERS);
        onClearAll?.();
        setOpenDropdown(null);
    };

    /* Active filter count */
    const activeCount =
        filters.gender.length +
        filters.type.length +
        filters.amenities.length +
        (filters.ordering !== "distance_asc" ? 1 : 0);

    const sortLabel = SORT_OPTIONS.find((o) => o.value === filters.ordering)?.label;

    return (
        <div className="w-full lg:sticky lg:top-24 lg:self-start" ref={wrapperRef}>
            {/* Card */}
            <div className="rounded-3xl border border-slate-200/60 bg-white shadow-2xl shadow-slate-900/[0.08]">

                {/* ── Header ── */}
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/30">
                            <SlidersHorizontal className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-black tracking-tight text-slate-900">
                                Filter Results
                            </h3>
                            <p className="text-xs font-medium text-slate-400">
                                {activeCount > 0
                                    ? `${activeCount} filter${activeCount > 1 ? "s" : ""} applied`
                                    : "Narrow down your perfect stay"}
                            </p>
                        </div>
                    </div>

                    {activeCount > 0 && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            type="button"
                            onClick={handleClear}
                            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-500 transition-all hover:bg-red-50 hover:text-red-500 active:scale-95"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reset
                        </motion.button>
                    )}
                </div>

                {/* ── Filters ── */}
                <div className="flex flex-col gap-2 p-4">

                    {/* Gender */}
                    <DropdownPanel
                        id="gender"
                        label="Gender"
                        icon={Users}
                        isActive={filters.gender.length > 0}
                        openDropdown={openDropdown}
                        setOpenDropdown={setOpenDropdown}
                        badge={<ActiveBadge count={filters.gender.length} />}
                    >
                        <div className="flex flex-col gap-0.5">
                            {GENDER_OPTIONS.map((opt) => (
                                <CheckRow
                                    key={opt.value}
                                    id={`gender-${opt.value}`}
                                    label={opt.value}
                                    emoji={opt.emoji}
                                    checked={filters.gender.includes(opt.value)}
                                    onChange={() => toggleMulti("gender", opt.value)}
                                />
                            ))}
                        </div>
                    </DropdownPanel>

                    {/* Accommodation Type */}
                    <DropdownPanel
                        id="type"
                        label="Accommodation Type"
                        icon={Building2}
                        isActive={filters.type.length > 0}
                        openDropdown={openDropdown}
                        setOpenDropdown={setOpenDropdown}
                        badge={<ActiveBadge count={filters.type.length} />}
                    >
                        <div className="flex flex-col gap-0.5">
                            {TYPE_OPTIONS.map((opt) => (
                                <CheckRow
                                    key={opt.value}
                                    id={`type-${opt.value}`}
                                    label={opt.value}
                                    emoji={opt.emoji}
                                    checked={filters.type.includes(opt.value)}
                                    onChange={() => toggleMulti("type", opt.value)}
                                />
                            ))}
                        </div>
                    </DropdownPanel>

                    {/* Amenities */}
                    <DropdownPanel
                        id="amenities"
                        label="Amenities"
                        icon={Sparkles}
                        isActive={filters.amenities.length > 0}
                        openDropdown={openDropdown}
                        setOpenDropdown={setOpenDropdown}
                        badge={<ActiveBadge count={filters.amenities.length} />}
                    >
                        <div className="flex max-h-64 flex-col gap-3 overflow-y-auto pr-1">
                            {AMENITIES_CATEGORIES.map((cat) => (
                                <div key={cat.label}>
                                    <div className="mb-1.5 flex items-center gap-1.5 px-3">
                                        <span className="text-xs">{cat.emoji}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            {cat.label}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        {cat.options.map((opt) => (
                                            <CheckRow
                                                key={opt}
                                                id={`amenity-${opt}`}
                                                label={opt}
                                                checked={filters.amenities.includes(opt)}
                                                onChange={() => toggleMulti("amenities", opt)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DropdownPanel>

                    {/* Sort */}
                    <DropdownPanel
                        id="sort"
                        label={filters.ordering !== "distance_asc" ? sortLabel : "Sort By"}
                        icon={ArrowUpDown}
                        isActive={filters.ordering !== "distance_asc"}
                        openDropdown={openDropdown}
                        setOpenDropdown={setOpenDropdown}
                    >
                        <div className="flex flex-col gap-0.5">
                            {SORT_OPTIONS.map((opt) => (
                                <RadioRow
                                    key={opt.value}
                                    id={`sort-${opt.value}`}
                                    label={opt.label}
                                    icon={opt.icon}
                                    checked={filters.ordering === opt.value}
                                    onChange={() => setOrdering(opt.value)}
                                />
                            ))}
                        </div>
                    </DropdownPanel>
                </div>

                {/* ── Apply Button ── */}
                <div className="border-t border-slate-100 px-4 pb-4 pt-3">
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleApply}
                        className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-500/30 transition-all hover:from-indigo-500 hover:to-purple-500 hover:shadow-xl hover:shadow-indigo-500/40 active:scale-[0.99]"
                    >
                        <Filter className="h-4 w-4" />
                        Apply Filters
                        {activeCount > 0 && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-[10px] font-black">
                                {activeCount}
                            </span>
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default FilterResults;
