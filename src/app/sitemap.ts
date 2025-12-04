import type { MetadataRoute } from 'next';
import { buildAbsoluteUrl } from '@/lib/site';
import { locales } from '@/lib/locales';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return locales.map((locale) => {
    const path = `/${locale}`;
    return {
      url: buildAbsoluteUrl(path),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: locale === 'fr' ? 1 : 0.8,
    };
  });
}
