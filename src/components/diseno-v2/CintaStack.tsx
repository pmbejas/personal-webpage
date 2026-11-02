"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { LISTA_TECNOLOGIAS_STACK } from "@/data/datosStack";

/**
 * Cinta de Tecnologías con acentos en la paleta activa.
 */
export function CintaStack() {
  const traducciones = useTranslations("stack");

  return (
    <section id="stack" className="relative py-12 bg-[#070606] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 mb-8"
        >
          {traducciones("subtitulo")}
        </motion.p>

        {/* Grilla de 8 tecnologías: 2 por fila en móvil, 4 por fila con mayor escala en escritorio */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {LISTA_TECNOLOGIAS_STACK.map((item, indice) => {
            const Icono = item.icono;
            return (
              <motion.div
                key={item.identificador}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: indice * 0.04 }}
                className="group p-3 lg:p-5 rounded-2xl lg:rounded-3xl bg-white/[0.02] hover:bg-[rgb(var(--tema-acento-rgb)/0.08)] border border-white/5 hover:border-[rgb(var(--tema-acento-rgb)/0.4)] hover:shadow-[0_0_20px_rgba(var(--tema-acento-rgb),0.2)] transition-all duration-300 flex flex-col items-center justify-center text-center shadow-sm cursor-default hover:-translate-y-0.5"
              >
                <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white/[0.04] group-hover:bg-[rgb(var(--tema-acento-rgb)/0.2)] flex items-center justify-center mb-2 lg:mb-3.5 transition-colors">
                  <Icono className="w-4 h-4 lg:w-6 lg:h-6 text-neutral-400 group-hover:text-[rgb(var(--tema-acento-claro-rgb))] transition-colors" />
                </div>
                <span className="text-xs lg:text-base font-semibold text-neutral-300 group-hover:text-white transition-colors">
                  {item.nombre}
                </span>
                <span className="text-[10px] lg:text-xs text-neutral-400 mt-0.5 lg:mt-1 truncate max-w-full group-hover:text-neutral-300 transition-colors">
                  {traducciones(item.claveCategoria)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
