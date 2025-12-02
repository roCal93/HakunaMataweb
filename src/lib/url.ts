import { locales } from './locales';

export function localizedPath(pathname: string, targetLocale: string) {
  const segments = pathname.split('/');
  const candidate = segments[1];
  if (segments.length > 1 && candidate && (locales as readonly string[]).includes(candidate)) {
    segments[1] = targetLocale;
    const next = segments.join('/') || '/';
    return next.replace('//', '/');
  }
  return `/${targetLocale}${pathname}`.replace('//', '/');
}

export function currentLocaleFromPath(pathname: string): string {
  const segments = pathname.split('/');
  const candidate = segments[1];
  return (segments.length > 1 && candidate && (locales as readonly string[]).includes(candidate)) ? candidate : 'fr';
}