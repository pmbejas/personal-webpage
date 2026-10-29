import React from "react";

export interface PropiedadesWordmarkLogo {
  className?: string;
}

/**
 * Componente vector oficial para el Wordmark de Pablo Bejas.
 * Se renderiza inline en el DOM para heredar directamente las fuentes nativas
 * Oswald y Montserrat, garantizando métricas tipográficas perfectas sin riesgo
 * de recortes provocados por sandboxing de imágenes externas.
 */
export function WordmarkLogo({ className = "h-6 w-auto" }: PropiedadesWordmarkLogo) {
  return (
    <svg
      viewBox="0 0 520 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Pablo Bejas - Full Stack Developer"
    >
      <defs>
        <style>{`
          .fuente-titulo-wordmark {
            font-family: var(--font-oswald), 'Oswald', 'Arial Black', sans-serif;
            font-size: 78px;
            font-weight: 700;
            letter-spacing: 0.5px;
          }
          .fuente-subtitulo-wordmark {
            font-family: var(--font-montserrat), 'Montserrat', sans-serif;
            font-size: 19px;
            font-weight: 800;
            letter-spacing: 1.8px;
          }
        `}</style>
      </defs>

      <g transform="translate(10, 75)">
        {/* Pablo Bejas */}
        <text className="fuente-titulo-wordmark" x="0" y="0">
          <tspan fill="#FFFFFF">Pablo </tspan>
          <tspan fill="#38BDF8">Bejas</tspan>
        </text>

        {/* FULL STACK DEVELOPER */}
        <text
          className="fuente-subtitulo-wordmark"
          fill="#94A3B8"
          x="0"
          y="42"
        >
          FULL STACK DEVELOPER
        </text>
      </g>
    </svg>
  );
}
