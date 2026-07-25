"use client";

import { useEffect, useState } from "react";

export function RotatingQuip({ quips }: { quips: string[] }) {
  const [quip, setQuip] = useState<string | null>(null);

  useEffect(() => {
    if (!quips.length) return;
    const randomIndex = Math.floor(Math.random() * quips.length);
    setQuip(quips[randomIndex]);
  }, [quips]);

  return (
    <p className="home-quip" aria-live="off">
      {quip ? `“${quip}”` : <span aria-hidden="true">&nbsp;</span>}
    </p>
  );
}
