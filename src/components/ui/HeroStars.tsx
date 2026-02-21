import React from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

export function HeroStars() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={1.5} />
      </Canvas>
    </div>
  );
}
