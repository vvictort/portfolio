import React, { useState } from "react";
import { Plane, MapPin, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils";

interface Node {
  id: string;
  year: string;
  title: string;
  desc: string;
  gate: string;
  origin: string;
  dest: string;
  cx: number;
  cy: number;
  status: string;
}

const nodes: Node[] = [
  {
    id: "leg-1",
    year: "2024",
    title: "Undergrad @ UBC",
    desc: "Started Computer Science journey. Focused on core data structures and software engineering principles.",
    gate: "D1",
    origin: "INIT",
    dest: "CPSC 110",
    cx: 150,
    cy: 280,
    status: "ARCHIVED",
  },
  {
    id: "leg-2",
    year: "2025",
    title: "Full-Stack Eng",
    desc: "Shipped first major project. Learned React, Node, and how to survive merge conflicts at hackathons.",
    gate: "D2",
    origin: "CPSC 110",
    dest: "DEV",
    cx: 500,
    cy: 120,
    status: "ARCHIVED",
  },
  {
    id: "leg-3",
    year: "2026",
    title: "AI & Data",
    desc: "Diving into Machine Learning and advanced systems. Cruising altitude achieved.",
    gate: "D3",
    origin: "DEV",
    dest: "PRO",
    cx: 850,
    cy: 220,
    status: "ACTIVE",
  },
];

// SVG path connecting the nodes with curves.
const flightPath = `M ${nodes[0].cx} ${nodes[0].cy} Q 325 50 ${nodes[1].cx} ${nodes[1].cy} Q 675 150 ${nodes[2].cx} ${nodes[2].cy}`;

export function InteractiveMap() {
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const activeNode = nodes[activeNodeIndex];

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 bg-[#050505] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl group transform-gpu backface-hidden">
      {/* Background Decor */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 translate-y-1/2" />

      {/* Map Area */}
      <div className="flex-1 relative aspect-4/3 md:aspect-2/1 min-h-[400px] border border-white/5 bg-black/40 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
        {/* Navigation Grid Overlays */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-4 left-4 font-mono text-[8px] text-zinc-500 uppercase tracking-widest">
            NAV POS: 49.1967° N, 123.1815° W
          </div>
          <div className="absolute bottom-4 right-4 font-mono text-[8px] text-zinc-500 uppercase tracking-widest">
            HDG: 284° // ALT: 35000ft
          </div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/5" />
          <div className="absolute left-1/2 top-0 h-full w-px bg-white/5" />
        </div>
        <svg viewBox="0 0 1000 400" className="w-full h-full absolute inset-0 z-10">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#facc15" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#facc15" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#facc15" stopOpacity="1" />
            </linearGradient>
            <filter id="nodeGlow">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.98  0 0 0 0 0.8  0 0 0 0 0.08  0 0 0 0.6 0" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Dotted path background */}
          <path d={flightPath} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeDasharray="6 10" />

          {/* Active Path with Glow */}
          <motion.path
            d={flightPath}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="3.5"
            className="drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Render Nodes */}
          {nodes.map((node, i) => {
            const isActive = activeNodeIndex === i;
            return (
              <g key={node.id} className="cursor-pointer group/node" onClick={() => setActiveNodeIndex(i)}>
                {/* Hit area */}
                <circle cx={node.cx} cy={node.cy} r={40} fill="transparent" />

                {/* Ring Outer */}
                <motion.circle
                  cx={node.cx}
                  cy={node.cy}
                  animate={{
                    r: isActive ? 12 : 10,
                    fill: isActive ? "rgba(250, 204, 21, 1)" : "rgba(0,0,0,1)",
                  }}
                  className={cn(
                    "stroke-[2px] transition-colors duration-500",
                    isActive ? "stroke-primary" : "stroke-zinc-600 group-hover/node:stroke-zinc-400",
                  )}
                />

                {/* Center dot (only visible when not active or as a subtle core) */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={2.5}
                  className={cn("transition-all duration-500", isActive ? "fill-black" : "fill-zinc-700")}
                />

                {/* Label */}
                <text
                  x={node.cx}
                  y={node.cy + 30}
                  textAnchor="middle"
                  className={cn(
                    "font-mono text-[10px] uppercase font-bold tracking-[0.2em] transition-all duration-500",
                    isActive ? "fill-primary" : "fill-zinc-600 group-hover/node:fill-zinc-400",
                  )}>
                  {node.dest}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Airplane Layer */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <svg viewBox="0 0 1000 400" className="w-full h-full overflow-visible">
            <motion.g
              initial={false}
              animate={{
                offsetDistance: activeNodeIndex === 0 ? "0%" : activeNodeIndex === 1 ? "51.5%" : "100%",
              }}
              transition={{ type: "spring", stiffness: 45, damping: 15 }}
              style={{
                offsetPath: `path("${flightPath}")`,
                offsetRotate: "auto 90deg",
              }}>
              <g transform="translate(-12, -12) rotate(-45)">
                <Plane className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] fill-white" />
              </g>
            </motion.g>
          </svg>
        </div>
      </div>

      {/* Details Panel (Avionics style) */}
      <div className="w-full md:w-80 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNodeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col h-full bg-black/55 border border-white/10 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 tracking-[0.3em] uppercase mb-1">NAV LOG</span>
                <span className="text-3xl font-mono font-bold text-primary [text-shadow:0_0_15px_rgba(250,204,21,0.3)]">
                  {activeNode.year}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-mono text-zinc-500 tracking-widest mb-1 italic">EN ROUTE</span>
                <div className="bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-sm flex items-center gap-2">
                  <Zap className="w-3 h-3 text-primary" />
                  <span className="text-primary font-mono text-[10px] font-bold">GTE {activeNode.gate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8 bg-black/40 p-4 rounded-xl border border-white/5 relative overflow-hidden group/route">
              <div className="flex flex-col">
                <span className="text-[8px] font-mono text-zinc-600">FROM</span>
                <span className="text-xs font-mono font-bold text-zinc-400">{activeNode.origin}</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full h-px bg-zinc-800 relative">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary/40 w-1/4"
                    animate={{ x: ["0%", "400%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <Plane className="w-3 h-3 text-zinc-700 mt-1 rotate-45" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono text-zinc-600">TO</span>
                <span className="text-xs font-mono font-bold text-white">{activeNode.dest}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 flex-1">
              <h3 className="text-lg font-mono font-bold text-white tracking-widest leading-tight uppercase">
                {activeNode.title}
              </h3>
              <p className="text-zinc-400 font-mono text-xs leading-relaxed">{activeNode.desc}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[8px] font-mono text-zinc-500 mb-1">AUTOPILOT</span>
                <span
                  className={cn(
                    "font-mono text-[9px] font-bold tracking-[0.2em]",
                    activeNode.status === "ACTIVE" ? "text-green-500" : "text-zinc-600",
                  )}>
                  {activeNode.status}
                </span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map((bit) => (
                  <div
                    key={bit}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      activeNode.status === "ACTIVE" ? "bg-primary/40 animate-pulse" : "bg-white/5",
                    )}
                    style={{ animationDelay: `${bit * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
