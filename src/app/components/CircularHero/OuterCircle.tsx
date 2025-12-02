"use client";

import { forwardRef, type MouseEvent } from "react";
import { m } from "framer-motion";
import type { Quadrant } from "./types";
import { QuadrantSeparators } from "./QuadrantSeparators";
import { NavigationRing } from "./NavigationRing";
import { GRADIENTS, QUADRANT_ANGLES, ANIMATION_DURATIONS } from "./constants";
import type { NavItem } from "./types";

interface OuterCircleProps {
  isCompact: boolean;
  mobileScale: number;
  rotation: number;
  activeQuadrant: Quadrant | null;
  animateIn: 'start' | 'return' | 'none';
  reduceMotion: boolean;
  gradientIndex: number;
  separatorsVisible: boolean;
  navItems: NavItem[];
  onMouseMove: (e: MouseEvent<HTMLElement>) => void;
  onClick: (e: MouseEvent<HTMLElement>) => void;
  onLabelMouseEnter: (e: MouseEvent<HTMLAnchorElement>, id: Quadrant) => void;
  onLabelMouseLeave: () => void;
  onLabelFocus: (id: Quadrant) => void;
  onLabelBlur: () => void;
  onLinkClick: (href: string) => (e: MouseEvent<HTMLAnchorElement>) => void;
}

export const OuterCircle = forwardRef<HTMLDivElement, OuterCircleProps>(
  (
    {
      isCompact,
      mobileScale,
      rotation,
      activeQuadrant,
      animateIn,
      reduceMotion,
      gradientIndex,
      separatorsVisible,
      navItems,
      onMouseMove,
      onClick,
      onLabelMouseEnter,
      onLabelMouseLeave,
      onLabelFocus,
      onLabelBlur,
      onLinkClick,
    },
    ref
  ) => {
    const currentGradient = GRADIENTS[gradientIndex];
    const compactGradient = `linear-gradient(${
      activeQuadrant ? QUADRANT_ANGLES[activeQuadrant] : 135 - rotation
    }deg, #fbbf24, #fffbeb)`;

    return (
      <m.div
        ref={ref}
        className="relative z-10 flex h-[28rem] w-[28rem] items-center justify-center rounded-full shadow-2xl transition-all duration-700 ease-out border-4 border-amber-400"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent), ${
            isCompact ? compactGradient : currentGradient
          }`,
          boxShadow:
            '0 0 32px 8px #fbbf24, 0 8px 32px 0px #00000044, inset 0 3px 16px rgba(0,0,0,0.18)',
          border: '4px solid #fbbf24',
        }}
        initial={{ scale: 0.01, rotate: 360, opacity: 0.01 }}
        animate={{
          scale:
            animateIn === 'start'
              ? 0.01
              : animateIn === 'return'
              ? 1
              : isCompact
              ? 0.5
              : mobileScale,
          rotate: animateIn === 'start' ? 360 : animateIn === 'return' ? 0 : rotation,
          opacity: animateIn === 'start' ? 0.01 : isCompact ? 0.6 : 1,
          backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent), ${
            isCompact ? compactGradient : currentGradient
          }`,
        }}
        transition={{
          type: 'tween',
          ease: reduceMotion ? 'linear' : [0.68, -0.55, 0.27, 1.55],
          duration: reduceMotion
            ? 0
            : animateIn === 'start'
            ? ANIMATION_DURATIONS.ENTRY_START
            : animateIn === 'return'
            ? ANIMATION_DURATIONS.ENTRY_RETURN
            : ANIMATION_DURATIONS.ROTATION,
          backgroundImage: { duration: reduceMotion ? 0 : ANIMATION_DURATIONS.GRADIENT_TRANSITION },
        }}
        onMouseMove={onMouseMove}
        onClick={onClick}
      >
        <QuadrantSeparators
          visible={separatorsVisible}
          isCompact={isCompact}
          gradientIndex={gradientIndex}
        />

        <NavigationRing
          navItems={navItems}
          activeQuadrant={activeQuadrant}
          isCompact={isCompact}
          rotation={rotation}
          onLabelMouseEnter={onLabelMouseEnter}
          onLabelMouseLeave={onLabelMouseLeave}
          onLabelFocus={onLabelFocus}
          onLabelBlur={onLabelBlur}
          onLinkClick={onLinkClick}
        />
      </m.div>
    );
  }
);

OuterCircle.displayName = "OuterCircle";
