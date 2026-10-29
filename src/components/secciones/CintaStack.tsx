"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { LISTA_TECNOLOGIAS_STACK } from "@/data/datosStack";

/**
 * Cinta interactiva de tecnologías y herramientas principales.
 * Renderiza tarjetas compactas con microinteracciones sensibles al tema activo.
 */
export function CintaStack() {
  const traducciones = useTranslations("stack");

  return (
    <section className="relative py-8 md:py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtítulo superior de la cinta */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-xs font-mono uppercase tracking-[0.25em] text-slate-400 mb-6"
        >
          {traducciones("subtitulo")}
        </motion.p>

        {/* Cuadrícula responsiva de 8 tecnologías */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {LISTA_TECNOLOGIAS_STACK.map((item, indice) => {
            const Icono = item.icono;
            return (
              <motion.div
                key={item.identificador}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: indice * 0.05 }}
                className="group p-3 rounded-2xl bg-slate-900/50 hover:bg-[rgb(var(--tema-acento-rgb)/0.08)] border border-slate-800/80 hover:border-[rgb(var(--tema-acento-rgb)/0.4)] transition-all duration-300 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-[0_0_20px_rgb(var(--tema-acento-rgb)/0.15)] hover:-translate-y-0.5 cursor-default"
              >
                {/* Contenedor del ícono */}
                <div className="w-8 h-8 rounded-xl bg-slate-800/70 group-hover:bg-[rgb(var(--tema-acento-rgb)/0.2)] flex items-center justify-center mb-2 transition-colors">
                  <Icono className="w-4 h-4 text-slate-400 group-hover:text-[rgb(var(--tema-acento-claro-rgb))] transition-colors" />
                </div>

                {/* Título de la tecnología */}
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {item.nombre}
                </span>

                {/* Categoría / subtítulo traducido */}
                <span className="text-[10px] text-slate-400 mt-0.5 truncate max-w-full group-hover:text-slate-300">
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
