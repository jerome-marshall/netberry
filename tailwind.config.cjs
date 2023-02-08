/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      padding: {
        card_pad: "24px",
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
      },
    },
    borderRadius: {
      medium: "8px",
    },
    colors: {
      background: {
        primary: "#070b0d",
        secondary: "#151a1e",
        active: "#1e2327",
      },
      white: "#ffffff",
      gray: "#4c5257",
      text: {
        primary: "#e7eaed",
        muted: "#a3a7ac",
      },
      blue: {
        lighter: "#a6bffd",
        light: "#587ef8",
        dark: "#040d4e",
      },
      teal: {
        lighter: "#84f3df",
        light: "#30c8c9",
        dark: "#032b3a",
      },
      gold: {
        light: "#ffcf50",
        dark: "#4f2f03",
      },
      red: {
        light: "#ff9987",
        dark: "#470a1a",
      },
    },
    fontFamily: {
      "noto-sans": ["Noto Sans JP", "sans-serif"],
    },
  },
  plugins: [],
};
