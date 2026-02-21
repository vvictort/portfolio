import React from "react";
import { Github, Linkedin, Mail, ArrowUpRight, Plane } from "lucide-react";
import { motion } from "framer-motion";

const contacts = [
  {
    id: "GIT",
    name: "GitHub",
    handle: "@vvictort",
    icon: Github,
    link: "https://github.com/vvictort",
  },
  {
    id: "LIN",
    name: "LinkedIn",
    handle: "vvictort20",
    icon: Linkedin,
    link: "https://linkedin.com/in/vvictort20",
  },
  {
    id: "EML",
    name: "Email",
    handle: "hello@example.com",
    icon: Mail,
    link: "mailto:hello@example.com",
  },
];

export function ArrivalsSection() {
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const itemVars = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-8 h-full flex flex-col py-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-2 relative mt-20">
        <span className="text-primary font-mono text-sm font-bold tracking-widest">GATE E5 //</span>
        <h2 className="text-6xl font-bold tracking-tight text-white mb-2">Arrivals</h2>
        <p className="text-zinc-400 text-xl max-w-xl leading-relaxed mt-4">
          Reached the final destination. Let's connect and build something together.
        </p>
      </motion.div>

      <motion.div
        variants={containerVars}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-3 gap-6 mt-16">
        {contacts.map((contact, i) => (
          <motion.a
            variants={itemVars}
            key={i}
            href={contact.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#0a0a0a] hover:bg-[#111] transition-all duration-300 border border-white/5 rounded-2xl p-8 flex flex-col group relative overflow-hidden">
            <div className="flex items-center justify-between mb-16">
              <contact.icon className="w-7 h-7 text-zinc-500 group-hover:text-primary transition-colors" />
              <ArrowUpRight className="w-5 h-5 text-zinc-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>

            <div className="flex flex-col gap-1 z-10">
              <span className="text-primary font-mono text-[10px] tracking-widest uppercase mb-2">{contact.id}</span>
              <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                {contact.name}
              </h3>
              <span className="text-zinc-500 font-mono text-sm">{contact.handle}</span>
            </div>
          </motion.a>
        ))}
      </motion.div>

      <div className="mt-auto pt-20 pb-8 flex items-center justify-between border-t border-white/5 text-zinc-600 font-mono text-[10px] uppercase tracking-widest px-4">
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4" /> VICTOR THAI
        </div>
        <div>DESIGNED & BUILT WITH REACT + TAILWIND CSS V4</div>
        <div>© 2026</div>
      </div>
    </div>
  );
}
