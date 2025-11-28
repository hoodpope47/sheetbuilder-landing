/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: "#39FF14",          // main neon
        "neon-dark": "#1FCC0E",   // hover / accent
        "neon-soft": "#E6FFE6",   // light background tints
      },
      boxShadow: {
        "soft-card": "0 18px 45px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};