/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {
      colors: {
        sever: {
          bg: "#0b0e13",
          card: "#121721",
          primary: "#2f6eff",
          accent: "#00e0a4",
          muted: "#8892a6",
        },
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
      boxShadow: {
        card: "0 8px 30px rgba(0,0,0,0.06)",
        header: "0 6px 20px rgba(0,0,0,0.05)",
      },
      keyframes: {
        fade: { '0%': {opacity:0, transform:'translateY(6px)'}, '100%': {opacity:1, transform:'translateY(0)'} }
      },
      animation: { fade: 'fade .25s ease-out both' },
    },
  },
  plugins: [],
}
