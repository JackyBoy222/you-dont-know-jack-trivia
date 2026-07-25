"use client";

import { useEffect, useRef, useState } from "react";

export function NeonHero() {
  const heroRef = useRef<HTMLElement>(null);
  const [isLit, setIsLit] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      setIsLit(true);
      return;
    }

    const ignite = () => setIsLit(true);
    window.addEventListener("arcade-intro-complete", ignite, { once: true });
    return () => window.removeEventListener("arcade-intro-complete", ignite);
  }, []);

  return (
    <section ref={heroRef} className="neon-hero" aria-labelledby="home-title">
      <h1 id="home-title" className="neon-hero-sign">
        <span className="neon-tube neon-tube-cyan" data-text="YOU DON’T">
          YOU DON’T
        </span>
        <span className="neon-tube neon-tube-magenta" data-text="KNOW JACK">
          KNOW JACK
        </span>
        <span
          className="neon-trivia-wrap"
          data-lit={isLit}
        >
          <span className="neon-tube neon-tube-lime neon-tube-script" data-text="TRIVIA">
            TRIVIA
          </span>
          <span className="neon-trivia-underline" aria-hidden="true" />
        </span>
      </h1>
    </section>
  );
}
