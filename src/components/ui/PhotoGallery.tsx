import React, { useState } from "react";
import { motion } from "framer-motion";
import { Camera, MapPin, Wind, Utensils, Calendar, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils";

interface PhotoGroup {
  id: string;
  title: string;
  location: string;
  coordinates: string;
  date: string;
  images: string[];
  altitude?: string;
  dish?: string;
}

interface PhotoGalleryProps {
  photos: PhotoGroup[];
  type: "outdoor" | "food";
}

interface PhotoCardProps {
  photo: PhotoGroup;
  type: "outdoor" | "food";
  itemVars: {
    hidden: { opacity: number; y: number; filter: string };
    show: { opacity: number; y: number; filter: string; transition: { duration: number } };
  };
}

function PhotoCard({ photo, type, itemVars }: PhotoCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalImages = photo.images.length;
  const activeImage = photo.images[activeIndex];
  const hasPlaceholder = !activeImage || activeImage.includes("placeholder");

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? totalImages - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => (current === totalImages - 1 ? 0 : current + 1));
  };

  return (
    <motion.div
      variants={itemVars}
      className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500 shadow-2xl flex flex-col transform-gpu backface-hidden">
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20 z-10" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20 z-10" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20 z-10" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20 z-10" />

      <div className="relative aspect-4/5 overflow-hidden">
        {hasPlaceholder ? (
          <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center gap-4 group-hover:bg-zinc-800 transition-colors duration-500">
            <Camera className="w-12 h-12 text-zinc-700 animate-pulse" />
            <span className="font-mono text-[10px] text-zinc-600 tracking-[0.3em]">NO SIGNAL</span>
          </div>
        ) : (
          <motion.div
            animate={{ x: `-${activeIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex h-full">
            {photo.images.map((image, index) => (
              <div key={image} className="relative h-full min-w-full overflow-hidden">
                <img
                  src={image}
                  alt={`${photo.title} ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                  fetchPriority={index === activeIndex ? "high" : "low"}
                />
              </div>
            ))}
          </motion.div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-6 flex flex-col justify-end">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-mono text-primary tracking-[0.3em] uppercase">Visual Record</span>
              <h4 className="text-white font-mono font-bold tracking-widest">{photo.title}</h4>
            </div>
            <Maximize2 className="w-4 h-4 text-white/40 shrink-0" />
          </div>
        </div>

        {totalImages > 1 && (
          <>
            <div className="absolute top-6 right-6 flex h-5 min-w-[2.25rem] items-center justify-center px-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-sm">
              <span className="font-mono text-[8px] leading-none text-primary tabular-nums">{`${activeIndex + 1}/${totalImages}`}</span>
            </div>

            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
              <button
                type="button"
                aria-label="Previous photo"
                onClick={goToPrevious}
                className="pointer-events-auto w-9 h-9 rounded-full border border-white/10 bg-black/45 text-white/80 hover:text-primary hover:border-primary/40 transition-colors flex items-center justify-center">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={goToNext}
                className="pointer-events-auto w-9 h-9 rounded-full border border-white/10 bg-black/45 text-white/80 hover:text-primary hover:border-primary/40 transition-colors flex items-center justify-center">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-black/45 border border-white/10 backdrop-blur-sm">
              {photo.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  aria-label={`Go to photo ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    index === activeIndex ? "bg-primary shadow-[0_0_10px_rgba(250,204,21,0.6)]" : "bg-white/25 hover:bg-white/50",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-5 flex flex-col gap-4 border-t border-white/5 bg-black/20">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 opacity-40">
              <MapPin className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-mono tracking-widest uppercase">LOC</span>
            </div>
            <span className="font-mono text-[10px] text-white overflow-hidden text-ellipsis whitespace-nowrap">
              {photo.location}
            </span>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <div className="flex items-center gap-1.5 opacity-40">
              <Calendar className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-mono tracking-widest uppercase">DATE</span>
            </div>
            <span className="font-mono text-[10px] text-white">{photo.date}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between opacity-40">
            <div className="flex items-center gap-1.5">
              {type === "outdoor" ? <Wind className="w-3 h-3 text-primary" /> : <Utensils className="w-3 h-3 text-primary" />}
              <span className="text-[9px] font-mono tracking-widest uppercase">
                {type === "outdoor" ? "ENVIRONMENT" : "CALIBRATION"}
              </span>
            </div>
            <span className="text-[9px] font-mono tracking-tighter">{photo.coordinates}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[10px] text-zinc-400 capitalize whitespace-nowrap overflow-hidden text-ellipsis">
              {type === "outdoor" ? `Altitude: ${photo.altitude}` : `Item: ${photo.dish}`}
            </span>
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest whitespace-nowrap">
              {totalImages} {totalImages === 1 ? "Frame" : "Frames"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function PhotoGallery({ photos, type }: PhotoGalleryProps) {
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} type={type} itemVars={itemVars} />
      ))}
    </motion.div>
  );
}
