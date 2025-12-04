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
  const title = `${messages.home.title} — ${locale === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy'}`;
  const description = locale === 'fr'
    ? 'Informations sur l’utilisation des données personnelles, finalités, bases légales, destinataires, transferts, durées de conservation et droits RGPD.'
    : 'Information on the use of personal data, purposes, legal bases, recipients, transfers, retention periods and GDPR rights.';
  return { title, description };
}

export default async function PrivacyPage({ params }: { params: { locale: string } | Promise<{ locale: string }> }) {
  const isPromise = typeof (params as Promise<{ locale: string }>).then === 'function';
  const resolved = isPromise ? await (params as Promise<{ locale: string }>) : (params as { locale: string });
  const { locale } = resolved;
  const isFr = locale !== 'en';

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 text-amber-900">
      <h1 className="text-3xl font-semibold mb-6">{isFr ? 'Politique de confidentialité' : 'Privacy Policy'}</h1>

      <p className="mb-4">
        {isFr
          ? "Cette page explique comment Hakuna Mataweb traite vos données personnelles conformément au RGPD."
          : "This page explains how Hakuna Mataweb processes your personal data in accordance with the GDPR."}
      </p>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">{isFr ? 'Responsable de traitement' : 'Data Controller'}</h2>
        <p>
          Hakuna Mataweb — {isFr ? 'France' : 'France'}
        </p>
        <p>
          {isFr ? 'Contact : ' : 'Contact: '}<a className="underline" href="mailto:contact@hakunamataweb.fr">contact@hakunamataweb.fr</a>
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">{isFr ? 'Données collectées' : 'Data Collected'}</h2>
        <ul className="list-disc ml-6">
          <li>{isFr ? 'Nom' : 'Name'}</li>
          <li>Email</li>
          <li>{isFr ? 'Message' : 'Message'}</li>
          <li>{isFr ? 'Consentement marketing (optionnel)' : 'Marketing consent (optional)'}</li>
        </ul>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">{isFr ? 'Finalités et bases légales' : 'Purposes and Legal Bases'}</h2>
        <ul className="list-disc ml-6">
          <li>{isFr ? 'Répondre à votre message (intérêt légitime / exécution précontractuelle)' : 'Respond to your message (legitimate interest / pre-contractual steps)'}</li>
          <li>{isFr ? 'Prospection par email (avec votre consentement)' : 'Email marketing (with your consent)'}</li>
        </ul>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">{isFr ? 'Destinataires et sous-traitants' : 'Recipients and Processors'}</h2>
        <p>
          {isFr
            ? "Vos données sont destinées à l’équipe Hakuna Mataweb. Nous utilisons des prestataires d’envoi d’email (par ex. Resend ou Google) en qualité de sous-traitants. Avec Resend, un Data Processing Agreement (DPA) incluant les Clauses Contractuelles Types (SCC) s’applique."
            : "Your data is intended for the Hakuna Mataweb team. We use email providers (e.g., Resend or Google) as processors. With Resend, a Data Processing Agreement (DPA) including Standard Contractual Clauses (SCC) applies."}
        </p>
        <p>
          {isFr
            ? <>Infos GDPR Resend: <a className="underline" href="https://resend.com/security/gdpr" target="_blank" rel="noopener noreferrer">https://resend.com/security/gdpr</a>. Politique de confidentialité: <a className="underline" href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">https://resend.com/legal/privacy-policy</a>.</>
            : <>Resend GDPR info: <a className="underline" href="https://resend.com/security/gdpr" target="_blank" rel="noopener noreferrer">https://resend.com/security/gdpr</a>. Privacy Policy: <a className="underline" href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">https://resend.com/legal/privacy-policy</a>.</>}
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">{isFr ? 'Transferts hors UE' : 'Transfers Outside the EU'}</h2>
        <p>
          {isFr
            ? "Des transferts hors UE (notamment vers les États-Unis) peuvent avoir lieu via nos sous-traitants. Ils sont encadrés par des garanties appropriées, notamment les Clauses Contractuelles Types (SCC) intégrées au DPA de Resend."
            : "Transfers outside the EU (including to the United States) may occur via our processors. They are governed by appropriate safeguards, notably the EU Standard Contractual Clauses (SCC) included in Resend’s DPA."}
        </p>
        <p>
          {isFr
            ? <>Informations GDPR: <a className="underline" href="https://resend.com/security/gdpr" target="_blank" rel="noopener noreferrer">https://resend.com/security/gdpr</a>. Politique de confidentialité de Resend: <a className="underline" href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">https://resend.com/legal/privacy-policy</a>.</>
            : <>GDPR information: <a className="underline" href="https://resend.com/security/gdpr" target="_blank" rel="noopener noreferrer">https://resend.com/security/gdpr</a>. Resend Privacy Policy: <a className="underline" href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">https://resend.com/legal/privacy-policy</a>.</>}
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">{isFr ? 'Durées de conservation' : 'Retention Periods'}</h2>
        <ul className="list-disc ml-6">
          <li>{isFr ? 'Demandes de contact : 12 mois pour répondre et assurer le suivi lié à votre demande.' : 'Contact inquiries: 12 months to respond and handle any related follow-up.'}</li>
          <li>{isFr ? 'Prospection (email) : jusqu’à 3 ans à compter du dernier contact/interaction.' : 'Marketing (email): up to 3 years from the last contact/interaction.'}</li>
          <li>{isFr ? 'Plus longtemps si une relation contractuelle s’ensuit et en cas d’obligations légales (facturation, comptabilité).' : 'Longer where a contractual relationship follows and for legal obligations (billing, accounting).'}
          </li>
        </ul>
        <p className="text-sm text-amber-700">
          {isFr
            ? "Vous pouvez retirer votre consentement marketing à tout moment."
            : "You may withdraw your marketing consent at any time."}
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">{isFr ? 'Vos droits' : 'Your Rights'}</h2>
        <ul className="list-disc ml-6">
          <li>{isFr ? 'Accès, rectification, effacement, limitation, opposition, portabilité' : 'Access, rectification, erasure, restriction, objection, portability'}</li>
          <li>
            {isFr ? 'Pour exercer vos droits : ' : 'To exercise your rights: '}<a className="underline" href="mailto:contact@hakunamataweb.fr">contact@hakunamataweb.fr</a>
          </li>
          <li>
            {isFr ? 'Réclamation : ' : 'Complaint: '}<a className="underline" href="https://www.cnil.fr/">CNIL</a>
          </li>
        </ul>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">{isFr ? 'Sécurité' : 'Security'}</h2>
        <p>
          {isFr
            ? "Mesures raisonnables de sécurité sont mises en place (validation côté serveur, anti-spam, limitation de débit, TLS)."
            : "Reasonable security measures are in place (server-side validation, anti-spam, rate limiting, TLS)."}
        </p>
      </section>

      <div className="mt-10">
        <Link className="underline" href={`/${locale}`}>
          {isFr ? 'Retour à l’accueil' : 'Back to home'}
        </Link>
      </div>
    </main>
  );
}
