import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowUpRight, MapPin } from "lucide-react";
import heroVideo from "@/assets/pg-in-ahmedabad-for-students-working-professionals-stayflh.video.herobannerVideo-1.Woblo.mp4";

/* ── Type Tabs ── */
const TYPE_TABS = [
  { label: "🏠 Hostel", value: "Hostel" },
  { label: "🛏️ PG", value: "PG" },
];

/* ── Search Bar Sub-component ── */
const SearchBar = ({ scrollToListings }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    scrollToListings();
    window.dispatchEvent(
      new CustomEvent("hero-search", { detail: { query } })
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="w-full">
      {/* Input Row */}
      <div className="flex items-center w-full bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl sm:rounded-full shadow-2xl overflow-hidden group focus-within:border-white/60 focus-within:bg-white/20 transition-all duration-300">
        <div className="flex items-center pl-4 sm:pl-5 pr-2 shrink-0">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 group-focus-within:text-white transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search hostels & PGs by area, college or name…"
          className="flex-1 bg-transparent py-3.5 sm:py-4 text-sm sm:text-base text-white placeholder-white/50 font-medium outline-none min-w-0"
        />
        <button
          onClick={handleSearch}
          className="m-1.5 shrink-0 flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-full bg-white text-slate-900 font-extrabold text-xs sm:text-sm tracking-wide hover:bg-slate-100 active:scale-95 transition-all duration-200 shadow-md group/btn"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
};

/* ── Main Hero Section ── */
const HeroSection = () => {
  const scrollToListings = () => {
    const listingsElement = document.getElementById("listings");
    if (listingsElement) {
      listingsElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-slate-950">
      {/* ── Background Video (Full Screen, No Controls) ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none opacity-90"
      >
        <source src={heroVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Subtle Overlay for Text Contrast */}
      <div className="absolute inset-0 bg-black/40 bg-gradient-to-b from-black/50 via-black/25 to-black/60 pointer-events-none" />

      {/* ── Center Content ── */}
      <div className="relative z-10 text-center px-4 max-w-2xl w-full mx-auto flex flex-col items-center justify-center select-none">
        {/* Cursive yellow "Truly" - Proportional size */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-script text-4xl sm:text-5xl md:text-6xl text-[#f7b239] drop-shadow-md leading-none select-none tracking-wide -mb-2 sm:-mb-3 z-20"
        >
          Truly
        </motion.span>

        {/* Bold Title "FEELS LIKE HOME" - Exact proportional size fitting on one line */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-wider leading-tight drop-shadow-lg whitespace-nowrap"
        >
          FEELS LIKE HOME
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs sm:text-base md:text-lg text-white/90 font-medium max-w-lg text-center leading-snug pt-2 sm:pt-3 drop-shadow-sm"
        >
          Managed living spaces for<br className="hidden sm:inline" /> students and working professionals
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full mt-6 sm:mt-8"
        >
          <SearchBar scrollToListings={scrollToListings} />
        </motion.div>
      </div>



      {/* ── Seamless Wave Connector to White Section Below ── */}
      <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full block"
          style={{ height: "80px" }}
        >
          <path
            d="M0,80 L0,40 Q360,0 720,30 Q1080,60 1440,20 L1440,80 Z"
            fill="#f8fafc"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
