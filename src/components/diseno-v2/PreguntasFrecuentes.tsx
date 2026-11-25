"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CLAVES_COLUMNA_IZQUIERDA = ["q1", "q2", "q3", "q4", "q5"] as const;
const CLAVES_COLUMNA_DERECHA = ["q6", "q7", "q8", "q9", "q10"] as const;

type ClavePregunta =
  | (typeof CLAVES_COLUMNA_IZQUIERDA)[number]
  | (typeof CLAVES_COLUMNA_DERECHA)[number];

interface PropiedadesItemPregunta {
  clave: ClavePregunta;
  numeroOrden: number;
  estaAbierto: boolean;
  alAlternar: () => void;
  pregunta: string;
  respuesta: string;
}

/**
 * Elemento individual del acordeón FAQ con numeración discreta y foco accesible.
 */
function ItemPreguntaFrecuente({
  numeroOrden,
  estaAbierto,
  alAlternar,
  pregunta,
  respuesta,
}: PropiedadesItemPregunta) {
  return (
    <div
      className={`rounded-2xl bg-[#0c0a09]/90 border transition-colors overflow-hidden ${
        estaAbierto
          ? "border-[rgb(var(--tema-acento-rgb)/0.45)] shadow-[0_0_20px_rgb(var(--tema-acento-rgb)/0.1)]"
          : "border-white/10 hover:border-[rgb(var(--tema-acento-rgb)/0.3)]"
      }`}
    >
      <button
        type="button"
        onClick={alAlternar}
        aria-expanded={estaAbierto}
        className="w-full px-5 py-4 text-left flex items-start justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[rgb(var(--tema-acento-rgb))] cursor-pointer"
      >
        <div className="flex items-start gap-3 min-w-0">
          <span className="text-[11px] font-mono font-bold text-[rgb(var(--tema-acento-claro-rgb))] opacity-80 mt-0.5 tabular-nums shrink-0">
            {String(numeroOrden).padStart(2, "0")}
          </span>
          <span className="text-sm sm:text-[15px] font-semibold text-neutral-200 hover:text-white transition-colors leading-snug">
            {pregunta}
          </span>
        </div>
        <ChevronDown
          className={`w-4.5 h-4.5 text-[rgb(var(--tema-acento-claro-rgb))] shrink-0 mt-0.5 transition-transform duration-300 ${
            estaAbierto ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {estaAbierto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-5 pb-4 pt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-white/5 pl-11">
              {respuesta}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Acordeón de 10 preguntas frecuentes con soporte multilenguaje completo.
 * [MEJORA-VISUAL-07] Mantiene las 10 preguntas exactas distribuidas en 2 columnas independientes
 * (5 y 5 en escritorio) para evitar fatiga de scroll sin alterar la columna vecina al expandir.
 */
export function PreguntasFrecuentes() {
  const [claveAbierta, setClaveAbierta] = useState<ClavePregunta | null>("q1");
  const traducciones = useTranslations("faq");

  const alternarPregunta = (clave: ClavePregunta) => {
    setClaveAbierta((anterior) => (anterior === clave ? null : clave));
  };

  return (
    <section id="faq" className="py-12 sm:py-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Cabecera */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 mb-3">
            {traducciones("etiqueta")}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {traducciones("titulo")}
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base">
            {traducciones("descripcion")}
          </p>
        </div>

        {/* [MEJORA-VISUAL-07] Dos columnas independientes de 5 preguntas cada una (10 en total) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 items-start">
          <div className="flex flex-col gap-3">
            {CLAVES_COLUMNA_IZQUIERDA.map((clave, indice) => (
              <ItemPreguntaFrecuente
                key={clave}
                clave={clave}
                numeroOrden={indice + 1}
                estaAbierto={claveAbierta === clave}
                alAlternar={() => alternarPregunta(clave)}
                pregunta={traducciones(`${clave}.pregunta`)}
                respuesta={traducciones(`${clave}.respuesta`)}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {CLAVES_COLUMNA_DERECHA.map((clave, indice) => (
              <ItemPreguntaFrecuente
                key={clave}
                clave={clave}
                numeroOrden={indice + 6}
                estaAbierto={claveAbierta === clave}
                alAlternar={() => alternarPregunta(clave)}
                pregunta={traducciones(`${clave}.pregunta`)}
                respuesta={traducciones(`${clave}.respuesta`)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
