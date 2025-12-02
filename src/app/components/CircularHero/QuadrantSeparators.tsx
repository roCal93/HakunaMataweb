"use client";

import { m } from "framer-motion";
import { SEPARATOR_COLORS, COMPACT_SEPARATOR_COLOR } from "./constants";

interface QuadrantSeparatorsProps {
  visible: boolean;
  isCompact: boolean;
  gradientIndex: number;
}

export function QuadrantSeparators({
  visible,
  isCompact,
  gradientIndex,
}: QuadrantSeparatorsProps) {
  const separatorColor = isCompact 
    ? COMPACT_SEPARATOR_COLOR 
    : SEPARATOR_COLORS[gradientIndex];

  return (
    <>
      <m.div
        className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
        style={{
          width: "3px",
          background: `linear-gradient(to bottom, ${separatorColor}, #00000022 80%)`,
          boxShadow: "0 0 12px 2px #fbbf24, 0 2px 16px 0px #00000044"
        }}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: visible ? 1 : 0,
          background: `linear-gradient(to bottom, ${separatorColor}, #00000022 80%)`
        }}
        transition={{ duration: 0.5 }}
      />
      <m.div
        className="absolute top-1/2 left-0 right-0 -translate-y-1/2"
        style={{
          height: "3px",
          background: `linear-gradient(to right, ${separatorColor}, #00000022 80%)`,
          boxShadow: "0 0 12px 2px #fbbf24, 0 2px 16px 0px #00000044"
        }}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: visible ? 1 : 0,
          background: `linear-gradient(to right, ${separatorColor}, #00000022 80%)`
        }}
        transition={{ duration: 0.5 }}
      />
    </>
  );
}
