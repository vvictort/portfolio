import React from "react";
import { Camera, Music, Coffee, Mountain } from "lucide-react";
import { motion } from "framer-motion";

export function BeyondCodeSection() {
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const itemVars = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-8 py-20 flex flex-col gap-8 text-center items-center justify-center h-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-2 items-center">
        <span className="text-primary font-mono text-sm font-bold tracking-widest">GATE D4 //</span>
        <h2 className="text-5xl font-bold tracking-tight text-white mb-6">Beyond Code</h2>
        <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed mb-12">
          Life outside the IDE. Exploring the physical world and finding inspiration in everyday things.
        </p>
      </motion.div>

      <motion.div
        variants={containerVars}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {[
          { icon: Mountain, label: "Outdoors", desc: "Hiking the local trails" },
          { icon: Camera, label: "Photography", desc: "Capturing moments" },
          { icon: Music, label: "Vinyl", desc: "Collecting records" },
          { icon: Coffee, label: "Brewing", desc: "The perfect espresso" },
        ].map((item, i) => (
          <motion.div
            variants={itemVars}
            key={i}
            className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 flex flex-col items-center gap-4 group hover:border-primary/50 transition-colors">
            <item.icon className="w-8 h-8 text-zinc-600 group-hover:text-primary transition-colors" />
            <h3 className="font-mono text-sm tracking-widest uppercase text-white font-bold mt-2">{item.label}</h3>
            <p className="text-zinc-500 font-mono text-xs text-center leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
