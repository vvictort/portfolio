import React from "react";
import { Plane, ArrowRight } from "lucide-react";
import { cn } from "../../utils";
import { motion } from "framer-motion";

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

        <div className="grid grid-cols-3 gap-12">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="flex flex-col gap-4">
              <span className="text-primary font-mono text-xs font-bold tracking-widest">{category}</span>
              <div className="flex flex-col gap-2">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-[#111] border border-white/5 rounded-md px-4 py-3">
                    <span className="text-white text-sm">{item.name}</span>
                    <span
                      className={cn(
                        "font-mono text-[10px] tracking-widest",
                        item.active ? "text-green-500" : "text-zinc-500",
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

        {/* Custom Timeline visual - Horizontal "Connecting Flights" */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between mt-2 gap-8 xl:gap-0">
          {[
            {
              year: "2024",
              title: "Undergrad @ UBC",
              desc: "Started Computer Science journey. Focused on core data structures and software engineering principles.",
              gate: "D1",
              origin: "INIT",
              dest: "CS101",
            },
            {
              year: "2025",
              title: "Full-Stack Eng",
              desc: "Shipped first major project. Learned React, Node, and how to survive merge conflicts at hackathons.",
              gate: "D2",
              origin: "CS101",
              dest: "DEV",
            },
            {
              year: "2026",
              title: "AI & Data",
              desc: "Diving into Machine Learning and advanced systems. Cruising altitude achieved.",
              gate: "D3",
              origin: "DEV",
              dest: "PRO",
            },
          ].map((log, i, arr) => (
            <React.Fragment key={i}>
              <motion.div
                variants={itemVars}
                className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 relative group hover:bg-[#111] transition-colors overflow-hidden flex flex-col h-full">
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <span className="text-primary font-mono text-2xl font-bold">{log.year}</span>
                  <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase border border-zinc-800 px-2 py-1 rounded-sm">
                    Gate {log.gate}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-8 font-mono text-sm tracking-widest relative z-10">
                  <span className="text-zinc-400">{log.origin}</span>
                  <div className="flex-1 border-t border-dashed border-zinc-700 flex items-center justify-center relative">
                    <Plane className="w-4 h-4 text-zinc-600 absolute bg-[#0a0a0a] group-hover:bg-[#111] px-1 group-hover:text-primary transition-colors delay-100" />
                  </div>
                  <span className="text-white font-bold">{log.dest}</span>
                </div>

                <h3 className="text-xl text-white font-bold mb-3 relative z-10">{log.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed relative z-10 flex-1">{log.desc}</p>
              </motion.div>

              {/* Connecting line between horizontal tickets on large screens */}
              {i < arr.length - 1 && (
                <div className="hidden xl:flex w-16 items-center justify-center relative">
                  <div className="absolute inset-x-0 h-px border-b border-dashed border-white/20 top-1/2 -translate-y-1/2"></div>
                  <ArrowRight className="text-primary w-5 h-5 relative z-10 bg-background px-1" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
