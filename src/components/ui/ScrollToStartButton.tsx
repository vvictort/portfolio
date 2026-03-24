import React from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { scrollSectionIntoView } from "../../utils";

export function ScrollToStartButton() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollSectionIntoView("about");
  };

  return (
    <motion.a
      href="/#about"
      aria-label="Scroll to start"
      onClick={handleClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      whileHover="hover"
      className="absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-0.5 font-mono text-sm text-zinc-500 transition-colors duration-300 hover:text-white">
      <span className="text-[11px] font-semibold tracking-widest uppercase whitespace-nowrap">Scroll to start</span>
      <motion.span
        className="mt-[-2px] text-base leading-none"
        variants={{ hover: { y: 2 } }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}>
        <ChevronDown className="w-4 h-4" />
      </motion.span>
    </motion.a>
  );
}
