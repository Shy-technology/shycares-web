import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FAFBF7",
          100: "#F0F3EC",
          200: "#E3E8DB",
        },
        peach: {
          50: "#F0F3EC",
          100: "#E8E8E2",
          200: "#B3B3AC",
          300: "#5A5A55",
          400: "#1F1F1D",
          500: "#040404",
        },
        sage: {
          50: "#F1F7F3",
          100: "#DEEBE2",
          200: "#B7D2BF",
          300: "#85B393",
          400: "#5C9670",
          500: "#3F7855",
          600: "#2F5D42",
        },
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
        soft: "0 4px 16px -4px rgba(4, 4, 4, 0.08)",
        card: "0 2px 12px -2px rgba(4, 4, 4, 0.10)",
        warm: "0 8px 24px -6px rgba(4, 4, 4, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
