"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CLAVES_PREGUNTAS = [
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "q10",
] as const;

/**
 * Acordeón de preguntas frecuentes con soporte multilenguaje completo.
 */
export function PreguntasFrecuentes() {
  const [indiceAbierto, setIndiceAbierto] = useState<number | null>(0);
  const traducciones = useTranslations("faq");

  const alternarPregunta = (indice: number) => {
    setIndiceAbierto(indiceAbierto === indice ? null : indice);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 relative bg-[#070606] overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Cabecera */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 mb-3">
            {traducciones("etiqueta")}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {traducciones("titulo")}
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base">
            {traducciones("descripcion")}
          </p>
        </div>

        {/* Lista de preguntas */}
        <div className="flex flex-col gap-3">
          {CLAVES_PREGUNTAS.map((clave, index) => {
            const estaAbierto = indiceAbierto === index;
            const pregunta = traducciones(`${clave}.pregunta`);
            const respuesta = traducciones(`${clave}.respuesta`);

            return (
              <div
                key={clave}
                className="rounded-2xl bg-[#0c0a09]/90 border border-white/10 hover:border-sky-500/30 transition-colors overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => alternarPregunta(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-semibold text-neutral-200 hover:text-white transition-colors">
                    {pregunta}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-sky-400 shrink-0 transition-transform duration-300 ${
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
                      <div className="px-6 pb-5 pt-1 text-sm text-neutral-400 leading-relaxed border-t border-white/5">
                        {respuesta}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
