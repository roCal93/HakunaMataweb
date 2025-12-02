import type { Position, EdgeProximity, Viewport } from './types';
import { MATH, PHYSICS } from './constants';

/**
 * Calculate proximity to viewport edges
 */
export function calculateEdgeProximity(
  pos: Position,
  viewport: Viewport,
  anticipation: number
): EdgeProximity {
  const avoidanceMargin = Math.min(
    viewport.width / 2,
    viewport.height / 2,
    PHYSICS.MAX_AVOIDANCE_MARGIN
  ) * Math.max(1, anticipation);

  const leftProx = Math.max(0, (avoidanceMargin - pos.x) / avoidanceMargin);
  const rightProx = Math.max(
    0,
    (avoidanceMargin - (viewport.width - pos.x)) / avoidanceMargin
  );
  const topProx = Math.max(0, (avoidanceMargin - pos.y) / avoidanceMargin);
  const bottomProx = Math.max(
    0,
    (avoidanceMargin - (viewport.height - pos.y)) / avoidanceMargin
  );

  return {
    px: leftProx - rightProx,
    py: topProx - bottomProx,
    total: Math.max(leftProx, rightProx, topProx, bottomProx),
    margin: avoidanceMargin,
  };
}

/**
 * Calculate normalized avoidance vector from edge proximity
 */
export function calculateAvoidanceVector(proximity: EdgeProximity): Position {
  const avx = proximity.px + (Math.random() - 0.5) * PHYSICS.RANDOM_NOISE;
  const avy = proximity.py + (Math.random() - 0.5) * PHYSICS.RANDOM_NOISE;
  const alen = Math.hypot(avx, avy) || 1;
  return { x: avx / alen, y: avy / alen };
}

/**
 * Smoothly update direction with turn speed limit
 */
export function updateDirection(
  currentAngle: number,
  desiredAngle: number,
  deltaTime: number,
  turnSpeed: number,
  curvedSteer: boolean
): number {
  if (!curvedSteer) return desiredAngle;

  const maxDelta = (turnSpeed * MATH.DEGREES_TO_RADIANS) * (deltaTime / 1000);
  let diff = desiredAngle - currentAngle;
  
  // Normalize angle difference to [-π, π]
  diff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;
  
  const clamped = Math.max(-maxDelta, Math.min(maxDelta, diff));
  return currentAngle + clamped;
}

/**
 * Clamp position to viewport bounds with margin
 */
export function clampPosition(
  x: number,
  y: number,
  minMargin: number,
  viewport: Viewport
): Position {
  const maxX = Math.max(minMargin, viewport.width - minMargin);
  const maxY = Math.max(minMargin, viewport.height - minMargin);
  
  return {
    x: Math.max(minMargin, Math.min(x, maxX)),
    y: Math.max(minMargin, Math.min(y, maxY)),
  };
}

/**
 * Calculate safe starting position within viewport
 */
export function calculateSafeStartPosition(
  viewport: Viewport,
  minMargin: number
): Position {
  const safeStartX = Math.max(
    minMargin,
    Math.min(viewport.width / 2, viewport.width - minMargin)
  );
  const safeStartY = Math.max(
    minMargin,
    Math.min(viewport.height / 2, viewport.height - minMargin)
  );
  
  return { x: safeStartX, y: safeStartY };
}

/**
 * Mix movement and avoidance vectors based on proximity
 */
export function mixDirectionVectors(
  movementVector: Position,
  avoidanceVector: Position,
  proximityTotal: number,
  anticipation: number,
  avoidanceStrength: number
): Position {
  const mix = Math.min(
    PHYSICS.DIRECTION_MIX_MIN,
    proximityTotal * anticipation * avoidanceStrength
  );
  
  const fx = (1 - mix) * movementVector.x + mix * avoidanceVector.x;
  const fy = (1 - mix) * movementVector.y + mix * avoidanceVector.y;
  
  const flen = Math.hypot(fx, fy) || 1;
  return { x: fx / flen, y: fy / flen };
}

/**
 * Calculate position with offset at given angle
 */
export function calculateOffsetPosition(
  basePos: Position,
  angle: number,
  distance: number
): Position {
  return {
    x: basePos.x + Math.cos(angle) * distance,
    y: basePos.y + Math.sin(angle) * distance,
  };
}

/**
 * Get random direction variation
 */
export function getRandomDirectionVariation(
  baseDirection: number,
  drift: number
): number {
  return baseDirection + (Math.random() * drift - drift / 2);
}

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return degrees * MATH.DEGREES_TO_RADIANS;
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return radians * MATH.RADIANS_TO_DEGREES;
}
