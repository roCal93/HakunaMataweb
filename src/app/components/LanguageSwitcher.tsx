"use client";

import { useRouter, usePathname } from 'next/navigation';
import type { Locale } from '../../lib/locales';
import { locales } from '../../lib/locales';
import { localizedPath, currentLocaleFromPath } from '@/lib/url';
import type { Messages } from '@/lib/types';

export default function LanguageSwitcher({ messages }: { messages: Messages }) {
  const router = useRouter();
  const pathname = usePathname() || '/';

  // Determine current locale
  const getCurrentLocale = (): Locale => currentLocaleFromPath(pathname) as Locale;

  const currentLocale = getCurrentLocale();

  function toLocale(locale: Locale) { return localizedPath(pathname, locale); }

  return (
    <section className="absolute top-4 right-4 z-50">
      <div className="flex space-x-2 text-amber-600 font-semibold">
        <button
          aria-label={currentLocale === 'fr' ? messages.aria.currentLanguage : messages.aria.switchToFrench}
          className={`hover:underline ${currentLocale === 'fr' ? 'underline' : ''}`}
          onClick={() => router.push(toLocale('fr'))}
        >
          FR
        </button>
        <span>/</span>
        <button
          aria-label={currentLocale === 'en' ? messages.aria.currentLanguage : messages.aria.switchToEnglish}
          className={`hover:underline ${currentLocale === 'en' ? 'underline' : ''}`}
          onClick={() => router.push(toLocale('en'))}
        >
          EN
        </button>
      </div>
    </section>
  );
}
