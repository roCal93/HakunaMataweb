import type { Quadrant, QuadrantAngles } from "./types";

// Animation durations
export const ANIMATION_DURATIONS = {
  ENTRY_START: 2.6,
  ENTRY_RETURN: 1.4,
  ROTATION: 0.7,
  GRADIENT_TRANSITION: 1,
  OVERLAY_FADE: 0.25,
  OVERLAY_SCALE: 0.45,
  COMPACT_TRANSITION: 1.5,
} as const;

// Timeouts
export const TIMEOUTS = {
  ANIMATE_IN_START: 600,
  ANIMATE_IN_COMPLETE: 4000,
  SEPARATORS_VISIBLE: 2000,
  INIT_ROTATION: 2000,
  QUADRANT_LOOP: 3000,
  QUADRANT_LOOP_REDUCED: 6000,
  GRADIENT_CHANGE: 2000,
  GRADIENT_CHANGE_REDUCED: 8000,
  OVERLAY_CLOSE: 500,
  RESUME_LOOP: 1500,
} as const;

// Scroll thresholds
export const SCROLL_THRESHOLDS = {
  COMPACT: 80,
  HIDE_CHEVRON: 100,
} as const;

// Offsets for smooth scrolling
export const SCROLL_OFFSETS = {
  MOBILE: 120,
  DESKTOP: 200,
  HERO: 100,
} as const;

// Breakpoints
export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 768,
  DESKTOP: 1200,
} as const;

// Scale values
export const SCALE_VALUES = {
  MOBILE: 0.71,
  DESKTOP: 1,
  COMPACT: 0.5,
} as const;

// Gradients
export const GRADIENTS = [
  "linear-gradient(to bottom right, #fffbeb, #fef3c7)", // amber-50 to amber-100
  "linear-gradient(to bottom right, #fef3c7, #fde68a)", // amber-100 to amber-200
  "linear-gradient(to bottom right, #fde68a, #fef3c7)", // amber-200 to amber-100
  "linear-gradient(to bottom right, #fef3c7, #fffbeb)", // amber-100 to amber-50
] as const;

// Separator colors
export const SEPARATOR_COLORS = [
  "rgba(254, 243, 199, 0.6)", // amber-100
  "rgba(253, 230, 138, 0.6)", // amber-200
  "rgba(254, 243, 199, 0.6)", // amber-100
  "rgba(255, 251, 235, 0.6)", // amber-50
] as const;

export const COMPACT_SEPARATOR_COLOR = "rgba(217, 119, 6, 0.1)"; // amber-600

// Quadrant angles
export const QUADRANT_ANGLES: QuadrantAngles = {
  explorer: 45,   // top right
  about: 135,     // bottom right
  contact: 225,   // bottom left
  creations: 315, // top left
} as const;

// Quadrant order for rotation
export const QUADRANTS_ORDER: readonly Quadrant[] = ['about', 'explorer', 'creations', 'contact'] as const;

// Area classes for quadrant overlays
export const QUADRANT_AREA_CLASSES: Record<Quadrant, string> = {
  explorer: "top-0 right-0",
  about: "bottom-0 right-0",
  contact: "bottom-0 left-0",
  creations: "top-0 left-0",
} as const;

// Rate limiting
export const RATE_LIMIT = {
  COUNT: 5,
  WINDOW: 60 * 1000, // 1 minute
} as const;

// Section to rotation mapping (degrees)
export const SECTION_ROTATIONS: Record<string, number> = {
  about: 0,
  explorer: 90,
  creations: 180,
  contact: 270,
};
