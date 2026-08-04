import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Search, MapPin, Building, Users, Star, Compass } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [category, setCategory] = useState("All");
  
  // Mouse hover perspective state for the 3D cards
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-800, 800], [5, -5]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-800, 800], [-5, 5]), { stiffness: 100, damping: 30 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleSearch = () => {
    if (onSearch) onSearch(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16 bg-transparent"
    >

      {/* ── Aesthetic light background glows ── */}
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none bg-blue-200/40 blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none bg-indigo-200/30 blur-[80px]" />

      <div className="container max-w-7xl mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* ── LEFT COLUMN: Text and Search ── */}
        <div className="lg:col-span-6 space-y-8 text-left">
          
          {/* Main slogan */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-[3.8rem] xl:text-[4.2rem] font-black tracking-tight text-slate-900 leading-[1.1]">
              NestNode-
              <br />
              <span className="text-3d-gradient">
                Making Every Stay
                <br />
                Feel Like Home.
              </span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-lg">
              Discover premium hostels, luxury PGs, and verified student accommodations. Designed for modern academic living.
            </p>
          </div>

          {/* Premium Search box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-white p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(15,23,42,0.06)] border border-slate-100/80 space-y-4 max-w-xl"
          >
            {/* Input row */}
            <div
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border transition-all duration-300 ${
                focused ? "border-blue-500 ring-4 ring-blue-500/10" : "border-slate-200 bg-slate-50/50"
              }`}
            >
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Select a city or locality"
                className="flex-1 bg-transparent text-slate-800 placeholder:text-slate-400 text-base font-semibold outline-none"
              />
              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-bold text-sm shrink-0 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-95 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Find my room</span>
              </button>
            </div>

            {/* Quick type filters */}
            <div className="flex items-center gap-2 pt-1.5 flex-wrap">
              <span className="text-xs text-slate-400 font-black uppercase tracking-wider mr-2">I'm looking for</span>
              {[
                { name: "All", emoji: "✨" },
                { name: "Hostels", emoji: "🏠" },
                { name: "PGs", emoji: "🛏️" },
                { name: "Apartments", emoji: "🔑" },
              ].map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => setCategory(opt.name)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                    category === opt.name
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span>{opt.emoji}</span>
                  <span>{opt.name}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Cities tags */}
          <div className="flex items-center gap-3.5 text-sm">
            <span className="text-xs text-slate-400 font-black uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Filling Fast
            </span>
            <div className="flex items-center gap-2">
              {["Pune", "Ahmedabad"].map((city) => (
                <button
                  key={city}
                  onClick={() => { setQuery(city); if (onSearch) onSearch(city); }}
                  className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:border-slate-300 transition-all flex items-center gap-1"
                >
                  <Compass className="w-3 h-3 text-slate-400" />
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: 3D Isometric Stacked Display ── */}
        <div className="lg:col-span-6 relative h-[600px] w-full hidden md:block select-none" style={{ perspective: 1200 }}>
          
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="relative w-full h-full"
          >
            {/* 1. Live Booker notification pill */}
            <motion.div
              style={{ transform: "translateZ(80px)" }}
              className="absolute top-[8%] left-[5%] bg-white p-3 rounded-2xl border border-slate-100 shadow-[0_15px_30px_rgba(15,23,42,0.06)] flex items-center gap-3 w-[260px] z-50"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-black text-sm shadow-md">
                R
              </div>
              <div className="text-left leading-tight">
                <span className="absolute top-2.5 right-3 bg-emerald-500 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  Live
                </span>
                <p className="text-xs font-black text-slate-800">Rudraraj C.</p>
                <p className="text-[10px] text-slate-400 font-semibold">Booked Navrangpura, Ahmedabad</p>
              </div>
            </motion.div>

            {/* 2. Main card overlay (The property card) */}
            <motion.div
              style={{ transform: "translateZ(30px) rotateY(-5deg)" }}
              className="absolute top-[18%] left-[12%] w-[270px] overflow-hidden rounded-3xl border border-slate-100 bg-slate-900 text-white shadow-[0_30px_60px_rgba(15,23,42,0.25)] z-30"
            >
              <div className="relative h-40">
                <img
                  src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=500&q=80"
                  alt="Property"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
              </div>
              <div className="p-4 space-y-2 text-left">
                <p className="text-[9px] font-black uppercase text-blue-400 tracking-wider">Navrangpura</p>
                <h4 className="text-sm font-black leading-tight text-white">Homversity Rainbow Boys Hostel</h4>
                <p className="text-xs font-black text-white/90">₹21,000<span className="text-[9px] font-normal text-white/60">/mo</span></p>
              </div>
            </motion.div>

            {/* 3. High quality secondary photo card */}
            <motion.div
              style={{ transform: "translateZ(60px) rotate(-3deg)" }}
              className="absolute top-[8%] right-[8%] w-[220px] rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-white z-40"
            >
              <img
                src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=400&q=80"
                alt="Room"
                className="w-full h-32 object-cover"
              />
              <div className="p-3 text-left">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Hinjawadi</p>
                <h5 className="text-xs font-black text-slate-800 leading-tight">Homversity Sangaria - 3BHK</h5>
                <p className="text-xs font-bold text-slate-600 mt-1">₹16,000/mo</p>
              </div>
            </motion.div>

            {/* 4. Rating box floating */}
            <motion.div
              style={{ transform: "translateZ(90px)" }}
              className="absolute top-[33%] right-[5%] bg-white p-3.5 rounded-2xl border border-slate-100 shadow-[0_15px_30px_rgba(15,23,42,0.06)] flex flex-col items-center gap-1.5 w-[110px] z-50"
            >
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">RATED</span>
              <p className="text-lg font-black text-slate-900 leading-none">4.8 <span className="text-[10px] text-slate-400 font-medium">/5</span></p>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </motion.div>

            {/* 5. Modern Brokerage Card */}
            <motion.div
              style={{ transform: "translateZ(40px) rotate(4deg)" }}
              className="absolute bottom-[10%] left-[8%] bg-white p-4 rounded-3xl border border-slate-100 shadow-[0_20px_40px_rgba(15,23,42,0.06)] w-[200px] z-30"
            >
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">BROKERAGE</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-blue-600">₹0</span>
                <span className="text-[10px] font-bold text-slate-400">always</span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">No hidden fees. Ever.</p>
            </motion.div>

            {/* 6. Savings Pill Card */}
            <motion.div
              style={{ transform: "translateZ(85px)" }}
              className="absolute bottom-[20%] right-[10%] bg-white p-4 rounded-3xl border border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.06)] w-[180px] z-50 text-left"
            >
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">YOU SAVE</span>
              <p className="text-xl font-black text-blue-600 mt-0.5">₹4,200<span className="text-[10px] text-slate-400 font-medium">/mo</span></p>
              <div className="flex gap-0.5 items-end h-5 mt-2">
                {[12, 18, 14, 22, 28, 20].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-100 rounded-sm" style={{ height: `${h}px` }} />
                ))}
              </div>
            </motion.div>

            {/* 7. Cozy property photo (Background overlap) */}
            <motion.div
              style={{ transform: "translateZ(10px) rotateY(6deg)" }}
              className="absolute bottom-[12%] right-[16%] w-[200px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl z-20"
            >
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80"
                alt="Room"
                className="w-full h-24 object-cover"
              />
              <div className="p-3 text-left">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Mahalunge</p>
                <h6 className="text-[11px] font-black text-slate-800 leading-tight">Homversity Shroff Shrusti</h6>
                <p className="text-[10px] font-black text-slate-600 mt-1">₹8,000/mo</p>
              </div>
            </motion.div>

          </motion.div>
        </div>

      </div>

      {/* ── Infinite Scrolling Highlight Ticker Ribbon ── */}
      <div className="absolute bottom-0 inset-x-0 bg-white/70 backdrop-blur-md border-t border-slate-100 py-3.5 overflow-hidden z-30 select-none">
        <div className="flex whitespace-nowrap min-w-full">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{
              ease: "linear",
              duration: 35,
              repeat: Infinity,
            }}
            className="flex gap-16 text-sm font-bold text-slate-600/90 whitespace-nowrap shrink-0 pr-16"
          >
            {/* First Set */}
            <span className="flex items-center gap-2">✓ Flexible 1-month deposits</span>
            <span className="flex items-center gap-2">✓ Live kitchens</span>
            <span className="flex items-center gap-2">✓ Zero brokerage</span>
            <span className="flex items-center gap-2">✓ 48-hour move-in</span>
            <span className="flex items-center gap-2">✓ Verified photos</span>
            <span className="flex items-center gap-2">✓ Nutritionist meals</span>
            <span className="flex items-center gap-2">✓ 24/7 ops support</span>
            
            {/* Duplicate Set for Seamless Loop */}
            <span className="flex items-center gap-2">✓ Flexible 1-month deposits</span>
            <span className="flex items-center gap-2">✓ Live kitchens</span>
            <span className="flex items-center gap-2">✓ Zero brokerage</span>
            <span className="flex items-center gap-2">✓ 48-hour move-in</span>
            <span className="flex items-center gap-2">✓ Verified photos</span>
            <span className="flex items-center gap-2">✓ Nutritionist meals</span>
            <span className="flex items-center gap-2">✓ 24/7 ops support</span>
          </motion.div>

          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{
              ease: "linear",
              duration: 35,
              repeat: Infinity,
            }}
            className="flex gap-16 text-sm font-bold text-slate-600/90 whitespace-nowrap shrink-0 pr-16"
            aria-hidden="true"
          >
            {/* Repeat First Set for continuous slide */}
            <span className="flex items-center gap-2">✓ Flexible 1-month deposits</span>
            <span className="flex items-center gap-2">✓ Live kitchens</span>
            <span className="flex items-center gap-2">✓ Zero brokerage</span>
            <span className="flex items-center gap-2">✓ 48-hour move-in</span>
            <span className="flex items-center gap-2">✓ Verified photos</span>
            <span className="flex items-center gap-2">✓ Nutritionist meals</span>
            <span className="flex items-center gap-2">✓ 24/7 ops support</span>
            
            {/* Repeat Duplicate Set */}
            <span className="flex items-center gap-2">✓ Flexible 1-month deposits</span>
            <span className="flex items-center gap-2">✓ Live kitchens</span>
            <span className="flex items-center gap-2">✓ Zero brokerage</span>
            <span className="flex items-center gap-2">✓ 48-hour move-in</span>
            <span className="flex items-center gap-2">✓ Verified photos</span>
            <span className="flex items-center gap-2">✓ Nutritionist meals</span>
            <span className="flex items-center gap-2">✓ 24/7 ops support</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
