# CircularHero Component

Composant hero circulaire interactif avec navigation par quadrants.


### 📁 Fichiers principaux

- **`index.tsx`** - Composant principal orchestrateur
- **`types.ts`** - Définitions TypeScript
- **`constants.ts`** - Constantes (durées, breakpoints, couleurs)
- **`utils.ts`** - Fonctions utilitaires réutilisables

### 🧩 Sous-composants

- **`OuterCircle.tsx`** - Cercle extérieur avec gestion des interactions
- **`InnerCircle.tsx`** - Cercle central avec logo
- **`NavigationRing.tsx`** - Labels de navigation en forme d'anneau
- **`QuadrantSeparators.tsx`** - Séparateurs visuels entre quadrants
- **`QuadrantOverlay.tsx`** - Overlays d'information par quadrant

## Usage

```tsx
import { CircularHero } from "@/app/components/CircularHero";

<CircularHero messages={messages} />
```

## Props

- `messages`: Objet de traduction (type `Messages`)

## Features

- ✨ Animation d'entrée élaborée
- 🔄 Rotation automatique des quadrants
- 🎨 Transitions de gradient fluides
- 📱 Responsive (mobile/desktop)
- ♿ Accessible (ARIA, navigation clavier)
- 🎭 Support reduced motion
- 🖱️ Interactions souris/tactile

## Architecture

### Gestion d'état

- **Animation** : `animateIn`, `entryActive`, `separatorsVisible`, `gradientIndex`
- **Interaction** : `activeQuadrant`, `isCompact`, `rotation`, `showChevron`
- **Viewport** : `viewportWidth`, `mobileScale`, `showOverlays`

### Refs

- `intervalRef` - Rotation automatique
- `outerCircleRef` / `innerCircleRef` - Détection de position souris
- Timeouts pour animations et delays

### Optimisations

- Memoïsation des items de navigation (`useMemo`)
- Callbacks mémorisés (`useCallback`)
- IntersectionObserver pour détection de scroll
- Cleanup automatique des timers/intervals

## Constantes configurables

Voir `constants.ts` pour :
- Durées d'animation
- Breakpoints responsive
- Seuils de scroll
- Couleurs et gradients
