import React, { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  glowSize: number;
  sparkle: boolean;
  color: [number, number, number];
};

type Meteor = {
  x: number;
  y: number;
  length: number;
  thickness: number;
  speedX: number;
  speedY: number;
  nextSpawnAt: number;
};

type MaskRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const STAR_TONES: Array<[number, number, number]> = [
  [255, 255, 255],
  [245, 247, 255],
  [250, 235, 190],
  [190, 225, 255],
];

function createStar(width: number, height: number): Star {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: 0.6 + Math.random() * 2,
    baseAlpha: 0.22 + Math.random() * 0.42,
    twinkleSpeed: 0.5 + Math.random() * 1.8,
    twinkleOffset: Math.random() * Math.PI * 2,
    glowSize: 3 + Math.random() * 10,
    sparkle: Math.random() > 0.9,
    color: STAR_TONES[Math.floor(Math.random() * STAR_TONES.length)],
  };
}

function resetMeteor(meteor: Meteor, width: number, height: number, time: number) {
  meteor.x = Math.random() * width * 0.75 - width * 0.1;
  meteor.y = -60 - Math.random() * height * 0.35;
  meteor.length = 70 + Math.random() * 110;
  meteor.thickness = 1 + Math.random() * 1.3;
  meteor.speedX = 0.9 + Math.random() * 0.6;
  meteor.speedY = 1.7 + Math.random() * 1;
  meteor.nextSpawnAt = time + 4200 + Math.random() * 7600;
}

function createMeteor(width: number, height: number, delay: number): Meteor {
  const meteor: Meteor = {
    x: 0,
    y: 0,
    length: 0,
    thickness: 0,
    speedX: 0,
    speedY: 0,
    nextSpawnAt: delay,
  };

  resetMeteor(meteor, width, height, delay);
  return meteor;
}

