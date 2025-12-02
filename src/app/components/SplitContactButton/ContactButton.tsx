"use client";

import { m, AnimatePresence } from 'framer-motion';
import type { Stage, ButtonStyles } from './types';
import type { Messages } from '@/lib/types';
import { ANIMATION_TIMINGS, EASING } from './constants';

interface ContactButtonProps {
  index: number;
  stage: Stage;
  buttonStyles: ButtonStyles;
  buttonLabels: string[];
  buttonIcons: React.ReactNode[];
  formSuccess: boolean;
  copiedMessage: boolean;
  isDisabled: boolean;
  isHidden: boolean;
  prefersReducedMotion: boolean;
  messages: Messages;
  onClick?: () => void;
}

export function ContactButton({
  index,
  stage,
  buttonStyles,
  buttonLabels,
  buttonIcons,
  formSuccess,
  copiedMessage,
  isDisabled,
  isHidden,
  prefersReducedMotion,
  messages,
  onClick,
}: ContactButtonProps) {
  const getButtonClass = () => {
    if (formSuccess && index === 3) return 'bg-green-500 text-white';
    if (copiedMessage && index === 0) return 'bg-green-500 text-white';
    return 'bg-amber-100 text-amber-800';
  };

  const shouldShowHover = (index === 0 && stage === 'initial') || stage === 'split';

  return (
    <m.button
      onClick={onClick}
      className={`absolute py-3 px-4 rounded-lg text-lg font-semibold shadow-lg whitespace-nowrap overflow-hidden flex items-center justify-center ${getButtonClass()}`}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      animate={buttonStyles as any}
      transition={{
        duration: prefersReducedMotion
          ? 0
          : stage === 'stretching'
          ? ANIMATION_TIMINGS.STRETCHING_DURATION
          : ANIMATION_TIMINGS.DEFAULT_DURATION,
        ease: prefersReducedMotion ? EASING.LINEAR : EASING.SPRING,
        opacity: { duration: prefersReducedMotion ? 0 : ANIMATION_TIMINGS.OPACITY_DURATION },
      }}
      whileHover={
        shouldShowHover ? { y: -4, boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)' } : {}
      }
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      disabled={isDisabled}
      aria-label={
        stage === 'initial' && index === 0 ? messages.contactButton.initial : buttonLabels[index]
      }
      aria-disabled={isDisabled}
      aria-hidden={isHidden}
    >
      <AnimatePresence mode="wait">
        {formSuccess && index === 3 ? (
          <m.span
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="inline-block px-4 flex items-center"
          >
            {messages.contactButton.form.success}
          </m.span>
        ) : copiedMessage && index === 0 ? (
          <m.span
            key="copied"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="inline-block px-4 flex items-center"
          >
            {messages.contactButton.form.copied}
          </m.span>
        ) : stage === 'initial' && index === 0 ? (
          <m.span
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block px-4 flex items-center"
          >
            {messages.contactButton.initial}
          </m.span>
        ) : (
          <m.span
            key="split"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block px-4 flex items-center"
          >
            {buttonIcons[index]}
            {buttonLabels[index]}
          </m.span>
        )}
      </AnimatePresence>
    </m.button>
  );
}
