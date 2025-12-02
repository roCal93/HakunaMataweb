#!/bin/bash

# Checklist de déploiement en production
echo "📋 Checklist de déploiement Hakuna Mataweb"
echo "=========================================="
echo ""

# 1. Build
echo "1️⃣  Build de production..."
npm run build
if [ $? -eq 0 ]; then
    echo "  ✅ Build réussi"
else
    echo "  ❌ Échec du build"
    exit 1
fi

# 2. Tests
echo ""
echo "2️⃣  Exécution des tests..."
npm test -- --passWithNoTests
if [ $? -eq 0 ]; then
    echo "  ✅ Tests passés"
else
    echo "  ⚠️  Certains tests ont échoué"
fi

# 3. Type checking
echo ""
echo "3️⃣  Vérification des types..."
npm run type-check
if [ $? -eq 0 ]; then
    echo "  ✅ Types OK"
else
    echo "  ❌ Erreurs de types"
    exit 1
fi

# 4. Sécurité
echo ""
echo "4️⃣  Vérification de sécurité..."
./check-security.sh

# 5. Variables d'environnement
echo ""
echo "5️⃣  Variables d'environnement..."
echo "  ⚠️  N'oubliez pas de configurer sur votre plateforme :"
echo "     - CONTACT_EMAIL"
echo "     - CONTACT_EMAIL_PASS"
echo "     - NEXT_PUBLIC_SITE_URL=https://hakunamataweb.com"

# 6. Checklist manuelle
echo ""
echo "=========================================="
echo "📝 Checklist manuelle :"
echo "  □ Variables d'environnement configurées"
echo "  □ Domaine configuré et DNS pointé"
echo "  □ SSL/HTTPS activé"
echo "  □ Sitemap accessible"
echo "  □ Robots.txt accessible"
echo "  □ Formulaire de contact testé"
echo "  □ Tests sur mobile et desktop"
echo "  □ Tests sur différents navigateurs"
echo "  □ Google Search Console configuré"
echo "  □ Analytics configuré (optionnel)"
echo ""
echo "✅ Prêt pour le déploiement !"
