import React, { useEffect } from "react";
import Lenis from "lenis";

const MOBILE_MENU_TOGGLE_EVENT = "portfolio:mobile-menu-toggle";

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.7,
    });
    let rafId = 0;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    function handleMobileMenuToggle(event: Event) {
      const { isOpen } = (event as CustomEvent<{ isOpen?: boolean }>).detail ?? {};

      if (isOpen) {
        lenis.stop();
        return;
      }

      lenis.start();
    }

    window.addEventListener(MOBILE_MENU_TOGGLE_EVENT, handleMobileMenuToggle);
    rafId = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener(MOBILE_MENU_TOGGLE_EVENT, handleMobileMenuToggle);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
