"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Code2, Database } from "lucide-react";
import { CuboCodigo } from "@/components/animacion/CuboCodigo";

/**
 * Sección Hero adaptada a la columna de contenido de la nueva Versión 2.
 * Integra la tipografía expansiva, el Cubo de Código 3D interactivo y métricas destacadas.
 */
export function HeroContenidoV2() {
  const traduccionesHero = useTranslations("hero");
  const traduccionesSobreMi = useTranslations("sobreMi");

  return (
    <section id="inicio" className="relative pt-6 sm:pt-10 pb-16 overflow-hidden">
      {/* Resplandor ambiental superior */}
      <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="flex flex-col gap-8">
        {/* Cabecera de impacto con tipografía masiva */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start"
        >
          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium text-[rgb(var(--tema-acento-claro-rgb))] bg-[rgb(var(--tema-acento-rgb)/0.1)] border border-[rgb(var(--tema-acento-rgb)/0.25)] mb-4 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[rgb(var(--tema-acento-claro-rgb))] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[rgb(var(--tema-acento-rgb))]" />
            </span>
            <span>Software Architecture & Full Stack</span>
          </div>

          {/* Título Principal estilo Mojunsh con cápsulas refinadas y tipografía moderada */}
          <h1 className="fuente-titular text-2xl sm:text-4xl xl:text-[3.25rem] font-normal text-white tracking-tight leading-[1.22]">
            Construyo{" "}
            <span className="inline-block bg-[rgb(var(--tema-acento-rgb))] text-black px-3.5 py-0.5 rounded-full font-medium align-middle shadow-[0_0_20px_rgba(var(--tema-acento-rgb),0.35)] my-0.5">
              sistemas web
            </span>
            <br className="hidden sm:inline" />
            {" "}&{" "}
            <span className="inline-block bg-white/10 text-[rgb(var(--tema-acento-claro-rgb))] px-3.5 py-0.5 rounded-full font-medium align-middle border border-white/15 my-5">
              arquitecturas
            </span>{" "}
            escalables
          </h1>

          <p className="mt-4 text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
            Especializado en servicios backend en <strong className="text-white">.NET 9 (C#)</strong> con Clean Architecture, interfaces reactivas en <strong className="text-white">Next.js 15</strong> y bases de datos relacionales en <strong className="text-white">PostgreSQL</strong>.
          </p>
        </motion.div>

        {/* Zona del Cubo 3D Interactivo y Métricas (integrada al fondo continuo del hero) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative py-4 sm:py-10 mt-3 sm:mt-5">
          {/* Halo sutil de fondo del cubo */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-[rgb(var(--tema-acento-rgb)/0.12)] blur-2xl pointer-events-none" />

          {/* Cubo 3D en columna izquierda/centro */}
          <div className="md:col-span-7 flex flex-col items-center justify-center">
            <div className="scale-90 sm:scale-100 origin-center">
              <CuboCodigo />
            </div>
            <p className="mt-3 text-[11px] font-mono text-neutral-400 flex items-center gap-1.5 uppercase tracking-widest text-center">
              <Sparkles className="w-3.5 h-3.5 text-[rgb(var(--tema-acento-claro-rgb))]" />
              <span>Arrastra con el mouse para rotar el cubo libremente</span>
            </p>
          </div>

          {/* Métricas destacadas en columna derecha */}
          <div className="md:col-span-5 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono block">
                7+
              </span>
              <span className="text-xs text-neutral-400 tracking-wider uppercase mt-1 block">
                {traduccionesSobreMi("aniosExperiencia")}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-3xl sm:text-4xl font-extrabold text-[rgb(var(--tema-acento-claro-rgb))] font-mono block">
                50+
              </span>
              <span className="text-xs text-neutral-400 tracking-wider uppercase mt-1 block">
                {traduccionesSobreMi("proyectosCompletados")}
              </span>
            </div>

            <a
              href="#proyectos"
              className="inline-flex items-center justify-between px-5 py-3 rounded-2xl text-xs font-semibold bg-[rgb(var(--tema-acento-rgb))] text-black shadow-[0_0_20px_rgba(var(--tema-acento-rgb),0.35)] hover:shadow-[0_0_25px_rgba(var(--tema-acento-rgb),0.55)] hover:scale-[1.02] active:scale-95 transition-all group"
            >
              <span>{traduccionesHero("verProyectos")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
