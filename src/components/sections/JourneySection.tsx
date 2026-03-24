import React from "react";
import { motion } from "framer-motion";
import { InteractiveMap } from "../ui/InteractiveMap";

export function JourneySection() {
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-8 py-28">
      <motion.div
        variants={containerVars}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col relative">
        <div className="items-center justify-center relative my-12 hidden">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-dashed border-primary/50"></div>
          <span className="bg-background px-4 text-zinc-500 font-mono text-xs tracking-widest uppercase relative z-10">
            REVIEWING FLIGHT LOG
          </span>
        </div>

        <div data-scroll-anchor className="flex flex-col gap-2">
          <span className="text-primary font-mono text-sm font-bold tracking-widest">GATE B2 //</span>
          <h2 className="text-5xl font-bold tracking-tight text-white mb-12">Flight Path</h2>
        </div>

        <div className="mt-8">
          <InteractiveMap />
        </div>
      </motion.div>
    </div>
  );
}
