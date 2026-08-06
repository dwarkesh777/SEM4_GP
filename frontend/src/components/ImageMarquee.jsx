import React from 'react';

// Import all images from the fhl folder dynamically
const imageModules = import.meta.glob('@/assets/fhl/*.{webp,png,jpg,jpeg}', { eager: true });
const images = Object.values(imageModules).map((mod) => mod.default);

// Split images into two halves for two rows
const midpoint = Math.ceil(images.length / 2);
const firstRow = images.slice(0, midpoint);
const secondRow = images.slice(midpoint);

const ImageMarquee = () => {
  if (images.length === 0) return null;

  // Define various border radius shape patterns
  const getShapeClass = (index) => {
    const shapes = [
      "rounded-2xl sm:rounded-3xl", // Standard rounded
      "rounded-tr-[80px] sm:rounded-tr-[120px] rounded-bl-[80px] sm:rounded-bl-[120px] rounded-tl-2xl rounded-br-2xl", // Reverse leaf
      "rounded-t-full rounded-b-2xl", // Arch top
      "rounded-2xl sm:rounded-3xl", // Standard rounded
      "rounded-tl-[80px] sm:rounded-tl-[120px] rounded-br-[80px] sm:rounded-br-[120px] rounded-tr-2xl rounded-bl-2xl", // Leaf
      "rounded-r-full rounded-l-2xl", // Arch right
      "rounded-l-full rounded-r-2xl", // Arch left
    ];
    return shapes[index % shapes.length];
  };

  return (
    <div className="w-full overflow-hidden py-4 sm:py-8 relative bg-transparent flex flex-col gap-4 sm:gap-6 mt-4">
      {/* Custom styles for marquee animation */}
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: scroll-left 90s linear infinite;
        }
        .animate-marquee-right {
          animation: scroll-right 90s linear infinite;
        }
        .marquee-track {
          display: flex;
          gap: 1rem;
          width: max-content;
        }
        @media (min-width: 640px) {
          .marquee-track {
            gap: 1.5rem;
          }
        }
        .marquee-image {
          height: 180px;
          object-fit: cover;
          flex-shrink: 0;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          width: 280px;
        }
        @media (min-width: 640px) {
          .marquee-image { 
            height: 220px; 
            width: 340px;
          }
        }
        @media (min-width: 1024px) {
          .marquee-image { 
            height: 280px; 
            width: 420px;
          }
        }
      `}</style>

      {/* Row 1 - Scrolling Left */}
      <div className="w-full overflow-hidden flex">
        <div className="marquee-track animate-marquee-left">
          {/* Double the array for seamless loop */}
          {[...firstRow, ...firstRow, ...firstRow].map((src, idx) => (
            <img 
              key={`row1-${idx}`} 
              src={src} 
              alt="Property view" 
              className={`marquee-image ${getShapeClass(idx)}`} 
              loading="lazy" 
              draggable="false"
            />
          ))}
        </div>
      </div>

      {/* Row 2 - Scrolling Right */}
      <div className="w-full overflow-hidden flex">
        <div className="marquee-track animate-marquee-right">
          {/* Double the array for seamless loop */}
          {[...secondRow, ...secondRow, ...secondRow].map((src, idx) => (
            <img 
              key={`row2-${idx}`} 
              src={src} 
              alt="Property view" 
              className={`marquee-image ${getShapeClass(idx + 3)}`} 
              loading="lazy" 
              draggable="false"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageMarquee;
