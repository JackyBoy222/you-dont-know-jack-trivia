"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function NeonHero() {
  const [isLit, setIsLit] = useState(false);

  useEffect(() => {
    setIsLit(true);
  }, []);

  return (
    <section className="neon-hero" aria-labelledby="home-title">
      <h1 id="home-title" className="sr-only">You Don&apos;t Know Jack Trivia</h1>
      <div className="neon-hero-artwork" aria-hidden="true">
        <Image
          src="/ydkj-neon-hero.png"
          alt=""
          width={1672}
          height={941}
          className="neon-hero-artwork-top"
          priority
        />
        <Image
          src="/ydkj-neon-hero.png"
          alt=""
          width={1672}
          height={941}
          className="neon-hero-artwork-trivia"
          data-lit={isLit}
          priority
        />
      </div>
    </section>
  );
}
