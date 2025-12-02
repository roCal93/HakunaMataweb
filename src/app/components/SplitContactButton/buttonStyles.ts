import type { Stage, ButtonStyles } from './types';
import { SPACING } from './constants';
import {
  getInitialButtonStyles,
  getStretchingButtonStylesDesktop,
  getStretchingButtonStylesMobile,
  getCenteringButtonStyles,
  getFormButtonStyles,
  getFormSuccessStyles,
  getGatheringButtonStyles,
  calculateButtonPositionX,
  calculateButtonPositionY,
} from './utils';

/**
 * Get button styles for desktop layout
 */
export function getButtonStylesDesktop(
  stage: Stage,
  buttonIndex: number,
  selectedButton: number | null,
  copiedMessage: boolean,
  showForm: boolean,
  formSuccess: boolean
): ButtonStyles {
  // Special states
  if (stage === 'centering') {
    return getCenteringButtonStyles(buttonIndex, selectedButton);
  }

  if (showForm && buttonIndex === 3) {
    return getFormButtonStyles();
  }

  if (formSuccess && buttonIndex === 3) {
    return getFormSuccessStyles();
  }

  // Stage-based styles
  switch (stage) {
    case 'initial':
      return getInitialButtonStyles(buttonIndex, copiedMessage);

    case 'stretching':
      return getStretchingButtonStylesDesktop(buttonIndex, copiedMessage);

    case 'splitting':
      return {
        x: calculateButtonPositionX(buttonIndex, SPACING.SPLITTING_GAP),
        y: 0,
        width: 200,
        height: 48,
        opacity: 1,
        scale: 1,
        background: copiedMessage && buttonIndex === 0 ? '#10b981' : '#fef3c7',
      };

    case 'split':
      return {
        x: calculateButtonPositionX(buttonIndex, SPACING.FINAL_GAP),
        y: 0,
        width: 200,
        height: 48,
        opacity: 1,
        scale: 1,
        background: copiedMessage && buttonIndex === 0 ? '#10b981' : '#fef3c7',
      };

    case 'gathering':
      return getGatheringButtonStyles(copiedMessage);

    default:
      return getInitialButtonStyles(buttonIndex, copiedMessage);
  }
}

/**
 * Get button styles for mobile layout
 */
export function getButtonStylesMobile(
  stage: Stage,
  buttonIndex: number,
  selectedButton: number | null,
  copiedMessage: boolean,
  showForm: boolean,
  formSuccess: boolean
): ButtonStyles {
  // Special states
  if (stage === 'centering') {
    return getCenteringButtonStyles(buttonIndex, selectedButton);
  }

  if (showForm && buttonIndex === 3) {
    return getFormButtonStyles();
  }

  if (formSuccess && buttonIndex === 3) {
    return getFormSuccessStyles();
  }

  // Stage-based styles
  switch (stage) {
    case 'initial':
      return getInitialButtonStyles(buttonIndex, copiedMessage);

    case 'stretching':
      return getStretchingButtonStylesMobile(buttonIndex, copiedMessage);

    case 'splitting':
      return {
        x: 0,
        y: calculateButtonPositionY(buttonIndex, SPACING.SPLITTING_GAP_MOBILE),
        width: 200,
        height: 48,
        opacity: 1,
        scale: 1,
        background: copiedMessage && buttonIndex === 0 ? '#10b981' : '#fef3c7',
      };

    case 'split':
      return {
        x: 0,
        y: calculateButtonPositionY(buttonIndex, SPACING.FINAL_GAP_MOBILE),
        width: 200,
        height: 48,
        opacity: 1,
        scale: 1,
        background: copiedMessage && buttonIndex === 0 ? '#10b981' : '#fef3c7',
      };

    case 'gathering':
      return getGatheringButtonStyles(copiedMessage);

    default:
      return getInitialButtonStyles(buttonIndex, copiedMessage);
  }
}
