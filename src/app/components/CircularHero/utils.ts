import type { Quadrant } from "./types";
import { SCROLL_OFFSETS } from "./constants";

/**
 * Smooth scroll to an element with offset
 */
export function smoothScrollTo(element: HTMLElement): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const isMobile = window.innerWidth < 768;
  const offset = isMobile ? SCROLL_OFFSETS.MOBILE : SCROLL_OFFSETS.DESKTOP;
  const targetPosition = Math.max(0, element.offsetTop - offset);
  
  try {
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  } catch {
    // Fallback for environments that don't support the options signature
    window.scrollTo(0, targetPosition);
  }
}

/**
 * Get rotated coordinates based on rotation angle
 */
export function getRotatedCoords(
  dx: number,
  dy: number,
  rotationDeg: number
): { dx_rot: number; dy_rot: number } {
  const angle = Math.atan2(dy, dx) - (rotationDeg * Math.PI / 180);
  const dist = Math.sqrt(dx * dx + dy * dy);
  return {
    dx_rot: Math.cos(angle) * dist,
    dy_rot: Math.sin(angle) * dist,
  };
}

/**
 * Determine quadrant from rotated coordinates
 */
export function quadrantFromRotated(dx_rot: number, dy_rot: number): Quadrant {
  if (dx_rot >= 0 && dy_rot <= 0) return 'explorer';
  if (dx_rot >= 0 && dy_rot > 0) return 'about';
  if (dx_rot < 0 && dy_rot > 0) return 'contact';
  return 'creations';
}

/**
 * Check if point is inside a circle
 */
export function isInsideCircle(
  clientX: number,
  clientY: number,
  centerX: number,
  centerY: number,
  radius: number
): boolean {
  const dx = clientX - centerX;
  const dy = clientY - centerY;
  const distanceSquared = dx * dx + dy * dy;
  return distanceSquared <= radius * radius;
}

/**
 * Get label rotation based on current rotation and quadrant position
 */
export function getLabelRotation(
  quadrantId: Quadrant,
  rotation: number
): number {
  const isBottomRight = 
    (quadrantId === 'about' && rotation === 0) ||
    (quadrantId === 'explorer' && rotation === 90) ||
    (quadrantId === 'creations' && rotation === 180) ||
    (quadrantId === 'contact' && rotation === 270);
  const isBottomLeft = 
    (quadrantId === 'contact' && rotation === 0) ||
    (quadrantId === 'about' && rotation === 90) ||
    (quadrantId === 'explorer' && rotation === 180) ||
    (quadrantId === 'creations' && rotation === 270);
  const isTopLeft = 
    (quadrantId === 'creations' && rotation === 0) ||
    (quadrantId === 'contact' && rotation === 90) ||
    (quadrantId === 'about' && rotation === 180) ||
    (quadrantId === 'explorer' && rotation === 270);
  const isTopRight = 
    (quadrantId === 'explorer' && rotation === 0) ||
    (quadrantId === 'creations' && rotation === 90) ||
    (quadrantId === 'contact' && rotation === 180) ||
    (quadrantId === 'about' && rotation === 270);
  
  const extraRotation = isBottomRight ? -45 : isBottomLeft ? 45 : isTopLeft ? -45 : isTopRight ? 45 : 0;
  return -rotation + extraRotation;
}

/**
 * Get transform origin based on quadrant
 */
export function getTransformOrigin(quadrant: Quadrant): string {
  switch (quadrant) {
    case 'explorer':
      return 'bottom left';
    case 'about':
      return 'top left';
    case 'contact':
      return 'top right';
    case 'creations':
      return 'bottom right';
    default:
      return 'center';
  }
}

/**
 * Check if quadrant is in bottom right position based on rotation
 */
export function isQuadrantBottomRight(quadrantId: Quadrant, rotation: number): boolean {
  return (
    (quadrantId === 'about' && rotation === 0) ||
    (quadrantId === 'explorer' && rotation === 90) ||
    (quadrantId === 'creations' && rotation === 180) ||
    (quadrantId === 'contact' && rotation === 270)
  );
}
