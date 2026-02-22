import React from "react";
import { Plane, FolderGit2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../utils";

export interface Project {
  code: string;
  context: string;
  gate: string;
  status: string;
  title: string;
  date: string;
  category: string;
  description: string;
  tags: string[];
  github?: string;
  live?: string;
}

interface Props {
  projects: Project[];
}

export function DestinationsSection({ projects }: Props) {
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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mb-4 md:mb-0">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Destinations</h2>
          <a
            href="https://github.com/vvictort"
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest mt-2 md:mt-0">
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
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {projects.map((proj, i) => (
          <motion.div
            variants={itemVars}
            key={i}
            className="group relative bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-primary/30 transition-[border-color,box-shadow] duration-500 hover:shadow-[0_0_30px_rgba(250,204,21,0.1)] flex flex-col overflow-hidden h-full transform-gpu backface-hidden will-change-[transform,opacity]">
            {/* Background Decor */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none translate-x-1/3 -translate-y-1/3" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Tech Header */}
            <div className="w-full px-8 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between relative overflow-hidden z-10">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs tracking-widest text-white font-bold uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  SEC: {proj.code}
                </span>
              </div>
              <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase border border-white/10 px-2 py-0.5 rounded-sm bg-black/40">
                SYS.DEF
              </span>
            </div>

            {/* Project Details */}
            <div className="p-8 relative z-10 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-8">
                <span className="text-primary font-mono text-xs font-bold tracking-widest uppercase bg-primary/10 px-3 py-1 rounded-sm border border-primary/20">
                  GATE {proj.gate}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest border-b border-zinc-500/30 pb-0.5">
                    {proj.context}
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-mono uppercase tracking-wider text-white font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                {proj.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-1">{proj.description}</p>

              <div className="flex items-center justify-between mb-8">
                {(() => {
                  const isLanded = proj.status === "LANDED";
                  const colorClass = isLanded ? "bg-green-500" : "bg-cyan-500";
                  const textClass = isLanded ? "text-green-500" : "text-cyan-500";
                  const shadowClass = isLanded
                    ? "[text-shadow:0_0_8px_rgba(34,197,94,0.6)]"
                    : "[text-shadow:0_0_8px_rgba(6,182,212,0.6)]";

                  return (
                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-md border border-white/5">
                      <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", colorClass)} />
                      <span
                        className={cn(
                          "font-mono text-[10px] uppercase tracking-widest font-bold",
                          textClass,
                          shadowClass,
                        )}>
                        {proj.status}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {proj.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="px-3 py-1 rounded font-mono text-[10px] font-bold tracking-widest text-primary bg-primary/10 border border-primary/30 shadow-[0_0_8px_rgba(250,204,21,0.4)] transition-all">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-6 border-t border-white/10 mt-auto">
                <a
                  href={proj.github}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-3 text-sm font-mono tracking-widest transition-colors duration-300">
                  <FolderGit2 className="w-4 h-4" />
                  <span>REPO</span>
                </a>
                {proj.live && (
                  <a
                    href={proj.live}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary rounded-lg py-3 text-sm font-mono tracking-widest font-bold transition-colors duration-300 shadow-[0_0_12px_rgba(250,204,21,0.2)]">
                    <ExternalLink className="w-4 h-4" />
                    <span>LIVE</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
