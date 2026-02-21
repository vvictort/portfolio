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
          className="w-full bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col p-8 relative overflow-hidden shadow-2xl group">
          {/* Background Decor */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          {/* Pass Top row: YVR ...DEV */}
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex flex-col">
              <span className="text-6xl font-mono font-bold tracking-wider text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                YVR
              </span>
              <span className="text-zinc-500 font-mono text-xs mt-2 uppercase tracking-widest">Origin</span>
            </div>

            <div className="flex-1 mx-12 flex items-center relative gap-4">
              <div className="flex-1 h-px bg-zinc-700/50 relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-primary/50 w-1/2 blur-[1px]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <div className="bg-primary/10 p-3 rounded-full border border-primary/20 relative">
                <div className="absolute inset-0 rounded-full border border-primary/40 animate-ping opacity-20" />
                <Plane className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 h-px bg-zinc-700/50 relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-primary/50 w-1/2 blur-[1px]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 2, delay: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>

            <div className="flex flex-col items-end pr-8 border-r border-white/10">
              <span className="text-6xl font-mono font-bold tracking-wider text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                DEV
              </span>
              <span className="text-zinc-500 font-mono text-xs mt-2 uppercase tracking-widest">Destination</span>
            </div>

            <div className="flex flex-col items-center justify-center pl-8 relative">
              <span className="text-zinc-500 font-mono text-xs uppercase mb-2 tracking-widest">Gate</span>
              <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
                <span className="text-primary text-4xl font-mono font-bold [text-shadow:0_0_12px_rgba(250,204,21,0.4)]">
                  A1
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-500 font-mono text-[10px] uppercase tracking-widest font-bold">
                  Boarding
                </span>
              </div>
            </div>
          </div>

          {/* Pass Bottom info */}
          <div className="grid grid-cols-4 gap-8 relative z-10 bg-black/40 p-6 rounded-2xl border border-white/5">
            <div className="flex flex-col gap-1.5">
              <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">Passenger</span>
              <span className="font-mono text-sm text-white font-bold tracking-wider">THAI, VICTOR</span>
            </div>
            <div className="flex flex-col gap-1.5 border-l border-white/5 pl-8">
              <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">Date</span>
              <span className="font-mono text-sm text-white font-bold tracking-wider">2024-PRESENT</span>
            </div>
            <div className="flex flex-col gap-1.5 border-l border-white/5 pl-8">
              <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">Flight</span>
              <span className="font-mono text-sm text-white font-bold tracking-wider">VT2026</span>
            </div>
            <div className="flex flex-col gap-1.5 border-l border-white/5 pl-8">
              <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">Seat</span>
              <span className="font-mono text-sm text-white font-bold tracking-wider">3A</span>
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
                <span className="font-mono text-sm text-white uppercase tracking-wider">{item.value}</span>
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
