import React, { useState } from "react";
import { Plane, MapPin, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    dest: "CS101",
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
    origin: "CS101",
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
  const [activeNode, setActiveNode] = useState<Node>(nodes[0]);

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl group">
      {/* Background Decor */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 translate-y-1/2" />

      {/* Map Area */}
      <div className="flex-1 relative aspect-[2/1] min-h-[300px] border border-white/5 bg-black/40 rounded-2xl overflow-hidden shadow-inner">
        {/* Radar Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <div className="w-[100%] aspect-square rounded-full border border-primary/30" />
          <div className="absolute w-[70%] aspect-square rounded-full border border-primary/20" />
          <div className="absolute w-[40%] aspect-square rounded-full border border-primary/10" />
        </div>

        <svg viewBox="0 0 1000 400" className="w-full h-full drop-shadow-lg absolute inset-0">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#facc15" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#facc15" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#facc15" stopOpacity="1" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Base path (dotted/faded) */}
          <path d={flightPath} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeDasharray="4 6" />

          {/* Animated active path */}
          <motion.path
            d={flightPath}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="3"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />

          {/* Render Nodes */}
          {nodes.map((node) => {
            const isActive = activeNode.id === node.id;
            return (
              <g key={node.id} className="cursor-pointer group/node" onClick={() => setActiveNode(node)}>
                {/* Invisible hit area for easier clicking */}
                <circle cx={node.cx} cy={node.cy} r={60} fill="transparent" />

                {/* Node outer pulse */}
                {isActive && (
                  <motion.circle
                    cx={node.cx}
                    cy={node.cy}
                    r="24"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: [0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    className="fill-primary"
                  />
                )}

                {/* Node Ring */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={12}
                  fill="transparent"
                  className={`transition-all duration-300 stroke-2 ${isActive ? "stroke-primary" : "stroke-zinc-700"}`}
                />

                {/* Node core */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={4}
                  className={`transition-colors duration-300 ${isActive ? "fill-primary" : "fill-zinc-600"}`}
                  filter={isActive ? "url(#glow)" : ""}
                />

                {/* Text Label */}
                <text
                  x={node.cx}
                  y={node.cy + 30}
                  textAnchor="middle"
                  className={`font-mono text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${isActive ? "fill-white" : "fill-zinc-500"}`}>
                  {node.dest}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Animated Airplane */}
        {nodes.map((node, i) => {
          if (activeNode.id === node.id) {
            return (
              <motion.div
                key="plane"
                layoutId="plane"
                className="absolute z-10 text-black bg-primary rounded-full p-2 pointer-events-none drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]"
                transition={{ type: "spring", stiffness: 60, damping: 12 }}
                style={{
                  left: `calc(${(node.cx / 1000) * 100}% - 30px)`,
                  top: `calc(${(node.cy / 400) * 100}% - 30px)`,
                  x: "-50%",
                  y: "-50%",
                }}>
                <div style={{ transform: `rotate(${i === 0 ? 45 : i === 1 ? 15 : -10}deg)` }}>
                  <Plane className="w-4 h-4 fill-black" />
                </div>
              </motion.div>
            );
          }
          return null;
        })}
      </div>

      {/* Details Panel */}
      <div className="w-full md:w-80 flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNode.id}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full bg-white/[0.02] border border-white/10 p-6 rounded-2xl backdrop-blur-md">
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col">
                <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-1">YEAR</span>
                <span className="text-primary font-mono text-4xl font-bold [text-shadow:0_0_12px_rgba(250,204,21,0.4)]">
                  {activeNode.year}
                </span>
              </div>
              <div className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded flex items-center gap-2">
                <Zap className="w-3 h-3 text-primary" />
                <span className="text-primary font-mono text-[10px] tracking-widest uppercase font-bold">
                  GTE {activeNode.gate}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8 font-mono text-sm tracking-widest bg-black/40 p-3 rounded-lg border border-white/5 relative overflow-hidden">
              <span className="text-zinc-400 relative z-10">{activeNode.origin}</span>
              <div className="flex-1 h-px bg-zinc-700 relative z-10">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-primary w-1/3 blur-[2px]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "300%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <span className="text-white font-bold relative z-10">{activeNode.dest}</span>
            </div>

            <h3 className="text-xl font-mono uppercase tracking-wider text-white font-bold mb-3">{activeNode.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed flex-1">{activeNode.desc}</p>

            <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">SYS.STATUS</span>
              <span
                className={`font-mono text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 ${activeNode.status === "ACTIVE" ? "text-green-500 [text-shadow:0_0_8px_rgba(34,197,94,0.6)]" : "text-zinc-500 [text-shadow:0_0_8px_rgba(113,113,122,0.5)]"}`}>
                {activeNode.status === "ACTIVE" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                )}
                {activeNode.status}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
