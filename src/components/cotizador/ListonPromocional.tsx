"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface PropiedadesListonPromocional {
  textoBanner: string;
  variante?: "esquinaDiagonal" | "insigniaPildora";
}

/**
 * Componente visual de Banner Cruzado (Ribbon) e insignia promocional.
 * Utiliza los tokens semánticos de alto contraste (--tema-realce-rgb) para destacar
 * campañas temporales como Lanzamiento, Black Friday o Cyber Monday.
 */
export function ListonPromocional({
  textoBanner,
  variante = "esquinaDiagonal",
}: PropiedadesListonPromocional) {
  if (!textoBanner || textoBanner.trim().length === 0) {
    return null;
  }

  if (variante === "insigniaPildora") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-realce-500/15 text-realce-300 border border-realce-500/40 shadow-[0_0_16px_rgb(var(--tema-realce-rgb)/0.25)]">
        <Sparkles className="w-3.5 h-3.5 text-realce-400 shrink-0" />
        <span>{textoBanner}</span>
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none absolute top-0 right-0 w-28 h-28 overflow-hidden z-20 rounded-tr-2xl"
      aria-label={textoBanner}
    >
      {/* Sombra de pliegue superior e inferior para efecto tridimensional de cinta */}
      <div className="absolute top-0 left-3 w-1.5 h-1.5 bg-realce-600/80" />
      <div className="absolute bottom-3 right-0 w-1.5 h-1.5 bg-realce-600/80" />

      {/* Listón diagonal rotado a 45 grados */}
      <div className="absolute top-5 -right-9 w-36 rotate-45 bg-gradient-to-r from-realce-500 via-realce-400 to-realce-500 text-black font-mono font-extrabold text-[9px] tracking-wider uppercase py-1 text-center shadow-[0_4px_14px_rgb(var(--tema-realce-rgb)/0.55)] border-y border-white/30">
        <span className="block truncate px-2 drop-shadow-[0_1px_0_rgba(255,255,255,0.35)]">
          {textoBanner}
        </span>
      </div>
    </div>
  );
}
