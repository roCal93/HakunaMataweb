"use client";

import { m } from 'framer-motion';
import type { Paw } from './types';
import { ANIMATION_DELAYS } from './constants';

interface PawPrintProps {
  paw: Paw;
  src: string;
  size: number;
}

export function PawPrint({ paw, src, size }: PawPrintProps) {
  return (
    <m.img
      key={paw.id}
      src={src}
      width={size}
      height={size}
      alt="paw"
      className="fixed pointer-events-none select-none z-[9999]"
      style={{
        left: paw.x,
        top: paw.y,
        transform: "translate(-50%, -50%)",
        filter: "drop-shadow(0 8px 16px rgba(16,24,40,0.08))",
        opacity: 0.5,
        willChange: "transform, opacity",
      }}
      initial={{ opacity: 0.5, scale: 0.86, rotate: paw.angle + 90 }}
      animate={{
        opacity: 0,
        scale: 1.02,
        rotate: paw.angle + 90,
        transition: { 
          delay: ANIMATION_DELAYS.FADE_OUT / 1000, 
          duration: 0, 
          ease: "easeOut" 
        },
      }}
    />
  );
}
