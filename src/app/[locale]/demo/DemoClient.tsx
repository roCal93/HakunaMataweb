'use client'

import Link from 'next/link'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import { useEffect, useState, type MouseEvent } from 'react'

type CursorMode = 'default' | 'halo' | 'frame' | 'orbital'
type DemoScene = 'morning' | 'midday' | 'golden' | 'evening'
type DemoIdentity = 'modern' | 'paper' | 'bubblegum'

type DemoCopy = {
  eyebrow: string
  title: string
  intro: string
  primaryCta: string
  secondaryCta: string
  ctaMicrocopy: string
  stickyCta: string
  labTitle: string
  labIntro: string
  sceneTitle: string
  sceneIntro: string
  identityTitle: string
  identityIntro: string
  magneticTitle: string
  magneticIntro: string
  wallTitle: string
  wallIntro: string
  finalTitle: string
  finalText: string
  finalCta: string
  finalCtaSecondary: string
  finalEyebrow: string
  morphTargets: Array<{ mode: CursorMode; label: string; hint: string }>
  sceneTabs: Array<{ id: DemoScene; label: string; caption: string }>
  identityTabs: Array<{ id: DemoIdentity; label: string; caption: string }>
  wallCards: Array<{ title: string; text: string }>
}

const demoCopy: Record<string, DemoCopy> = {
  fr: {
    eyebrow: 'Playground interactif',
    title: 'Un terrain de jeu qui donne envie avant même le premier brief',
    intro:
      "Cette page ne montre pas seulement des animations : elle montre comment un même contenu peut changer de ton selon la scène, le rythme et l'univers graphique.",
    primaryCta: "Retour à l'accueil",
    secondaryCta: 'Parler du projet',
    ctaMicrocopy: "15 minutes d'échange, sans engagement.",
    stickyCta: 'Parler de mon projet',
    labTitle: '3 zones, 3 comportements de curseur',
    labIntro:
      "Chaque zone déclenche une réaction différente. Le but n'est pas de faire gadget, mais de créer une sensation de précision, de matière ou d'énergie.",
    sceneTitle: 'Un même restaurant, quatre moments de la journée',
    sceneIntro:
      "Ici, le contenu reste proche, mais l'ambiance, la lumière et la hiérarchie changent pour vendre un brunch, un déjeuner rapide, un apéritif ou un dîner.",
    identityTitle: 'Trois univers graphiques, une même promesse',
    identityIntro:
      "L'idée n'est pas de recolorer une maquette. Chaque version change réellement la structure, la matière et la tension visuelle.",
    magneticTitle: 'Boutons interactifs',
    magneticIntro:
      'Un bouton peut sembler plus vivant sans devenir bruyant. Un micro-déplacement suffit à donner une sensation de réactivité immédiate.',
    wallTitle: '3 ressentis pour une même interface',
    wallIntro:
      'On compare ici trois directions très simples. La base reste la même, mais la perception change : plus nette, plus tactile ou plus pop.',
    finalTitle: "Votre site peut donner envie avant même qu'on le lise.",
    finalText:
      "Si ce que vous venez de voir vous parle, on peut en discuter. Pas de devis immédiat : juste un échange pour voir si cette direction a du sens pour votre projet.",
    finalCta: 'On en parle ?',
    finalCtaSecondary: "Revenir à l'accueil",
    finalEyebrow: 'Prochaine étape',
    morphTargets: [
      { mode: 'halo', label: 'Halo doux', hint: 'Une lumière suit le geste.' },
      { mode: 'frame', label: 'Cadre précis', hint: 'Le curseur devient un viseur net.' },
      { mode: 'orbital', label: 'Burst pop', hint: 'Une réaction plus vive, plus énergique et plus démonstrative.' },
    ],
    sceneTabs: [
      { id: 'morning', label: 'Matin / brunch', caption: 'Une version claire et lumineuse, pensée pour vendre un café, un brunch ou une réservation simple dès le début de journée.' },
      { id: 'midday', label: 'Midi / rapide', caption: 'Une version plus directe, conçue pour rassurer vite et déclencher une réservation ou une commande pendant la pause déjeuner.' },
      { id: 'golden', label: 'Apéro / terrasse', caption: "Une version plus chaude, pensée pour donner envie de rester, de partager et de réserver pour l'apéritif." },
      { id: 'evening', label: 'Soir / dîner', caption: 'Une version plus intime et plus premium, conçue pour installer une ambiance de dîner et justifier la réservation.' },
    ],
    identityTabs: [
      { id: 'modern', label: 'Monde moderne', caption: 'Une direction nette, précise, presque éditoriale, qui installe une sensation premium et maîtrisée.' },
      { id: 'paper', label: 'Monde papier 2D', caption: 'Une direction tactile et découpée, plus artisanale et plus mémorable grâce à des formes en couches.' },
      { id: 'bubblegum', label: 'Bubble Gum fluo', caption: 'Une direction pop, joyeuse et ultra-visible, pensée pour capter le regard très vite.' },
    ],
    wallCards: [
      { title: 'Plus net', text: "Beaucoup d'air, des lignes droites et une sensation de maîtrise immédiate." },
      { title: 'Plus tactile', text: 'Des couches, des ombres franches et une sensation de matière plus artisanale.' },
      { title: 'Plus pop', text: 'Des contrastes forts, des volumes ronds et une énergie visuelle plus directe.' },
    ],
  },
  en: {
    eyebrow: 'Interactive playground',
    title: 'A place to spark interest before the first brief',
    intro:
      'This page is not only about animation. It shows how the same content can feel completely different depending on scene, rhythm and graphic universe.',
    primaryCta: 'Back home',
    secondaryCta: 'Discuss the project',
    ctaMicrocopy: '15-minute exchange, no commitment needed.',
    stickyCta: 'Discuss my project',
    labTitle: '3 zones, 3 cursor behaviors',
    labIntro:
      'Each rectangle triggers a different response. The goal is not gimmickry, but a feeling of precision, materiality or energy.',
    sceneTitle: 'One restaurant, four times of day',
    sceneIntro:
      'The core content stays close, but the ambiance, light and hierarchy shift to sell brunch, lunch, aperitif or dinner.',
    identityTitle: 'Three graphic worlds, one promise',
    identityIntro:
      'The point is not to recolor a mockup. Each version changes the structure, texture and visual tension.',
    magneticTitle: 'Interactive buttons',
    magneticIntro:
      'A button can feel more alive without becoming noisy. Small movement creates an immediate responsive feel.',
    wallTitle: '3 possible feels for the same interface',
    wallIntro:
      'This block compares three very simple directions. The base stays the same, but the perception shifts: cleaner, more tactile or more pop.',
    finalTitle: 'Your site can already spark interest before anyone reads a single word.',
    finalText:
      'If what you just saw resonates, we can talk. No immediate quote — just a quick exchange to see if the direction makes sense for your project.',
    finalCta: 'Let\'s talk',
    finalCtaSecondary: 'Back to home',
    finalEyebrow: 'Next step',
    morphTargets: [
      { mode: 'halo', label: 'Soft halo', hint: 'A light follows the gesture.' },
      { mode: 'frame', label: 'Sharp frame', hint: 'The cursor turns into a precise target.' },
      { mode: 'orbital', label: 'Pop burst', hint: 'A more energetic and playful response.' },
    ],
    sceneTabs: [
      { id: 'morning', label: 'Morning / brunch', caption: 'A bright version built to sell coffee, brunch and easy early-day booking.' },
      { id: 'midday', label: 'Midday / quick', caption: 'A more direct version designed to reassure fast and drive lunch-time booking or ordering.' },
      { id: 'golden', label: 'Aperitif / terrace', caption: 'A warmer version built to make shared plates, drinks and terrace booking feel desirable.' },
      { id: 'evening', label: 'Evening / dinner', caption: 'A more intimate and premium version that supports a dinner reservation mood.' },
    ],
    identityTabs: [
      { id: 'modern', label: 'Modern', caption: 'A sharp, controlled, premium-tech direction with strong clarity.' },
      { id: 'paper', label: 'Paper World 2D', caption: 'A tactile, layered direction that feels handcrafted and memorable.' },
      { id: 'bubblegum', label: 'Fluo Bubble Gum', caption: 'A loud, joyful, high-contrast direction built to grab attention fast.' },
    ],
    wallCards: [
      { title: 'Cleaner', text: 'More breathing room, straighter lines and a stronger sense of control.' },
      { title: 'More tactile', text: 'Layering, bold shadows and a more handcrafted material feel.' },
      { title: 'More pop', text: 'Stronger contrast, rounder volumes and more immediate visual energy.' },
    ],
  },
}

