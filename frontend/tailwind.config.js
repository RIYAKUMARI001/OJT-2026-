/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#F8F7F4",
        primary: "#1A1A1A",
        secondary: "#FFFFFF",
        border: "#E5E3DE",
        muted: "#888888",
        accent: {
          blue: "#EBF3FF",
          red: "#FFF0F0",
          error: "#DC2626",
          blueText: "#1D4ED8"
        }
      },
      fontFamily: {
        syne: ["System"], // Generic sans for now, easy to swap
        mono: ["Courier New"]
      }
    },
  },
  plugins: []
};
