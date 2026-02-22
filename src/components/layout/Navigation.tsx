import React, { useEffect, useState } from "react";
import { Plane, Menu, X, ChevronRight } from "lucide-react";
import { cn } from "../../utils";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#about", label: "ABOUT", gate: "A1" },
  { href: "#journey", label: "JOURNEY", gate: "B2" },
  { href: "#destinations", label: "DESTINATIONS", gate: "C3" },
  { href: "#beyond-code", label: "BEYOND CODE", gate: "D4" },
  { href: "#contact", label: "CONTACT", gate: "E5" },
  { href: "#arrivals", label: "ARRIVALS", gate: "F6" },
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
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full bg-transparent transition-all duration-500">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-8 py-4 flex flex-row items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-3 text-primary relative cursor-pointer group"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}>
            <div className="relative flex items-center justify-center w-10 h-10">
              <motion.div
                className="absolute inset-0 rounded-full border border-primary/20 border-t-primary shadow-[0_0_10px_rgba(250,204,21,0.1)] group-hover:shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-shadow duration-300"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <Plane className="w-5 h-5 rotate-45 relative z-10 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-mono font-bold text-lg tracking-widest text-white group-hover:text-primary transition-colors duration-300">
                VT
              </span>
            </div>
          </motion.div>

          {/* Desktop Links (Clean, animated pill-style with active gate indicator) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center justify-center px-4 py-2 rounded-full transition-colors duration-300 overflow-hidden group",
                    isActive ? "text-primary" : "text-zinc-400 hover:text-white hover:bg-white/5",
                  )}>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary/10 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2 font-mono text-xs font-semibold tracking-widest">
                    <span>{link.label}</span>
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, width: 0, scale: 0.8 }}
                          animate={{ opacity: 1, width: "auto", scale: 1 }}
                          exit={{ opacity: 0, width: 0, scale: 0.8 }}
                          className="flex items-center text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm whitespace-nowrap overflow-hidden">
                          G-{link.gate}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </a>
              );
            })}
          </motion.div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors active:scale-95">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown (Clean, sliding list) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-[73px] left-0 right-0 z-40 bg-[#0a0a0a]/98 backdrop-blur-3xl border-b border-white/10 md:hidden overflow-hidden shadow-2xl">
            <div className="flex flex-col px-6 py-6 gap-2">
              <span className="text-[10px] font-mono text-zinc-500 tracking-widest mb-2 px-2">DEPARTURES</span>
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <motion.a
                    initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "group flex items-center justify-between p-4 rounded-xl transition-all duration-300",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(250,204,21,0.05)]"
                        : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent",
                    )}>
                    <div className="flex items-center gap-4">
                      <span
                        className={cn(
                          "font-mono text-sm tracking-widest font-semibold",
                          isActive ? "drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" : "",
                        )}>
                        {link.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-mono text-zinc-500">GATE</span>
                        <span
                          className={cn("text-xs font-mono font-bold", isActive ? "text-primary" : "text-zinc-300")}>
                          {link.gate}
                        </span>
                      </div>
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 transition-transform group-hover:translate-x-1",
                          isActive ? "text-primary" : "text-zinc-600",
                        )}
                      />
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