export function DemoClient({ locale }: { locale: string }) {
  const copy = demoCopy[locale] ?? demoCopy.fr

  const [cursorMode, setCursorMode] = useState<CursorMode>('default')
  const [isZoneCursorActive, setIsZoneCursorActive] = useState(false)
  const [isSelectableHover, setIsSelectableHover] = useState(false)
  const [isPointerPressed, setIsPointerPressed] = useState(false)
  const [clickedZone, setClickedZone] = useState<number | null>(null)
  const [clickKey, setClickKey] = useState(0)
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 })
  const [scene, setScene] = useState<DemoScene>('morning')
  const [identity, setIdentity] = useState<DemoIdentity>('modern')

  const pointerX = useMotionValue(-200)
  const pointerY = useMotionValue(-200)
  const cursorX = useSpring(pointerX, { stiffness: 360, damping: 28 })
  const cursorY = useSpring(pointerY, { stiffness: 360, damping: 28 })
  const glowX = useSpring(pointerX, { stiffness: 70, damping: 26 })
  const glowY = useSpring(pointerY, { stiffness: 70, damping: 26 })

  const zoneX = useMotionValue(-999)
  const zoneY = useMotionValue(-999)
  const magnetX = useMotionValue(0)
  const magnetY = useMotionValue(0)
  const magnetXS = useSpring(magnetX, { stiffness: 260, damping: 18 })
  const magnetYS = useSpring(magnetY, { stiffness: 260, damping: 18 })

  const pageGlow = useMotionTemplate`radial-gradient(540px circle at ${glowX}px ${glowY}px, rgba(255,255,255,0.07), transparent 60%)`
  const zoneLight = useMotionTemplate`radial-gradient(220px circle at ${zoneX}px ${zoneY}px, rgba(255,255,255,0.24), transparent 72%)`

  useEffect(() => {
    if (clickedZone === null) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setClickedZone(null)
    }, 650)

    return () => window.clearTimeout(timeoutId)
  }, [clickedZone, clickKey])

  useEffect(() => {
    const releasePointer = () => setIsPointerPressed(false)

    window.addEventListener('mouseup', releasePointer)
    window.addEventListener('blur', releasePointer)

    return () => {
      window.removeEventListener('mouseup', releasePointer)
      window.removeEventListener('blur', releasePointer)
    }
  }, [])

  const activateCursor = (mode: CursorMode) => {
    setIsZoneCursorActive(true)
    setCursorMode(mode)
  }

  const resetCursor = () => {
    setIsZoneCursorActive(false)
    setCursorMode('default')
    zoneX.set(-999)
    zoneY.set(-999)
  }

  const handleZoneClick = (event: MouseEvent<HTMLDivElement>, index: number) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setClickPos({ x: event.clientX - rect.left, y: event.clientY - rect.top })
    setClickedZone(index)
    setClickKey((value) => value + 1)
  }

  const cursorAnimation = isZoneCursorActive
    ? cursorMode === 'halo'
      ? {
          width: 24,
          height: 24,
          borderRadius: 999,
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderColor: 'rgba(255,255,255,0.9)',
          boxShadow: '0 0 24px rgba(255,255,255,0.16)',
        }
      : cursorMode === 'frame'
        ? {
            width: 42,
            height: 42,
            borderRadius: 16,
            backgroundColor: 'rgba(125,211,252,0.08)',
            borderColor: 'rgba(125,211,252,0.95)',
            boxShadow: '0 0 26px rgba(125,211,252,0.2)',
          }
        : {
            width: 28,
            height: 28,
            borderRadius: 999,
            backgroundColor: 'rgba(244,114,182,0.12)',
            borderColor: 'rgba(244,114,182,0.96)',
            boxShadow: '0 0 26px rgba(244,114,182,0.25)',
            scale: isPointerPressed ? 1.12 : 1,
          }
    : isSelectableHover
      ? {
          width: 46,
          height: 40,
          borderRadius: 999,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          boxShadow: '0 8px 20px rgba(251,191,36,0.16)',
          scale: isPointerPressed ? 1.16 : 1,
        }
      : {
          width: 40,
          height: 34,
          borderRadius: 999,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          boxShadow: 'none',
          scale: isPointerPressed ? 1.14 : 1,
        }

  const sceneAccent =
    scene === 'morning'
      ? 'from-amber-200/40 via-cyan-200/20 to-transparent'
      : scene === 'midday'
        ? 'from-lime-200/35 via-emerald-200/18 to-transparent'
        : scene === 'golden'
          ? 'from-amber-300/36 via-orange-300/20 to-transparent'
          : 'from-violet-300/28 via-fuchsia-300/16 to-transparent'

  const identityAccent =
    identity === 'modern'
      ? 'from-cyan-300/16 via-white/4 to-transparent'
      : identity === 'paper'
        ? 'from-[#ffcf70]/26 via-[#fff6e8]/10 to-transparent'
        : 'from-fuchsia-300/18 via-cyan-300/10 to-transparent'

  const identitySample =
    identity === 'modern'
      ? {
          eyebrow: locale === 'fr' ? 'Studio moderne' : 'Modern studio',
          title: locale === 'fr' ? 'Une vitrine nette, calme et précise.' : 'A storefront that feels sharp, calm and precise.',
          summary:
            locale === 'fr'
              ? 'Grandes masses, rythme contrôlé, contrastes fins. Tout installe une sensation premium sans surcharger la lecture.'
              : 'Large blocks, controlled rhythm and crisp contrast create a premium feel without overwhelming the reading flow.',
          stats: locale === 'fr' ? ['Grille stricte', 'Espaces larges', 'Signal premium'] : ['Strict grid', 'Wide spacing', 'Premium signal'],
          primary: locale === 'fr' ? 'Voir la carte' : 'See the menu',
          secondary: locale === 'fr' ? 'Réserver' : 'Book now',
        }
      : identity === 'paper'
        ? {
            eyebrow: locale === 'fr' ? 'Paper World 2D' : 'Paper World 2D',
            title: locale === 'fr' ? 'Un univers en couches, plus artisanal et plus tactile.' : 'A layered world that feels handcrafted and tactile.',
            summary:
              locale === 'fr'
                ? "Les blocs ressemblent à des papiers découpés. L'interface devient plus singulière, plus chaleureuse et plus mémorable."
                : 'Blocks feel like cut paper. The interface becomes more singular, warmer and easier to remember.',
            stats: locale === 'fr' ? ['Ombres franches', 'Couches 2D', 'Mémoire visuelle'] : ['Bold shadows', '2D layers', 'Visual memory'],
            primary: locale === 'fr' ? 'Explorer' : 'Explore',
            secondary: locale === 'fr' ? 'Composer' : 'Compose',
          }
        : {
            eyebrow: locale === 'fr' ? 'Fluo Bubble Gum' : 'Fluo Bubble Gum',
            title: locale === 'fr' ? 'Une présence pop qui prend tout de suite la place.' : 'A pop presence that immediately takes space.',
            summary:
              locale === 'fr'
                ? "Volumes ronds, couleurs fluo, contrastes francs. Le site devient un objet d'attention, presque une affiche vivante."
                : 'Round volumes, fluorescent color and strong contrast turn the site into a live poster.',
            stats: locale === 'fr' ? ['Couleurs franches', 'Rondeur', 'Impact direct'] : ['Loud colors', 'Roundness', 'Immediate impact'],
            primary: locale === 'fr' ? 'Voir l’effet' : 'Lets pop',
            secondary: locale === 'fr' ? 'Essayer' : 'Try it',
          }

  const sceneSample =
    scene === 'morning'
      ? {
          moment: locale === 'fr' ? 'Matin calme et lumineux' : 'Bright calm morning',
          goal: locale === 'fr' ? 'Donner envie de café, brunch et réservation simple' : 'Sell coffee, brunch and easy booking',
          shift: locale === 'fr' ? 'Plus clair, plus accueillant, plus immédiat' : 'Brighter, warmer and more immediate',
        }
      : scene === 'midday'
        ? {
            moment: locale === 'fr' ? 'Pause déjeuner rapide' : 'Fast lunch break',
            goal: locale === 'fr' ? 'Rassurer vite et pousser une action utile' : 'Reassure fast and drive action',
            shift: locale === 'fr' ? 'Plus direct, plus dense, plus efficace' : 'More direct, denser and more efficient',
          }
        : scene === 'golden'
          ? {
              moment: locale === 'fr' ? 'Apéro et terrasse' : 'Aperitif and terrace',
              goal: locale === 'fr' ? 'Donner envie de rester, partager et réserver' : 'Make staying, sharing and booking feel desirable',
              shift: locale === 'fr' ? 'Plus chaud, plus social, plus gourmand' : 'Warmer, more social and more indulgent',
            }
          : {
              moment: locale === 'fr' ? 'Soir et dîner signature' : 'Evening and signature dinner',
              goal: locale === 'fr' ? 'Installer une ambiance premium et plus exclusive' : 'Install a more premium and exclusive mood',
              shift: locale === 'fr' ? 'Plus sombre, plus calme, plus haut de gamme' : 'Darker, calmer and more premium',
            }

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#fff4d9_0%,#fde7b0_14%,#f7cf7d_32%,#efb45c_52%,#e59a49_74%,#d8843e_100%)] text-neutral-950 lg:cursor-none lg:[&_a]:cursor-none lg:[&_button]:cursor-none"
      onMouseMove={(event) => {
        pointerX.set(event.clientX)
        pointerY.set(event.clientY)
        setIsSelectableHover(Boolean((event.target as HTMLElement | null)?.closest('a, button')))
      }}
      onMouseDown={() => setIsPointerPressed(true)}
      onMouseUp={() => setIsPointerPressed(false)}
      onMouseLeave={() => {
        setIsPointerPressed(false)
        setIsSelectableHover(false)
        resetCursor()
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.02)_100%)]" />

      <motion.div className="pointer-events-none absolute inset-0 opacity-90" style={{ backgroundImage: pageGlow }} />

      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[59] hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/18 lg:block"
        style={{ x: glowX, y: glowY }}
        animate={{
          width: isZoneCursorActive && cursorMode === 'halo' ? 56 : 0,
          height: isZoneCursorActive && cursorMode === 'halo' ? 56 : 0,
          opacity: isZoneCursorActive && cursorMode === 'halo' ? 0.72 : 0,
        }}
        transition={{ type: 'spring', stiffness: 70, damping: 20 }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[59] hidden -translate-x-1/2 -translate-y-1/2 lg:block"
        style={{ x: cursorX, y: cursorY }}
      >
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const angle = (index / 6) * Math.PI * 2
          return (
            <motion.div
              key={index}
              className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-300"
              animate={isZoneCursorActive && cursorMode === 'orbital'
                ? {
                    x: [0, Math.cos(angle) * 28, 0],
                    y: [0, Math.sin(angle) * 28, 0],
                    opacity: [0, 0.9, 0],
                    scale: [0.2, 1, 0.2],
                  }
                : { opacity: 0, scale: 0 }}
              transition={isZoneCursorActive && cursorMode === 'orbital'
                ? { duration: 1.05, repeat: Infinity, delay: index * 0.12, ease: 'easeOut' }
                : { duration: 0.08 }}
            />
          )
        })}
      </motion.div>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center border lg:flex"
        style={{ x: cursorX, y: cursorY }}
        animate={cursorAnimation}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        {isZoneCursorActive && cursorMode === 'frame' ? (
          <>
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-px bg-cyan-200/80" />
            <div className="absolute inset-y-0 left-1/2 w-px -translate-x-px bg-cyan-200/80" />
            <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200 shadow-[0_0_10px_rgba(125,211,252,0.85)]" />
          </>
        ) : !isZoneCursorActive ? (
          <motion.svg
            viewBox="0 0 39 32"
            aria-hidden
            className={`h-full w-full ${isSelectableHover ? 'drop-shadow-[0_0_14px_rgba(251,191,36,0.3)]' : 'drop-shadow-[0_2px_6px_rgba(42,29,22,0.16)]'}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={isSelectableHover ? { rotate: [-8, 6, -4], scale: [1, 1.08, 1.02] } : { rotate: 0, scale: 1 }}
            transition={isSelectableHover ? { duration: 0.55, ease: 'easeInOut' } : { type: 'spring', stiffness: 260, damping: 20 }}
            style={{ transformOrigin: '55% 72%' }}
          >
            <path d="M17.6748 3.6959C16.8591 4.31865 16.0603 5.76828 16 6.74102C15.9056 8.31796 16.776 10.3294 17.955 11.2342C18.584 11.7199 19.6417 12.0801 20.4494 12.0903C21.0226 12.0934 21.2134 12.0591 21.7636 11.8094C23.1062 11.227 24.1063 9.70025 24.1529 8.19975C24.1964 6.52603 23.3385 4.81018 21.9431 3.7655C21.362 3.32924 20.2404 2.99361 19.5707 3.03707C19.0504 3.07177 18.0222 3.43677 17.6748 3.6959Z" fill="#FFF4E6" stroke="#2A1D16" strokeWidth="0.9" />
            <path d="M8.24082 7.64586C7.02022 8.75328 6.92248 10.0312 7.92685 11.691C8.81607 13.1527 9.85637 14.0235 11.4124 14.5997C13.6498 15.4478 15.3426 14.925 16.1662 13.146C17.0586 11.205 16.0132 9.02786 13.4881 7.61169C12.6111 7.11439 11.6817 6.831 10.8387 6.79555C9.96885 6.75098 8.7998 7.14089 8.24082 7.64586Z" fill="#FFF4E6" stroke="#2A1D16" strokeWidth="0.9" />
            <path d="M5.51372 16.0413C5.3187 16.1936 4.97735 16.5281 4.77406 16.7903C4.13179 17.599 4.07302 18.2616 4.56042 19.2097C4.95512 19.9605 5.38603 20.4452 6.18373 21.0416C7.70005 22.1676 9.79722 22.4309 11.3681 21.6931C12.5988 21.1245 13.3049 20.1652 13.1877 19.2305C13.1097 18.6008 12.5955 17.6436 12.027 17.0856C10.9776 16.0522 9.12929 15.3832 7.4599 15.4313C6.82191 15.4527 5.95381 15.7271 5.51372 16.0413Z" fill="#FFF4E6" stroke="#2A1D16" strokeWidth="0.9" />
            <path d="M26.3971 8.25844C24.9877 9.28362 24.2793 11.0977 24.7157 12.6187C25.0542 13.8278 26.1173 14.8661 27.1705 15.0058C28.2864 15.1603 29.2486 14.9177 30.1029 14.2605C31.4256 13.2588 32.1626 11.6666 32.0105 10.1628C31.8985 9.07059 30.9925 7.93338 29.8895 7.53136C29.0321 7.21958 27.3656 7.56714 26.3971 8.25844Z" fill="#FFF4E6" stroke="#2A1D16" strokeWidth="0.9" />
            <path d="M17.0684 14.9799C15.7413 15.8779 15.2993 16.6118 14.7812 18.7761C14.3215 20.6944 14.1565 21.0106 13.0499 22.223C12.4804 22.8404 12.2321 23.208 11.9518 23.8507C11.637 24.5747 11.6041 24.7431 11.6984 25.3006C11.9587 26.9719 13.243 28.2606 15.1567 28.7727C17.6993 29.4525 19.2959 29.0254 23.1576 26.6498L24.2411 25.9814L25.751 25.7044C28.6344 25.1636 30.3178 24.5864 31.4074 23.7406C32.3614 23.0148 33.2032 21.5924 33.2588 20.6272C33.3222 19.6978 33.1712 19.0745 32.7038 18.2902C32.3733 17.7454 32.199 17.5397 31.8004 17.2643C31.0258 16.7145 29.9208 16.418 28.4088 16.3552C27.3042 16.3115 26.9393 16.247 26.0831 15.9621C25.5185 15.7698 24.4959 15.3151 23.7966 14.9506C23.1065 14.5826 22.3026 14.2289 22.0105 14.156C20.4279 13.77 18.3581 14.1157 17.0684 14.9799Z" fill="#FFF4E6" stroke="#2A1D16" strokeWidth="0.9" />
          </motion.svg>
        ) : null}
      </motion.div>

      <section className="relative px-6 pb-16 pt-24 lg:px-8 lg:pb-24 lg:pt-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative z-10">
            <motion.div
              className="text-xs uppercase tracking-[0.34em] text-amber-950/95"
              initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            >
              {copy.eyebrow}
            </motion.div>
            <h1
              className="mt-6 max-w-4xl text-[clamp(2.35rem,11vw,4.4rem)] font-black leading-[0.92] text-neutral-950 sm:text-6xl md:text-7xl lg:text-[5.5rem]"
              style={{ fontFamily: '"Bodoni 72", "Didot", "Times New Roman", serif' }}
            >
              {copy.title.split(' ').map((word, index, words) => (
                <span
                  key={`${word}-${index}`}
                  className={`inline-block overflow-hidden align-top ${index < words.length - 1 ? 'mr-[0.12em]' : ''}`}
                >
                  <motion.span
                    className="inline-block"
                    initial={{ y: '115%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: 0.95 + index * 0.08 }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              className="mt-6 max-w-2xl text-lg leading-8 text-neutral-900/90"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.9 }}
            >
              {copy.intro}
            </motion.p>
            <motion.div
              className="mt-9 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.1 }}
            >
              <Link
                href={`/${locale}`}
                className="rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-1"
              >
                {copy.primaryCta}
              </Link>
              <Link
                href={`/${locale}#contact`}
                className="rounded-full border border-amber-700/20 bg-white/70 px-6 py-3 text-sm font-semibold text-amber-900 transition-transform duration-200 hover:-translate-y-1"
              >
                {copy.secondaryCta}
              </Link>
            </motion.div>
            <motion.p
              className="mt-4 text-sm text-neutral-900/80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 2.25 }}
            >
              {copy.ctaMicrocopy}
            </motion.p>
          </div>

          <motion.div
            className="relative h-[27rem] overflow-hidden rounded-[36px] border border-amber-900/20 bg-[#fff8ea]/72 p-5 shadow-[0_24px_60px_rgba(120,53,15,0.12)] backdrop-blur-sm"
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.9 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_26%),linear-gradient(180deg,transparent,rgba(255,248,234,0.4))]" />
            <motion.div
              className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-900/20 bg-[radial-gradient(circle,_rgba(255,255,255,0.48),_rgba(255,248,234,0.08)_60%)]"
              animate={{ scale: [1, 1.08, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute left-[18%] top-[18%] h-24 w-52 rounded-[28px] border border-amber-900/20 bg-white/85 p-4 backdrop-blur-md"
              animate={{ y: [0, -10, 0], rotate: [-7, -2, -7] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="h-3 w-20 rounded-full bg-white/60" />
              <div className="mt-4 h-12 rounded-2xl bg-gradient-to-r from-amber-300/80 to-pink-300/70" />
            </motion.div>
            <motion.div
              className="absolute right-[10%] top-[24%] h-28 w-44 rounded-[32px] border border-amber-900/20 bg-white/85 p-4 backdrop-blur-md"
              animate={{ y: [0, 14, 0], rotate: [6, 2, 6] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="h-16 rounded-[24px] bg-gradient-to-br from-cyan-300/75 to-emerald-300/65" />
              <div className="mt-4 h-3 w-16 rounded-full bg-white/85" />
            </motion.div>
            <motion.div
              className="absolute bottom-[10%] left-[26%] h-40 w-64 rounded-[32px] border border-amber-900/24 bg-[rgba(96,58,18,0.18)] p-5 backdrop-blur-md"
              animate={{ y: [0, -14, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex items-center justify-between">
                <div className="h-3 w-24 rounded-full bg-white/65" />
                <div className="h-3 w-3 rounded-full bg-amber-300" />
              </div>
              <div className="mt-5 h-20 rounded-[24px] bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.55),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.42),_transparent_35%),rgba(255,255,255,0.06)]" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <motion.section
        className="px-6 py-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.24 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="mx-auto max-w-6xl overflow-hidden rounded-[36px] border border-amber-900/20 bg-[#fff8ea]/76 p-6 shadow-[0_20px_80px_rgba(120,53,15,0.14)] backdrop-blur-sm lg:p-8"
          initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl font-semibold text-neutral-950 md:text-4xl">{copy.labTitle}</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-900/90">{copy.labIntro}</p>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {copy.morphTargets.map((target, index) => (
              <motion.div
                key={target.label}
                initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.12 + index * 0.1 }}
                onMouseEnter={() => activateCursor(target.mode)}
                onMouseLeave={() => {
                  magnetX.set(0)
                  magnetY.set(0)
                  resetCursor()
                }}
                onMouseMove={index === 0 ? (event) => {
                  const rect = event.currentTarget.getBoundingClientRect()
                  zoneX.set(event.clientX - rect.left)
                  zoneY.set(event.clientY - rect.top)
                } : undefined}
                onClick={(event) => handleZoneClick(event, index)}
                whileHover={{ y: -8 }}
                className="group relative min-h-[320px] overflow-hidden rounded-[30px] border border-amber-900/20 bg-[rgba(28,19,10,0.82)] shadow-[0_18px_44px_rgba(60,37,12,0.18)]"
              >
                {index === 0 ? (
                  <motion.div className="absolute inset-0" style={{ backgroundImage: zoneLight }} />
                ) : (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      index === 1
                        ? 'from-cyan-300/12 via-sky-300/4 to-transparent'
                        : 'from-fuchsia-300/12 via-violet-300/4 to-transparent'
                    }`}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />
                )}

                <div className="absolute inset-[14px] rounded-[24px] border border-dashed border-amber-100/40" />
                <div className="relative flex h-full flex-col justify-between p-6">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-white/80">Zone 0{index + 1}</div>
                    <h3 className="mt-4 text-3xl font-semibold text-white">{target.label}</h3>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-white/90">{target.hint}</p>
                  </div>
                  <div className="rounded-[24px] border border-white/20 bg-white/10 p-4 text-sm leading-6 text-white/90">
                    {index === 0
                      ? locale === 'fr'
                        ? 'Une zone plus douce et plus diffuse.'
                        : 'A softer and more diffuse interaction area.'
                      : index === 1
                        ? locale === 'fr'
                          ? 'Une sensation de viseur, plus nette et plus dirigée.'
                          : 'A target-like feel, sharper and more directed.'
                        : locale === 'fr'
                          ? 'Une réponse visuelle plus pop et plus démonstrative.'
                          : 'A more demonstrative and playful response.'}
                  </div>
                </div>

                <AnimatePresence>
                  {clickedZone === index && index === 0 && (
                    <motion.div
                      key={`ripple-${clickKey}`}
                      className="pointer-events-none absolute rounded-full border border-white/60"
                      style={{ left: clickPos.x, top: clickPos.y, translateX: '-50%', translateY: '-50%' }}
                      initial={{ width: 0, height: 0, opacity: 0.8 }}
                      animate={{ width: 260, height: 260, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.62, ease: 'easeOut' }}
                    />
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {clickedZone === index && index === 1 && (
                    <motion.div
                      key={`scan-${clickKey}`}
                      className="pointer-events-none absolute inset-x-0 h-px bg-cyan-200/80 shadow-[0_0_18px_6px_rgba(125,211,252,0.35)]"
                      style={{ top: clickPos.y + 18, transformOrigin: `${clickPos.x}px 0` }}
                      initial={{ scaleX: 0, opacity: 1 }}
                      animate={{ scaleX: 1, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.48, ease: 'easeOut' }}
                    />
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {clickedZone === index && index === 2
                    ? [0, 1, 2, 3, 4, 5, 6, 7].map((item) => {
                        const angle = (item / 8) * Math.PI * 2
                        return (
                          <motion.div
                            key={`burst-${clickKey}-${item}`}
                            className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-300 shadow-[0_0_12px_rgba(244,114,182,0.7)]"
                            style={{ left: clickPos.x, top: clickPos.y }}
                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                            animate={{ x: Math.cos(angle) * 70, y: Math.sin(angle) * 70, opacity: 0, scale: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.58, ease: 'easeOut', delay: item * 0.02 }}
                          />
                        )
                      })
                    : null}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        className="px-6 py-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.24 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[34px] border border-amber-900/20 bg-[#fff8ea]/76 p-6 shadow-[0_20px_80px_rgba(120,53,15,0.14)] backdrop-blur-sm lg:p-8"
          initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            aria-hidden
            className={`pointer-events-none absolute inset-0 z-0 bg-gradient-to-br ${identityAccent}`}
            animate={{ opacity: [0.12, 0.24, 0.12] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative z-10">
            <div>
              <div className="text-xs uppercase tracking-[0.26em] text-amber-950/95">{locale === 'fr' ? 'Direction visuelle' : 'Visual direction'}</div>
              <h2 className="mt-3 max-w-3xl text-3xl font-black text-neutral-950 md:text-4xl">{copy.identityTitle}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-900/90 md:text-base">{copy.identityIntro}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {copy.identityTabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setIdentity(tab.id)}
                    className={`group rounded-full border px-4 py-2.5 text-sm font-semibold transition duration-200 ${
                      identity === tab.id
                        ? 'border-neutral-950 bg-neutral-950 text-white shadow-[0_8px_20px_rgba(23,23,23,0.22)]'
                        : 'border-amber-900/28 bg-white/90 text-neutral-900 shadow-[0_4px_12px_rgba(120,53,15,0.08)] hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_18px_rgba(120,53,15,0.14)]'
                    }`}
                    aria-pressed={identity === tab.id}
                  >
                    <span
                      className={`mr-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[11px] font-bold leading-none ${
                        identity === tab.id
                          ? 'bg-white/20 text-white'
                          : 'bg-amber-200/70 text-neutral-800 group-hover:bg-amber-300/70'
                      }`}
                    >
                      0{index + 1}
                    </span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.18fr)_minmax(18rem,0.82fr)] lg:items-start">
            <div className="relative min-h-[32rem] overflow-hidden rounded-[28px] border border-amber-900/24 bg-[linear-gradient(180deg,#17110d,#0f0c0a)] shadow-[0_30px_80px_rgba(120,53,15,0.18)] lg:min-h-[34rem]">
              <AnimatePresence mode="wait">
                {identity === 'modern' ? (
                  <motion.div
                    key="modern"
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 overflow-hidden px-6 py-6 lg:px-8 lg:py-7"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.09),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_58%)]" />
                    <div className="relative flex h-full flex-col justify-between">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-white/85">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                          {identitySample.eyebrow}
                        </span>
                        <span className="text-white/75">{locale === 'fr' ? 'Monde moderne' : 'Modern world'}</span>
                      </div>
                      <div className="grid flex-1 items-center gap-7 lg:grid-cols-[1.02fr_0.98fr]">
                        <div className="max-w-xl">
                          <div className="mb-4 text-xs uppercase tracking-[0.22em] text-white/75">{locale === 'fr' ? 'Interface moderne' : 'Modern interface'}</div>
                          <h3 className="text-4xl font-black leading-[0.94] text-white sm:text-5xl md:text-[3.7rem]">{identitySample.title}</h3>
                          <p className="mt-6 max-w-lg text-base leading-7 text-white/80">{identitySample.summary}</p>
                        </div>
                        <div className="rounded-[30px] border border-white/15 bg-white/[0.045] p-5 backdrop-blur-sm">
                          <div className="grid gap-3">
                            <div className="rounded-[22px] border border-white/15 bg-black/20 p-5">
                              <div className="text-[11px] uppercase tracking-[0.2em] text-white/75">{locale === 'fr' ? 'Direction' : 'Direction'}</div>
                              <div className="mt-3 text-2xl font-black leading-none text-white">{locale === 'fr' ? 'Clair. Net. Maîtrisé.' : 'Clear. Sharp. Controlled.'}</div>
                              <div className="mt-4 grid gap-2">
                                <div className="h-2 rounded-full bg-white/18">
                                  <div className="h-2 w-[78%] rounded-full bg-white/72" />
                                </div>
                                <div className="h-2 rounded-full bg-white/12">
                                  <div className="h-2 w-[58%] rounded-full bg-white/42" />
                                </div>
                              </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                              <div className="rounded-[22px] border border-white/15 bg-white/[0.05] p-4">
                                <div className="text-[11px] uppercase tracking-[0.2em] text-white/75">Signal</div>
                                <div className="mt-2 text-3xl font-black leading-none text-white">48h</div>
                              </div>
                              <div className="rounded-[22px] border border-white/15 bg-white/[0.05] px-4 py-4 text-xs uppercase tracking-[0.18em] text-white/80 sm:min-w-[10rem]">
                                {identitySample.stats[0]}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-6 border-t border-white/15 pt-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="flex flex-wrap gap-2.5">
                          {identitySample.stats.map((item) => (
                            <span key={item} className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-white/80">
                              {item}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <div className="rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-950">{identitySample.primary}</div>
                          <div className="rounded-full border border-white/20 bg-white/[0.04] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/85">{identitySample.secondary}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : identity === 'paper' ? (
                  <motion.div
                    key="paper"
                    initial={{ opacity: 0, x: 16, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -14, scale: 1.02 }}
                    transition={{ duration: 0.38 }}
                    className="absolute inset-0 overflow-hidden bg-[#f4e9d1] px-5 py-5 text-[#2d241d] lg:px-6 lg:py-6"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.5),transparent_28%),linear-gradient(180deg,rgba(0,0,0,0.04),transparent_55%)]" />
                    <motion.div className="absolute left-8 top-20 h-24 w-48 rounded-[20px] border-2 border-[#2d241d] bg-[#ffcf70] shadow-[6px_6px_0_0_rgba(45,36,29,0.9)]" animate={{ rotate: [-2, 1, -2] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }} />
                    <motion.div className="absolute right-10 bottom-16 h-28 w-40 rounded-[24px] border-2 border-[#2d241d] bg-[#9dd6b3] shadow-[8px_8px_0_0_rgba(45,36,29,0.9)]" animate={{ rotate: [2, -1, 2] }} transition={{ duration: 5.1, repeat: Infinity, ease: 'easeInOut' }} />
                    <div className="relative grid h-full grid-rows-[auto_1fr_auto] gap-5">
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.22em] text-[#5c4f42]">
                        <span>{identitySample.eyebrow}</span>
                        <span>{locale === 'fr' ? 'Scène en couches' : 'Layered scene'}</span>
                      </div>
                      <div className="relative flex items-center justify-center">
                        <div className="relative w-full max-w-3xl">
                          <div className="absolute -left-4 top-6 h-40 w-40 rounded-[28px] border-2 border-[#2d241d] bg-[#b8d5ff] shadow-[10px_10px_0_0_rgba(45,36,29,0.9)]" />
                          <div className="relative mx-auto max-w-xl rounded-[34px] border-[3px] border-[#2d241d] bg-[#fff6e8] px-6 py-8 text-center shadow-[14px_14px_0_0_rgba(45,36,29,0.95)]">
                            <div className="text-xs uppercase tracking-[0.24em] text-[#6b5a4a]">{locale === 'fr' ? 'Monde papier' : 'Paper world'}</div>
                            <h3 className="mt-4 text-3xl font-black leading-[0.94] text-[#2d241d] sm:text-4xl md:text-5xl">{identitySample.title}</h3>
                            <p className="mt-5 text-base leading-7 text-[#5c4f42]">{identitySample.summary}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="grid gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#5c4f42]">
                          {identitySample.stats.map((item) => (
                            <span key={item}>{item}</span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <div className="rounded-full border-2 border-[#2d241d] bg-[#ffcf70] px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-[#2d241d] shadow-[4px_4px_0_0_rgba(45,36,29,0.9)]">{identitySample.primary}</div>
                          <div className="rounded-full border-2 border-[#2d241d] bg-[#fff6e8] px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-[#2d241d] shadow-[4px_4px_0_0_rgba(45,36,29,0.9)]">{identitySample.secondary}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="bubblegum"
                    initial={{ opacity: 0, x: 16, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -14, scale: 1.02 }}
                    transition={{ duration: 0.38 }}
                    className="absolute inset-0 overflow-hidden bg-[#c8eff2] px-5 py-5 lg:px-6 lg:py-6"
                  >
                    {/* Colorful glossy balls — top-right cluster */}
                    <motion.div className="absolute rounded-full" style={{ width: 118, height: 118, top: -38, right: 20, background: 'radial-gradient(circle at 36% 28%, rgba(255,255,185,0.98) 0%, #ffdd00 44%, #cc9000 100%)', boxShadow: 'inset -5px -7px 14px rgba(0,0,0,0.16), 0 6px 12px rgba(0,0,0,0.1)' }} animate={{ y: [0, -6, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }} />
                    <motion.div className="absolute rounded-full" style={{ width: 94, height: 94, top: -26, right: 118, background: 'radial-gradient(circle at 36% 28%, rgba(175,255,250,0.98) 0%, #22ddd8 44%, #009990 100%)', boxShadow: 'inset -4px -6px 12px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.1)' }} animate={{ y: [0, 6, 0] }} transition={{ duration: 4.0, repeat: Infinity, ease: 'easeInOut' }} />
                    <motion.div className="absolute rounded-full" style={{ width: 76, height: 76, top: -10, right: 70, background: 'radial-gradient(circle at 36% 28%, rgba(255,185,240,0.98) 0%, #ff55cc 44%, #cc0099 100%)', boxShadow: 'inset -3px -5px 10px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)' }} animate={{ y: [0, -5, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} />
                    <motion.div className="absolute rounded-full" style={{ width: 86, height: 86, top: -28, right: 192, background: 'radial-gradient(circle at 36% 28%, rgba(220,185,255,0.98) 0%, #aa55ee 44%, #770099 100%)', boxShadow: 'inset -3px -6px 12px rgba(0,0,0,0.15), 0 4px 9px rgba(0,0,0,0.1)' }} animate={{ y: [0, 5, 0] }} transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }} />
                    <motion.div className="absolute rounded-full" style={{ width: 64, height: 64, top: 32, right: 156, background: 'radial-gradient(circle at 36% 28%, rgba(255,200,220,0.98) 0%, #ff44aa 44%, #cc0077 100%)', boxShadow: 'inset -2px -4px 8px rgba(0,0,0,0.15), 0 3px 7px rgba(0,0,0,0.1)' }} animate={{ y: [0, -6, 0], scale: [1, 1.05, 1] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }} />
                    {/* Left-side balls */}
                    <motion.div className="absolute rounded-full" style={{ width: 56, height: 56, top: -14, left: 20, background: 'radial-gradient(circle at 36% 28%, rgba(255,185,220,0.98) 0%, #ff77cc 44%, #dd2299 100%)', boxShadow: 'inset -2px -4px 8px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.1)' }} animate={{ y: [0, 6, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }} />
                    <motion.div className="absolute rounded-full" style={{ width: 42, height: 42, top: 44, left: 64, background: 'radial-gradient(circle at 36% 28%, rgba(175,240,255,0.98) 0%, #44ccee 44%, #0099bb 100%)', boxShadow: 'inset -2px -3px 7px rgba(0,0,0,0.14), 0 3px 5px rgba(0,0,0,0.1)' }} animate={{ y: [0, -4, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }} />
                    <motion.div className="absolute rounded-full" style={{ width: 48, height: 48, bottom: 28, right: 22, background: 'radial-gradient(circle at 36% 28%, rgba(255,255,185,0.9) 0%, #ffee44 44%, #ccaa00 100%)', boxShadow: 'inset -2px -3px 7px rgba(0,0,0,0.13), 0 3px 5px rgba(0,0,0,0.08)' }} animate={{ y: [0, 4, 0] }} transition={{ duration: 3.9, repeat: Infinity, ease: 'easeInOut' }} />
                    {/* Small translucent bubbles */}
                    <div className="absolute left-[7%] top-[44%] h-6 w-6 rounded-full border border-white/70" style={{ background: 'radial-gradient(circle at 35% 28%, rgba(255,255,255,0.75) 0%, rgba(200,240,255,0.25) 70%, transparent 100%)' }} />
                    <div className="absolute bottom-[24%] left-[13%] h-9 w-9 rounded-full border border-white/60" style={{ background: 'radial-gradient(circle at 35% 28%, rgba(255,255,255,0.65) 0%, rgba(200,240,255,0.2) 70%, transparent 100%)' }} />
                    <div className="absolute bottom-[32%] right-[12%] h-5 w-5 rounded-full border border-white/70" style={{ background: 'radial-gradient(circle at 35% 28%, rgba(255,255,255,0.75) 0%, rgba(200,240,255,0.25) 70%, transparent 100%)' }} />
                    <div className="absolute bottom-[14%] right-[30%] h-7 w-7 rounded-full border border-white/60" style={{ background: 'radial-gradient(circle at 35% 28%, rgba(255,255,255,0.65) 0%, rgba(200,240,255,0.2) 70%, transparent 100%)' }} />
                    <div className="relative grid h-full grid-rows-[auto_1fr_auto] gap-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b81f84]">
                        {identitySample.eyebrow}
                      </div>
                      <div className="flex flex-col justify-center gap-4">
                        {/* BUBBLE letters — glossy pink spheres */}
                        <div className="flex flex-wrap gap-[6px]">
                          {['B', 'U', 'B', 'B', 'L', 'E'].map((letter, i) => (
                            <motion.div
                              key={`b-${i}`}
                              className="flex items-center justify-center text-2xl font-black uppercase leading-none text-white sm:text-3xl"
                              style={{
                                width: 52, height: 52,
                                borderRadius: '999px',
                                background: 'radial-gradient(circle at 38% 28%, rgba(255,220,240,0.96) 0%, #ff88cc 28%, #ff44aa 58%, #dd1188 100%)',
                                boxShadow: 'inset 0 -5px 8px rgba(155,0,75,0.5), inset 0 5px 9px rgba(255,255,255,0.58), 0 6px 0 0 #990055, 0 9px 14px rgba(0,0,0,0.2)',
                                willChange: 'transform',
                              }}
                              animate={{ y: [-5, 5] }}
                              transition={{ duration: 3.2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: -i * 0.18 }}
                            >
                              {letter}
                            </motion.div>
                          ))}
                        </div>
                        {/* GUM letters — larger */}
                        <div className="flex flex-wrap gap-[6px] pl-3">
                          {['G', 'U', 'M'].map((letter, i) => (
                            <motion.div
                              key={`g-${i}`}
                              className="flex items-center justify-center text-3xl font-black uppercase leading-none text-white sm:text-4xl"
                              style={{
                                width: 66, height: 66,
                                borderRadius: '999px',
                                background: 'radial-gradient(circle at 38% 28%, rgba(255,220,240,0.96) 0%, #ff88cc 26%, #ff44aa 56%, #dd1188 100%)',
                                boxShadow: 'inset 0 -6px 10px rgba(155,0,75,0.5), inset 0 7px 12px rgba(255,255,255,0.58), 0 8px 0 0 #990055, 0 12px 18px rgba(0,0,0,0.2)',
                                willChange: 'transform',
                              }}
                              animate={{ y: [-5, 5] }}
                              transition={{ duration: 3.2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: -(1.08 + i * 0.2) }}
                            >
                              {letter}
                            </motion.div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <p className="min-w-[160px] flex-1 text-sm leading-6 text-[#885577]/90">{identitySample.summary}</p>
                          <div className="flex flex-col gap-2">
                            {identitySample.stats.map((item) => (
                              <div
                                key={item}
                                className="rounded-[999px] border border-[#ff88cc]/60 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#b81f84] backdrop-blur-sm"
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 pt-1">
                        <div
                          className="rounded-[999px] px-6 py-3 text-xs font-black uppercase tracking-[0.24em] text-white"
                          style={{
                            background: 'radial-gradient(circle at 40% 30%, rgba(255,200,230,0.92) 0%, #ff66bb 33%, #dd1188 100%)',
                            boxShadow: 'inset 0 -3px 6px rgba(140,0,70,0.45), inset 0 3px 7px rgba(255,255,255,0.45), 0 5px 0 0 #880044, 0 7px 10px rgba(0,0,0,0.18)',
                          }}
                        >
                          {identitySample.primary}
                        </div>
                        <div className="rounded-[999px] border-[3px] border-[#ff88cc]/60 bg-white/70 px-6 py-3 text-xs font-black uppercase tracking-[0.24em] text-[#cc3399] backdrop-blur-sm">
                          {identitySample.secondary}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid gap-4 lg:sticky lg:top-8">
              <div className="rounded-[28px] border border-amber-900/20 bg-white/85 p-5 shadow-[0_12px_34px_rgba(120,53,15,0.08)]">
                <div className="text-xs uppercase tracking-[0.22em] text-amber-950/95">{locale === 'fr' ? "Pourquoi c'est utile" : 'Why it matters'}</div>
                <p className="mt-4 text-lg leading-7 text-neutral-900/90">{copy.identityTabs.find((tab) => tab.id === identity)?.caption}</p>
              </div>

              <div className="rounded-[28px] border border-amber-900/20 bg-[#fffaf0]/72 p-5 shadow-[0_12px_34px_rgba(120,53,15,0.08)]">
                <div className="text-xs uppercase tracking-[0.22em] text-amber-950/95">{locale === 'fr' ? 'Ce qui change vraiment' : 'What really changes'}</div>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-[18px] border border-amber-900/20 bg-white/85 px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-800">{locale === 'fr' ? 'Structure' : 'Structure'}</div>
                    <div className="mt-2 text-sm leading-6 text-neutral-900/90">{locale === 'fr' ? 'Une même offre peut devenir méthodique, artisanale ou exubérante selon l’univers choisi.' : 'The same offer can feel methodical, handcrafted or exuberant depending on the chosen world.'}</div>
                  </div>
                  <div className="rounded-[18px] border border-amber-900/20 bg-white/85 px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-800">{locale === 'fr' ? 'Matière' : 'Materiality'}</div>
                    <div className="mt-2 text-sm leading-6 text-neutral-900/90">{locale === 'fr' ? 'Contours, volumes, textures et contrastes changent la sensation perçue avant même la lecture.' : 'Edges, volume, texture and contrast change the perceived feeling before anyone starts reading.'}</div>
                  </div>
                  <div className="rounded-[18px] border border-amber-900/20 bg-white/85 px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-800">{locale === 'fr' ? 'Impact' : 'Impact'}</div>
                    <div className="mt-2 text-sm leading-6 text-neutral-900/90">{locale === 'fr' ? 'On ne recolore pas une maquette : on change la promesse perçue dès les premières secondes.' : 'This is not a recolor of the same mockup; it changes the promise people perceive in the first seconds.'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        className="px-6 py-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
          <motion.div
            className="mx-auto max-w-6xl overflow-hidden rounded-[40px] border border-amber-900/20 bg-[#fff8ea]/76 p-6 shadow-[0_30px_80px_rgba(120,53,15,0.14)] backdrop-blur-sm md:p-8"
            initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          >
          <div>
            <div className="text-xs uppercase tracking-[0.26em] text-amber-950/95">{copy.sceneTitle}</div>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-neutral-950 md:text-4xl">{copy.sceneTitle}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-900/90 md:text-base">{copy.sceneIntro}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {copy.sceneTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setScene(tab.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      scene === tab.id ? 'bg-neutral-950 text-white shadow-[0_10px_24px_rgba(23,23,23,0.18)]' : 'bg-white/85 text-neutral-800 hover:bg-white/70'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-[20px] border border-amber-900/18 bg-white/82 px-4 py-4 shadow-[0_10px_24px_rgba(120,53,15,0.06)]">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-700">Moment</div>
                  <div className="mt-2 text-sm font-semibold leading-6 text-neutral-950">{sceneSample.moment}</div>
                </div>
                <div className="rounded-[20px] border border-amber-900/18 bg-white/82 px-4 py-4 shadow-[0_10px_24px_rgba(120,53,15,0.06)]">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-700">Objectif</div>
                  <div className="mt-2 text-sm font-semibold leading-6 text-neutral-950">{sceneSample.goal}</div>
                </div>
                <div className="rounded-[20px] border border-amber-900/18 bg-white/82 px-4 py-4 shadow-[0_10px_24px_rgba(120,53,15,0.06)]">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-700">Ce qui change</div>
                  <div className="mt-2 text-sm font-semibold leading-6 text-neutral-950">{sceneSample.shift}</div>
                </div>
              </div>

              <div className="mt-6 rounded-[28px] border border-amber-900/24 bg-[rgba(96,58,18,0.14)] p-4">
                <div className="relative min-h-[22rem] overflow-hidden rounded-[24px] border border-white/22 bg-[linear-gradient(180deg,#17110d,#0f0c0a)] lg:min-h-[24rem]">
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${sceneAccent} opacity-10`}
                    animate={{ opacity: [0.08, 0.18, 0.08] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <AnimatePresence mode="wait">
                    {scene === 'morning' ? (
                      <motion.div
                        key="morning"
                        initial={{ opacity: 0, y: 14, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 1.02 }}
                        transition={{ duration: 0.38 }}
                        className="absolute inset-0 overflow-hidden p-6"
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(254,240,138,0.28),transparent_38%),linear-gradient(180deg,rgba(125,211,252,0.18),transparent_55%)]" />
                        <div className="relative flex h-full flex-col justify-between">
                          <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-white/85">
                            <span>La Nappe</span>
                            <span>08:00 - 14:00</span>
                          </div>
                          <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
                            <div className="rounded-[28px] border border-white/20 bg-white/18 p-5 backdrop-blur-md">
                              <div className="text-sm uppercase tracking-[0.18em] text-amber-100/85">Brunch en terrasse</div>
                              <div className="mt-4 max-w-lg text-3xl font-black leading-none text-white md:text-4xl">Café filtre, pancakes et lumière douce</div>
                              <div className="mt-4 max-w-md text-sm leading-6 text-white/85">Une version claire, calme et ouverte pour rendre le matin plus accueillant et plus facile à réserver.</div>
                              <div className="mt-8 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-950">Voir le brunch</div>
                            </div>
                            <div className="space-y-4">
                              <motion.div className="rounded-[24px] border border-white/22 bg-[linear-gradient(135deg,rgba(253,230,138,0.78),rgba(186,230,253,0.52)),radial-gradient(circle_at_top_right,rgba(255,255,255,0.5),transparent_35%)] p-4" animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
                                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-950">Terrasse claire</div>
                                <div className="mt-8 h-24 rounded-[20px] bg-white/45" />
                              </motion.div>
                              <div className="rounded-[24px] border border-white/22 bg-black/30 p-4">
                                <div className="text-sm font-semibold text-white">Menu du matin</div>
                                <div className="mt-3 h-2 rounded-full bg-white/45" />
                                <div className="mt-2 h-2 w-4/5 rounded-full bg-white/30" />
                                <div className="mt-2 h-2 w-3/5 rounded-full bg-white/22" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : scene === 'midday' ? (
                      <motion.div
                        key="midday"
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 1.02 }}
                        transition={{ duration: 0.38 }}
                        className="absolute inset-0 overflow-hidden p-6"
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(163,230,53,0.2),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_52%)]" />
                        <div className="relative grid h-full gap-4 lg:grid-cols-[1.04fr_0.96fr]">
                          <div className="rounded-[26px] border border-white/22 bg-black/30 p-5">
                            <div className="text-sm uppercase tracking-[0.18em] text-lime-200/85">Service déjeuner</div>
                            <div className="mt-4 max-w-lg text-3xl font-black leading-none text-white md:text-4xl">Plat du jour, lecture rapide et réservation directe</div>
                            <div className="mt-4 max-w-md text-sm leading-6 text-white/85">Une composition plus dense et plus directe pour aider à choisir vite pendant la pause de midi.</div>
                            <div className="mt-8 inline-flex rounded-full bg-emerald-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-950">Réservation express</div>
                          </div>
                          <div className="grid gap-4">
                            <motion.div className="rounded-[24px] border border-white/22 bg-[linear-gradient(135deg,rgba(163,230,53,0.56),rgba(253,224,71,0.42)),radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_32%)] p-4" animate={{ y: [0, -3, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                              <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-950">Midi efficace</div>
                              <div className="mt-8 h-20 rounded-[20px] bg-white/42" />
                            </motion.div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="rounded-[22px] border border-white/22 bg-white/20 p-4">
                                <div className="text-sm font-semibold text-white">Plat du jour</div>
                                <div className="mt-3 h-2 w-4/5 rounded-full bg-white/42" />
                                <div className="mt-2 h-2 w-2/3 rounded-full bg-white/28" />
                              </div>
                              <div className="rounded-[22px] border border-white/22 bg-white/20 p-4">
                                <div className="text-sm font-semibold text-white">Pause déj</div>
                                <div className="mt-3 h-2 w-3/4 rounded-full bg-white/42" />
                                <div className="mt-2 h-2 w-1/2 rounded-full bg-white/28" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : scene === 'golden' ? (
                      <motion.div
                        key="golden"
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 1.02 }}
                        transition={{ duration: 0.38 }}
                        className="absolute inset-0 overflow-hidden p-6"
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.28),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.24),transparent_30%)]" />
                        <motion.div className="absolute right-10 top-8 h-24 w-24 rounded-full bg-amber-200/30 blur-2xl" animate={{ scale: [0.9, 1.12, 0.9] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
                        <div className="relative grid h-full gap-4 lg:grid-cols-[0.92fr_1.08fr]">
                          <div className="rounded-[24px] border border-white/22 bg-black/30 p-5">
                            <div className="text-sm uppercase tracking-[0.18em] text-orange-200/85">Apéro terrasse</div>
                            <div className="mt-4 max-w-lg text-3xl font-black leading-none text-white md:text-4xl">Cocktails, terrasse chaude et assiettes à partager</div>
                            <div className="mt-4 max-w-md text-sm leading-6 text-white/85">Une scène plus chaude et plus désirable, pensée pour donner envie de rester et de réserver la fin de journée.</div>
                            <div className="mt-8 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-950">Voir les disponibilités</div>
                          </div>
                          <div className="grid gap-4">
                            <motion.div className="rounded-[24px] border border-white/22 bg-[linear-gradient(135deg,rgba(251,191,36,0.72),rgba(251,146,60,0.48)),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.38),transparent_35%)] p-4" animate={{ y: [0, -4, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}>
                              <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-950">Terrasse chaude</div>
                              <div className="mt-8 h-24 rounded-[20px] bg-white/42" />
                            </motion.div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="rounded-[22px] border border-white/22 bg-white/20 p-4">
                                <div className="text-sm font-semibold text-white">Petites assiettes</div>
                                <div className="mt-3 h-2 w-4/5 rounded-full bg-white/42" />
                                <div className="mt-2 h-2 w-3/5 rounded-full bg-white/30" />
                              </div>
                              <div className="rounded-[22px] border border-white/22 bg-white/20 p-4">
                                <div className="text-sm font-semibold text-white">Cocktails maison</div>
                                <div className="mt-3 h-2 w-3/4 rounded-full bg-white/42" />
                                <div className="mt-2 h-2 w-1/2 rounded-full bg-white/30" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="evening"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.03 }}
                        transition={{ duration: 0.38 }}
                        className="absolute inset-0 overflow-hidden p-6"
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,119,6,0.16),transparent_30%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.14),transparent_35%)]" />
                        {[0, 1, 2].map((item) => (
                          <motion.div
                            key={item}
                            className="absolute rounded-full bg-amber-200/26 blur-xl"
                            style={{
                              left: item === 0 ? '14%' : item === 1 ? '48%' : '76%',
                              top: item === 1 ? '18%' : '24%',
                              width: item === 1 ? 54 : 38,
                              height: item === 1 ? 54 : 38,
                            }}
                            animate={{ opacity: [0.35, 0.72, 0.35], scale: [0.95, 1.08, 0.95] }}
                            transition={{ duration: 3 + item * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        ))}
                        <div className="relative grid h-full gap-4 lg:grid-rows-[auto_1fr_auto]">
                          <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-white/85">
                            <span>Dîner signature</span>
                            <span>20:00 - 23:30</span>
                          </div>
                          <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
                            <div className="rounded-[30px] border border-white/22 bg-[linear-gradient(180deg,rgba(14,14,20,0.92),rgba(28,22,38,0.84))] p-6 backdrop-blur-md">
                              <div className="text-sm uppercase tracking-[0.18em] text-amber-200/85">Menu dégustation</div>
                              <div className="mt-5 max-w-lg text-4xl font-black leading-none text-white">Une ambiance plus intime, plus rare et plus calme.</div>
                              <div className="mt-4 max-w-md text-sm leading-6 text-white/80">Le site se resserre, s&apos;assombrit et gagne en tenue pour évoquer un dîner plus haut de gamme.</div>
                              <div className="mt-8 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-950 inline-flex">Réserver le dîner</div>
                            </div>
                            <div className="rounded-[26px] border border-white/22 bg-black/32 p-5">
                              <div className="text-[11px] uppercase tracking-[0.16em] text-white/80">Réservation du soir</div>
                              <div className="mt-4 h-24 rounded-[20px] bg-white/14" />
                              <div className="mt-4 h-2 rounded-full bg-white/34" />
                              <div className="mt-2 h-2 w-4/5 rounded-full bg-white/24" />
                            </div>
                          </div>
                          <div className="grid gap-3 md:grid-cols-3">
                            {[
                              'Mise en bouche',
                              'Verre de rouge',
                              'Dessert signature',
                            ].map((item, index) => (
                              <motion.div
                                key={item}
                                className="rounded-[22px] border border-white/22 bg-white/[0.14] p-4"
                                animate={{ y: [0, index === 1 ? -4 : -2, 0] }}
                                transition={{ duration: 3.6 + index * 0.35, repeat: Infinity, ease: 'easeInOut' }}
                              >
                                <div className="h-16 rounded-[18px] bg-[linear-gradient(135deg,rgba(120,53,15,0.55),rgba(88,28,135,0.32))]" />
                                <div className="mt-3 text-sm font-semibold text-white">{item}</div>
                                <div className="mt-2 h-2 w-3/4 rounded-full bg-white/28" />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <p className="mt-4 text-sm text-neutral-900">{copy.sceneTabs.find((tab) => tab.id === scene)?.caption}</p>
              </div>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        className="px-6 pb-3 pt-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.28 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="mx-auto max-w-6xl rounded-[32px] border border-amber-900/20 bg-[#fff8ea]/76 p-6 shadow-[0_20px_60px_rgba(120,53,15,0.12)] backdrop-blur-sm"
          initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        >
            <h2 className="text-2xl font-semibold text-neutral-950">{copy.magneticTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-900/90">{copy.magneticIntro}</p>
            <div className="mt-8 grid gap-4 rounded-[28px] border border-amber-900/20 bg-white/70 p-4 md:grid-cols-3">
              <motion.div
                className="rounded-[22px] border border-amber-900/20 bg-[#fffaf0]/76 p-4"
                initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
              >
                <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-700">01 Suiveur</div>
                <div className="mt-3 flex min-h-[10rem] items-center justify-center rounded-[18px] border border-amber-900/20 bg-white/60">
                  <motion.button
                    onMouseLeave={() => {
                      magnetX.set(0)
                      magnetY.set(0)
                    }}
                    onMouseMove={(event) => {
                      const rect = event.currentTarget.getBoundingClientRect()
                      const dx = event.clientX - (rect.left + rect.width / 2)
                      const dy = event.clientY - (rect.top + rect.height / 2)
                      magnetX.set(dx * 0.18)
                      magnetY.set(dy * 0.18)
                    }}
                    style={{ x: magnetXS, y: magnetYS }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-full bg-gradient-to-r from-amber-300 via-orange-300 to-pink-300 px-6 py-3 text-sm font-semibold text-neutral-950 shadow-[0_18px_60px_rgba(251,191,36,0.28)]"
                  >
                    Attire le pointeur
                  </motion.button>
                </div>
                  <p className="mt-3 text-sm leading-6 text-neutral-900/85">Le bouton vient légèrement vers la souris pour créer une sensation d&apos;appel.</p>
              </motion.div>

              <motion.div
                className="rounded-[22px] border border-amber-900/20 bg-[#fffaf0]/76 p-4"
                initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
              >
                <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-700">02 Impulsion</div>
                <div className="mt-3 flex min-h-[10rem] items-center justify-center rounded-[18px] border border-amber-900/20 bg-white/60">
                  <motion.button
                    whileHover={{ y: -6, scale: 1.03, boxShadow: '0 24px 50px rgba(34,211,238,0.22)' }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    className="rounded-full border border-cyan-200/20 bg-cyan-300/90 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_14px_34px_rgba(34,211,238,0.18)]"
                  >
                    Déclenche une impulsion
                  </motion.button>
                </div>
                  <p className="mt-3 text-sm leading-6 text-neutral-900/85">Ici, le retour visuel est plus franc: le bouton se soulève et renforce son impact au survol.</p>
              </motion.div>

              <motion.div
                className="rounded-[22px] border border-amber-900/20 bg-[#fffaf0]/76 p-4"
                initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
              >
                <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-700">03 Glissement</div>
                <div className="mt-3 flex min-h-[10rem] items-center justify-center rounded-[18px] border border-amber-900/20 bg-white/60">
                  <motion.button
                    initial="rest"
                    whileHover="hover"
                    whileTap={{ scale: 0.985 }}
                    className="group relative overflow-hidden rounded-full border border-white/24 bg-white px-6 py-3 text-sm font-semibold text-neutral-950 shadow-[0_14px_34px_rgba(255,255,255,0.08)]"
                  >
                    <motion.span
                      variants={{ rest: { x: 0 }, hover: { x: -8 } }}
                      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                      className="relative z-10 inline-flex items-center gap-3"
                    >
                      Voir la direction
                      <motion.span
                        variants={{ rest: { x: 0, opacity: 0.65 }, hover: { x: 6, opacity: 1 } }}
                        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                      >
                        →
                      </motion.span>
                    </motion.span>
                    <motion.span
                      aria-hidden
                      variants={{ rest: { x: '-120%' }, hover: { x: '120%' } }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-transparent via-amber-200/70 to-transparent"
                    />
                  </motion.button>
                </div>
                  <p className="mt-3 text-sm leading-6 text-neutral-900/85">Le contenu interne bouge, ce qui donne un signal plus éditorial et plus directionnel.</p>
              </motion.div>
            </div>
            <p className="mt-5 text-center text-sm leading-6 text-neutral-900/85">Trois comportements suffisent déjà à montrer qu&apos;un CTA peut attirer, répondre ou guider selon le ton voulu.</p>
        </motion.div>
      </motion.section>

      <motion.section
        className="px-6 pb-20 pt-8 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <div className="text-xs uppercase tracking-[0.34em] text-amber-950/95">{copy.finalEyebrow}</div>
            <h2
              className="mt-6 text-4xl font-black leading-[0.94] text-neutral-950 md:text-6xl"
              style={{ fontFamily: '"Bodoni 72", "Didot", "Times New Roman", serif' }}
            >
              {copy.finalTitle}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-900/90">{copy.finalText}</p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-800/40 to-transparent" />
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href={`/${locale}#contact`}
                className="rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_36px_rgba(120,53,15,0.14)] transition-transform duration-200 hover:-translate-y-1"
              >
                {copy.finalCta}
              </Link>
              <Link
                href={`/${locale}`}
                className="rounded-full border border-amber-700/20 bg-white/70 px-6 py-3 text-sm font-semibold text-amber-900 transition-transform duration-200 hover:-translate-y-1"
              >
                {copy.finalCtaSecondary}
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <div className="fixed inset-x-4 bottom-4 z-40 lg:hidden">
        <Link
          href={`/${locale}#contact`}
          className="block rounded-full bg-neutral-950 px-6 py-3 text-center text-sm font-semibold text-white shadow-[0_16px_40px_rgba(120,53,15,0.28)]"
        >
          {copy.stickyCta}
        </Link>
      </div>
    </div>
  )
}
