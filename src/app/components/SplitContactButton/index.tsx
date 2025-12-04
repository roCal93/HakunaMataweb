"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { m } from 'framer-motion';
import type { SplitContactButtonProps, ContactMethod, Stage, FormData } from './types';
import { ContactForm } from './ContactForm';
import { ContactButton } from './ContactButton';
import { BUTTON_ICONS } from './buttonIcons';
import { ANIMATION_TIMINGS, BREAKPOINTS } from './constants';
import { validateEmail, getContainerHeightClass, isButtonHidden, isButtonDisabled } from './utils';
import { getButtonStylesDesktop, getButtonStylesMobile } from './buttonStyles';

export default function SplitContactButton({
  onContactSelect,
  contactEmail = 'contact@hakunamataweb.fr',
  contactPhone = '+33745229697',
  messages,
}: SplitContactButtonProps) {
  // State management
  const [stage, setStage] = useState<Stage>('initial');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '', marketingConsent: false, website: '' });
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Refs
  const nameInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Timeout management
  const setSafeTimeout = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  // Handle initial button click (start animation)
  const handleClick = useCallback(() => {
    if (stage !== 'initial') return;

    setStage('stretching');
    setSafeTimeout(
      () => setStage('splitting'),
      prefersReducedMotion ? 0 : ANIMATION_TIMINGS.STRETCHING_DELAY
    );
    setSafeTimeout(
      () => setStage('split'),
      prefersReducedMotion ? 0 : ANIMATION_TIMINGS.SPLITTING_DELAY
    );
  }, [stage, prefersReducedMotion, setSafeTimeout]);

  // Handle contact method selection
  const handleContactClick = useCallback(
    (method: ContactMethod, buttonIndex: number) => {
      onContactSelect?.(method);

      switch (method) {
        case 'email':
          window.location.href = `mailto:${contactEmail}`;
          setTimeout(() => {
            if (document.hasFocus()) {
              const clipboard = navigator.clipboard;
              if (clipboard?.writeText) {
                clipboard
                  .writeText(contactEmail)
                  .then(() => {
                    setCopiedMessage(true);
                    setTimeout(() => setCopiedMessage(false), ANIMATION_TIMINGS.COPIED_MESSAGE_DURATION);
                  })
                  .catch(() => {
                    alert(`Votre client email ne s'est pas ouvert. Contactez-nous à : ${contactEmail}`);
                  });
              } else {
                alert(`Votre client email ne s'est pas ouvert. Contactez-nous à : ${contactEmail}`);
              }
            }
          }, ANIMATION_TIMINGS.EMAIL_FALLBACK_DELAY);
          break;

        case 'phone':
          window.location.href = `tel:${contactPhone}`;
          break;

        case 'whatsapp':
          window.open(`https://wa.me/${contactPhone.replace(/\+/g, '')}`, '_blank', 'noopener,noreferrer');
          break;

        case 'callback':
          setSelectedButton(buttonIndex);
          setStage('centering');
          setSafeTimeout(() => setShowForm(true), ANIMATION_TIMINGS.CENTERING_DELAY);
          break;
      }
    },
    [onContactSelect, contactEmail, contactPhone, setSafeTimeout]
  );

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const { name, email, message, marketingConsent, website } = formData;

      console.log('[FORM] Tentative d\'envoi...');

      if (!name.trim() || name.length < 2) {
        alert(messages.contactButton.form.validation.name);
        return;
      }
      if (!validateEmail(email)) {
        alert(messages.contactButton.form.validation.email);
        return;
      }
      if (!message.trim() || message.length < 10) {
        alert(messages.contactButton.form.validation.message);
        return;
      }

      console.log('[FORM] Validation OK, envoi vers /api/contact...');

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message, marketingConsent, website }),
        });

        console.log('[FORM] Réponse reçue:', res.status, res.statusText);

        if (res.ok) {
          console.log('[FORM] Succès!');
          setShowForm(false);
          setFormData({ name: '', email: '', message: '', marketingConsent: false, website: '' });
          setFormSuccess(true);
          setTimeout(() => setFormSuccess(false), ANIMATION_TIMINGS.SUCCESS_MESSAGE_DURATION);
          reset();

          setSafeTimeout(() => {
            const liveRegion = document.getElementById('contact-live-region');
            if (liveRegion) {
              liveRegion.textContent = `Merci ${name} ! Je vous contacterai bientôt à ${email}.`;
            }
          }, ANIMATION_TIMINGS.LIVE_REGION_DELAY);
        } else {
          const data = await res.json();
          console.error('[FORM] Erreur serveur:', data);
          alert(data.error || messages.contactButton.form.error.send);
        }
      } catch (error) {
        console.error('[FORM] Erreur réseau:', error);
        alert(`${messages.contactButton.form.error.network} ${error}`);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formData, messages, setSafeTimeout]
  );

  // Handle form close
  const handleFormClose = useCallback(() => {
    setShowForm(false);
    setSelectedButton(null);
    setStage('split');
  }, []);

  // Reset to initial state
  const reset = useCallback(() => {
    if (stage === 'initial') return;

    setShowForm(false);
    setSelectedButton(null);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    if (stage === 'split' || stage === 'splitting') {
      setStage('gathering');
      setSafeTimeout(() => setStage('initial'), ANIMATION_TIMINGS.GATHERING_DELAY);
    } else if (stage === 'centering') {
      setStage('split');
    } else if (stage === 'stretching') {
      setStage('initial');
    }
  }, [stage, setSafeTimeout]);

  // Focus management for form
  useEffect(() => {
    if (showForm && nameInputRef.current) {
      nameInputRef.current.focus();
    }

    const onKey = (e: KeyboardEvent) => {
      if (!showForm) return;

      if (e.key === 'Escape') {
        handleFormClose();
      }

      if (e.key === 'Tab') {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const focusable = dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showForm, handleFormClose]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Button labels
  const buttonLabels = [
    messages.contactButton.email,
    messages.contactButton.phone,
    messages.contactButton.whatsapp,
    messages.contactButton.callback,
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <div id="contact-live-region" aria-live="polite" className="sr-only" />

      <div
        className={`relative w-full ${getContainerHeightClass(stage, isMobile)} flex items-center justify-center overflow-visible`}
      >
        <div className="relative flex items-center justify-center w-full" role="group" aria-label={messages.aria.chooseContact}>
          {[0, 1, 2, 3].map((index) => {
            const isFormButton = showForm && index === 3;
            const isHidden = isButtonHidden(stage, index, selectedButton);
            const isDisabled = isButtonDisabled(stage, index, isHidden);

            const buttonStyles = isMobile
              ? getButtonStylesMobile(stage, index, selectedButton, copiedMessage, showForm, formSuccess)
              : getButtonStylesDesktop(stage, index, selectedButton, copiedMessage, showForm, formSuccess);

            if (isFormButton) {
              return (
                <ContactForm
                  key={`modal-${index}`}
                  ref={dialogRef}
                  formData={formData}
                  messages={messages}
                  nameInputRef={nameInputRef}
                  onFormDataChange={setFormData}
                  onSubmit={handleFormSubmit}
                  onClose={handleFormClose}
                />
              );
            }

            return (
              <ContactButton
                key={index}
                index={index}
                stage={stage}
                buttonStyles={buttonStyles}
                buttonLabels={buttonLabels}
                buttonIcons={BUTTON_ICONS}
                formSuccess={formSuccess}
                copiedMessage={copiedMessage}
                isDisabled={isDisabled}
                isHidden={isHidden}
                prefersReducedMotion={prefersReducedMotion}
                messages={messages}
                onClick={
                  index === 0 && stage === 'initial'
                    ? handleClick
                    : stage === 'split'
                    ? () =>
                        handleContactClick(
                          index === 0 ? 'email' : index === 1 ? 'phone' : index === 2 ? 'whatsapp' : 'callback',
                          index
                        )
                    : undefined
                }
              />
            );
          })}
        </div>
      </div>

      {stage !== 'initial' && (
        <m.button
          onClick={reset}
          className="mt-4 px-4 py-2 bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-sm cursor-pointer hover:bg-amber-200 transition-colors"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          aria-label={messages.aria.closeContactMenu}
        >
          {messages.contactButton.close}
        </m.button>
      )}
    </div>
  );
}
