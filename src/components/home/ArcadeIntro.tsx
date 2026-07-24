"use client";

import { useEffect, useRef, useState } from "react";

export function ArcadeIntro() {
  const introRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const intro = introRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (completedRef.current) return;
      const progress = reducedMotion.matches
        ? 1
        : Math.min(window.scrollY / (window.innerHeight * 0.24), 1);
      intro?.style.setProperty("--intro-progress", progress.toString());
      if (progress >= 0.99) {
        completedRef.current = true;
        setIsOpen(true);
      }
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  return (
    <div
      ref={introRef}
      className="arcade-intro"
      data-open={isOpen}
      aria-hidden="true"
    >
      <div className="arcade-intro-panel arcade-intro-left" />
      <div className="arcade-intro-panel arcade-intro-right" />
      <div className="arcade-intro-screen">
        <p className="arcade-intro-kicker">New Orleans · Player One Ready</p>
        <p className="arcade-intro-title">You Don&apos;t<br />Know Jack</p>
        <p className="arcade-intro-neon">TRIVIA</p>
        <p className="arcade-intro-prompt">Scroll to start</p>
      </div>
      <div className="arcade-intro-scanlines" />
    </div>
  );
}
