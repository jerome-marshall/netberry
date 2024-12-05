/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      padding: {
        card_pad: "24px",
      },
      animation: {
        text: "text 5s ease infinite",
      },
      keyframes: {
        text: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
      },
      screens: {
        xl: "1240px",
        "2xl": "1240px",
      },
    },

    colors: {
      background: {
        primary: "#070b0d",
        secondary: "#12181f",
        active: "#191f26",
        active_hover: "#1d242c",
        alt_hover: "#272f38",
      },
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background1: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
      white: "#ffffff",
      gray: {
        light: "#4d565f",
        darkest: "#1e242c",
      },
      text: {
        primary: "#e7eaed",
        muted: "#abb5bf",
      },
      blue: {
        lighter: "#a6bffd",
        light: "#587ef8",
        dark: "#040d4e",
        darker: "#030a39",
      },
      teal: {
        lighter: "#84f3df",
        light: "#30c8c9",
        dark: "#0c2a2a",
      },
      green: {
        light: "#93f5a5",
        dark: "#152a19",
        darker: "#0f2313",
      },
      gold: {
        light: "#facd6f",
        dark: "#332213",
        darker: "#26190d",
      },
      red: {
        alt: "#ff4e46",
        lighter: "#ffada9",
        light: "#ff9987",
        dark: "#2e1212",
      },
      transparent: "transparent",
    },
    borderRadius: {
      lg: "12px",
      md: "8px",
      sm: "4px",
      full: "9999px",
      medium: "8px",
    },
    fontFamily: {
      sans: [
        "Noto Sans JP",
        "Segoe UI",
        "Roboto",
        "Helvetica",
        "Arial",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
      ],
    },
  },
  plugins: [],
};
