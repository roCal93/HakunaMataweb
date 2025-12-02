import type { MetadataRoute } from 'next';
import { buildAbsoluteUrl, getSiteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const origin = new URL(siteUrl);

  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: [buildAbsoluteUrl('/sitemap.xml')],
    host: origin.host,
  };
}
