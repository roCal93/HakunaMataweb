import type { Stage, ButtonStyles } from './types';
import { BUTTON_DIMENSIONS, COLORS } from './constants';

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Get button position multiplier based on index
 */
export function getButtonPositionMultiplier(buttonIndex: number): number {
  switch (buttonIndex) {
    case 0:
      return -1.5;
    case 1:
      return -0.5;
    case 2:
      return 0.5;
    case 3:
      return 1.5;
    default:
      return 0;
  }
}

/**
 * Calculate button position for splitting/split stages (desktop)
 */
export function calculateButtonPositionX(
  buttonIndex: number,
  gap: number
): number {
  const multiplier = getButtonPositionMultiplier(buttonIndex);
  return BUTTON_DIMENSIONS.BASE_WIDTH * multiplier + gap * multiplier;
}

/**
 * Calculate button position for splitting/split stages (mobile)
 */
export function calculateButtonPositionY(
  buttonIndex: number,
  gap: number
): number {
  const multiplier = getButtonPositionMultiplier(buttonIndex);
  return BUTTON_DIMENSIONS.BASE_HEIGHT * multiplier + gap * multiplier;
}

/**
 * Get base button styles for initial state
 */
export function getInitialButtonStyles(
  buttonIndex: number,
  copiedMessage: boolean
): ButtonStyles {
  return {
    x: 0,
    y: 0,
    width: buttonIndex === 0 ? BUTTON_DIMENSIONS.BASE_WIDTH : 0,
    height: BUTTON_DIMENSIONS.BASE_HEIGHT,
    opacity: buttonIndex === 0 ? 1 : 0,
    scale: buttonIndex === 0 ? 1 : 0,
    background: copiedMessage && buttonIndex === 0 ? COLORS.SUCCESS : COLORS.BASE,
  };
}

/**
 * Get button styles for stretching state (desktop)
 */
export function getStretchingButtonStylesDesktop(
  buttonIndex: number,
  copiedMessage: boolean
): ButtonStyles {
  return {
    x: 0,
    y: 0,
    width: buttonIndex === 0 ? BUTTON_DIMENSIONS.STRETCHED_WIDTH : 0,
    height: BUTTON_DIMENSIONS.BASE_HEIGHT,
    opacity: buttonIndex === 0 ? 1 : 0,
    scale: buttonIndex === 0 ? 1 : 0,
    background: copiedMessage && buttonIndex === 0 ? COLORS.SUCCESS : COLORS.BASE,
  };
}

/**
 * Get button styles for stretching state (mobile)
 */
export function getStretchingButtonStylesMobile(
  buttonIndex: number,
  copiedMessage: boolean
): ButtonStyles {
  return {
    x: 0,
    y: 0,
    width: BUTTON_DIMENSIONS.BASE_WIDTH,
    height: buttonIndex === 0 ? BUTTON_DIMENSIONS.STRETCHED_HEIGHT : 0,
    opacity: buttonIndex === 0 ? 1 : 0,
    scale: buttonIndex === 0 ? 1 : 0,
    background: copiedMessage && buttonIndex === 0 ? COLORS.SUCCESS : COLORS.BASE,
  };
}

/**
 * Get button styles for centering state
 */
export function getCenteringButtonStyles(
  buttonIndex: number,
  selectedButton: number | null
): ButtonStyles {
  if (buttonIndex === selectedButton) {
    return {
      x: 0,
      y: 0,
      width: BUTTON_DIMENSIONS.BASE_WIDTH,
      height: BUTTON_DIMENSIONS.BASE_HEIGHT,
      opacity: 1,
      scale: 1,
      background: COLORS.BASE,
    };
  }

  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    opacity: 0,
    scale: 0,
    background: COLORS.BASE,
  };
}

/**
 * Get button styles for form display
 */
export function getFormButtonStyles(): ButtonStyles {
  return {
    x: 0,
    y: 0,
    width: BUTTON_DIMENSIONS.FORM_WIDTH,
    height: BUTTON_DIMENSIONS.FORM_HEIGHT,
    opacity: 1,
    scale: 1.04,
    borderRadius: '1.5rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    background: COLORS.FORM,
  };
}

/**
 * Get button styles for form success state
 */
export function getFormSuccessStyles(): ButtonStyles {
  return {
    x: 0,
    y: 0,
    width: BUTTON_DIMENSIONS.BASE_WIDTH,
    height: BUTTON_DIMENSIONS.BASE_HEIGHT,
    opacity: 1,
    scale: 1,
    borderRadius: '0.5rem',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    background: COLORS.SUCCESS,
  };
}

/**
 * Get button styles for gathering state
 */
export function getGatheringButtonStyles(copiedMessage: boolean): ButtonStyles {
  return {
    x: 0,
    y: 0,
    width: BUTTON_DIMENSIONS.BASE_WIDTH,
    height: BUTTON_DIMENSIONS.BASE_HEIGHT,
    opacity: 1,
    scale: 0.95,
    background: copiedMessage ? COLORS.SUCCESS : COLORS.BASE,
  };
}

/**
 * Get container height class based on stage and mobile state
 */
export function getContainerHeightClass(stage: Stage, isMobile: boolean): string {
  if (isMobile) {
    if (stage === 'initial') return 'h-12';
    if (stage === 'stretching') return 'h-40';
    if (
      stage === 'splitting' ||
      stage === 'split' ||
      stage === 'centering' ||
      stage === 'gathering'
    ) {
      return 'h-80';
    }
  }
  return 'h-24';
}

/**
 * Check if button should be hidden
 */
export function isButtonHidden(
  stage: Stage,
  buttonIndex: number,
  selectedButton: number | null
): boolean {
  if (stage === 'centering' && buttonIndex !== selectedButton) {
    return true;
  }

  if (stage === 'initial' || stage === 'stretching') {
    return buttonIndex !== 0;
  }

  return false;
}

/**
 * Check if button should be disabled
 */
export function isButtonDisabled(
  stage: Stage,
  buttonIndex: number,
  isHidden: boolean
): boolean {
  return isHidden || (stage !== 'split' && !(buttonIndex === 0 && stage === 'initial'));
}
