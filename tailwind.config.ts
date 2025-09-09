import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))", // Added border color definition
        primary: {
          DEFAULT: "hsl(225, 85%, 65%)",
          light: "hsl(225, 85%, 75%)",
          dark: "hsl(225, 85%, 55%)",
          foreground: "hsl(210, 40%, 98%)",
        },
        secondary: {
          DEFAULT: "hsl(280, 65%, 60%)",
          light: "hsl(280, 65%, 70%)",
          foreground: "hsl(210, 40%, 98%)",
        },
        accent: {
          DEFAULT: "hsl(45, 85%, 60%)",
          light: "hsl(45, 85%, 70%)",
          foreground: "hsl(222.2, 47.4%, 11.2%)",
        },
        background: {
          DEFAULT: "hsl(0, 0%, 100%)",
          muted: "hsl(210, 40%, 98%)",
        },
        foreground: {
          DEFAULT: "hsl(222.2, 47.4%, 11.2%)",
          muted: "hsl(215, 20.2%, 65.1%)",
        },
      },
      borderColor: {
        DEFAULT: "hsl(var(--border))", // Added default border color
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      boxShadow: {
        card: "0 4px 6px -1px hsl(222.2, 47.4%, 11.2% / 0.1), 0 2px 4px -1px hsl(222.2, 47.4%, 11.2% / 0.06)",
        hover: "0 10px 15px -3px hsl(225, 85%, 65% / 0.1), 0 4px 6px -2px hsl(225, 85%, 65% / 0.05)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
