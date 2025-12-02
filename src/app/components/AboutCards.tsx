"use client";
import React, { useEffect, useState } from "react";
import { m } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import type { Messages } from "@/lib/types";

export default function AboutCards({ messages }: { messages: Messages }) {
  const [flipped, setFlipped] = useState([false, false, false]);
  const [isTouch, setIsTouch] = useState(false);

  const cards = [
    {
      src: '/images/Ampoule.webp',
      alt: messages.aboutCards.innovation.alt,
      text: messages.aboutCards.innovation.text
    },
    {
      src: '/images/cible.webp',
      alt: messages.aboutCards.solutions.alt,
      text: messages.aboutCards.solutions.text
    },
    {
      src: '/images/valeur.webp',
      alt: messages.aboutCards.identity.alt,
      text: messages.aboutCards.identity.text
    }
  ];

  useEffect(() => {
    try {
      const m = window.matchMedia('(hover: none)');
      setIsTouch(m.matches);
      const listener = (e: MediaQueryListEvent) => setIsTouch(e.matches);
      if (m.addEventListener) {
        m.addEventListener('change', listener);
      } else {
        // Safari & older browsers
        m.addListener(listener);
      }
      return () => {
        if (m.removeEventListener) {
          m.removeEventListener('change', listener);
        } else {
          m.removeListener(listener);
        }
      };
    } catch {
      setIsTouch(false);
    }
  }, []);

  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.3 });

  return (
    <div ref={ref} className="flex flex-col items-center gap-4 mt-12 md:mt-20 mb-8">
      <div className="flex flex-col custom-sm:flex-row justify-center items-center gap-8 md:gap-16">
      {cards.map((item, idx) => {
        // Animation direction et décalage
        let initial;
        if (idx === 0) initial = { opacity: 0, x: -100, y: 0, rotateY: 0 }; // gauche
        else if (idx === 1) initial = { opacity: 0, y: 100, x: 0, rotateY: 0 }; // bas
        else initial = { opacity: 0, x: 100, y: 0, rotateY: 0 }; // droite

        return (
          <m.div
            key={item.alt}
            initial={initial}
            animate={inView ? {
              opacity: 1,
              x: 0,
              y: 0,
              rotateY: 360
            } : initial}
            transition={{
              duration: 1,
              ease: "easeOut",
              delay: idx * 0.2
            }}
            className="flip-wrapper"
          >
            {isTouch ? (
            <button
              className="relative inline-block w-56 h-56 xs-custom:w-72 xs-custom:h-72 custom-sm:w-56 custom-sm:h-56 xl-custom:w-80 xl-custom:h-80 hover:scale-105 transition-transform duration-200 hover:shadow-2xl cursor-pointer"
              // Mobile : chaque touch toggle la carte (aller/retour)
              onClick={() => setFlipped(f => f.map((v, i) => i === idx ? !v : v))}
              aria-pressed={flipped[idx]}
              role="button"
            >
              <div
                className={`w-full h-full transition-transform duration-500 cursor-auto flip-inner ${flipped[idx] ? 'flipped' : ''}`}
                style={{
                  transformStyle: 'preserve-3d',
                  WebkitTransformStyle: 'preserve-3d',
                  willChange: 'transform',
                  transformOrigin: 'center'
                }}
              >
                <div
                  className="absolute inset-0 rounded-2xl shadow-xl bg-amber-100 flex items-center justify-center flip-front"
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={256}
                    height={256}
                    className="w-40 h-40 xs-custom:w-56 xs-custom:h-56 custom-sm:w-40 custom-sm:h-40 xl-custom:w-64 xl-custom:h-64 object-contain"
                    priority
                    loading="eager"
                  />
                </div>
                <div
                  className="absolute inset-0 rounded-2xl shadow-xl bg-amber-800 text-white flex items-center justify-center px-6 text-center text-lg font-semibold flip-back"
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  {item.text}
                </div>
              </div>
            </button>
          ) : (
            <div className="flip-wrapper">
              <input id={`flip-${idx}`} type="checkbox" className="sr-only flip-toggle" />
              <label
                htmlFor={`flip-${idx}`}
                tabIndex={0}
                className="relative inline-block w-56 h-56 xs-custom:w-72 xs-custom:h-72 custom-sm:w-56 custom-sm:h-56 xl-custom:w-80 xl-custom:h-80 hover:scale-105 transition-transform duration-200 hover:shadow-2xl cursor-pointer group"
              >
                <div
                  className={`w-full h-full transition-transform duration-500 cursor-auto flip-inner ${flipped[idx] ? 'flipped' : ''}`}
                  // Styles like transform-style live in global CSS. Use CSS-only group hover via .group:hover
                >
                  <div
                    className="absolute inset-0 rounded-2xl shadow-xl bg-amber-100 flex items-center justify-center flip-front"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={256}
                      height={256}
                      className="w-40 h-40 xs-custom:w-56 xs-custom:h-56 custom-sm:w-40 custom-sm:h-40 xl-custom:w-64 xl-custom:h-64 object-contain"
                      priority
                      loading="eager"
                    />
                  </div>
                  <div
                    className="absolute inset-0 rounded-2xl shadow-xl bg-amber-800 text-white flex items-center justify-center px-6 text-center text-lg font-semibold flip-back"
                  >
                    {item.text}
                  </div>
                </div>
              </label>
            </div>
          )}
          </m.div>
        );
      })}
      </div>
    </div>
  );
}
