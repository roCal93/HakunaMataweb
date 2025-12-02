# Hakuna Mataweb

Site vitrine moderne pour agence web, construit avec Next.js 16, TypeScript et Tailwind CSS.

## 🚀 Fonctionnalités

- ⚡ Next.js 16 avec App Router
- 🎨 Tailwind CSS
- 🌐 Internationalisation (Français/Anglais)
- 📱 Entièrement responsive
- ♿ Accessible (respect de prefers-reduced-motion)
- 🔒 Sécurisé (CSP, rate limiting, validation des entrées)
- 📊 SEO optimisé (structured data, sitemap, robots.txt)
- 🎭 Animations fluides avec Framer Motion
- ✅ TypeScript
- 🧪 Tests avec Jest + Testing Library

## 📦 Installation

```bash
npm install
```

## 🔧 Configuration

1. Copier `.env.example` vers `.env.local`:
```bash
cp .env.example .env.local
```

2. Remplir les variables d'environnement dans `.env.local`:
```env
CONTACT_EMAIL=votre-email@gmail.com
CONTACT_EMAIL_PASS=votre-mot-de-passe-app
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**⚠️ Ne jamais commiter `.env.local` sur git !**

## 🏃‍♂️ Utilisation

### Développement
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

## 📁 Structure du Projet

```
src/
├── app/
│   ├── [locale]/          # Routes internationalisées
│   ├── api/               # Routes API
│   └── components/        # Composants React
├── lib/                   # Utilitaires
└── locales/              # Traductions (en.json, fr.json)
```

## 🌍 Langues

- 🇫🇷 Français (par défaut)
- 🇬🇧 Anglais

## 🔒 Sécurité

- Content Security Policy (CSP)
- Rate limiting sur le formulaire de contact
- Validation et sanitization des entrées
- En-têtes de sécurité (HSTS, X-Frame-Options, etc.)
- Protection contre XSS et injection

## 📈 SEO

- Données structurées (JSON-LD)
- Sitemap dynamique
- Robots.txt
- URLs canoniques
- Tags hreflang
- Meta tags optimisés

## 🎯 Performance

- Génération statique (SSG)
- Optimisation des images (AVIF, WebP)
- Code splitting
- Optimisation du bundle
- Compression activée

## 🧪 Tests

- Tests unitaires avec Jest
- Tests des composants avec Testing Library
- Coverage configuré

## 📝 Internationalisation (i18n)

### Structure
- `src/app/[locale]`: pages par langue
- `src/locales/*.json`: fichiers de traduction
- `src/lib/locales.ts`: configuration des langues
- `LanguageSwitcher`: composant de changement de langue

### Ajouter une nouvelle langue

1. Ajouter la locale dans `src/lib/locales.ts`:
```typescript
export const locales = ['en', 'fr', 'es'] as const;
```

2. Créer `src/locales/es.json` avec les mêmes clés

3. Importer dans les pages nécessaires

## 🔧 Configuration Avancée

### Variables d'environnement

- `CONTACT_EMAIL`: Email de réception des contacts
- `CONTACT_EMAIL_PASS`: Mot de passe d'application Gmail
- `NEXT_PUBLIC_SITE_URL`: URL du site (production/dev)

### En-têtes de sécurité

Tous configurés dans `next.config.ts`:
- CSP (Content Security Policy)
- HSTS (Strict-Transport-Security)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

## 📄 License

Privé - Tous droits réservés

## 👤 Auteur

Équipe Hakuna Mataweb
