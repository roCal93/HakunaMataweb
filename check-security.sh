#!/bin/bash

# Script de vérification de sécurité
echo "🔍 Vérification de sécurité Hakuna Mataweb"
echo "=========================================="
echo ""

# Vérifier .gitignore
echo "✓ Vérification du .gitignore..."
if [ -f .gitignore ]; then
    if grep -q ".env.local" .gitignore; then
        echo "  ✅ .env.local est ignoré"
    else
        echo "  ❌ ATTENTION : .env.local n'est pas dans .gitignore"
    fi
else
    echo "  ❌ ATTENTION : Pas de .gitignore trouvé"
fi

# Vérifier que .env.local n'est pas commité
echo ""
echo "✓ Vérification de .env.local..."
if git ls-files --error-unmatch .env.local 2>/dev/null; then
    echo "  ❌ DANGER : .env.local est tracé par git !"
    echo "  Exécutez: git rm --cached .env.local"
else
    echo "  ✅ .env.local n'est pas tracé par git"
fi

# Vérifier .env.example
echo ""
echo "✓ Vérification de .env.example..."
if [ -f .env.example ]; then
    echo "  ✅ .env.example existe"
else
    echo "  ⚠️  Pas de .env.example trouvé"
fi

# Vérifier les variables sensibles
echo ""
echo "✓ Recherche de credentials en dur..."
if grep -r --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" \
    -E "(password|secret|api[_-]?key|private[_-]?key|token).*=.*['\"].*['\"]" src/ 2>/dev/null; then
    echo "  ⚠️  Credentials potentiels trouvés (à vérifier)"
else
    echo "  ✅ Pas de credentials en dur trouvés"
fi

# Vérifier console.log en production
echo ""
echo "✓ Vérification des console.log..."
LOG_COUNT=$(grep -r --include="*.ts" --include="*.tsx" "console\.(log|warn)" src/ 2>/dev/null | wc -l)
if [ "$LOG_COUNT" -gt 0 ]; then
    echo "  ⚠️  $LOG_COUNT console.log/warn trouvés (seront supprimés en prod)"
else
    echo "  ✅ Pas de console.log trouvés"
fi

# Vérifier les dépendances vulnérables
echo ""
echo "✓ Vérification des vulnérabilités npm..."
npm audit --json > /tmp/audit.json 2>/dev/null
VULNERABILITIES=$(cat /tmp/audit.json | grep -c '"severity"')
if [ "$VULNERABILITIES" -gt 0 ]; then
    echo "  ⚠️  Vulnérabilités détectées - exécutez 'npm audit' pour détails"
else
    echo "  ✅ Pas de vulnérabilités connues"
fi

echo ""
echo "=========================================="
echo "✅ Vérification terminée"
