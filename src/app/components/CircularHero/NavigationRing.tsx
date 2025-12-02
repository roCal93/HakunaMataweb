"use client";

import type { MouseEvent } from "react";
import type { NavItem, Quadrant } from "./types";
import { getLabelRotation, isQuadrantBottomRight } from "./utils";

interface NavigationRingProps {
  navItems: NavItem[];
  activeQuadrant: Quadrant | null;
  isCompact: boolean;
  rotation: number;
  onLabelMouseEnter: (e: MouseEvent<HTMLAnchorElement>, id: Quadrant) => void;
  onLabelMouseLeave: () => void;
  onLabelFocus: (id: Quadrant) => void;
  onLabelBlur: () => void;
  onLinkClick: (href: string) => (e: MouseEvent<HTMLAnchorElement>) => void;
}

export function NavigationRing({
  navItems,
  activeQuadrant,
  isCompact,
  rotation,
  onLabelMouseEnter,
  onLabelMouseLeave,
  onLabelFocus,
  onLabelBlur,
  onLinkClick,
}: NavigationRingProps) {
  return (
    <nav className="absolute inset-0 z-30">
      {navItems.map((item) => {
        const labelRotation = getLabelRotation(item.id, rotation);
        const isBottomRight = isQuadrantBottomRight(item.id, rotation);
        const isBottomLeft = 
          (item.id === 'contact' && rotation === 0) ||
          (item.id === 'about' && rotation === 90) ||
          (item.id === 'explorer' && rotation === 180) ||
          (item.id === 'creations' && rotation === 270);

        return (
          <a
            key={item.id}
            href={item.href}
            aria-label={item.label}
            onClick={onLinkClick(item.href)}
            style={{
              ...item.labelStyle,
              transform: `translate(-50%, -50%) rotate(${labelRotation}deg)`
            }}
            className={`absolute text-2xl font-semibold transition-colors hover:text-amber-800 focus:text-amber-800 focus:outline-none ${
              activeQuadrant === item.id 
                ? "text-amber-800" 
                : isCompact && isBottomRight 
                ? "text-amber-800" 
                : "text-amber-600"
            }`}
            onMouseEnter={(e) => onLabelMouseEnter(e, item.id)}
            onMouseLeave={onLabelMouseLeave}
            onFocus={() => onLabelFocus(item.id)}
            onBlur={onLabelBlur}
          >
            <svg width="160" height="80" viewBox="0 0 160 80">
              <path 
                id={`curve-${item.id}`} 
                d={isBottomLeft || isBottomRight 
                  ? "M 16 32 Q 80 64 144 32" 
                  : "M 16 64 Q 80 32 144 64"
                } 
                fill="none" 
              />
              <text 
                fontSize="26" 
                fill="currentColor" 
                fontWeight="600" 
                textAnchor="middle" 
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
              >
                <textPath href={`#curve-${item.id}`} startOffset="50%">
                  {item.label}
                </textPath>
              </text>
            </svg>
          </a>
        );
      })}
    </nav>
  );
}
