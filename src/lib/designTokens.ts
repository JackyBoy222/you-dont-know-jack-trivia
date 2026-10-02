export const designTokens = {
  colors: {
    canvas: "#f3efe6",
    paper: "#fffaf0",
    charcoal: "#1b1b20",
    softBlack: "#111115",
    electricCyan: "#00c8d7",
    hotMagenta: "#f04b9b",
    arcadeYellow: "#f4c542",
    emerald: "#1fa878",
  },
  typography: {
    display: "var(--font-display), Impact, sans-serif",
    body: "var(--font-body), system-ui, sans-serif",
    numeric: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  effects: {
    cabinetShadow: "0 14px 0 #111115, 0 24px 50px rgba(17,17,21,.16)",
    neonGlow: "0 0 5px rgba(0,200,215,.62), 0 0 18px rgba(0,200,215,.3)",
    keyline: "1px solid rgba(27,27,32,.14)",
  },
} as const;
