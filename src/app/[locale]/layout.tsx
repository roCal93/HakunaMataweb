import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../globals.css';
import fr from '../../locales/fr.json';
import en from '../../locales/en.json';
import { defaultLocale } from '@/lib/locales';
import { buildAbsoluteUrl, getSiteUrl } from '@/lib/site';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });

export async function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }];
}

// Dynamic metadata that includes hreflang alternates for SEO
export async function generateMetadata({ params }: { params: { locale: string } | Promise<{ locale: string }> }): Promise<Metadata> {
  const resolved = (params && typeof (params as any).then === 'function') ? await (params as Promise<{ locale: string }>) : (params as { locale: string });
  const { locale } = resolved;
  const messages = locale === 'en' ? en : fr;
  const title = `${messages.home.title} - ${messages.home.subtitle}`;
  const description = messages.footer.description;
  const siteUrl = getSiteUrl();
  const metadataBase = new URL(siteUrl);
  // Canonical should point to the current page's URL with locale
  const canonicalUrl = buildAbsoluteUrl(`/${locale}`);
  const defaultUrl = buildAbsoluteUrl('/fr');
  const englishUrl = buildAbsoluteUrl('/en');
  const frenchUrl = defaultUrl;
  const openGraphLocale = locale === 'fr' ? 'fr_FR' : 'en_US';

  return {
    metadataBase,
    title,
    description,
    alternates: {
      // Each page points to itself as canonical
      canonical: canonicalUrl,
      languages: {
        'x-default': defaultUrl,
        en: englishUrl,
        fr: frenchUrl,
      },
    },
    openGraph: {
      url: canonicalUrl,
      siteName: 'Hakuna Mataweb',
      title,
      description,
      locale: openGraphLocale,
      alternateLocale: ['fr_FR', 'en_US'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } | Promise<{ locale: string }> }) {
  const resolved = (params && typeof (params as any).then === 'function') ? await (params as Promise<{ locale: string }>) : (params as { locale: string });
  const { locale } = resolved;
  const messages = locale === 'en' ? en : fr;
  const siteUrl = getSiteUrl();
  
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hakuna Mataweb",
    "url": siteUrl,
    "logo": `${siteUrl}/images/logo.png`,
    "description": messages.footer.description,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "FR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": ["French", "English"]
    }
  };
  
  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${jakarta.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}