import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import img1 from "@/assets/fac/pg-in-ahmedabad-for-students-working-professionals-stayflh.image.scroll02.Woblo.webp";
import img2 from "@/assets/fac/pg-in-ahmedabad-for-students-working-professionals-stayflh.image.scroll03.Woblo.webp";
import img3 from "@/assets/fac/pg-in-ahmedabad-for-students-working-professionals-stayflh.image.scroll04.Woblo.webp";
import img4 from "@/assets/fac/pg-in-ahmedabad-for-students-working-professionals-stayflh.image.scroll05.Woblo.webp";
import img5 from "@/assets/fac/pg-in-ahmedabad-for-students-working-professionals-stayflh.image.scroll06.Woblo.webp";

const items = [
  { 
    id: 1, 
    img: img3, 
    title: "Delicious & Nutritious Food", 
    desc: "Hygienic 4-meal daily home-style dining prepared fresh every day." 
  },
  { 
    id: 2, 
    img: img4, 
    title: "Managed & Maintained Spaces", 
    desc: "Clean, well-maintained living areas with professional daily upkeep." 
  },
  { 
    id: 3, 
    img: img5, 
    title: "Fitness & Wellness Gym", 
    desc: "Fully equipped in-house gym machines for health & daily workouts." 
  },
  { 
    id: 4, 
    img: img2, 
    title: "Quiet Study Rooms & Library", 
    desc: "Dedicated silent study zones with extensive books & high-speed Wi-Fi." 
  },
  { 
    id: 5, 
    img: img1, 
    title: "24/7 Security & Biometric Access", 
    desc: "Advanced biometric entry, CCTV monitoring & total peace of mind." 
  },
];

const FacilitiesScroll = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Calculate 3 items to show starting from startIndex
  const visibleItems = [
    items[startIndex % items.length],
    items[(startIndex + 1) % items.length],
    items[(startIndex + 2) % items.length],
  ];

  // Auto-change image cards every 6 seconds (slower speed)
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % items.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <section
      className="relative w-full py-8 my-6 overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Header */}
      <div className="text-center mb-10 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 text-blue-700 font-extrabold text-xs uppercase tracking-wider mb-3">
          ✨ Premium Amenities
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Everything You Need, <span className="text-blue-600">Already Taken Care Of</span>
        </h2>
        <p className="mt-3 text-slate-600 text-sm sm:text-base font-medium max-w-xl mx-auto">
          Thoughtfully curated facilities so you can focus on what truly matters to you.
        </p>
      </div>

      {/* Main Container */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* 3 Cards Container */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 py-4">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, idx) => (
              <motion.div
                key={`${item.id}-${startIndex}-${idx}`}
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -15 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white rounded-[2.2rem] p-3 sm:p-4 shadow-xl border border-blue-100/70 hover:shadow-2xl hover:border-blue-300 transform hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* Image Box */}
                <div className="relative w-full h-[260px] sm:h-[300px] rounded-[1.8rem] overflow-hidden bg-slate-100 group">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-lg sm:text-xl font-extrabold leading-tight text-white drop-shadow-md">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-100 font-medium mt-1 drop-shadow-sm line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Previous / Next Buttons */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute -left-2 sm:left-1 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-blue-600 shadow-xl border border-blue-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute -right-2 sm:right-1 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-blue-600 shadow-xl border border-blue-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Carousel Indicators / Dots */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setStartIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === startIndex % items.length
                  ? "w-8 bg-blue-600"
                  : "w-2.5 bg-blue-200 hover:bg-blue-300"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesScroll;
