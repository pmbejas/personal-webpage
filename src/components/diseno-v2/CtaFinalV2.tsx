"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { CONFIGURACION_CONTACTO } from "@/data/datosContacto";

/**
 * Llamado a la acción final pre-footer con emblema central resplandeciente
 * y resplandor de horizonte inferior ámbar/cobre.
 */
export const CtaFinalV2: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 relative bg-[#070606] overflow-visible text-center">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        {/* Emblema circular central resplandeciente */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute w-36 h-36 rounded-full bg-gradient-to-r from-amber-600/30 via-orange-500/25 to-amber-400/20 blur-2xl" />
          
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-neutral-800 to-neutral-950 border border-amber-500/50 flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.5)]">
            <span className="text-xl font-bold font-mono text-amber-400 tracking-tighter">PB</span>
          </div>
        </div>

        {/* Titular */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-2xl">
          ¿Listo para construir software que realmente funcione?
        </h2>

        {/* Subtítulo */}
        <p className="mt-5 text-base sm:text-lg text-neutral-400 max-w-xl leading-relaxed">
          Diseñemos y desarrollemos la solución que tu proyecto necesita. Arquitectura limpia, moderna y lista para escalar.
        </p>

        {/* Botón CTA */}
        <div className="mt-8">
          <a
            href={CONFIGURACION_CONTACTO.urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 shadow-[0_0_35px_rgba(234,88,12,0.6)] hover:shadow-[0_0_50px_rgba(234,88,12,0.9)] hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-2 group"
          >
            <span>Iniciar Conversación</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Resplandor de horizonte inferior con fundido suave 360 grados */}
      <div className="relative w-full mt-12 pointer-events-none flex flex-col items-center justify-center overflow-visible">
        <div
          className="w-full max-w-5xl h-[180px] bg-gradient-to-t from-orange-600/30 via-amber-500/15 to-transparent blur-[50px]"
          style={{
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 100%, black 20%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 100%, black 20%, transparent 80%)",
          }}
        />
        <div
          className="absolute bottom-2 w-[80%] max-w-3xl h-[60px] rounded-[100%] border-b border-amber-300/40 shadow-[0_4px_25px_rgba(245,158,11,0.4)]"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 25%, black 75%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 25%, black 75%, transparent)",
          }}
        />
      </div>
    </section>
  );
};
