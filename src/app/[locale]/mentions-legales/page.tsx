import type { Metadata } from 'next';
import fr from '../../../locales/fr.json';
import en from '../../../locales/en.json';
import Link from 'next/link';

export const dynamic = 'error';

export async function generateMetadata({ params }: { params: { locale: string } | Promise<{ locale: string }> }): Promise<Metadata> {
  const isPromise = typeof (params as Promise<{ locale: string }>).then === 'function';
  const resolved = isPromise ? await (params as Promise<{ locale: string }>) : (params as { locale: string });
  const { locale } = resolved;
  const messages = locale === 'en' ? en : fr;
  const title = `${messages.home.title} — ${locale === 'fr' ? 'Mentions légales' : 'Legal Notice'}`;
  const description = locale === 'fr'
    ? 'Mentions légales du site Hakuna Mataweb : éditeur, hébergeur, propriété intellectuelle et responsabilité.'
    : 'Legal notice for Hakuna Mataweb website: publisher, host, intellectual property and liability.';
  return { title, description };
}

export default async function MentionsLegalesPage({ params }: { params: { locale: string } | Promise<{ locale: string }> }) {
  const isPromise = typeof (params as Promise<{ locale: string }>).then === 'function';
  const resolved = isPromise ? await (params as Promise<{ locale: string }>) : (params as { locale: string });
  const { locale } = resolved;
  const isFr = locale !== 'en';

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 text-amber-900">
      <h1 className="text-3xl font-semibold mb-6">{isFr ? 'Mentions légales' : 'Legal Notice'}</h1>

      <p className="mb-4 text-sm text-amber-700">
        {isFr ? 'Dernière mise à jour : 4 décembre 2025' : 'Last updated: December 4, 2025'}
      </p>

      {/* Éditeur du site */}
      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">{isFr ? 'Éditeur du site' : 'Website Publisher'}</h2>
        <p>
          <strong>{isFr ? 'Nom / Raison sociale :' : 'Name / Company:'}</strong> Hakuna Mataweb
        </p>
        <p>
          <strong>{isFr ? 'Représentant légal :' : 'Legal representative:'}</strong> Romain Calmelet
        </p>
        <p>
          <strong>{isFr ? 'Statut :' : 'Status:'}</strong> {isFr ? 'Micro-entrepreneur' : 'Sole proprietor (France)'}
        </p>
        <p>
          <strong>SIRET :</strong> <span className="text-amber-600">[À COMPLÉTER]</span>
        </p>
        <p>
          <strong>{isFr ? 'Adresse :' : 'Address:'}</strong> <span className="text-amber-600">[À COMPLÉTER - Adresse professionnelle]</span>
        </p>
        <p>
          <strong>{isFr ? 'Téléphone :' : 'Phone:'}</strong> +33 7 45 22 96 97
        </p>
        <p>
          <strong>Email :</strong> <a className="underline" href="mailto:contact@hakunamataweb.fr">contact@hakunamataweb.fr</a>
        </p>
      </section>

      {/* Directeur de publication */}
      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">{isFr ? 'Directeur de publication' : 'Publication Director'}</h2>
        <p>Romain Calmelet</p>
      </section>

      {/* Hébergeur */}
      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">{isFr ? 'Hébergeur' : 'Website Host'}</h2>
        <p>
          <strong>{isFr ? 'Nom :' : 'Name:'}</strong> Vercel Inc.
        </p>
        <p>
          <strong>{isFr ? 'Adresse :' : 'Address:'}</strong> 440 N Barranca Ave #4133, Covina, CA 91723, USA
        </p>
        <p>
          <strong>{isFr ? 'Site web :' : 'Website:'}</strong> <a className="underline" href="https://vercel.com" target="_blank" rel="noopener noreferrer">https://vercel.com</a>
        </p>
      </section>

      {/* Propriété intellectuelle */}
      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">{isFr ? 'Propriété intellectuelle' : 'Intellectual Property'}</h2>
        <p>
          {isFr
            ? "L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, etc.) est la propriété exclusive de Hakuna Mataweb, sauf mention contraire. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site est interdite sans autorisation écrite préalable."
            : "All content on this site (texts, images, graphics, logo, icons, etc.) is the exclusive property of Hakuna Mataweb, unless otherwise stated. Any reproduction, representation, modification, publication or adaptation of all or part of the elements of the site is prohibited without prior written authorization."}
        </p>
      </section>

      {/* Responsabilité */}
      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">{isFr ? 'Responsabilité' : 'Liability'}</h2>
        <p>
          {isFr
            ? "Hakuna Mataweb s'efforce d'assurer l'exactitude des informations diffusées sur ce site, mais ne peut garantir leur exhaustivité ou leur mise à jour permanente. Hakuna Mataweb décline toute responsabilité pour les erreurs, omissions ou résultats qui pourraient être obtenus par un mauvais usage de ces informations."
            : "Hakuna Mataweb strives to ensure the accuracy of the information published on this site, but cannot guarantee its completeness or permanent updating. Hakuna Mataweb disclaims any responsibility for errors, omissions or results that may be obtained through misuse of this information."}
        </p>
      </section>

      {/* Liens hypertextes */}
      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">{isFr ? 'Liens hypertextes' : 'Hyperlinks'}</h2>
        <p>
          {isFr
            ? "Ce site peut contenir des liens vers d'autres sites. Hakuna Mataweb n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu."
            : "This site may contain links to other websites. Hakuna Mataweb has no control over these sites and disclaims any responsibility for their content."}
        </p>
      </section>

      {/* Cookies */}
      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Cookies</h2>
        <p>
          {isFr
            ? "Ce site n'utilise pas de cookies de suivi ou de publicité. Seuls des cookies strictement nécessaires au fonctionnement technique du site peuvent être utilisés (cookies de session, préférences de langue). Ces cookies techniques ne nécessitent pas votre consentement préalable."
            : "This site does not use tracking or advertising cookies. Only cookies strictly necessary for the technical operation of the site may be used (session cookies, language preferences). These technical cookies do not require your prior consent."}
        </p>
      </section>

      {/* Données personnelles */}
      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">{isFr ? 'Données personnelles' : 'Personal Data'}</h2>
        <p>
          {isFr
            ? "Pour toute information concernant le traitement de vos données personnelles, veuillez consulter notre "
            : "For any information regarding the processing of your personal data, please see our "}
          <Link href={`/${locale}/privacy`} className="underline hover:text-amber-700">
            {isFr ? 'Politique de confidentialité' : 'Privacy Policy'}
          </Link>.
        </p>
      </section>

      {/* Droit applicable */}
      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">{isFr ? 'Droit applicable' : 'Applicable Law'}</h2>
        <p>
          {isFr
            ? "Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents."
            : "These legal notices are governed by French law. In the event of a dispute, the French courts shall have sole jurisdiction."}
        </p>
      </section>

      {/* Contact */}
      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>
          {isFr
            ? "Pour toute question concernant ces mentions légales, vous pouvez nous contacter à : "
            : "For any questions regarding these legal notices, you can contact us at: "}
          <a className="underline" href="mailto:contact@hakunamataweb.fr">contact@hakunamataweb.fr</a>
        </p>
      </section>

      <div className="mt-10">
        <Link className="underline" href={`/${locale}`}>
          {isFr ? 'Retour à l\'accueil' : 'Back to home'}
        </Link>
      </div>
    </main>
  );
}
