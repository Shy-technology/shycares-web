import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm & friendly pet care palette
        cream: {
          50: "#FFFBF5",
          100: "#FEF6E9",
          200: "#FCEBCB",
        },
        peach: {
          50: "#FFF4EE",
          100: "#FFE3D3",
          200: "#FFC9AC",
          300: "#FFA77F",
          400: "#FF8855",
          500: "#F26B33",
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
          DEFAULT: "#2A1F1A",
          soft: "#5C4F47",
          muted: "#9A8C82",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 20px -4px rgba(42, 31, 26, 0.08)",
        warm: "0 10px 40px -10px rgba(242, 107, 51, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
