import type { Messages } from "@/lib/types";

export type Quadrant = "explorer" | "about" | "contact" | "creations";

export interface NavItem {
  id: Quadrant;
  label: string;
  href: string;
  labelStyle: { top: string; left: string };
  ctaLabel: string;
  ctaDescription: string;
  ctaAlignment: string;
}

export interface CircularHeroProps {
  messages: Messages;
}

export interface QuadrantAngles {
  explorer: number;
  about: number;
  contact: number;
  creations: number;
}

export interface AnimationState {
  animateIn: 'start' | 'return' | 'none';
  entryActive: Quadrant | null;
  separatorsVisible: boolean;
  gradientIndex: number;
}

export interface InteractionState {
  activeQuadrant: Quadrant | null;
  isCompact: boolean;
  rotation: number;
  showChevron: boolean;
  chevronHovered: boolean;
  showOverlays: boolean;
}

export interface ViewportState {
  viewportWidth: number | null;
  mobileScale: number;
  isMobile: boolean;
}
