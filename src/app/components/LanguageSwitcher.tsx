"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '../../lib/locales';
import { localizedPath, currentLocaleFromPath } from '@/lib/url';
import type { Messages } from '@/lib/types';

export default function LanguageSwitcher({ messages }: { messages: Messages }) {
  const pathname = usePathname() || '/';

  // Determine current locale
  const getCurrentLocale = (): Locale => currentLocaleFromPath(pathname) as Locale;

  const currentLocale = getCurrentLocale();

  function toLocale(locale: Locale) { return localizedPath(pathname, locale); }

  return (
    <section className="absolute right-4 top-12 z-50 sm:top-4">
      <div className="flex space-x-2 text-amber-600 font-semibold">
        <Link
          aria-label={currentLocale === 'fr' ? messages.aria.currentLanguage : messages.aria.switchToFrench}
          aria-current={currentLocale === 'fr' ? 'page' : undefined}
          className={`cursor-pointer hover:underline ${currentLocale === 'fr' ? 'underline' : ''}`}
          href={toLocale('fr')}
        >
          FR
        </Link>
        <span>/</span>
        <Link
          aria-label={currentLocale === 'en' ? messages.aria.currentLanguage : messages.aria.switchToEnglish}
          aria-current={currentLocale === 'en' ? 'page' : undefined}
          className={`cursor-pointer hover:underline ${currentLocale === 'en' ? 'underline' : ''}`}
          href={toLocale('en')}
        >
          EN
        </Link>
      </div>
    </section>
  );
}
