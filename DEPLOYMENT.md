# Guide de Déploiement - Hakuna Mataweb

## 🚀 Plateformes recommandées

### Vercel (Recommandé)
1. Connecter votre repo GitHub à Vercel
2. Configurer les variables d'environnement :
   - `CONTACT_EMAIL`
   - `CONTACT_EMAIL_PASS`
   - `NEXT_PUBLIC_SITE_URL=https://hakunamataweb.com`
3. Déployer automatiquement

### Netlify
```bash
npm run build
# Upload .next folder
```

### Autres (AWS, GCP, etc.)
Utiliser `npm run build && npm start` avec Node.js

## 🔧 Configuration DNS

Pointer votre domaine vers votre hébergeur :
```
Type: A
Name: @
Value: [IP de votre hébergeur]

Type: CNAME
Name: www
Value: hakunamataweb.com
```

## 🔒 Variables d'environnement de production

```env
CONTACT_EMAIL=votre-email@gmail.com
CONTACT_EMAIL_PASS=votre-app-password
NEXT_PUBLIC_SITE_URL=https://hakunamataweb.com
NODE_ENV=production
```

## ✅ Checklist avant déploiement

Exécuter :
```bash
npm run deploy-checklist
```

Ou manuellement :
- [ ] Build sans erreurs (`npm run build`)
- [ ] Tests passent (`npm test`)
- [ ] Types OK (`npm run type-check`)
- [ ] Sécurité vérifiée (`npm run security-check`)
- [ ] Variables d'env configurées
- [ ] .env.local NON commité
- [ ] README à jour

## 🔍 Post-déploiement

1. **Vérifier le site**
   - Tester la navigation
   - Tester le formulaire de contact
   - Vérifier les deux langues (FR/EN)
   - Tester sur mobile et desktop

2. **SEO**
   - Vérifier `/sitemap.xml`
   - Vérifier `/robots.txt`
   - Soumettre à Google Search Console
   - Vérifier les meta tags avec view-source:

3. **Performance**
   - Tester avec Lighthouse
   - Vérifier Core Web Vitals
   - Tester la vitesse de chargement

4. **Sécurité**
   - Vérifier HTTPS
   - Tester les headers de sécurité : https://securityheaders.com
   - Vérifier le CSP

## 🐛 Dépannage

### Le formulaire ne fonctionne pas
- Vérifier que `CONTACT_EMAIL` et `CONTACT_EMAIL_PASS` sont configurés
- Vérifier que le mot de passe est un "App Password" Gmail
- Vérifier les logs de l'hébergeur

### Pages 404
- Vérifier que les routes sont bien générées statiquement
- Vérifier `generateStaticParams` dans layout.tsx

### Erreurs de build
- Vérifier TypeScript : `npm run type-check`
- Vérifier ESLint : `npm run lint`
- Nettoyer : `rm -rf .next node_modules && npm install`

## 📊 Monitoring (Optionnel)

### Analytics
- Google Analytics 4
- Plausible Analytics (privacy-friendly)
- Vercel Analytics

### Erreurs
- Sentry
- LogRocket
- Bugsnag

### Performance
- Vercel Speed Insights
- Google PageSpeed Insights
- WebPageTest

## 🔄 Mises à jour

Pour déployer des changements :
```bash
git add .
git commit -m "Description des changements"
git push
```

Le déploiement sera automatique sur Vercel/Netlify.

## 📞 Support

En cas de problème, vérifier :
1. Les logs de votre plateforme d'hébergement
2. La console du navigateur (F12)
3. Les Network requests
4. Les variables d'environnement
