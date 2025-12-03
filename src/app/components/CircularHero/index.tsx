"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { m } from "framer-motion";
import Chevron from "../Chevron";
import { OuterCircle } from "./OuterCircle";
import { InnerCircle } from "./InnerCircle";
import { QuadrantOverlay } from "./QuadrantOverlay";
import type { CircularHeroProps, Quadrant, NavItem } from "./types";
import {
  ANIMATION_DURATIONS,
  TIMEOUTS,
  SCROLL_THRESHOLDS,
  BREAKPOINTS,
  SCALE_VALUES,
  GRADIENTS,
  SECTION_ROTATIONS,
} from "./constants";
import {
  smoothScrollTo,
  getRotatedCoords,
  quadrantFromRotated,
  isInsideCircle,
} from "./utils";

export function CircularHero({ messages }: CircularHeroProps) {
  // Animation state
  const [animateIn, setAnimateIn] = useState<'start' | 'return' | 'none'>('start');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [separatorsVisible] = useState(true);
  const [gradientIndex, setGradientIndex] = useState(0);

  // Interaction state
  const [activeQuadrant, setActiveQuadrant] = useState<Quadrant | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showChevron, setShowChevron] = useState(true);
  const [chevronHovered, setChevronHovered] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);

  // Viewport state
  const [viewportWidth, setViewportWidth] = useState<number | null>(null);
  const [mobileScale, setMobileScale] = useState<number>(SCALE_VALUES.MOBILE);

  // Refs for intervals and timeouts
  const closeTimeoutRef = useRef<number | null>(null);
  // (kept) close timeout for overlay closing

  // Refs for DOM elements
  const outerCircleRef = useRef<HTMLDivElement | null>(null);
  const innerCircleRef = useRef<HTMLDivElement | null>(null);

  // Navigation items
  const navItems = useMemo<NavItem[]>(
    () => [
      {
        id: "explorer" as Quadrant,
        label: messages.hero.explorer.label,
        href: "#explorer",
        labelStyle: { top: "calc(50% - 7.5rem)", left: "calc(50% + 7.5rem)" },
        ctaLabel: messages.hero.explorer.ctaLabel,
        ctaDescription: messages.hero.explorer.ctaDescription,
        ctaAlignment: "items-end justify-start",
      },
      {
        id: "about" as Quadrant,
        label: messages.hero.about.label,
        href: "#about",
        labelStyle: { top: "calc(50% + 7.5rem)", left: "calc(50% + 7.5rem)" },
        ctaLabel: messages.hero.about.ctaLabel,
        ctaDescription: messages.hero.about.ctaDescription,
        ctaAlignment: "items-start justify-start",
      },
      {
        id: "contact" as Quadrant,
        label: messages.hero.contact.label,
        href: "#contact",
        labelStyle: { top: "calc(50% + 7.5rem)", left: "calc(50% - 7.5rem)" },
        ctaLabel: messages.hero.contact.ctaLabel,
        ctaDescription: messages.hero.contact.ctaDescription,
        ctaAlignment: "items-start justify-end",
      },
      {
        id: "creations" as Quadrant,
        label: messages.hero.creations.label,
        href: "#creations",
        labelStyle: { top: "calc(50% - 7.5rem)", left: "calc(50% - 7.5rem)" },
        ctaLabel: messages.hero.creations.ctaLabel,
        ctaDescription: messages.hero.creations.ctaDescription,
        ctaAlignment: "items-end justify-end",
      },
    ],
    [messages.hero]
  );

  // No-op pause/resume (auto-rotation removed)
  const pauseAutoRotation = useCallback(() => {}, []);
  const resumeAutoRotation = useCallback(() => {}, []);

  // Check for reduced motion preference
  useEffect(() => {
    const mq =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    const update = () => setReduceMotion(!!mq?.matches);
    update();
    mq?.addEventListener('change', update);
    return () => mq?.removeEventListener('change', update);
  }, []);

  // Initial entry animation
  useEffect(() => {
    setAnimateIn('start');
    const timeout1 = setTimeout(
      () => setAnimateIn('return'),
      reduceMotion ? 0 : TIMEOUTS.ANIMATE_IN_START
    );
    const timeout2 = setTimeout(
      () => setAnimateIn('none'),
      reduceMotion ? 0 : TIMEOUTS.ANIMATE_IN_COMPLETE
    );

    // Separators are visible by default; auto-rotation removed

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      // Nothing to clean up (auto-rotation removed)
    };
  }, [reduceMotion]);

  // Gradient rotation animation
  useEffect(() => {
    const gradientInterval = window.setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % GRADIENTS.length);
    }, reduceMotion ? TIMEOUTS.GRADIENT_CHANGE_REDUCED : TIMEOUTS.GRADIENT_CHANGE);

    return () => window.clearInterval(gradientInterval);
  }, [reduceMotion]);

  // Handle compact mode on scroll
  useEffect(() => {
    const handleCompactScroll = () => {
      const newCompact = window.scrollY > SCROLL_THRESHOLDS.COMPACT;
      setIsCompact(newCompact);
      setShowChevron(window.scrollY < SCROLL_THRESHOLDS.HIDE_CHEVRON);
      if (newCompact || window.scrollY < SCROLL_THRESHOLDS.HIDE_CHEVRON) {
        setActiveQuadrant(null);
      }
    };

    handleCompactScroll();
    window.addEventListener("scroll", handleCompactScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleCompactScroll);
  }, []);

  // Handle viewport resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      setMobileScale(width < BREAKPOINTS.MOBILE ? SCALE_VALUES.MOBILE : SCALE_VALUES.DESKTOP);
      setShowOverlays(width >= BREAKPOINTS.DESKTOP);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle rotation based on scroll position
  useEffect(() => {
    const sections = [
      { id: 'about', rotation: SECTION_ROTATIONS.about },
      { id: 'explorer', rotation: SECTION_ROTATIONS.explorer },
      { id: 'creations', rotation: SECTION_ROTATIONS.creations },
      { id: 'contact', rotation: SECTION_ROTATIONS.contact },
    ];

    const hasIO = typeof window !== 'undefined' && 'IntersectionObserver' in window;
    if (hasIO) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const sec = sections.find((s) => s.id === entry.target.id);
              if (sec) {
                setRotation(sec.rotation);
              }
            }
          });
        },
        // Slightly lower threshold helps on mobile where URL bar resizing affects viewport height
        { threshold: 0.35 }
      );

      sections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) observer.observe(el);
      });

      return () => observer.disconnect();
    }

    // Fallback for environments without IntersectionObserver
    const handleSectionScroll = () => {
      let newRotation = 0;
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
            newRotation = sec.rotation;
            break;
          }
        }
      }
      setRotation(newRotation);
    };

    window.addEventListener("scroll", handleSectionScroll, { passive: true });
    handleSectionScroll();
    return () => window.removeEventListener("scroll", handleSectionScroll);
  }, []);

  // Handle label mouse enter
  const handleLabelMouseEnter = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, id: Quadrant) => {
      if (!outerCircleRef.current || !innerCircleRef.current) return;

      const outerRect = outerCircleRef.current.getBoundingClientRect();
      const innerRect = innerCircleRef.current.getBoundingClientRect();
      const centerX = outerRect.left + outerRect.width / 2;
      const centerY = outerRect.top + outerRect.height / 2;
      const innerRadius = innerRect.width / 2;

      if (isInsideCircle(event.clientX, event.clientY, centerX, centerY, innerRadius)) {
        return;
      }

      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const { dx_rot, dy_rot } = getRotatedCoords(dx, dy, rotation);
      const quadrant = quadrantFromRotated(dx_rot, dy_rot);

      if (quadrant !== id) return;

      setActiveQuadrant(id);
      pauseAutoRotation();
    },
    [rotation, pauseAutoRotation]
  );

  // Handle hero mouse move
  const handleHeroMouseMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (!outerCircleRef.current || !innerCircleRef.current) return;
      if (animateIn !== 'none') return;

      const outerRect = outerCircleRef.current.getBoundingClientRect();
      const innerRect = innerCircleRef.current.getBoundingClientRect();
      const centerX = outerRect.left + outerRect.width / 2;
      const centerY = outerRect.top + outerRect.height / 2;
      const innerRadius = innerRect.width / 2;

      if (isInsideCircle(event.clientX, event.clientY, centerX, centerY, innerRadius)) {
        if (activeQuadrant !== null) setActiveQuadrant(null);
        return;
      }

      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const { dx_rot, dy_rot } = getRotatedCoords(dx, dy, rotation);
      const quadrant = quadrantFromRotated(dx_rot, dy_rot);

      if (quadrant !== activeQuadrant) {
        setActiveQuadrant(quadrant);
        pauseAutoRotation();
      }
    },
    [animateIn, activeQuadrant, rotation, pauseAutoRotation]
  );

  // Handle click on outer circle
  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const outerRect = outerCircleRef.current?.getBoundingClientRect();
      const innerRect = innerCircleRef.current?.getBoundingClientRect();
      if (!outerRect || !innerRect) return;

      const centerX = outerRect.left + outerRect.width / 2;
      const centerY = outerRect.top + outerRect.height / 2;
      const innerRadius = innerRect.width / 2;

      if (isInsideCircle(event.clientX, event.clientY, centerX, centerY, innerRadius)) {
        return;
      }

      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const { dx_rot, dy_rot } = getRotatedCoords(dx, dy, rotation);
      const quadrant = quadrantFromRotated(dx_rot, dy_rot);

      const item = navItems.find((i) => i.id === quadrant);
      if (item) {
        const el = document.getElementById(item.href.slice(1));
        if (el) {
          // Pause auto-rotation and set rotation immediately to target for responsive feel
          pauseAutoRotation();
          const targetId = item.href.slice(1);
          const targetRotation = SECTION_ROTATIONS[targetId] ?? 0;
          setRotation(targetRotation);
          smoothScrollTo(el);
          setActiveQuadrant(null);
          // Schedule auto-rotation resume
          resumeAutoRotation();
        }
      }
    },
    [rotation, navItems, pauseAutoRotation, resumeAutoRotation]
  );

  // Handle scroll down from chevron
  const handleScrollDown = useCallback(() => {
    const el = document.getElementById('about');
    if (el) {
      pauseAutoRotation();
      setRotation(SECTION_ROTATIONS.about);
      smoothScrollTo(el);
      setActiveQuadrant(null);
      resumeAutoRotation();
    }
  }, [pauseAutoRotation, resumeAutoRotation]);

  // Handle inner circle click (scroll to top or about)
  const handleInnerCircleClick = useCallback(() => {
    if (isCompact) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById('about');
      if (el) {
        pauseAutoRotation();
        setRotation(SECTION_ROTATIONS.about);
        smoothScrollTo(el);
        resumeAutoRotation();
      }
    }
    setActiveQuadrant(null);
  }, [isCompact, pauseAutoRotation, resumeAutoRotation]);

  // Handle link click
  const handleLinkClick = useCallback(
    (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const el = document.getElementById(href.slice(1));
      if (el) {
        pauseAutoRotation();
        const targetId = href.slice(1);
        const targetRotation = SECTION_ROTATIONS[targetId] ?? 0;
        setRotation(targetRotation);
        smoothScrollTo(el);
        setActiveQuadrant(null);
        e.currentTarget.blur?.();
        resumeAutoRotation();
      }
    },
    [pauseAutoRotation, resumeAutoRotation]
  );

  // Handle overlay mouse enter
  const handleOverlayMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    pauseAutoRotation();
  }, [pauseAutoRotation]);

  // Handle overlay mouse leave
  const handleOverlayMouseLeave = useCallback(() => {
    closeTimeoutRef.current = window.setTimeout(
      () => setActiveQuadrant(null),
      TIMEOUTS.OVERLAY_CLOSE
    );
    resumeAutoRotation();
  }, [resumeAutoRotation]);

  // Handle label focus
  const handleLabelFocus = useCallback(
    (id: Quadrant) => {
      setActiveQuadrant(id);
      pauseAutoRotation();
    },
    [pauseAutoRotation]
  );

  // Handle label blur
  const handleLabelBlur = useCallback(() => {
    setActiveQuadrant(null);
    resumeAutoRotation();
  }, [resumeAutoRotation]);

  const compactTranslation =
    viewportWidth !== null && viewportWidth < BREAKPOINTS.MOBILE ? '-10rem' : '-5rem';

  const currentQuadrant = activeQuadrant;
  const activeItem = navItems.find((item) => item.id === currentQuadrant) || null;

  return (
    <>
      {!isCompact && mobileScale === 1 && showOverlays && animateIn === 'none' && (
        <>
          {/* Invisible hover zones for each quadrant */}
          <div className="fixed inset-0 z-30 pointer-events-auto">
            <div
              className="absolute top-0 right-0 h-1/2 w-1/2"
              onMouseEnter={() => {
                setActiveQuadrant('explorer');
                pauseAutoRotation();
              }}
              onMouseLeave={() => {
                setActiveQuadrant(null);
                resumeAutoRotation();
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-1/2"
              style={{ height: 'calc(50% - 120px)' }}
              onMouseEnter={() => {
                setActiveQuadrant('about');
                pauseAutoRotation();
              }}
              onMouseLeave={() => {
                setActiveQuadrant(null);
                resumeAutoRotation();
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-1/2"
              style={{ height: 'calc(50% - 120px)' }}
              onMouseEnter={() => {
                setActiveQuadrant('contact');
                pauseAutoRotation();
              }}
              onMouseLeave={() => {
                setActiveQuadrant(null);
                resumeAutoRotation();
              }}
            />
            <div
              className="absolute top-0 left-0 h-1/2 w-1/2"
              onMouseEnter={() => {
                setActiveQuadrant('creations');
                pauseAutoRotation();
              }}
              onMouseLeave={() => {
                setActiveQuadrant(null);
                resumeAutoRotation();
              }}
            />
          </div>

          <QuadrantOverlay
            currentQuadrant={currentQuadrant}
            activeItem={activeItem}
            onMouseEnter={handleOverlayMouseEnter}
            onMouseLeave={handleOverlayMouseLeave}
            onLinkClick={handleLinkClick}
          />
        </>
      )}

      <m.div
        className="fixed z-40"
        initial={{ left: '50%', top: '50%', x: '-50%', y: '-50%' }}
        animate={
          isCompact
            ? { left: '0%', top: '0%', x: compactTranslation, y: compactTranslation }
            : { left: '50%', top: '50%', x: '-50%', y: '-50%' }
        }
        transition={{
          type: 'tween',
          ease: [0.68, -0.55, 0.27, 1.55],
          duration: ANIMATION_DURATIONS.COMPACT_TRANSITION,
        }}
      >
        <OuterCircle
          ref={outerCircleRef}
          isCompact={isCompact}
          mobileScale={mobileScale}
          rotation={rotation}
          activeQuadrant={activeQuadrant}
          animateIn={animateIn}
          reduceMotion={reduceMotion}
          gradientIndex={gradientIndex}
          separatorsVisible={separatorsVisible}
          navItems={navItems}
          onMouseMove={handleHeroMouseMove}
          onClick={handleClick}
          onLabelMouseEnter={handleLabelMouseEnter}
          onLabelMouseLeave={() => {
            setActiveQuadrant(null);
            resumeAutoRotation();
          }}
          onLabelFocus={handleLabelFocus}
          onLabelBlur={handleLabelBlur}
          onLinkClick={handleLinkClick}
        />

        <InnerCircle
          ref={innerCircleRef}
          isCompact={isCompact}
          mobileScale={mobileScale}
          messages={messages}
          onClick={handleInnerCircleClick}
        />
      </m.div>

      {showChevron && (
        <Chevron
          hovered={chevronHovered}
          onMouseEnter={() => setChevronHovered(true)}
          onMouseLeave={() => setChevronHovered(false)}
          onClick={handleScrollDown}
          aria-label={messages.aria.scrollDownAbout}
        />
      )}

      <section className="relative h-screen overflow-hidden cursor-pointer pointer-events-none" />
    </>
  );
}
