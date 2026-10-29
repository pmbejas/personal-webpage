"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { LISTA_TECNOLOGIAS_STACK } from "@/data/datosStack";

/**
 * Cinta de Tecnologías optimizada para la Versión 3 con acentos en azul eléctrico.
 */
export function CintaStackV3() {
  const traducciones = useTranslations("stack");

  return (
    <section className="relative py-12 bg-[#070606] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 mb-8"
        >
          {traducciones("subtitulo")}
        </motion.p>

        {/* Grilla de 8 tecnologías */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {LISTA_TECNOLOGIAS_STACK.map((item, indice) => {
            const Icono = item.icono;
            return (
              <motion.div
                key={item.identificador}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: indice * 0.04 }}
                className="group p-3 rounded-2xl bg-white/[0.02] hover:bg-blue-500/[0.08] border border-white/5 hover:border-blue-500/40 hover:shadow-[0_0_15px_rgba(14,165,233,0.2)] transition-all duration-300 flex flex-col items-center justify-center text-center shadow-sm cursor-default hover:-translate-y-0.5"
              >
                <div className="w-8 h-8 rounded-xl bg-white/[0.04] group-hover:bg-blue-500/20 flex items-center justify-center mb-2 transition-colors">
                  <Icono className="w-4 h-4 text-neutral-400 group-hover:text-sky-400 transition-colors" />
                </div>
                <span className="text-xs font-semibold text-neutral-300 group-hover:text-white transition-colors">
                  {item.nombre}
                </span>
                <span className="text-[10px] text-neutral-400 mt-0.5 truncate max-w-full">
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
