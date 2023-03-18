/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      padding: {
        card_pad: "24px",
      },
      borderRadius: {
        medium: "8px",
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
      },
      teal: {
        lighter: "#84f3df",
        light: "#30c8c9",
        dark: "#0c2a2a",
      },
      green: {
        light: "#93f5a5",
        dark: "#152a19",
      },
      gold: {
        light: "#facd6f",
        dark: "#332213",
      },
      red: {
        lighter: "#ffada9",
        light: "#ff9987",
        dark: "#3d1c1b",
      },
      transparent: "transparent",
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
