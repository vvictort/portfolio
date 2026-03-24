import React, { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  drift: number;
};

function createStar(width: number, height: number): Star {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: 0.7 + Math.random() * 1.8,
    baseAlpha: 0.2 + Math.random() * 0.45,
    twinkleSpeed: 0.8 + Math.random() * 1.8,
    twinkleOffset: Math.random() * Math.PI * 2,
    drift: 0.15 + Math.random() * 0.45,
  };
}

export function HeroStars() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stars: Star[] = [];
    let width = 0;
    let height = 0;
    let frameId = 0;
    let lastTime = 0;

    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targetCount = Math.max(90, Math.min(220, Math.round((width * height) / 7000)));
      stars.length = 0;

      for (let i = 0; i < targetCount; i += 1) {
        stars.push(createStar(width, height));
      }
    };

    const draw = (time: number) => {
      const delta = lastTime ? Math.min(time - lastTime, 32) : 16;
      lastTime = time;

      context.clearRect(0, 0, width, height);

      for (const star of stars) {
        if (!prefersReducedMotion) {
          star.y += star.drift * (delta / 18);

          if (star.y > height + star.size * 2) {
            star.y = -star.size * 2;
            star.x = Math.random() * width;
          }
        }

        const twinkle =
          star.baseAlpha + (Math.sin(time * 0.001 * star.twinkleSpeed + star.twinkleOffset) + 1) * 0.18;

        context.fillStyle = `rgba(255, 255, 255, ${Math.min(twinkle, 0.92)})`;
        context.fillRect(star.x, star.y, star.size, star.size);

        if (star.size > 1.8) {
          context.fillStyle = `rgba(250, 204, 21, ${Math.min(twinkle * 0.18, 0.18)})`;
          context.fillRect(star.x - 0.6, star.y - 0.6, star.size + 1.2, star.size + 1.2);
        }
      }

      frameId = window.requestAnimationFrame(draw);
    };

    setCanvasSize();
    frameId = window.requestAnimationFrame(draw);
    window.addEventListener("resize", setCanvasSize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
    </div>
  );
}
