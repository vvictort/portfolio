import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Plane } from "lucide-react";

export function BackgroundCosmetics() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

  // Map scroll progress (0 to 1) to x and y coordinates on the screen.
  // The plane will start from deep bottom-left and fly to top-right.
  const x = useTransform(scrollYProgress, [0, 1], ["-10vw", "110vw"]);
  const y = useTransform(scrollYProgress, [0, 1], ["110vh", "-10vh"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Parallax Airplane */}
      <motion.div
        className="absolute z-0 opacity-10 text-zinc-500"
        style={{
          x,
          y,
          rotate: 45, // Adjust rotation so the plane points toward its flight path (top-right)
        }}>
        <Plane className="w-64 h-64" />
      </motion.div>
    </div>
  );
}
