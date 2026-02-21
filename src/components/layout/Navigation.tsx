import React, { useEffect, useState } from "react";
import { Plane, Menu, X } from "lucide-react";
import { cn } from "../../utils";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#about", label: "ABOUT", gate: "A1" },
  { href: "#journey", label: "JOURNEY", gate: "B2" },
  { href: "#destinations", label: "DESTINATIONS", gate: "C3" },
  { href: "#beyond-code", label: "BEYOND CODE", gate: "D4" },
  { href: "#arrivals", label: "ARRIVALS", gate: "E5" },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState("departures");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full bg-[#000000]/80 backdrop-blur-md border-b border-white/5">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-8 py-4 md:py-6 flex flex-row items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-3 text-primary pointer-events-auto relative cursor-pointer"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}>
            <div className="relative flex items-center justify-center w-10 h-10">
              {/* Spinning Radar Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-primary/30 border-t-primary shadow-[0_0_10px_rgba(250,204,21,0.2)]"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <Plane className="w-5 h-5 rotate-45 relative z-10" />
            </div>
            <span className="font-mono font-bold text-xl tracking-wider drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]">
              VT
            </span>
          </motion.div>

          {/* Desktop Links */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hidden md:flex items-center gap-8 font-mono text-sm pointer-events-auto">
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

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center pointer-events-auto">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary p-2 flex items-center gap-2">
              <span className="font-mono text-xs tracking-widest bg-primary/10 px-3 py-1.5 border border-primary/30 rounded-md flex items-center gap-2">
                {isMobileMenuOpen ? <X className="w-3 h-3" /> : <Menu className="w-3 h-3" />}
                {isMobileMenuOpen ? "CLOSE" : "MENU"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[73px] left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 md:hidden flex justify-center w-full">
            <div className="flex flex-col w-full px-6 py-4 font-mono text-sm">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "tracking-widest transition-all py-4 border-b border-white/5 flex items-center justify-between",
                      isActive ? "text-primary" : "text-zinc-400 hover:text-white",
                    )}>
                    <span>{link.label}</span>
                    <span className="text-zinc-600 text-[10px] bg-white/5 px-2 py-1 rounded">GATE {link.gate}</span>
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
