import type { Messages } from '@/lib/types';
import fr from '../../../locales/fr.json';
import en from '../../../locales/en.json';
import Link from 'next/link';

const translations: Record<string, Messages> = {
  fr: fr as Messages,
  en: en as Messages,
};

export default async function DemoPage({ params }: { params: { locale: string } | Promise<{ locale: string }> }) {
  const resolved = (params && typeof (params as any).then === 'function') ? await (params as Promise<{ locale: string }>) : (params as { locale: string });
  const { locale } = resolved;
  const messages = translations[locale] ?? translations.fr;

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          {messages.explore.heading}
        </h1>
        <p className="text-xl text-gray-700 mb-10">
          {messages.explore.paragraph}
        </p>
        <div className="flex gap-4">
          <Link href={`/${locale}#explorer`} className="rounded-full bg-gradient-to-br from-amber-400 to-amber-600 px-6 py-3 text-white font-semibold hover:from-amber-500 hover:to-amber-700 transition-shadow shadow">
            Retour à l'exploration
          </Link>
          <Link href={`/${locale}`} className="rounded-full border-2 border-amber-400 px-6 py-3 text-amber-700 font-semibold hover:bg-amber-400 hover:text-white transition-shadow">
            Accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
