import React from "react";
import { motion } from "framer-motion";
import { Camera, MapPin, Wind, Utensils, Calendar, Maximize2 } from "lucide-react";
import { cn } from "../../utils";

interface Photo {
  id: string;
  title: string;
  location: string;
  coordinates: string;
  date: string;
  image: string;
  altitude?: string;
  dish?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  type: "outdoor" | "food";
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
        <motion.div
          key={photo.id}
          variants={itemVars}
          className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500 shadow-2xl flex flex-col transform-gpu backface-hidden">
          {/* Viewfinder/Technical Corners */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20 z-10" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20 z-10" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20 z-10" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20 z-10" />

          {/* Image Container */}
          <div className="relative aspect-4/5 overflow-hidden">
            {photo.image.includes("placeholder") ? (
              <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center gap-4 group-hover:bg-zinc-800 transition-colors duration-500">
                <Camera className="w-12 h-12 text-zinc-700 animate-pulse" />
                <span className="font-mono text-[10px] text-zinc-600 tracking-[0.3em]">NO SIGNAL</span>
              </div>
            ) : (
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            )}

            {/* Overlay Info (Avionics style) */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-6 flex flex-col justify-end">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-mono text-primary tracking-[0.3em] uppercase">Visual Record</span>
                  <h4 className="text-white font-mono font-bold tracking-widest">{photo.title}</h4>
                </div>
                <Maximize2 className="w-4 h-4 text-white/40" />
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-6 right-6 px-2 py-0.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-sm">
              <span className="font-mono text-[8px] text-primary tracking-widest uppercase">Captured</span>
            </div>
          </div>

          {/* Meta Content */}
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
                  {type === "outdoor" ? (
                    <Wind className="w-3 h-3 text-primary" />
                  ) : (
                    <Utensils className="w-3 h-3 text-primary" />
                  )}
                  <span className="text-[9px] font-mono tracking-widest uppercase">
                    {type === "outdoor" ? "ENVIRONMENT" : "CALIBRATION"}
                  </span>
                </div>
                <span className="text-[9px] font-mono tracking-tighter">{photo.coordinates}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-zinc-400 capitalize whitespace-nowrap overflow-hidden text-ellipsis">
                  {type === "outdoor" ? `Altitude: ${photo.altitude}` : `Item: ${photo.dish}`}
                </span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-primary/40" />
                  <div className="w-1 h-1 rounded-full bg-white/5" />
                  <div className="w-1 h-1 rounded-full bg-white/5" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
