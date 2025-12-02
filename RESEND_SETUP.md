# Configuration Resend pour Hakuna Mataweb

## 🎯 Pourquoi Resend ?

Gmail bloque souvent les emails depuis des hébergeurs comme Railway, Vercel, etc. Resend est conçu pour les applications web et est beaucoup plus fiable.

## ⚡ Avantages
- ✅ Gratuit jusqu'à 3 000 emails/mois
- ✅ Fonctionne depuis n'importe quel hébergeur
- ✅ Délivrabilité excellente
- ✅ Configuration simple
- ✅ Logs et analytics

## 📝 Étapes de configuration

### 1. Créer un compte Resend

1. Allez sur https://resend.com
2. Cliquez sur "Sign Up"
3. Créez un compte (gratuit)

### 2. Obtenir une clé API

1. Une fois connecté, allez dans **API Keys**
2. Cliquez sur **Create API Key**
3. Donnez un nom (ex: "Hakuna Mataweb Production")
4. Sélectionnez les permissions **Sending access**
5. Copiez la clé (elle commence par `re_`)

### 3. Configurer le domaine (Optionnel)

#### Option A: Utiliser le domaine de test (Plus rapide)
Resend vous donne un domaine de test qui fonctionne immédiatement.
- Email expéditeur: `onboarding@resend.dev`
- Limitation: Peut seulement envoyer vers votre email vérifié

#### Option B: Utiliser votre propre domaine (Recommandé pour production)
1. Dans Resend, allez dans **Domains**
2. Cliquez sur **Add Domain**
3. Entrez `hakunamataweb.fr` (ou votre domaine)
4. Ajoutez les enregistrements DNS fournis :
   ```
   Type: TXT
   Name: resend._domainkey
   Value: [fourni par Resend]
   
   Type: MX
   Name: @
   Value: [fourni par Resend]
   ```
5. Attendez la vérification (quelques minutes)

### 4. Ajouter la clé sur Railway

1. Allez sur https://railway.app
2. Ouvrez votre projet **Hakuna Mataweb**
3. Allez dans **Variables**
4. Ajoutez une nouvelle variable :
   - **Nom:** `RESEND_API_KEY`
   - **Valeur:** `re_votre_clé_copiée`
5. Supprimez ou gardez `CONTACT_EMAIL` et `CONTACT_EMAIL_PASS` (pas nécessaires avec Resend)
6. Railway va automatiquement redéployer

### 5. Tester

1. Attendez que le déploiement soit terminé
2. Allez sur votre site
3. Essayez d'envoyer un message via le formulaire
4. Vérifiez vos emails !

## 🔍 Vérification

### Logs Railway
Dans les logs Railway, vous devriez voir :
```
[CONTACT API] Requête reçue
[CONTACT API] Données reçues: ...
[CONTACT API] Utilisation de Resend...
[CONTACT API] Email envoyé avec succès via Resend!
```

### Dashboard Resend
Dans le dashboard Resend, vous pouvez voir :
- Les emails envoyés
- Le statut de délivrance
- Les erreurs éventuelles

## 🐛 Dépannage

### Erreur: "Invalid API key"
- Vérifiez que vous avez bien copié toute la clé (commence par `re_`)
- Vérifiez qu'il n'y a pas d'espaces avant/après
- Régénérez une nouvelle clé si besoin

### Email non reçu
- Vérifiez vos spams
- Si vous utilisez le domaine de test, vérifiez que l'email destinataire est bien celui vérifié sur Resend
- Vérifiez les logs dans le dashboard Resend

### Erreur "Domain not verified"
- Attendez quelques minutes après avoir ajouté les DNS
- Vérifiez que les enregistrements DNS sont corrects
- Utilisez le domaine de test en attendant

## 💰 Tarification

- **Free:** 3 000 emails/mois, 100 emails/jour
- **Pro:** 50 000 emails/mois à $20/mois

Pour un site vitrine, le plan gratuit est largement suffisant !

## 📚 Documentation

- Documentation officielle: https://resend.com/docs
- API Reference: https://resend.com/docs/api-reference
- Exemples: https://resend.com/docs/send-with-nextjs

## ✅ Checklist finale

- [ ] Compte Resend créé
- [ ] Clé API obtenue
- [ ] `RESEND_API_KEY` ajoutée sur Railway
- [ ] Application redéployée
- [ ] Test du formulaire effectué
- [ ] Email reçu ✉️
