import React, { useEffect, useState } from "react";
import { Plane, Menu, X, ChevronRight } from "lucide-react";
import { cn } from "../../utils";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/#about", label: "ABOUT", gate: "A1" },
  { href: "/#journey", label: "JOURNEY", gate: "B2" },
  { href: "/#destinations", label: "DESTINATIONS", gate: "C3" },
  { href: "/#beyond-code", label: "BEYOND CODE", gate: "D4" },
  { href: "/#contact", label: "CONTACT", gate: "E5" },
  { href: "/#arrivals", label: "ARRIVALS", gate: "F6" },
];

const galleryLinks = [
  { href: "/outdoor", label: "OUTDOOR LOG", gate: "04-A" },
  { href: "/food", label: "FOOD LOG", gate: "04-B" },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState("departures");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        // Use a margin to detect the section in the center/top of the viewport
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      },
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const isHome =
      window.location.pathname === "/" ||
      window.location.pathname === "" ||
      window.location.pathname.endsWith("/index.html");

    // If it's a hash link and we're on the home page
    if (isHome && href.startsWith("/#")) {
      const id = href.split("#")[1];
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: "smooth" });
        setIsMobileMenuOpen(false);
      }
    } else {
      // For any other link (or we're on a subpage), allow default behavior
      setIsMobileMenuOpen(false);
    }
  };

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
              const isActive = activeSection === link.href.split("#")[1];
              const isHovered = hoveredPath === link.href;

              return (
                <motion.a
                  layout
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHoveredPath(link.href)}
                  onMouseLeave={() => setHoveredPath(null)}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={cn(
                    "relative flex items-center justify-center px-4 py-2 rounded-full overflow-hidden group",
                    isActive ? "text-primary" : "text-zinc-400 hover:text-white",
                  )}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}>
                  {/* Hover Bubble */}
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="nav-hover"
                      className="absolute inset-0 bg-white/5 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary/10 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-2 font-mono text-xs font-semibold tracking-widest">
                    <span>{link.label}</span>
                    <AnimatePresence mode="popLayout">
                      {isActive && (
                        <motion.span
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex items-center text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm whitespace-nowrap overflow-hidden"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}>
                          G-{link.gate}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.a>
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

      {/* Mobile Menu Overlay (Immersive "Boarding Pass" style) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-100 bg-black/60 backdrop-blur-2xl md:hidden overflow-hidden flex flex-col pt-24">
            {/* Background Texture/Grid */}
            <div className="absolute inset-0 bg-airport-grid opacity-20 pointer-events-none" />

            <div className="flex flex-col px-8 relative z-10 overflow-y-auto scrollbar-hide pb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between mb-12 pr-20">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-zinc-500 tracking-[0.3em] uppercase mb-1">
                    TERMINAL 1
                  </span>
                  <span className="text-2xl font-mono font-bold text-white tracking-widest">DEPARTURES</span>
                </div>
                <div className="hidden sm:block w-12 h-px bg-primary/30" />
              </motion.div>

              {/* Main Nav */}
              <div className="flex flex-col gap-2">
                {navLinks.map((link, i) => {
                  const isActive = activeSection === link.href.split("#")[1];
                  return (
                    <motion.a
                      initial={{ opacity: 0, x: -30, filter: "blur(8px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={cn(
                        "group relative flex items-center justify-between p-5 rounded-2xl transition-all duration-300 transform-gpu backface-hidden",
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/30 shadow-[0_0_20px_rgba(250,204,21,0.05)]"
                          : "bg-white/3 text-zinc-400 border border-white/5 hover:bg-white/5 hover:text-white",
                      )}>
                      <div className="flex flex-col gap-1">
                        <span
                          className={cn(
                            "font-mono text-[9px] tracking-[0.2em] mb-1 font-bold",
                            isActive ? "text-primary" : "text-zinc-600",
                          )}>
                          GATE {link.gate}
                        </span>
                        <span className="text-xl font-mono font-bold tracking-widest uppercase">{link.label}</span>
                      </div>
                      <ChevronRight className={cn("w-4 h-4", isActive ? "text-primary" : "text-zinc-800")} />
                    </motion.a>
                  );
                })}
              </div>

              {/* Discovery Logs Divider */}
              <div className="flex items-center gap-4 my-4 px-4">
                <span className="shrink-0 text-[9px] leading-none font-mono text-zinc-500 tracking-[0.45em] uppercase whitespace-nowrap">
                  Discovery Logs
                </span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              {/* Gallery Nav */}
              <div className="grid grid-cols-2 gap-2">
                {galleryLinks.map((link, i) => (
                  <motion.a
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-white/3 border border-white/5 rounded-xl p-4 flex flex-col gap-2 hover:bg-white/5 hover:border-primary/20 transition-all group">
                    <span className="text-[8px] font-mono text-zinc-600 tracking-widest uppercase font-bold group-hover:text-primary transition-colors">
                      {link.gate}
                    </span>
                    <span className="text-[10px] font-mono text-white font-bold tracking-widest uppercase group-hover:text-primary transition-colors">
                      {link.label}
                    </span>
                  </motion.a>
                ))}
              </div>

              {/* Bottom Decoration */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4 opacity-40">
                <Plane className="w-6 h-6 rotate-45 text-zinc-600" />
                <span className="font-mono text-[8px] tracking-[0.4em] text-zinc-500">READY FOR DEPARTURE</span>
              </motion.div>
            </div>

            {/* Close Button UI Redesign (Pill) */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-primary active:scale-90 transition-transform">
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
