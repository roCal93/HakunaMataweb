/**
 * Configuration LazyMotion pour réduire le bundle Framer Motion
 * Charge uniquement les fonctionnalités d'animation nécessaires
 */

// Import dynamique des features Framer Motion
export const loadMotionFeatures = () =>
  import("framer-motion").then((mod) => mod.domAnimation);

// Configuration par défaut pour reduced motion
export const reducedMotionConfig = {
  initial: false,
  animate: false,
  exit: false,
};

// Détection du préférence reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
