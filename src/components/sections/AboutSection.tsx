import React from "react";
import { Plane, MapPin, GraduationCap, Code } from "lucide-react";
import { cn } from "../../utils";
import { motion } from "framer-motion";

export function AboutSection() {
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-8 py-20 flex flex-col gap-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-2">
        <span className="text-primary font-mono text-sm font-bold tracking-widest">GATE A1 //</span>
        <h2 className="text-5xl font-bold tracking-tight text-white mb-4">Passenger Profile</h2>
      </motion.div>

      <motion.div
        variants={containerVars}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col gap-8">
        {/* Boarding Pass */}
        <motion.div
          variants={itemVars}
          className="w-full bg-[#111] border border-white/5 rounded-2xl flex flex-col p-8 relative overflow-hidden">
          {/* Pass Top row: YVR ...DEV */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <span className="text-5xl font-bold tracking-wider text-white">YVR</span>
              <span className="text-zinc-500 font-mono text-xs mt-1 uppercase">Origin</span>
            </div>

            <div className="flex-1 mx-8 flex items-center relative gap-4">
              <div className="flex-1 border-t border-dashed border-zinc-700"></div>
              <Plane className="w-5 h-5 text-primary" />
              <div className="flex-1 border-t border-dashed border-zinc-700"></div>
            </div>

            <div className="flex flex-col items-end pr-8 border-r border-white/10">
              <span className="text-5xl font-bold tracking-wider text-white">DEV</span>
              <span className="text-zinc-500 font-mono text-xs mt-1 uppercase">Destination</span>
            </div>

            <div className="flex flex-col items-center justify-center pl-8">
              <span className="text-zinc-500 font-mono text-xs uppercase mb-1 tracking-widest">Gate</span>
              <span className="text-primary text-4xl font-bold">A1</span>
              <span className="text-zinc-500 font-mono text-[10px] uppercase mt-1 tracking-widest">Boarding</span>
            </div>
          </div>

          {/* Pass Bottom info */}
          <div className="grid grid-cols-4 gap-8">
            <div className="flex flex-col">
              <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-1">Passenger</span>
              <span className="font-mono text-sm text-foreground">THAI, VICTOR</span>
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-1">Date</span>
              <span className="font-mono text-sm text-foreground">2024-PRESENT</span>
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-1">Flight</span>
              <span className="font-mono text-sm text-foreground">VT2026</span>
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-1">Seat</span>
              <span className="font-mono text-sm text-foreground">3A</span>
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div variants={itemVars} className="grid grid-cols-3 gap-4">
          {[
            { icon: MapPin, label: "Location", value: "Vancouver, BC" },
            { icon: GraduationCap, label: "Education", value: "CS @ UBC" },
            { icon: Code, label: "Focus", value: "Full-Stack Dev" },
          ].map((item, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 flex flex-col gap-4">
              <item.icon className="w-5 h-5 text-primary" />
              <div className="flex flex-col gap-1">
                <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">{item.label}</span>
                <span className="text-sm font-medium text-white">{item.value}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Text block */}
        <motion.div
          variants={itemVars}
          className="flex flex-col gap-6 mt-4 text-zinc-400 max-w-3xl text-lg leading-relaxed">
          <p>
            Hey there! I'm Victor, a third-year Computer Science student at the University of British Columbia. I'm
            passionate about building software that makes a difference - from full-stack web applications to machine
            learning projects. Currently exploring ThreeJS, React, and deepening my skills in data science and software
            architecture.
          </p>
          <p>
            When I'm not coding, you'll find me exploring the mountains around Vancouver, shooting hoops at the campus
            courts, or discovering new music at local vinyl shops. I believe the best software comes from diverse
            experiences and perspectives.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
