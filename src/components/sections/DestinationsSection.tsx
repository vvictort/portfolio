import React from "react";
import { Plane, Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const projects = [
  {
    code: "PIF",
    context: "nwHacks 2026",
    gate: "C1",
    status: "LANDED",
    title: "PlayItForward",
    description:
      "A gamified community platform built at nwHacks 2026. Encourages acts of kindness through interactive challenges and social features.",
    tags: ["React", "TypeScript", "Node.js"],
  },
  {
    code: "CCO",
    context: "Hackathon Project",
    gate: "C2",
    status: "LANDED",
    title: "Carbon Compass",
    description:
      "Environmental tracking tool that helps users understand and reduce their carbon footprint through data visualization and actionable insights.",
    tags: ["JavaScript", "API", "Data Viz"],
  },
  {
    code: "HSA",
    context: "UBC Bolt 2025",
    gate: "C3",
    status: "LANDED",
    title: "Hotel Sentiment Analysis",
    description:
      "UBC Bolt 2025 project analyzing resort hotel reviews with NLP techniques. Predicts sentiment and extracts key themes from guest feedback.",
    tags: ["Python", "scikit-learn", "NLP"],
  },
  {
    code: "PLA",
    context: "UBC DSCI",
    gate: "C4",
    status: "LANDED",
    title: "PLAICraft Analysis",
    description:
      "Statistical analysis of player engagement patterns across age groups in Minecraft, using R for data wrangling and visualization.",
    tags: ["R", "Statistics", "ggplot2"],
  },
  {
    code: "AIC",
    context: "TELUS Tech 2026",
    gate: "C5",
    status: "LANDED",
    title: "AI Innovation Challenge",
    description:
      "A platform providing challenges and leaderboards for developers creating innovative AI solutions during the TELUS 2026 event.",
    tags: ["Next.js", "PostgreSQL"],
  },
  {
    code: "CDD",
    context: "ML Project",
    gate: "C6",
    status: "LANDED",
    title: "Credit Default Detection",
    description:
      "An exploratory data analysis and ML classification project aimed at predicting credit card defaults from user metrics.",
    tags: ["Python", "Pandas", "XGBoost"],
  },
];

export function DestinationsSection() {
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const itemVars = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-8 py-20 flex flex-col gap-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-2 relative">
        <span className="text-primary font-mono text-sm font-bold tracking-widest">GATE C3 //</span>
        <div className="flex items-center justify-between">
          <h2 className="text-5xl font-bold tracking-tight text-white mb-4">Destinations</h2>
          <a
            href="#"
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest">
            ALL FLIGHTS <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div
        variants={containerVars}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 gap-6 mt-8">
        {projects.map((proj, i) => (
          <motion.div
            variants={itemVars}
            key={i}
            className="bg-[#0a0a0a] hover:bg-[#111] transition-colors border border-white/5 rounded-2xl p-8 flex flex-col group relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="text-primary font-mono font-bold tracking-widest">{proj.code}</span>
                <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">{proj.context}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">GATE {proj.gate}</span>
                <span className="text-green-500 font-mono text-[10px] uppercase tracking-widest font-bold">
                  {proj.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{proj.title}</h3>
              <Plane className="w-5 h-5 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">{proj.description}</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {proj.tags.map((tag, j) => (
                <span
                  key={j}
                  className="bg-white/5 border border-white/10 px-3 py-1 rounded text-zinc-300 font-mono text-[10px]">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
              <a
                href="#"
                className="flex items-center gap-2 text-zinc-600 hover:text-white transition-colors font-mono text-[10px] uppercase tracking-widest">
                <Github className="w-4 h-4" /> SOURCE
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
