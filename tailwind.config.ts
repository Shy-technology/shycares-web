import type { Config } from "tailwindcss";

// Shycares brand kit:
//   primary  = #040404 (near-black)
//   surface  = #F0F3EC (light grey)
//   accent   = sage green family (warm, pet-friendly)
//
// Class names from v1 are preserved (peach-*, cream-*, ink, sage-*) so existing
// pages don't need rewriting; only the underlying color values change.

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Surface / page-background scale (light grey)
        cream: {
          50: "#FAFBF7", // page background
          100: "#F0F3EC", // brand light grey — cards, chips, surfaces
          200: "#E3E8DB", // hover state on light surfaces
        },
        // Repurposed "peach" scale: now the BLACK CTA scale.
        // peach-500 = primary brand black for buttons & strong actions.
        peach: {
          50: "#F0F3EC",
          100: "#E8E8E2",
          200: "#B3B3AC",
          300: "#5A5A55",
          400: "#1F1F1D",
          500: "#040404", // CTA / primary brand color
        },
        // Sage — warm accent for success states (confirmed, completed)
        sage: {
          50: "#F1F7F3",
          100: "#DEEBE2",
          200: "#B7D2BF",
          300: "#85B393",
          400: "#5C9670",
          500: "#3F7855",
          600: "#2F5D42",
        },
        // Text colors
        ink: {
          DEFAULT: "#040404",
          soft: "#2A2A2A",
          muted: "#767676",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        // No more "warm" glow — sharp, clean shadows that suit a B2B feel
        soft: "0 4px 16px -4px rgba(4, 4, 4, 0.08)",
        warm: "0 8px 24px -6px rgba(4, 4, 4, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
