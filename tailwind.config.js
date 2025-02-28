/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        dark: "#2f2f3b",
        light: "#f8f8f8",
        primary: "#ef767a",
        secondary: {
          normal: "#07beb8",
          muted: "#20a39e"
        }
      }
    },
  },
  plugins: [],
}
