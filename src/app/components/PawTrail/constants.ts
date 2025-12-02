import type { PawTrailConfig } from './types';

export const DEFAULT_CONFIG: PawTrailConfig = {
  src: "/images/empreinte-patte.webp",
  size: 12,
  step: 30,
  bodyWidth: 30,
  frequency: 500,
  drift: 25,
  edgeMargin: 12,
  avoidanceStrength: 0.8,
  anticipation: 0.8,
  maxPaws: 24,
  roamOnIdle: true,
  idleAfter: 800,
  debug: false,
  debugScale: 0.1,
  curvedSteer: true,
  turnSpeed: 45,
  rearOffset: 0.8,
} as const;

// Animation delays (in milliseconds)
export const ANIMATION_DELAYS = {
  START: 3000,
  FADE_OUT: 1200,
} as const;

// Math constants
export const MATH = {
  DEGREES_TO_RADIANS: Math.PI / 180,
  RADIANS_TO_DEGREES: 180 / Math.PI,
  RIGHT_ANGLE: Math.PI / 2,
} as const;

// Physics tuning
export const PHYSICS = {
  MAX_AVOIDANCE_MARGIN: 300,
  RANDOM_NOISE: 0.2,
  DIRECTION_MIX_MIN: 1,
} as const;

// Debug visualization
export const DEBUG_COLORS = {
  AVOIDANCE_MARGIN: "rgba(255,165,0,0.6)",
  MOVEMENT_VECTOR: "#38bdf8",
  AVOIDANCE_VECTOR: "#ef4444",
  DESIRED_VECTOR: "#a78bfa",
  FORWARD_POINT: "#10b981",
  SIDE_POINT: "#f97316",
} as const;

export const DEBUG_SIZES = {
  MOVEMENT_VECTOR: 60,
  AVOIDANCE_VECTOR: 80,
  DESIRED_VECTOR: 90,
  POINT_RADIUS: 4,
  STROKE_WIDTH: 2,
} as const;
