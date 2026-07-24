"use client";

import { useEffect, useRef, useState } from "react";

export function CurtainIntro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const overlay = overlayRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const progress = reducedMotion.matches
        ? 1
        : Math.min(window.scrollY / (window.innerHeight * 0.26), 1);
      overlay?.style.setProperty("--curtain-progress", progress.toString());
      setIsOpen(progress >= 0.99);
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
    <div ref={overlayRef} className="curtain-intro" data-open={isOpen} aria-hidden="true">
      <div className="curtain curtain-left" />
      <div className="curtain curtain-right" />
      <div className="curtain-valance" />
      <div className="intro-marquee-wrap">
        <span className="marquee-chain marquee-chain-left" />
        <span className="marquee-chain marquee-chain-right" />
        <div className="intro-marquee">
          <span className="intro-bulbs" />
          <p>THINK YOU&apos;RE<br />SMARTER THAN THE ROOM?</p>
        </div>
      </div>
    </div>
  );
}
