import React from 'react';

const tickerItems = [
    "48-hour move-in",
    "Verified photos",
    "Nutritionist meals",
    "24/7 ops support",
    "Flexible 1-month deposits",
    "Live kitchens",
    "Zero brokerage"
];

const FeatureTicker = () => {
    // Repeat items multiple times for smooth infinite marquee looping
    const repeatedItems = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems];

    return (
        <div className="w-full bg-[#f4f7fc]/90 border-y border-slate-200/80 py-3 sm:py-3.5 overflow-hidden relative shadow-inner select-none">
            <style>{`
                @keyframes ticker-slide {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-ticker {
                    display: flex;
                    width: max-content;
                    animation: ticker-slide 30s linear infinite;
                }
                .animate-ticker:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="animate-ticker items-center gap-8 sm:gap-12">
                {repeatedItems.map((item, idx) => (
                    <div 
                        key={idx} 
                        className="flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-semibold text-slate-700 tracking-wide hover:text-blue-600 transition-colors cursor-default"
                    >
                        <span className="text-slate-800 font-bold text-sm sm:text-base">✓</span>
                        <span>{item}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatureTicker;
