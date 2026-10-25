import type { Config } from "tailwindcss";

const configuracionTailwind: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* La paleta azul sigue el tema activo: cada tono lee de una variable
           CSS definida en globals.css (azul / verde / naranja pastel) */
        blue: {
          200: "rgb(var(--tema-acento-claro-rgb) / <alpha-value>)",
          300: "rgb(var(--tema-acento-claro-rgb) / <alpha-value>)",
          400: "rgb(var(--tema-acento-claro-rgb) / <alpha-value>)",
          500: "rgb(var(--tema-acento-rgb) / <alpha-value>)",
          600: "rgb(var(--tema-acento-oscuro-rgb) / <alpha-value>)",
          700: "rgb(var(--tema-acento-oscuro-rgb) / <alpha-value>)",
          800: "rgb(var(--tema-acento-profundo-rgb) / <alpha-value>)",
          900: "rgb(var(--tema-acento-profundo-rgb) / <alpha-value>)",
          950: "rgb(var(--tema-acento-profundo-rgb) / <alpha-value>)",
        },
        sky: {
          300: "rgb(var(--tema-acento-claro-rgb) / <alpha-value>)",
          400: "rgb(var(--tema-acento-claro-rgb) / <alpha-value>)",
          500: "rgb(var(--tema-acento-rgb) / <alpha-value>)",
        },
        fondo: {
          oscuro: "#1c171b",
          tarjeta: "#0F172A",
          borde: "#1E293B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      /* Animación del divisor "línea de escaneo": el haz recorre la pista
         estrictamente dentro de los topes (de 0% a calc(100% - 72px)),
         apareciendo y desvaneciéndose suavemente en los extremos */
      keyframes: {
        barrido: {
          "0%": { left: "0%", opacity: "0" },
          "12%": { opacity: "1" },
          "88%": { opacity: "1" },
          "100%": { left: "calc(100% - 72px)", opacity: "0" },
        },
      },
      animation: {
        barrido: "barrido 5.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default configuracionTailwind;

