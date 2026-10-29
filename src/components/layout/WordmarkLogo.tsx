import React from "react";

export interface PropiedadesWordmarkLogo {
  className?: string;
}

/**
 * Componente vector oficial para el Wordmark de Pablo Bejas.
 * Se renderiza inline en el DOM para heredar directamente la fuente nativa Oswald
 * y reaccionar dinámicamente a la paleta de colores del tema activo.
 * Posee un viewBox optimizado (460 76) con centrado vertical geométrico exacto
 * y márgenes perimetrales reducidos para una alineación perfecta junto al robot.
 */
export function WordmarkLogo({ className = "h-8 w-auto" }: PropiedadesWordmarkLogo) {
  return (
    <svg
      viewBox="0 0 460 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Pablo Bejas"
    >
      <defs>
        <style>{`
          .fuente-titulo-wordmark {
            font-family: var(--font-oswald), 'Oswald', 'Arial Black', sans-serif;
            font-size: 78px;
            font-weight: 700;
            letter-spacing: 0.5px;
          }
        `}</style>
      </defs>

      <g transform="translate(0, 58)">
        {/* Pablo Bejas */}
        <text className="fuente-titulo-wordmark" x="0" y="0">
          <tspan fill="#FFFFFF">Pablo </tspan>
          <tspan fill="rgb(var(--tema-acento-claro-rgb, 56 189 248))">Bejas</tspan>
        </text>
      </g>
    </svg>
  );
}
