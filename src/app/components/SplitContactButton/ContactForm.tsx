"use client";

import { m } from 'framer-motion';
import { forwardRef, useMemo } from 'react';
import type { FormData } from './types';
import type { Messages } from '@/lib/types';

interface ContactFormProps {
  formData: FormData;
  messages: Messages;
  nameInputRef: React.RefObject<HTMLInputElement | null>;
  onFormDataChange: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const ContactForm = forwardRef<HTMLDivElement, ContactFormProps>(
  ({ formData, messages, nameInputRef, onFormDataChange, onSubmit, onClose }, ref) => {
    const privacyHref = useMemo(() => {
      if (typeof document !== 'undefined') {
        const lang = document.documentElement.lang || 'fr';
        return `/${lang}/privacy`;
      }
      return '/privacy';
    }, []);

    return (
      <m.div
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="absolute inset-0 bg-black/30 pointer-events-auto"
          onClick={onClose}
          aria-hidden
        />
        <m.div
          className="relative py-3 px-4 text-amber-600 font-semibold whitespace-normal overflow-auto flex items-center justify-center w-[90vw] max-w-[520px] max-h-[90vh] pointer-events-auto"
          initial={{ borderRadius: '2rem', scale: 0.95, background: '#fef3c7', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
          animate={{ borderRadius: '1.5rem', scale: 1.04, background: '#fef3c7', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
          exit={{ borderRadius: '2rem', scale: 0.95, background: '#fef3c7', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
          transition={{ duration: 0.5, ease: [0.68, -0.55, 0.265, 1.55] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="form-title"
          aria-label={messages.aria.callbackForm}
          ref={ref}
        >
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <form onSubmit={onSubmit} className="w-full space-y-4 p-4" aria-label={messages.aria.contactForm}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-amber-800" id="form-title">
                  {messages.contactButton.form.title}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 hover:bg-amber-50 rounded-full transition-colors"
                  aria-label={messages.aria.closeForm}
                >
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div>
                <label htmlFor="form-name" className="block text-sm font-medium text-amber-700 mb-1">
                  {messages.contactButton.form.name}
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  id="form-name"
                  value={formData.name}
                  onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  placeholder={messages.contactButton.form.namePlaceholder}
                  required
                  aria-required="true"
                  aria-label={messages.aria.fullName}
                />
              </div>

              <div>
                <label htmlFor="form-email" className="block text-sm font-medium text-amber-700 mb-1">
                  {messages.contactButton.form.email}
                </label>
                <input
                  type="email"
                  id="form-email"
                  value={formData.email}
                  onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  placeholder={messages.contactButton.form.emailPlaceholder}
                  required
                  aria-required="true"
                  aria-label={messages.aria.emailAddress}
                />
              </div>

              <div>
                <label htmlFor="form-message" className="block text-sm font-medium text-amber-700 mb-1">
                  {messages.contactButton.form.message}
                </label>
                <textarea
                  id="form-message"
                  value={formData.message}
                  onChange={(e) => onFormDataChange({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm resize-none"
                  placeholder={messages.contactButton.form.messagePlaceholder}
                  rows={3}
                  required
                  minLength={10}
                  aria-label={messages.aria.optionalMessage}
                />
              </div>

              {/* Consent (optional) */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="form-consent"
                  checked={formData.marketingConsent}
                  onChange={(e) => onFormDataChange({ ...formData, marketingConsent: e.target.checked })}
                  className="mt-1 h-4 w-4 text-amber-600 border-gray-300 rounded"
                  aria-describedby="privacy-notice"
                />
                <label htmlFor="form-consent" className="text-sm text-amber-800">
                  {messages.contactButton.form.consentLabel}
                </label>
              </div>

              {/* Micro-mention RGPD */}
              <p id="privacy-notice" className="text-xs text-amber-700/90">
                {messages.contactButton.form.privacyNotice}{' '}
                <a href={privacyHref} className="underline hover:text-amber-800">
                  {messages.contactButton.form.privacyLinkText}
                </a>
                .
              </p>

              {/* Honeypot field (hidden) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website" className="sr-only">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  autoComplete="off"
                  tabIndex={-1}
                  value={formData.website}
                  onChange={(e) => onFormDataChange({ ...formData, website: e.target.value })}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-3 py-2 bg-amber-200 text-amber-800 rounded-md hover:bg-amber-300 transition-colors text-sm"
                  aria-label={messages.aria.cancelCloseForm}
                >
                  {messages.contactButton.form.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors text-sm"
                  aria-label={messages.aria.sendForm}
                >
                  {messages.contactButton.form.send}
                </button>
              </div>
            </form>
          </m.div>
        </m.div>
      </m.div>
    );
  }
);

ContactForm.displayName = "ContactForm";
