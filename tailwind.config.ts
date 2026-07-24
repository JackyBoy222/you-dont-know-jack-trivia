import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1b1b20",
        cream: "#fffaf0",
        canvas: "#f3efe6",
        paper: "#fffaf0",
        brass: "#f4c542",
        gold: "#f4c542",
        rouge: "#f04b9b",
        oxblood: "#9f255f",
        teal: "#00c8d7",
        cyan: "#00c8d7",
        violet: "#7655d9",
        emerald: "#1fa878",
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 12px 32px rgba(17,17,21,.12), inset 0 1px 0 rgba(255,255,255,.65)",
        cabinet: "0 10px 0 #111115, 0 22px 44px rgba(17,17,21,.18)",
      },
    },
  },
  plugins: [],
} satisfies Config;
