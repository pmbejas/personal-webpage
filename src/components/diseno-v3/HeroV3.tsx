"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Download, Sparkles } from "lucide-react";
import { CuboCodigo } from "@/components/animacion/CuboCodigo";

/**
 * Hero híbrido cinemático: combina la tipografía masiva y horizonte resplandeciente
 * de la V2 en azul eléctrico con el Cubo de Código 3D interactivo y botones directos.
 */
export function HeroV3() {
  const traduccionesHero = useTranslations("hero");
  const traduccionesSobreMi = useTranslations("sobreMi");

  return (
    <section
      id="inicio"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#070606]"
    >
      {/* 1. Halo de horizonte curvado resplandeciente en la parte superior (Azul Neón) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[340px] rounded-[100%] bg-gradient-to-b from-blue-600/20 via-sky-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Línea de horizonte curvada */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[1px] bg-gradient-to-r from-transparent via-sky-400/40 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Columna Izquierda: Mensaje y llamada a la acción */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Badge de disponibilidad */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium text-sky-300 bg-sky-500/10 border border-sky-500/25 mb-6 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
              </span>
              <span>{traduccionesHero("saludo")} Pablo Bejas — {traduccionesHero("rol")}</span>
            </div>

            {/* Título Principal Cinemático */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
              Arquitectura & Ingeniería Web
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-white mt-2">
                de Alto Rendimiento
              </span>
            </h1>

            {/* Descripción técnica de valor */}
            <p className="mt-6 text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed">
              Desarrollo de servicios escalables en <strong className="text-white font-semibold">.NET 9 (C#)</strong>, interfaces web fluidas en <strong className="text-white font-semibold">Next.js 15</strong> y bases de datos en <strong className="text-white font-semibold">PostgreSQL</strong> con Clean Architecture, alto rendimiento y diseño de impacto.
            </p>

            {/* Grupo de botones de acción en azul */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="#proyectos"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white shadow-[0_0_25px_rgba(14,165,233,0.4)] hover:shadow-[0_0_35px_rgba(14,165,233,0.6)] hover:scale-105 active:scale-95 transition-all"
              >
                <span>{traduccionesHero("verProyectos")}</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#contacto"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-white/[0.04] text-neutral-200 hover:text-white border border-white/10 hover:border-sky-500/40 hover:bg-white/[0.08] transition-all"
              >
                <Mail className="h-4 w-4 text-sky-400" />
                <span>{traduccionesHero("contactarme")}</span>
              </a>

              <a
                href="/cv-pablo-bejas.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold bg-transparent text-neutral-400 hover:text-neutral-200 border border-transparent hover:border-white/10 transition-all"
              >
                <Download className="h-4 w-4" />
                <span>{traduccionesSobreMi("descargarCv")}</span>
              </a>
            </div>
          </motion.div>

          {/* Columna Derecha: Cubo de Código 3D interactivo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="lg:col-span-5 flex flex-col items-center justify-center relative zona-cubo"
          >
            {/* Halo de luz azul detrás del cubo */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-blue-600/20 via-sky-500/10 to-transparent blur-3xl pointer-events-none" />

            {/* El cubo 3D interactivo */}
            <div className="relative z-10 flex items-center justify-center">
              <CuboCodigo />
            </div>

            <p className="mt-4 text-[11px] font-mono text-neutral-400 flex items-center gap-1.5 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Arrastra con el mouse para rotar el cubo libremente</span>
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
