"use client";

import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { MouseEvent } from "react";
import type { NavItem, Quadrant } from "./types";
import { QUADRANT_AREA_CLASSES, ANIMATION_DURATIONS } from "./constants";
import { getTransformOrigin } from "./utils";

interface QuadrantOverlayProps {
  currentQuadrant: Quadrant | null;
  activeItem: NavItem | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onLinkClick: (href: string) => (e: MouseEvent<HTMLAnchorElement>) => void;
}

export function QuadrantOverlay({
  currentQuadrant,
  activeItem,
  onMouseEnter,
  onMouseLeave,
  onLinkClick,
}: QuadrantOverlayProps) {
  if (!currentQuadrant || !activeItem) {
    return null;
  }

  return (
    <AnimatePresence>
      <m.div
        key={currentQuadrant}
        className="pointer-events-none absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: ANIMATION_DURATIONS.OVERLAY_FADE }}
      >
        <m.div
          className={`absolute ${QUADRANT_AREA_CLASSES[currentQuadrant]} flex h-1/2 w-1/2 items-center justify-center bg-amber-50/90 p-16 pt-20 shadow-2xl backdrop-blur-xl`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: ANIMATION_DURATIONS.OVERLAY_SCALE }}
          style={{ transformOrigin: getTransformOrigin(currentQuadrant) }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="pointer-events-auto max-w-sm space-y-12 text-center text-gray-900">
            {/* Background images based on quadrant */}
            {activeItem.id === 'about' && (
              <div className="absolute inset-0 flex justify-center items-center gap-20 z-0 pointer-events-none">
                <Image src="/images/Ampoule.webp" alt="" aria-hidden width={128} height={128} className="w-32 h-32 opacity-10" />
                <Image src="/images/cible.webp" alt="" aria-hidden width={128} height={128} className="w-32 h-32 opacity-10" />
                <Image src="/images/valeur.webp" alt="" aria-hidden width={128} height={128} className="w-32 h-32 opacity-10" />
              </div>
            )}
            {activeItem.id === 'explorer' && (
              <div className="absolute inset-0 flex justify-center items-center z-0 pointer-events-none">
                <Image src="/images/jumelles.webp" alt="" aria-hidden width={224} height={224} className="w-56 h-56 opacity-10" loading="eager" />
              </div>
            )}
            {activeItem.id === 'creations' && (
              <div className="absolute inset-0 flex justify-center items-center z-0 pointer-events-none">
                <Image src="/images/crayon.webp" alt="" aria-hidden width={384} height={384} className="w-96 h-96 opacity-10" loading="eager" />
              </div>
            )}
            {activeItem.id === 'contact' && (
              <div className="absolute inset-0 flex justify-center items-center gap-20 z-0 pointer-events-none">
                <Image src="/images/telephone.webp" alt="" aria-hidden width={128} height={128} className="w-32 h-32 opacity-10" />
                <Image src="/images/Email.webp" alt="" aria-hidden width={128} height={128} className="w-32 h-32 opacity-10" />
                <Image src="/images/WhatsApp.webp" alt="" aria-hidden width={128} height={128} className="w-32 h-32 opacity-10" />
              </div>
            )}

            <div className="relative z-10">
              <p 
                className="text-lg uppercase tracking-[0.35em] text-amber-500 mb-12 mt-[-3rem]" 
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
              >
                {activeItem.label}
              </p>
              <p 
                className="text-lg font-medium leading-relaxed text-gray-700" 
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
              >
                {activeItem.ctaDescription}
              </p>
            </div>
            <a
              href={activeItem.href}
              onClick={onLinkClick(activeItem.href)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-500 hover:from-amber-500 hover:to-amber-700 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
            >
              <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                {activeItem.ctaLabel}
              </span>
              <span aria-hidden style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                →
              </span>
            </a>
          </div>
        </m.div>
      </m.div>
    </AnimatePresence>
  );
}
