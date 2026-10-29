"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Download, Award, Briefcase, CheckCircle2, Globe2 } from "lucide-react";
import { RetratoSobreMi } from "@/components/secciones/RetratoSobreMi";

/**
 * Sección Sobre Mí estilizada para la Versión 3 con estética azul eléctrico.
 * Presenta el retrato personal en el encuadre HUD y las métricas de confianza sobre Dark Obsidian.
 */
export function SobreMiV3() {
  const traducciones = useTranslations("sobreMi");

  const metricasDestacadas = [
    {
      texto: traducciones("aniosExperiencia"),
      icono: <Award className="h-5 w-5 text-sky-400" />,
    },
    {
      texto: traducciones("disponibleFreelance"),
      icono: <Briefcase className="h-5 w-5 text-sky-400" />,
    },
    {
      texto: traducciones("proyectosCompletados"),
      icono: <CheckCircle2 className="h-5 w-5 text-sky-400" />,
    },
    {
      texto: traducciones("clientesGlobales"),
      icono: <Globe2 className="h-5 w-5 text-sky-400" />,
    },
  ];

  return (
    <section id="sobre-mi" className="py-20 md:py-28 relative bg-[#070606] overflow-hidden">
      {/* Resplandor ambiental azul sutil */}
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Columna Izquierda: Retrato fotográfico con HUD futurista */}
          <div className="lg:col-span-5 flex justify-center">
            <RetratoSobreMi />
          </div>

          {/* Columna Derecha: Biografía personal y métricas */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Tag / Etiqueta */}
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 mb-3">
              {traducciones("etiqueta")}
            </span>

            {/* Título de la sección */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {traducciones("titulo")}
            </h2>

            {/* Descripción */}
            <p className="mt-6 text-base text-neutral-300 leading-relaxed max-w-2xl">
              {traducciones("descripcion")}
            </p>

            {/* Cuadrícula de 4 Métricas de confianza */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 w-full">
              {metricasDestacadas.map((metrica, indice) => (
                <div
                  key={indice}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0c0a09]/90 border border-white/10 hover:border-sky-500/40 hover:shadow-[0_0_20px_rgba(14,165,233,0.15)] transition-all"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20 flex-shrink-0">
                    {metrica.icono}
                  </div>
                  <span className="text-sm font-semibold text-neutral-200">
                    {metrica.texto}
                  </span>
                </div>
              ))}
            </div>

            {/* Botón Descargar CV */}
            <div className="mt-8">
              <a
                href="/cv-pablo-bejas.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-white/[0.04] text-neutral-200 hover:text-white border border-white/10 hover:border-sky-500/40 hover:bg-white/[0.08] transition-all"
              >
                <Download className="h-4 w-4 text-sky-400" />
                <span>{traducciones("descargarCv")}</span>
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
