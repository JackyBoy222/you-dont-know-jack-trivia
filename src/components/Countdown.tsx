"use client";
import { useEffect, useState } from "react";
import { CountdownDisplay } from "@/components/ui";

export function Countdown({ date }: { date: string }) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    const tick = () => {
      const ms = Math.max(0, new Date(date).getTime() - Date.now());
      const d = Math.floor(ms / 864e5);
      const h = Math.floor((ms % 864e5) / 36e5);
      const m = Math.floor((ms % 36e5) / 6e4);
      setRemaining(ms ? `${d}d ${h}h ${m}m` : "Tonight's the night!");
    };

    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [date]);

  return <CountdownDisplay>{remaining || "Calculating..."}</CountdownDisplay>;
}
