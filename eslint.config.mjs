import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const config = [
  { ignores: [".next/**", "node_modules/**", "node_modules.icloud-*/**", "next-env.d.ts"] },
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
];
export default config;
