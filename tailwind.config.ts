import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{mdx,md}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "ui-sans-serif", "system-ui"],
        body: ["'IBM Plex Sans'", "ui-sans-serif", "system-ui"]
      },
      colors: {
        ink: "#11111F",
        sand: "#F6F2EA",
        accent: "#F95C3C",
        calm: "#2B6E6B",
        paper: "#FFFCF7"
      },
      boxShadow: {
        lift: "0 12px 30px -12px rgba(17, 17, 31, 0.35)"
      }
    }
  },
  plugins: [typography]
};

export default config;
