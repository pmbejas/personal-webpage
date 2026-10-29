"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ElementoPregunta {
  pregunta: string;
  respuesta: string;
}

const LISTA_PREGUNTAS: ElementoPregunta[] = [
  {
    pregunta: "¿Qué tecnologías utilizas para el desarrollo Full Stack?",
    respuesta:
      "Me especializo en el ecosistema Microsoft .NET (C#, ASP.NET Core Web API, EF Core, Dapper) para arquitecturas backend robustas y de alto rendimiento, complementado con Next.js 15, TypeScript y Tailwind CSS en el frontend para interfaces modernas, ultrarrápidas y optimizadas para SEO.",
  },
  {
    pregunta: "¿Cómo es el flujo de trabajo y la comunicación durante el proyecto?",
    respuesta:
      "Trabajo bajo metodologías ágiles con sprints bien definidos. Mantendremos reuniones periódicas de avance, demos funcionales en entornos de staging y acceso directo a un repositorio de código o tablero para que tengas visibilidad total en cada etapa.",
  },
  {
    pregunta: "¿El software entregado cuenta con buenas prácticas y pruebas?",
    respuesta:
      "Absolutamente. Todo el código sigue principios SOLID, Clean Architecture y separación estricta en capas (Repository, Service, Controller). Incluyo pruebas en los puntos críticos y documentación técnica clara para facilitar su escalabilidad.",
  },
  {
    pregunta: "¿Qué modalidades de contratación ofreces?",
    respuesta:
      "Ofrezco colaboración tanto por proyecto cerrado (con alcance, hitos y entregables detallados desde el inicio) como por asignación de horas o sprints para desarrollo evolutivo y consultoría técnica de arquitectura.",
  },
];

/**
 * Acordeón de preguntas frecuentes.
 */
export function PreguntasFrecuentes() {
  const [indiceAbierto, setIndiceAbierto] = useState<number | null>(0);

  const alternarPregunta = (indice: number) => {
    setIndiceAbierto(indiceAbierto === indice ? null : indice);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 relative bg-[#070606] overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Cabecera */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 mb-3">
            Preguntas Frecuentes
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Respuestas directas y claras
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base">
            Todo lo que necesitas saber antes de dar inicio a nuestro próximo desarrollo.
          </p>
        </div>

        {/* Lista de preguntas */}
        <div className="flex flex-col gap-3">
          {LISTA_PREGUNTAS.map((item, index) => {
            const estaAbierto = indiceAbierto === index;
            return (
              <div
                key={item.pregunta}
                className="rounded-2xl bg-[#0c0a09]/90 border border-white/10 hover:border-sky-500/30 transition-colors overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => alternarPregunta(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-semibold text-neutral-200 hover:text-white transition-colors">
                    {item.pregunta}
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
                        {item.respuesta}
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
