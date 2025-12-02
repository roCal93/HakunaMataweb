# SplitContactButton Component

Bouton de contact animé qui se divise en plusieurs options de contact.

## Structure

Le composant a été refactorisé en 7 modules distincts pour améliorer la maintenabilité :

### 📁 Fichiers principaux

- **`index.tsx`** - Composant principal avec logique d'état
- **`types.ts`** - Définitions TypeScript
- **`constants.ts`** - Constantes (durées, dimensions, couleurs)
- **`utils.ts`** - Fonctions utilitaires
- **`buttonStyles.ts`** - Calcul des styles de boutons

### 🧩 Sous-composants

- **`ContactButton.tsx`** - Bouton de contact individuel avec animations
- **`ContactForm.tsx`** - Formulaire de callback modal
- **`buttonIcons.tsx`** - Icônes SVG des boutons

## Usage

```tsx
import SplitContactButton from "@/app/components/SplitContactButton";

<SplitContactButton 
  messages={messages}
  contactEmail="contact@example.com"
  contactPhone="+33123456789"
  onContactSelect={(method) => console.log(method)}
/>
```

## Props

- `messages`: Objet de traduction (type `Messages`)
- `contactEmail?`: Email de contact (défaut: 'contact@hakunamataweb.fr')
- `contactPhone?`: Téléphone de contact (défaut: '+33745229697')
- `onContactSelect?`: Callback lors de la sélection d'une méthode

## Features

- ✨ Animation d'étirement et division
- 📧 Email avec fallback copie
- 📱 Appel téléphonique direct
- 💬 WhatsApp avec ouverture sécurisée
- 📝 Formulaire de callback modal
- 🎨 Animations fluides avec Framer Motion
- 📱 Responsive (layouts mobile/desktop différents)
- ♿ Accessible (ARIA, focus trap, ESC)
- 🎭 Support reduced motion

## États (Stages)

1. **initial** - Bouton unique "Me contacter"
2. **stretching** - Étirement du bouton
3. **splitting** - Division en cours
4. **split** - 4 boutons séparés visibles
5. **centering** - Centrage du bouton callback
6. **gathering** - Rassemblement des boutons

## Méthodes de contact

- **email** - Ouvre le client email (+ copie en fallback)
- **phone** - Appel téléphonique
- **whatsapp** - Ouvre WhatsApp
- **callback** - Affiche le formulaire modal

## Architecture

### Gestion d'état

- **Stage** : Étape actuelle de l'animation
- **FormData** : Données du formulaire (name, email, message)
- **UI State** : showForm, selectedButton, copiedMessage, formSuccess
- **Viewport** : isMobile detection

### Animations

- Durées configurables via constants
- Easing personnalisé avec cubic-bezier
- Support du prefers-reduced-motion
- Transitions synchronisées

### Accessibilité

- Labels ARIA complets
- Focus trap dans le formulaire
- Support clavier (ESC, Tab)
- Live region pour feedback

## Ligne de code par fichier

```
324 lignes - index.tsx (orchestrateur)
156 lignes - ContactForm.tsx
120 lignes - ContactButton.tsx
117 lignes - utils.ts
94 lignes  - buttonStyles.ts
68 lignes  - constants.ts
46 lignes  - buttonIcons.tsx
42 lignes  - types.ts
```

**Total : ~967 lignes** (vs 733 avant, mais mieux organisé)
