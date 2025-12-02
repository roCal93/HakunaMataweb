import HomeClient from "./HomeClient";
import type { Messages } from "@/lib/types";
import fr from "../../locales/fr.json";
import en from "../../locales/en.json";

const translations: Record<string, Messages> = {
  fr: fr as Messages,
  en: en as Messages,
};

export default async function Home({ params }: { params: { locale: string } | Promise<{ locale: string }> }) {
  const resolved = (params && typeof (params as any).then === 'function') ? await (params as Promise<{ locale: string }>) : (params as { locale: string });
  const { locale } = resolved;
  const messages = translations[locale] ?? translations.fr;

  return <HomeClient messages={messages} locale={locale} />;
}
