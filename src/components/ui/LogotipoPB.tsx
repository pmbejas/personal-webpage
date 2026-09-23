interface PropiedadesLogotipoPB {
  className?: string;
  tamano?: number;
}

/**
 * Logotipo oficial personal de Pablo Bejas (PB).
 * Isotipo tecnológico compuesto por:
 * 1. Corona de engranaje exterior con 8 dientes que sincroniza su color con el tema activo.
 * 2. Letra B en la capa inferior de fondo.
 * 3. Letra P en la capa superior en blanco puro (#FFFFFF) pisando limpiamente a la B.
 * 4. Monograma escalado concéntricamente al 88% para un balance refinado.
 */
export function LogotipoPB({ className = "w-9 h-9", tamano = 36 }: PropiedadesLogotipoPB) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={tamano}
      height={tamano}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      role="img"
    >
      {/* 1. BASE: Engranaje exterior con el color del tema dinámico */}
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke="rgb(var(--tema-acento-claro-rgb))"
        strokeWidth="4.5"
        strokeDasharray="14 16"
        strokeLinecap="round"
        opacity="0.65"
      />
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="rgb(var(--tema-acento-claro-rgb))"
        strokeWidth="2"
        strokeOpacity="0.25"
        strokeDasharray="3 6"
      />

      {/* 2. MONOGRAMA PB (Reducido concéntricamente al 88% para máxima holgura) */}
      <g id="monograma-pb" transform="translate(50 50) scale(0.88) translate(-50 -50)">
        {/* CAPA INFERIOR: Letra B con color dinámico del tema */}
        <g id="capa-b">
          <path
            d="M 36 30 H 52 C 59 30 63 34 63 41 C 63 48 59 51 52 51 H 36"
            stroke="rgb(var(--tema-acento-claro-rgb))"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 46 51 H 55 C 62 51 66 55 66 62 C 66 69 62 72 55 72 H 36"
            stroke="rgb(var(--tema-acento-claro-rgb))"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* CAPA SUPERIOR: Letra P en blanco puro con halo de corte limpio */}
        <g id="capa-p">
          {/* Halo de separación que permite a la P pisar visualmente a la B */}
          <path
            d="M 36 26 V 74"
            stroke="#070B14"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M 36 29 H 52 C 60 29 65 34 65 41 C 65 48 60 52 52 52 H 36"
            stroke="#070B14"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Trazo blanco de la P frontal */}
          <path
            d="M 36 28 V 72"
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 36 30 H 52 C 59 30 63 34 63 41 C 63 48 59 51 52 51 H 36"
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}