export function HeroStars() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const maskElement = document.querySelector("[data-hero-sky-mask]");
    const stars: Star[] = [];
    const meteors: Meteor[] = [];
    let width = 0;
    let height = 0;
    let frameId = 0;
    let lastTime = 0;
    let maskRect: MaskRect | null = null;

    const updateMaskRect = () => {
      if (!(maskElement instanceof HTMLElement)) {
        maskRect = null;
        return;
      }

      const canvasBounds = canvas.getBoundingClientRect();
      const elementBounds = maskElement.getBoundingClientRect();
      const padding = window.innerWidth < 768 ? 12 : 20;

      maskRect = {
        x: elementBounds.left - canvasBounds.left - padding,
        y: elementBounds.top - canvasBounds.top - padding,
        width: elementBounds.width + padding * 2,
        height: elementBounds.height + padding * 2,
      };
    };

    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targetCount = Math.max(80, Math.min(180, Math.round((width * height) / 8200)));
      stars.length = 0;
      meteors.length = 0;

      for (let i = 0; i < targetCount; i += 1) {
        stars.push(createStar(width, height));
      }

      if (!prefersReducedMotion) {
        for (let i = 0; i < 2; i += 1) {
          meteors.push(createMeteor(width, height, i * 3600));
        }
      }

      updateMaskRect();
    };

    const drawStar = (star: Star, time: number) => {
      const [red, green, blue] = star.color;
      const twinkle =
        star.baseAlpha + (Math.sin(time * 0.001 * star.twinkleSpeed + star.twinkleOffset) + 1) * 0.16;
      const clampedAlpha = Math.min(twinkle, 0.95);

      if (star.size > 1.4) {
        const glowRadius = star.glowSize;
        const glow = context.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowRadius);
        glow.addColorStop(0, `rgba(${red}, ${green}, ${blue}, ${clampedAlpha * 0.16})`);
        glow.addColorStop(0.3, `rgba(${red}, ${green}, ${blue}, ${clampedAlpha * 0.07})`);
        glow.addColorStop(0.65, `rgba(${red}, ${green}, ${blue}, ${clampedAlpha * 0.02})`);
        glow.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);

        context.fillStyle = glow;
        context.fillRect(star.x - glowRadius, star.y - glowRadius, glowRadius * 2, glowRadius * 2);
      }

      context.beginPath();
      context.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${clampedAlpha})`;
      context.fill();

      if (!star.sparkle) return;

      const spikeLength = star.size * (2.8 + Math.sin(time * 0.002 + star.twinkleOffset) * 0.6);
      const spikeAlpha = Math.min(clampedAlpha * 0.42, 0.38);

      context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${spikeAlpha})`;
      context.lineWidth = 0.8;
      context.lineCap = "round";

      context.beginPath();
      context.moveTo(star.x - spikeLength, star.y);
      context.lineTo(star.x + spikeLength, star.y);
      context.moveTo(star.x, star.y - spikeLength);
      context.lineTo(star.x, star.y + spikeLength);
      context.stroke();

      context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${spikeAlpha * 0.6})`;
      context.beginPath();
      context.moveTo(star.x - spikeLength * 0.7, star.y - spikeLength * 0.7);
      context.lineTo(star.x + spikeLength * 0.7, star.y + spikeLength * 0.7);
      context.moveTo(star.x - spikeLength * 0.7, star.y + spikeLength * 0.7);
      context.lineTo(star.x + spikeLength * 0.7, star.y - spikeLength * 0.7);
      context.stroke();
    };

    const drawMeteor = (meteor: Meteor, delta: number, time: number) => {
      if (time < meteor.nextSpawnAt) return;

      meteor.x += meteor.speedX * delta;
      meteor.y += meteor.speedY * delta;

      const directionLength = Math.hypot(meteor.speedX, meteor.speedY) || 1;
      const dirX = meteor.speedX / directionLength;
      const dirY = meteor.speedY / directionLength;
      const tailX = meteor.x - dirX * meteor.length;
      const tailY = meteor.y - dirY * meteor.length;

      const gradient = context.createLinearGradient(tailX, tailY, meteor.x, meteor.y);
      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(0.45, "rgba(250,204,21,0.12)");
      gradient.addColorStop(1, "rgba(255,255,255,0.95)");

      context.strokeStyle = gradient;
      context.lineWidth = meteor.thickness;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(tailX, tailY);
      context.lineTo(meteor.x, meteor.y);
      context.stroke();

      context.beginPath();
      context.arc(meteor.x, meteor.y, meteor.thickness * 1.8, 0, Math.PI * 2);
      context.fillStyle = "rgba(255,255,255,0.8)";
      context.fill();

      if (meteor.x - meteor.length > width || meteor.y - meteor.length > height) {
        resetMeteor(meteor, width, height, time);
      }
    };

    const draw = (time: number) => {
      const delta = lastTime ? Math.min(time - lastTime, 32) : 16;
      lastTime = time;

      context.clearRect(0, 0, width, height);

      for (const star of stars) {
        drawStar(star, time);
      }

      if (!prefersReducedMotion) {
        for (const meteor of meteors) {
          drawMeteor(meteor, delta, time);
        }
      }

      if (maskRect) {
        context.save();
        context.globalCompositeOperation = "destination-out";
        context.beginPath();

        if (typeof context.roundRect === "function") {
          context.roundRect(maskRect.x, maskRect.y, maskRect.width, maskRect.height, 28);
        } else {
          context.rect(maskRect.x, maskRect.y, maskRect.width, maskRect.height);
        }

        context.fill();
        context.restore();
      }

      frameId = window.requestAnimationFrame(draw);
    };

    setCanvasSize();
    frameId = window.requestAnimationFrame(draw);
    window.addEventListener("resize", setCanvasSize);
    window.addEventListener("scroll", updateMaskRect, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("scroll", updateMaskRect);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-75">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
    </div>
  );
}
