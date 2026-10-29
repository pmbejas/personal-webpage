"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Sparkles } from "lucide-react";
import { CONFIGURACION_CONTACTO } from "@/data/datosContacto";

/**
 * Hero principal con el resplandor de horizonte curvado (Sunburst Horizon Glow).
 * Diseñado exactamente con la atmósfera cálida obsidiana & ámbar de la referencia.
 */
export const HeroV2: React.FC = () => {
  return (
    <section id="inicio" className="relative pt-32 sm:pt-40 pb-20 overflow-hidden text-center">
      {/* Contenedor central de contenido */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        {/* Chip / Badge superior con halo brillante */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)] mb-8 hover:border-amber-400/50 transition-all cursor-default"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Disponible para desarrollo de software & arquitectura web</span>
          <ArrowRight className="w-3 h-3 text-amber-400" />
        </motion.div>

        {/* Titular Principal de Alto Impacto */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl"
        >
          Arquitectura robusta.{" "}
          <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-amber-200 to-amber-500">
            Software que escala.
          </span>
        </motion.h1>

        {/* Bajada descriptiva */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-base sm:text-lg text-neutral-400 max-w-2xl leading-relaxed font-normal"
        >
          Desarrollo aplicaciones de misión crítica y plataformas web de alto rendimiento.
          Especialista en <strong className="text-neutral-200 font-medium">.NET 9 (C#)</strong>,{" "}
          <strong className="text-neutral-200 font-medium">Next.js 15</strong>, PostgreSQL y código limpio orientado a resultados de negocio.
        </motion.p>

        {/* Botones de acción doble */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <a
            href={CONFIGURACION_CONTACTO.urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 shadow-[0_0_30px_rgba(234,88,12,0.55)] hover:shadow-[0_0_45px_rgba(234,88,12,0.85)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 group"
          >
            <span>Iniciar Proyecto</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#proyectos"
            className="px-6 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-semibold text-neutral-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <Code2 className="w-4 h-4 text-amber-400" />
            <span>Ver Proyectos</span>
          </a>
        </motion.div>
      </div>

      {/* RESPLANDOR DE HORIZONTE ORGÁNICO Y FUNDIDO (SIN BORDES CUADRADOS) */}
      <div className="relative w-full mt-12 sm:mt-16 pointer-events-none flex flex-col items-center justify-center overflow-visible">
        {/* Capa de luz difusa ambiental que se desvanece suavemente 360 grados */}
        <div
          className="w-full max-w-6xl h-[260px] sm:h-[360px] bg-gradient-to-t from-orange-600/35 via-amber-500/20 to-transparent blur-[60px] sm:blur-[90px]"
          style={{
            maskImage: "radial-gradient(ellipse 85% 65% at 50% 90%, black 25%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 85% 65% at 50% 90%, black 25%, transparent 75%)",
          }}
        />

        {/* Núcleo curvado de alta luminosidad */}
        <div
          className="absolute bottom-2 w-[120%] sm:w-[100%] max-w-5xl h-[160px] sm:h-[220px] rounded-[100%] bg-gradient-to-t from-orange-500/50 via-amber-400/30 to-transparent blur-[25px] sm:blur-[40px]"
          style={{
            maskImage: "radial-gradient(ellipse 75% 55% at 50% 95%, black 20%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 75% 55% at 50% 95%, black 20%, transparent 75%)",
          }}
        />

        {/* Arco sutil de horizonte curvado con desvanecimiento lateral progresivo */}
        <div
          className="absolute bottom-4 w-[90%] sm:w-[80%] max-w-4xl h-[80px] sm:h-[110px] rounded-[100%] border-b border-amber-300/60 shadow-[0_4px_30px_rgba(245,158,11,0.6)]"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
          }}
        />
      </div>
    </section>
  );
};
