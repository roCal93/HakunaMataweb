// Client-safe locale list and type. This avoids importing Next.js server-only utilities into client components.
export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';
