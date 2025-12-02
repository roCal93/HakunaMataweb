// Button dimensions
export const BUTTON_DIMENSIONS = {
  BASE_WIDTH: 200,
  BASE_HEIGHT: 48,
  STRETCHED_WIDTH: 700,
  STRETCHED_HEIGHT: 160,
  FORM_WIDTH: 400,
  FORM_HEIGHT: 320,
} as const;

// Animation timings
export const ANIMATION_TIMINGS = {
  STRETCHING_DELAY: 1200,
  SPLITTING_DELAY: 2200,
  CENTERING_DELAY: 800,
  GATHERING_DELAY: 800,
  STRETCHING_DURATION: 1.2,
  DEFAULT_DURATION: 0.9,
  OPACITY_DURATION: 0.5,
  COPIED_MESSAGE_DURATION: 2000,
  SUCCESS_MESSAGE_DURATION: 3000,
  EMAIL_FALLBACK_DELAY: 1000,
  LIVE_REGION_DELAY: 100,
} as const;

// Spacing
export const SPACING = {
  SPLITTING_GAP: 15,
  SPLITTING_GAP_MOBILE: 15,
  FINAL_GAP: 25,
  FINAL_GAP_MOBILE: 25,
} as const;

// Colors
export const COLORS = {
  BASE: '#fef3c7',
  SUCCESS: '#10b981',
  FORM: '#fde68a',
} as const;

// Breakpoints
export const BREAKPOINTS = {
  MOBILE: 768,
} as const;

// Animation easing
export const EASING = {
  SPRING: [0.68, -0.55, 0.265, 1.55],
  LINEAR: 'linear',
} as const;
