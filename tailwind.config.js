/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Champagne gold
        gold: {
          50: '#fbf8f1', 100: '#f5eedc', 200: '#ebdcb8', 300: '#dfc78f',
          400: '#d2b06a', 500: '#c19a4b', 600: '#a67f38', 700: '#86642f',
          800: '#6d5129', 900: '#5a4425',
        },
        // Deep navy (kept under the "charcoal" key so every existing class re-themes automatically)
        charcoal: {
          50: '#f5f7fa', 100: '#e6eaf1', 200: '#cdd5e1', 300: '#a5b2c6',
          400: '#7a8aa3', 500: '#566683', 600: '#40506c', 700: '#2f3d56',
          800: '#1f2b42', 900: '#131c30', 950: '#0a1221',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        luxury: '0 24px 60px -24px rgba(10,18,33,0.35)',
        soft: '0 8px 30px -12px rgba(10,18,33,0.18)',
      },
    },
  },
  plugins: [],
};
