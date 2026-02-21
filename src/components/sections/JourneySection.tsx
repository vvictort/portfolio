import React from "react";
import { Plane, ArrowRight } from "lucide-react";
import { cn } from "../../utils";
import { motion } from "framer-motion";
import { InteractiveMap } from "../ui/InteractiveMap";

export function JourneySection() {
  const skills = {
    LANGUAGES: [
      { name: "Java", status: "CRUISING", active: true },
      { name: "TypeScript", status: "AIRBORNE", active: false },
      { name: "JavaScript", status: "AIRBORNE", active: false },
      { name: "Python", status: "AIRBORNE", active: false },
      { name: "R", status: "AIRBORNE", active: false },
      { name: "HTML/CSS", status: "CRUISING", active: true },
    ],
    FRAMEWORKS: [
      { name: "React", status: "AIRBORNE", active: false },
      { name: "Tailwind CSS", status: "AIRBORNE", active: false },
      { name: "Node.js", status: "AIRBORNE", active: false },
      { name: "Astro", status: "TAXIING", active: true },
      { name: "ThreeJS", status: "TAXIING", active: true },
    ],
    "TOOLS & OTHER": [
      { name: "Git", status: "AIRBORNE", active: false },
      { name: "scikit-learn", status: "AIRBORNE", active: false },
      { name: "Jupyter", status: "AIRBORNE", active: false },
      { name: "Figma", status: "AIRBORNE", active: false },
      { name: "VS Code", status: "CRUISING", active: true },
    ],
  };

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-8 py-20 flex flex-col gap-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col">
        <span className="text-zinc-500 font-mono text-sm tracking-widest uppercase mb-6">IN-FLIGHT EQUIPMENT</span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="flex flex-col gap-4">
              <span className="text-primary font-mono text-xs font-bold tracking-widest">{category}</span>
              <div className="flex flex-col gap-2">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-[#111] border border-white/5 rounded-md px-4 py-3">
                    <span className="font-mono text-xs text-white uppercase tracking-wider">{item.name}</span>
                    <span
                      className={cn(
                        "font-mono text-[10px] tracking-widest",
                        item.active
                          ? "text-green-500 [text-shadow:0_0_8px_rgba(34,197,94,0.6)]"
                          : "text-zinc-500 [text-shadow:0_0_8px_rgba(113,113,122,0.5)]",
                      )}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Flight Log Timeline */}
      <motion.div
        variants={containerVars}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col mt-16 relative">
        <div className="items-center justify-center relative my-12 hidden">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-dashed border-primary/50"></div>
          <span className="bg-background px-4 text-zinc-500 font-mono text-xs tracking-widest uppercase relative z-10">
            REVIEWING FLIGHT LOG
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-primary font-mono text-sm font-bold tracking-widest">GATE B2 //</span>
          <h2 className="text-5xl font-bold tracking-tight text-white mb-12">Flight Path</h2>
        </div>

        {/* Custom Interactive Map visual */}
        <div className="mt-8">
          <InteractiveMap />
        </div>
      </motion.div>
    </div>
  );
}
