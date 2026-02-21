import React, { useEffect, useState } from "react";
import { Plane } from "lucide-react";
import { cn } from "../utils";
import { motion } from "framer-motion";

const navLinks = [
  { href: "#about", label: "ABOUT", gate: "A1" },
  { href: "#journey", label: "JOURNEY", gate: "B2" },
  { href: "#destinations", label: "DESTINATIONS", gate: "C3" },
  { href: "#beyond-code", label: "BEYOND CODE", gate: "D4" },
  { href: "#arrivals", label: "ARRIVALS", gate: "E5" },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState("departures");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 },
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-none flex justify-center w-full">
      <div className="w-full max-w-6xl mx-auto px-8 py-6 flex flex-row items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-2 text-primary pointer-events-auto">
          <Plane className="w-6 h-6 rotate-45" />
          <span className="font-mono font-bold text-xl tracking-wider">VT</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex items-center gap-8 font-mono text-sm pointer-events-auto">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "tracking-widest transition-all duration-300 px-3 py-1.5 rounded-md border border-transparent",
                  isActive ? "text-primary border-primary/30 bg-primary/5" : "text-zinc-500 hover:text-zinc-300",
                )}>
                {link.label}
              </a>
            );
          })}
        </motion.div>
      </div>
    </nav>
  );
}
