"use client";

import { forwardRef } from "react";
import { m } from "framer-motion";
import type { Messages } from "@/lib/types";
import { ANIMATION_DURATIONS } from "./constants";

interface InnerCircleProps {
  isCompact: boolean;
  mobileScale: number;
  messages: Messages;
  onClick: () => void;
}

export const InnerCircle = forwardRef<HTMLDivElement, InnerCircleProps>(
  ({ isCompact, mobileScale, messages, onClick }, ref) => {
    return (
      <m.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
        initial={{ scale: 0 }}
        animate={{ scale: isCompact ? 0.5 : mobileScale }}
        transition={{
          type: 'tween',
          ease: [0.68, -0.55, 0.27, 1.55],
          duration: isCompact ? ANIMATION_DURATIONS.ROTATION : ANIMATION_DURATIONS.ENTRY_START,
        }}
      >
        <m.div
          ref={ref}
          className="absolute inset-24 z-20 rounded-full bg-white shadow-md cursor-pointer"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #fffbeb, #fde68a)',
            boxShadow: 'inset 0 3px 10px rgba(0,0,0,0.15), 0 5px 15px rgba(0,0,0,0.1)'
          }}
          initial={{ scale: 0.01, opacity: 0.01 }}
          animate={{ scale: 1, opacity: isCompact ? 0.8 : 1 }}
          transition={{
            type: 'tween',
            ease: [0.68, -0.55, 0.27, 1.55],
            duration: isCompact ? ANIMATION_DURATIONS.ROTATION : ANIMATION_DURATIONS.ENTRY_START,
          }}
          whileHover={{ scale: 1.05 }}
          onClick={onClick}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center pointer-events-auto rounded-full overflow-hidden">
            <h1 className="flex flex-col items-center text-2xl font-semibold text-gray-900">
              <span 
                className="text-center text-3xl uppercase tracking-[0.20em] text-amber-500 font-bold my-2" 
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
              >
                {messages.home.title}
              </span>
              <span 
                className="text-center font-medium italic text-amber-500" 
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
              >
                {messages.home.subtitle}
              </span>
            </h1>
          </div>
        </m.div>
      </m.div>
    );
  }
);

InnerCircle.displayName = "InnerCircle";
