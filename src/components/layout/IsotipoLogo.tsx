import React from "react";

export interface PropiedadesIsotipoLogo {
  className?: string;
}

/**
 * Componente vector oficial para el Isotipo de Pablo Bejas (Robot con llaves de código).
 * Se renderiza inline en el DOM para reaccionar dinámicamente a las variables CSS
 * del tema activo con efecto glow neón.
 * Su viewBox ajustado (28 10 144 212) elimina cualquier margen lateral vacío para
 * permitir una alineación y cercanía milimétrica con el texto contiguo.
 */
export function IsotipoLogo({ className = "h-10 w-auto" }: PropiedadesIsotipoLogo) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="28 10 144 212"
      fill="none"
      className={`overflow-visible ${className}`}
      aria-label="Isotipo Robot Pablo Bejas"
    >
      <defs>
        <style>{`
          .trazo-neon-robot {
            stroke: rgb(var(--tema-acento-claro-rgb, 56 189 248));
            stroke-width: 6.5;
            stroke-linecap: round;
            stroke-linejoin: round;
            fill: none;
            filter: drop-shadow(0 0 4px rgb(var(--tema-acento-claro-rgb, 56 189 248) / 0.95))
                    drop-shadow(0 0 12px rgb(var(--tema-acento-rgb, 14 165 233) / 0.8))
                    drop-shadow(0 0 24px rgb(var(--tema-acento-rgb, 14 165 233) / 0.5));
            transition: stroke 0.3s ease, filter 0.3s ease;
          }
          .relleno-neon-robot {
            fill: rgb(var(--tema-acento-claro-rgb, 56 189 248));
            filter: drop-shadow(0 0 4px rgb(var(--tema-acento-claro-rgb, 56 189 248) / 0.95))
                    drop-shadow(0 0 10px rgb(var(--tema-acento-rgb, 14 165 233) / 0.8))
                    drop-shadow(0 0 20px rgb(var(--tema-acento-rgb, 14 165 233) / 0.5));
            transition: fill 0.3s ease, filter 0.3s ease;
          }
        `}</style>
      </defs>

      <g transform="translate(15, 10)">
        {/* Antena */}
        <line className="trazo-neon-robot" x1="85" y1="36" x2="85" y2="18" />
        <circle className="relleno-neon-robot" cx="85" cy="14" r="8" />

        {/* Orejas */}
        <rect className="trazo-neon-robot" x="18" y="58" width="10" height="24" rx="5" />
        <rect className="trazo-neon-robot" x="142" y="58" width="10" height="24" rx="5" />

        {/* Cabeza */}
        <rect className="trazo-neon-robot" x="28" y="36" width="114" height="68" rx="22" />

        {/* Ojos */}
        <circle className="trazo-neon-robot" cx="62" cy="70" r="10" strokeWidth="5.5" />
        <circle className="relleno-neon-robot" cx="62" cy="70" r="4.5" />
        <circle className="trazo-neon-robot" cx="108" cy="70" r="10" strokeWidth="5.5" />
        <circle className="relleno-neon-robot" cx="108" cy="70" r="4.5" />

        {/* Sonrisa */}
        <path className="trazo-neon-robot" d="M 71 85 Q 85 96 99 85" strokeWidth="5.5" />

        {/* Cuerpo: Llaves de código { } */}
        <path
          className="trazo-neon-robot"
          d="M 64 126 C 52 126, 46 135, 46 148 C 46 158, 44 163, 31 166 C 44 169, 46 174, 46 184 C 46 197, 52 206, 64 206"
          strokeWidth="7"
        />
        <path
          className="trazo-neon-robot"
          d="M 106 126 C 118 126, 124 135, 124 148 C 124 158, 126 163, 139 166 C 126 169, 124 174, 124 184 C 124 197, 118 206, 106 206"
          strokeWidth="7"
        />
      </g>
    </svg>
  );
}
