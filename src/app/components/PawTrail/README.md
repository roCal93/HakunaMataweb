# PawTrail Component

Animation de traces de pattes suivant le curseur avec évitement des bords.

## Structure

Composant refactorisé en 7 modules pour améliorer la testabilité et la maintenabilité :

### 📁 Fichiers principaux

- **`index.tsx`** - Composant principal (40 lignes)
- **`types.ts`** - Définitions TypeScript (70 lignes)
- **`constants.ts`** - Configuration et constantes (70 lignes)
- **`physics.ts`** - Calculs physiques purs (160 lignes)
- **`usePawAnimation.ts`** - Hook custom animation (190 lignes)

### 🧩 Sous-composants

- **`PawPrint.tsx`** - Empreinte individuelle (35 lignes)
- **`DebugOverlay.tsx`** - Visualisation debug (75 lignes)

## Usage

```tsx
import PawTrail from "@/app/components/PawTrail";

<PawTrail 
  size={16}
  step={40}
  frequency={400}
  debug={false}
/>
```

## Props principales

### Apparence
- `src`: Image de l'empreinte (défaut: '/images/empreinte-patte.webp')
- `size`: Taille de l'empreinte en px (défaut: 12)

### Comportement
- `step`: Distance entre empreintes (défaut: 30)
- `bodyWidth`: Écart gauche/droite (défaut: 30)
- `frequency`: Intervalle entre empreintes en ms (défaut: 500)
- `drift`: Variation aléatoire de direction (défaut: 25)

### Physique
- `edgeMargin`: Marge minimale des bords (défaut: 12)
- `avoidanceStrength`: Force d'évitement (0-1, défaut: 0.8)
- `anticipation`: Distance d'anticipation (défaut: 0.8)
- `curvedSteer`: Tourner progressivement (défaut: true)
- `turnSpeed`: Vitesse de rotation en °/s (défaut: 45)

### Performance
- `maxPaws`: Nombre max d'empreintes (défaut: 24)
- `roamOnIdle`: Continuer pendant scroll (défaut: true)
- `idleAfter`: Délai avant idle en ms (défaut: 800)

### Debug
- `debug`: Afficher visualisation (défaut: false)
- `debugScale`: Échelle des vecteurs (défaut: 0.1)

## Physique

### Évitement des bords

Le composant calcule la proximité avec chaque bord et génère un vecteur d'évitement :

1. **Calcul de proximité** - Distance normalisée de chaque bord
2. **Vecteur d'évitement** - Direction pour s'éloigner des bords
3. **Mélange directionnel** - Combine mouvement et évitement
4. **Rotation progressive** - Tourne doucement vers la nouvelle direction

### Alternance des pattes

- Les empreintes alternent gauche/droite
- Position latérale calculée perpendiculairement
- Pattes arrière ajoutées avec offset configurable

## Mode Debug

Active avec `debug={true}` pour visualiser :

- **Cercle orange** : Zone d'anticipation d'évitement
- **Ligne bleue** : Vecteur de mouvement souhaité
- **Ligne rouge** : Vecteur d'évitement des bords
- **Ligne violette** : Direction résultante (mixée)
- **Point vert** : Position avant projetée
- **Point orange** : Position latérale (empreinte)

## Architecture

### Fonctions physiques (testables unitairement)

```typescript
calculateEdgeProximity()      // Détection proximité bords
calculateAvoidanceVector()    // Calcul vecteur d'évitement
updateDirection()             // Rotation progressive
clampPosition()               // Contrainte aux limites
mixDirectionVectors()         // Mélange mouvement/évitement
```

### Hook custom

`usePawAnimation()` gère :
- État de l'animation (refs)
- Boucle requestAnimationFrame
- Détection idle/scroll
- Ajout des empreintes

### Composants de rendu

- `PawPrint` : Empreinte avec animation fade-out
- `DebugOverlay` : Visualisation SVG des vecteurs

## Performances

- Utilise `requestAnimationFrame` pour synchronisation
- Limite le nombre d'empreintes (`maxPaws`)
- Pause pendant scroll si `roamOnIdle=false`
- `willChange` CSS pour optimisation GPU
- Détection `document.hidden` pour économiser ressources

## Tests possibles

Toutes les fonctions `physics.ts` sont pures et facilement testables :

```typescript
test('calculateEdgeProximity détecte bord gauche', () => {
  const result = calculateEdgeProximity(
    { x: 10, y: 100 },
    { width: 800, height: 600 },
    1
  );
  expect(result.px).toBeGreaterThan(0); // Proximité gauche positive
});
```

## Ligne de code par fichier

```
190 lignes - usePawAnimation.ts (logique principale)
160 lignes - physics.ts (calculs purs)
75 lignes  - DebugOverlay.tsx
70 lignes  - types.ts
70 lignes  - constants.ts
40 lignes  - index.tsx
35 lignes  - PawPrint.tsx
```

**Total : ~640 lignes** (vs 414 avant, mais bien mieux organisé)
