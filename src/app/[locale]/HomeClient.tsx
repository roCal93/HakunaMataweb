"use client";

import React, { useRef, useState, useEffect } from "react";
import type { ComponentType } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { LazyMotion, m, useInView } from "framer-motion";
import { loadMotionFeatures, prefersReducedMotion } from "@/lib/motion";
import LanguageSwitcher from "../components/LanguageSwitcher";
import type { Messages } from "@/lib/types";

// Dynamic imports pour les composants lourds
const CircularHero = dynamic(() => import("../components/CircularHero").then(mod => ({ default: mod.CircularHero })), {
  loading: () => <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div></div>,
  ssr: true,
});

const SplitContactButton = dynamic(() => import("../components/SplitContactButton"), {
  loading: () => <div className="animate-pulse bg-amber-500 rounded-full px-10 py-4 w-48 h-14"></div>,
  ssr: false,
});

const PawTrail = dynamic(() => import("../components/PawTrail"), {
  ssr: false,
});

interface HomeClientProps {
  messages: Messages;
  locale: string;
}

export default function HomeClient({ messages, locale }: HomeClientProps) {
  const aboutRef = useRef(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10% 0px -10% 0px" });
  const aboutInView = useInView(aboutRef, { once: true, margin: "-10% 0px -10% 0px" });
  const creationsRef = useRef(null);
  const creationsInView = useInView(creationsRef, { once: false, margin: "-10% 0px -10% 0px" });
  const contactRef = useRef(null);
  const contactInView = useInView(contactRef, { once: false, margin: "-10% 0px -10% 0px" });

  const [isMobile, setIsMobile] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [enableTrail, setEnableTrail] = useState(false);
  const [shouldRenderContactButton, setShouldRenderContactButton] = useState(false);
  const [AboutCardsComponent, setAboutCardsComponent] = useState<ComponentType<{ messages: Messages }> | null>(null);
  const [cityModal, setCityModal] = useState<{ open: boolean; city: 'annecy' | 'aravis' | 'geneva' | 'remote' | null }>({ open: false, city: null });
  const currentYear = new Date().getFullYear();
  const footerText = messages.aria.footerText.replace("{year}", String(currentYear));

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    setShouldReduceMotion(prefersReducedMotion());
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const timeout = window.setTimeout(() => setEnableTrail(true), 800);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (contactInView) {
      setShouldRenderContactButton(true);
    }
  }, [contactInView]);

  useEffect(() => {
    if (aboutInView && !AboutCardsComponent) {
      import("../components/AboutCards").then((mod) => {
        setAboutCardsComponent(() => mod.default);
      });
    }
  }, [aboutInView, AboutCardsComponent]);

  return (
    <LazyMotion features={loadMotionFeatures}>
      <div className="min-h-screen overflow-x-hidden dark:bg-gray-900">
      <div className="bg-gradient-to-b from-amber-100 to-amber-200 dark:from-gray-900 dark:to-gray-900">
        <LanguageSwitcher messages={messages} />
        {messages.home.heroTagline ? (
          <div className="relative z-50 mx-auto px-6 pb-2 pt-4 text-center sm:pt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-amber-700/85 sm:text-base">
              {messages.home.heroTagline}
            </p>
          </div>
        ) : null}
        <CircularHero messages={messages} />
      </div>
      {!isMobile && enableTrail && (
        <PawTrail
          src="/images/empreinte-patte.webp"
          size={20}
          step={50}
          bodyWidth={20}
          frequency={600}
          debug={false}
        />
      )}
      <div>
        <section
          ref={aboutRef}
          id="about"
          className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-200 to-amber-300 dark:from-gray-900 dark:to-gray-900"
        >
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-900 dark:text-gray-100 md:text-6xl">
              {messages.home.title}
              <div className="text-amber-600">{messages.home.subtitle}</div>
            </h2>
            <p className="mx-auto my-8 max-w-3xl text-xl text-gray-600 dark:text-gray-300">
              {messages.about.paragraph}
            </p>
            {AboutCardsComponent ? (
              <AboutCardsComponent messages={messages} />
            ) : (
              <AboutCardsFallback messages={messages} />
            )}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-20 w-full max-w-md mx-auto">
              <div className="relative w-full sm:w-80">
                <Link href="#explorer" className="block w-full">
                  <button className="w-full sm:w-80 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 px-8 py-3 text-lg font-semibold text-white transition-all duration-500 hover:from-amber-500 hover:to-amber-700 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2">
                    {messages.buttons.explore_demo}
                  </button>
                </Link>
              </div>
              <div className="w-full sm:w-80">
                <button
                  onClick={() => {
                    const el = document.getElementById("creations");
                    if (el) {
                      const targetPosition = Math.max(0, el.offsetTop - 100);
                      try {
                        window.scrollTo({ top: targetPosition, behavior: "smooth" });
                      } catch {
                        window.scrollTo(0, targetPosition);
                      }
                    }
                  }}
                  className="w-full sm:w-80 rounded-full border-2 border-amber-400 px-8 py-3 text-lg font-semibold text-amber-600 transition-all duration-500 hover:bg-amber-400 hover:text-white hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                >
                  {messages.buttons.see_creations}
                </button>
              </div>
            </div>
          </div>
        </section>
        <section id="explorer" className="bg-gradient-to-b from-amber-300 to-amber-400 dark:from-gray-900 dark:to-gray-900 pb-20 pt-28 relative">
          <m.div
            className="absolute inset-0 flex justify-center items-start pt-20 pointer-events-none"
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={shouldReduceMotion ? {} : (isInView ? { opacity: 1 } : { opacity: 0 })}
            transition={shouldReduceMotion ? {} : { duration: 0.8, delay: 1.5 }}
          >
            <Image
              src="/images/jumelles.webp"
              alt="Jumelles"
              width={200}
              height={200}
              className="w-72 h-72 opacity-5"
            />
          </m.div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <m.div
              ref={ref}
              className="mb-16"
              animate={shouldReduceMotion ? {} : (isInView ? { opacity: 1 } : { opacity: 0 })}
              transition={shouldReduceMotion ? {} : { duration: 0.8 }}
            >
              <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
                <m.div
                  initial={shouldReduceMotion ? {} : { opacity: 0, x: -80 }}
                  animate={shouldReduceMotion ? {} : (isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -80 })}
                  transition={shouldReduceMotion ? {} : { duration: 0.8, delay: 0.35 }}
                  className="mx-auto w-full max-w-md"
                >
                  <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-2 shadow-[0_22px_60px_rgba(120,53,15,0.2)] backdrop-blur-sm">
                    <Image
                      src="/images/portraitDesktop.webp"
                      alt={locale === 'fr' ? 'Portrait de Romain Calmelet' : 'Portrait of Romain Calmelet'}
                      width={900}
                      height={900}
                      className="h-[340px] w-full rounded-[1.5rem] object-cover object-center"
                      priority={false}
                    />
                  </div>
                </m.div>

                <m.div
                  initial={shouldReduceMotion ? {} : { opacity: 0, x: 80 }}
                  animate={shouldReduceMotion ? {} : (isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 })}
                  transition={shouldReduceMotion ? {} : { duration: 0.8, delay: 0.55 }}
                  className="text-left"
                >
                  <h2 className="mb-5 text-3xl font-bold text-gray-900 dark:text-gray-100 md:text-4xl">
                    {messages.explore.heading}
                  </h2>
                  <div className="max-w-2xl text-xl leading-9 text-gray-700 dark:text-gray-300">
                    {messages.explore.paragraph.split('\n\n').map((paragraph, index) => (
                      <p key={index} className={index > 0 ? 'mt-6' : undefined}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </m.div>
              </div>
            </m.div>
          </div>
        </section>
        <section id="creations" className="bg-gradient-to-b from-amber-400 to-amber-500 dark:from-gray-900 dark:to-gray-900 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <m.div
              ref={creationsRef}
              animate={shouldReduceMotion ? {} : (creationsInView ? { opacity: 1 } : { opacity: 0 })}
              transition={shouldReduceMotion ? {} : { duration: 0.8 }}
            >
              <div className="mb-16 text-center">
                <div className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-amber-800/80 dark:text-amber-200/80">
                  {locale === 'fr' ? 'Portfolio' : 'portfolio'}
                </div>
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100 md:text-4xl">{messages.creations.heading}</h2>
                <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-300 md:text-xl">
                  {messages.creations.paragraph}
                </p>
              </div>

              <m.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 50 }}
                animate={shouldReduceMotion ? {} : (creationsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 })}
                transition={shouldReduceMotion ? {} : { duration: 1.2, delay: 0.5 }}
                className="grid gap-8 md:grid-cols-3"
              >
                <a
                  href="https://www.amandatraduction.com/fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-[28px] border border-white/55 bg-[linear-gradient(180deg,rgba(255,252,245,0.95),rgba(255,244,214,0.94))] shadow-[0_24px_60px_rgba(120,53,15,0.16)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_80px_rgba(120,53,15,0.22)] dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="relative aspect-[3/2] overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(255,247,237,0.72)_55%,rgba(251,191,36,0.18)_100%)]">
                    <div className="absolute left-5 top-5 z-10 rounded-full border border-amber-300/50 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-900/75 backdrop-blur-sm">
                      {locale === 'fr' ? 'Site vitrine' : 'Showcase site'}
                    </div>
                    <Image
                      src="/images/AmandaTraduction.png"
                      alt={messages.cards.vitrine.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-4 p-6">
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-amber-800/70 dark:text-amber-200/70">
                        Amanda Traduction
                      </p>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {messages.cards.vitrine.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">{messages.cards.vitrine.description}</p>
                    {messages.cards.vitrine.priceFrom ? (
                      <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                        {messages.cards.vitrine.priceFrom}
                      </p>
                    ) : null}
                    <div className="flex items-center justify-between border-t border-amber-900/10 pt-4 text-sm font-semibold text-amber-900 dark:border-white/10 dark:text-amber-100">
                      <span>{locale === 'fr' ? 'Visiter le site' : 'Visit website'}</span>
                      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
                    </div>
                  </div>
                </a>

                <a
                  href="https://www.vivo-restaurant.site/fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-[28px] border border-white/55 bg-[linear-gradient(180deg,rgba(255,252,245,0.95),rgba(255,244,214,0.94))] shadow-[0_24px_60px_rgba(120,53,15,0.16)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_80px_rgba(120,53,15,0.22)] dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="relative aspect-[3/2] overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.84),rgba(255,248,220,0.42)_48%,rgba(22,101,52,0.14)_100%)]">
                    <div className="absolute left-5 top-5 z-10 rounded-full border border-emerald-700/20 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-900/75 backdrop-blur-sm">
                      {locale === 'fr' ? 'Réservation' : 'Booking'}
                    </div>
                    <Image
                      src="/images/Vivo.png"
                      alt={messages.cards.chalet.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="space-y-4 p-6">
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-amber-800/70 dark:text-amber-200/70">
                        Vivo Restaurant
                      </p>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {messages.cards.chalet.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">{messages.cards.chalet.description}</p>
                    {messages.cards.chalet.priceFrom ? (
                      <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                        {messages.cards.chalet.priceFrom}
                      </p>
                    ) : null}
                    <div className="flex items-center justify-between border-t border-amber-900/10 pt-4 text-sm font-semibold text-amber-900 dark:border-white/10 dark:text-amber-100">
                      <span>{locale === 'fr' ? 'Visiter le site' : 'Visit website'}</span>
                      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
                    </div>
                  </div>
                </a>

                <a
                  href="https://www.lamontredemongrandpere.com/fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-[28px] border border-white/55 bg-[linear-gradient(180deg,rgba(255,252,245,0.95),rgba(255,244,214,0.94))] shadow-[0_24px_60px_rgba(120,53,15,0.16)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_80px_rgba(120,53,15,0.22)] dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="relative aspect-[3/2] overflow-hidden bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.94),rgba(248,250,252,0.78)_55%,rgba(120,113,108,0.16)_100%)]">
                    <div className="absolute left-5 top-5 z-10 rounded-full border border-stone-400/30 bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-800/80 backdrop-blur-sm">
                      {locale === 'fr' ? 'E-commerce' : 'E-commerce'}
                    </div>
                    <Image
                      src="/images/LaMontreDeMonGrandPere.png"
                      alt={messages.cards.artisan.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="space-y-4 p-6">
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-amber-800/70 dark:text-amber-200/70">
                        La Montre de mon Grand-Père
                      </p>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {messages.cards.artisan.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">{messages.cards.artisan.description}</p>
                    {messages.cards.artisan.priceFrom ? (
                      <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                        {messages.cards.artisan.priceFrom}
                      </p>
                    ) : null}
                    <div className="flex items-center justify-between border-t border-amber-900/10 pt-4 text-sm font-semibold text-amber-900 dark:border-white/10 dark:text-amber-100">
                      <span>{locale === 'fr' ? 'Visiter le site' : 'Visit website'}</span>
                      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
                    </div>
                  </div>
                </a>
              </m.div>

              {messages.creations.pricingNote ? (
                <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-7 text-amber-950/80 dark:text-amber-100/75">
                  {messages.creations.pricingNote}
                </p>
              ) : null}
            </m.div>
          </div>
        </section>
        <section id="contact" className="bg-gradient-to-b from-amber-500 to-amber-600 dark:from-gray-900 dark:to-gray-900 py-20">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <m.div
              ref={contactRef}
              animate={shouldReduceMotion ? {} : (contactInView ? { opacity: 1 } : { opacity: 0 })}
              transition={shouldReduceMotion ? {} : { duration: contactInView ? 0.8 : 0.4 }}
            >
              <m.h2
                initial={shouldReduceMotion ? {} : { opacity: 0 }}
                animate={shouldReduceMotion ? {} : (contactInView ? { opacity: 1 } : { opacity: 0 })}
                transition={shouldReduceMotion ? {} : { duration: contactInView ? 0.8 : 0.4, delay: contactInView ? 0 : 0 }}
                className="mb-6 text-3xl font-bold text-white md:text-4xl"
              >
                {messages.contact.heading}
              </m.h2>
              <m.p
                initial={shouldReduceMotion ? {} : { opacity: 0 }}
                animate={shouldReduceMotion ? {} : (contactInView ? { opacity: 1 } : { opacity: 0 })}
                className="mx-auto mb-8 max-w-2xl text-xl text-blue-100"
                transition={shouldReduceMotion ? {} : { duration: contactInView ? 0.8 : 0.4, delay: contactInView ? 0.2 : 0 }}
              >
                {messages.contact.paragraph}
              </m.p>
              <m.div
                initial={shouldReduceMotion ? {} : { opacity: 0 }}
                animate={shouldReduceMotion ? {} : (contactInView ? { opacity: 1 } : { opacity: 0 })}
                transition={shouldReduceMotion ? {} : { duration: contactInView ? 0.8 : 0.4, delay: contactInView ? 0.4 : 0 }}
              >
                {shouldRenderContactButton ? (
                  <SplitContactButton messages={messages} />
                ) : (
                  <ContactButtonPlaceholder label={messages.buttons.contact} />
                )}
              </m.div>
            </m.div>
          </div>
        </section>

        <footer className="bg-gradient-to-b from-amber-600 to-amber-700 dark:from-gray-900 dark:to-gray-900 text-white relative overflow-hidden">
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center md:text-left">
                <h3 className="mb-4 text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Hakuna Mataweb
                </h3>
                <p className="text-amber-100 mb-4">{messages.footer.brand}</p>
                <p className="text-sm text-amber-200">{messages.footer.description}</p>
              </div>
              <div className="text-center">
                <h4 className="mb-4 text-lg font-semibold text-amber-100">{messages.nav.quickLinks}</h4>
                <div className="space-y-2">
                  <a href="#about" className="block text-amber-200 hover:text-white transition-colors duration-300">
                    {messages.nav.about}
                  </a>
                  <a href="#explorer" className="block text-amber-200 hover:text-white transition-colors duration-300">
                    {messages.nav.explore}
                  </a>
                  <a href="#creations" className="block text-amber-200 hover:text-white transition-colors duration-300">
                    {messages.nav.creations}
                  </a>
                  <a href="#contact" className="block text-amber-200 hover:text-white transition-colors duration-300">
                    {messages.nav.contact}
                  </a>
                </div>
              </div>
              {/* Service areas column */}
              <div className="text-center">
                <h4 className="mb-4 text-lg font-semibold text-amber-100">
                  {messages.footer.serviceAreas}
                </h4>
                <div className="space-y-2">
                  <button
                    type="button"
                    aria-label={messages.footer.openModalAnnecy}
                    className="block w-full text-center text-amber-200 hover:text-white transition-colors duration-300"
                    onClick={() => setCityModal({ open: true, city: 'annecy' })}
                  >
                    Annecy
                  </button>
                  <button
                    type="button"
                    aria-label={messages.footer.openModalAravis}
                    className="block w-full text-center text-amber-200 hover:text-white transition-colors duration-300"
                    onClick={() => setCityModal({ open: true, city: 'aravis' })}
                  >
                    Aravis
                  </button>
                  <button
                    type="button"
                    aria-label={messages.footer.openModalGeneva}
                    className="block w-full text-center text-amber-200 hover:text-white transition-colors duration-300"
                    onClick={() => setCityModal({ open: true, city: 'geneva' })}
                  >
                    {locale === 'fr' ? 'Genève' : 'Geneva'}
                  </button>
                  <button
                    type="button"
                    aria-label={messages.footer.openModalRemote}
                    className="block w-full text-center text-amber-200 hover:text-white transition-colors duration-300"
                    onClick={() => setCityModal({ open: true, city: 'remote' })}
                  >
                    {locale === 'fr' ? 'Et partout ailleurs à distance !' : 'And everywhere else remotely!'}
                  </button>
                </div>
              </div>
              <div className="text-center md:text-right">
                <h4 className="mb-4 text-lg font-semibold text-amber-100">{messages.footer.contact}</h4>
                <div className="space-y-3">
                  <a
                    href="mailto:contact@hakunamataweb.fr"
                    className="flex items-center justify-center md:justify-end text-amber-200 hover:text-white transition-colors duration-300 group"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    contact@hakunamataweb.com
                  </a>
                  <a
                    href="tel:+33745229697"
                    className="flex items-center justify-center md:justify-end text-amber-200 hover:text-white transition-colors duration-300 group"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    +33 7 45 22 96 97
                  </a>
                  <div className="mt-4 flex items-center justify-center md:justify-end space-x-5">
                    <a
                      href="https://www.linkedin.com/company/hakuna-mataweb"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={messages.aria.linkedin}
                      className="text-amber-200 hover:text-white transition-colors duration-300 hover:scale-110 transform"
                    >
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M22.225 0H1.771C.792 0 0 .771 0 1.723v20.554C0 23.229.792 24 1.771 24h20.451C23.2 24 24 23.229 24 22.277V1.723C24 .771 23.2 0 22.225 0zM7.002 20.452H3.666V9h3.336v11.452zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zM20.447 20.452h-3.554V14.89c0-1.327-.027-3.036-1.852-3.036-1.853 0-2.136 1.447-2.136 2.941v5.657H9.351V9h3.414v1.561h.047c.476-.9 1.637-1.852 3.372-1.852 3.605 0 4.271 2.372 4.271 5.455v6.289z"/>
                      </svg>
                    </a>
                    <a
                      href="https://github.com/roCal93"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={messages.aria.github}
                      className="text-amber-200 hover:text-white transition-colors duration-300 hover:scale-110 transform"
                    >
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.093.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.455-1.157-1.11-1.466-1.11-1.466-.908-.62.069-.607.069-.607 1.003.07 1.53 1.03 1.53 1.03.892 1.529 2.341 1.088 2.91.832.091-.646.35-1.088.636-1.339-2.22-.253-4.556-1.11-4.556-4.943 0-1.091.39-1.985 1.029-2.685-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.851.004 1.707.115 2.506.338 1.909-1.294 2.748-1.025 2.748-1.025.546 1.378.203 2.397.1 2.65.64.7 1.028 1.594 1.028 2.685 0 3.842-2.339 4.687-4.566 4.936.359.309.678.918.678 1.852 0 1.336-.012 2.414-.012 2.742 0 .268.18.58.688.481A10.002 10.002 0 0 0 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-amber-300">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-amber-200 mb-4 md:mb-0">
                  <span className="inline-flex items-center text-center gap-2">
                    <Image
                      src="/images/empreinte-patte.webp"
                      alt={messages.aria.pawPrint}
                      width={24}
                      height={24}
                      className="inline-block align-middle filter-orange"
                    />
                    {footerText}
                  </span>
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <Link href={`/${locale}/privacy`} className="text-amber-200 hover:text-white transition-colors duration-300">
                    {messages.nav.privacy}
                  </Link>
                  <Link href={`/${locale}/mentions-legales`} className="text-amber-200 hover:text-white transition-colors duration-300">
                    {messages.nav.legalNotice}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
        {/* City modal */}
        {cityModal.open && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setCityModal({ open: false, city: null })} />
            <div className="relative z-50 mx-auto max-w-lg mt-24 rounded-xl bg-amber-50 dark:bg-gray-800 border border-amber-200 dark:border-gray-700 shadow-xl p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  {cityModal.city === 'annecy' && (locale === 'fr' ? 'Annecy' : 'Annecy')}
                  {cityModal.city === 'aravis' && (locale === 'fr' ? 'Aravis' : 'Aravis')}
                  {cityModal.city === 'geneva' && (locale === 'fr' ? 'Genève' : 'Geneva')}
                  {cityModal.city === 'remote' && (locale === 'fr' ? 'Accompagnement à distance' : 'Remote support')}
                </h3>
                <button
                  type="button"
                  className="text-neutral-600 hover:text-black"
                  onClick={() => setCityModal({ open: false, city: null })}
                  aria-label={locale === 'fr' ? 'Fermer la fenêtre' : 'Close dialog'}
                >
                  ×
                </button>
              </div>
              <div className="mt-4 space-y-3 text-neutral-800">
                {cityModal.city === 'annecy' && (
                  <>
                    <p>{locale === 'fr' ? 'Annecy attire chaque année un flux constant de visiteurs, et beaucoup vous cherchent sur leur téléphone avant même d’arriver.' : 'Annecy attracts a steady flow of visitors every year, and many of them look for you on their phone before they even arrive.'}</p>
                    <p>{locale === 'fr' ? 'Je conçois des sites vitrines, des systèmes de réservation et des boutiques en ligne pour les commerces, hébergements et prestataires du lac qui veulent transformer cette visibilité en clients, été comme hiver.' : 'I design showcase websites, booking systems and online stores for lakeside businesses, accommodations and service providers who want to turn that visibility into customers, in summer and winter alike.'}</p>
                  </>
                )}
                {cityModal.city === 'aravis' && (
                  <>
                    <p>{locale === 'fr' ? 'La Clusaz, Le Grand‑Bornand, Manigod : le massif des Aravis attire une clientèle fidèle et exigeante, été comme hiver.' : 'La Clusaz, Le Grand‑Bornand and Manigod: the Aravis massif attracts a loyal and demanding clientele in both summer and winter.'}</p>
                    <p>{locale === 'fr' ? 'Votre site doit être à la hauteur de la destination.' : 'Your website should match the standard of the destination.'}</p>
                    <p>{locale === 'fr' ? 'Je conçois des sites sur‑mesure pour les hébergeurs, restaurateurs et artisans du secteur.' : 'I design tailor-made websites for local accommodation providers, restaurateurs and craftspeople.'}</p>
                  </>
                )}
                {cityModal.city === 'geneva' && (
                  <>
                    <p>{locale === 'fr' ? 'Genève attire des clients du monde entier. Votre site est-il prêt à les accueillir ?' : 'Geneva attracts clients from all over the world. Is your website ready to welcome them?'}</p>
                    <p>{locale === 'fr' ? 'Sites multilingues, design soigné, performances optimisées : je conçois des sites pensés pour les entreprises genevoises qui évoluent dans un environnement international.' : 'Multilingual websites, refined design and optimized performance: I design websites for Geneva-based businesses operating in an international environment.'}</p>
                  </>
                )}
                {cityModal.city === 'remote' && (
                  <>
                    <p>{locale === 'fr' ? 'Même si vous êtes loin d’Annecy, je peux vous accompagner de A à Z sur votre projet web.' : 'Even if you are far from Annecy, I can support your web project from start to finish.'}</p>
                    <p>{locale === 'fr' ? 'Échanges en visio, suivi clair par email ou téléphone, validations à chaque étape : vous gardez une vision simple et précise de l’avancement.' : 'Video calls, clear follow-up by email or phone, and validation at each step: you keep a simple and precise view of progress.'}</p>
                  </>
                )}
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                  onClick={() => setCityModal({ open: false, city: null })}
                >
                  {locale === 'fr' ? 'Fermer' : 'Close'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCityModal({ open: false, city: null });
                    const section = document.getElementById('contact');
                    if (section) {
                      try {
                        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      } catch {
                        const y = Math.max(0, section.offsetTop - 80);
                        window.scrollTo(0, y);
                      }
                    }
                    setTimeout(() => {
                      window.dispatchEvent(new Event('hmw-open-callback'));
                    }, 350);
                  }}
                  className="px-4 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-700"
                >
                  {locale === 'fr' ? 'Demander un devis' : 'Request a quote'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </LazyMotion>
  );
}

function AboutCardsFallback({ messages }: { messages: Messages }) {
  const fallbackCards = [
    {
      key: "innovation",
      text: messages.aboutCards.innovation.text,
      alt: messages.aboutCards.innovation.alt,
    },
    {
      key: "solutions",
      text: messages.aboutCards.solutions.text,
      alt: messages.aboutCards.solutions.alt,
    },
    {
      key: "identity",
      text: messages.aboutCards.identity.text,
      alt: messages.aboutCards.identity.alt,
    },
  ];

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {fallbackCards.map((card) => (
        <div
          key={card.key}
          className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-lg border border-amber-100 dark:border-gray-700"
          aria-label={card.alt}
        >
          <p className="text-lg text-gray-700 dark:text-gray-300">{card.text}</p>
        </div>
      ))}
    </div>
  );
}

function ContactButtonPlaceholder({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 px-10 py-4 text-xl font-semibold text-white opacity-80 cursor-wait select-none">
      {label}
    </div>
  );
}
