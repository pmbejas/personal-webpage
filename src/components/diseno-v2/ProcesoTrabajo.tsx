"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle2, Compass, Rocket, Search } from "lucide-react";

interface ElementoConfigPaso {
  clave: "paso1" | "paso2" | "paso3";
  icono: React.ElementType;
}

const PASOS_CONFIG: ElementoConfigPaso[] = [
  { clave: "paso1", icono: Search },
  { clave: "paso2", icono: Compass },
  { clave: "paso3", icono: Rocket },
];

/**
 * Sección de proceso y metodología ágil de 3 pasos.
 * [MEJORA-VISUAL-01] Glows y bordes 100% reactivos al tema cromático activo.
 * [MEJORA-VISUAL-04] Conector horizontal timeline y entregables concretos en lugar de cajas vacías.
 */
export function ProcesoTrabajo() {
  const traducciones = useTranslations("proceso");

  return (
    <section id="proceso" className="py-12 sm:py-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Cabecera */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 mb-3"
          >
            {traducciones("etiqueta")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight"
          >
            {traducciones("titulo")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed"
          >
            {traducciones("descripcion")}
          </motion.p>
        </div>

        {/* [MEJORA-VISUAL-04] Flujo horizontal conectado con entregables concretos */}
        <div className="relative">
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-11 left-[16%] right-[16%] h-[1px] bg-gradient-to-r from-[rgb(var(--tema-acento-rgb)/0.15)] via-[rgb(var(--tema-acento-claro-rgb)/0.55)] to-[rgb(var(--tema-acento-rgb)/0.15)] pointer-events-none"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {PASOS_CONFIG.map((paso, indice) => {
              const Icono = paso.icono;
              const numero = traducciones(`${paso.clave}.numero`);
              const titulo = traducciones(`${paso.clave}.titulo`);
              const descripcion = traducciones(`${paso.clave}.descripcion`);
              const entregables = traducciones.raw(
                `${paso.clave}.entregables`
              ) as string[];

              return (
                <motion.div
                  key={paso.clave}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: indice * 0.1 }}
                  className="relative p-6 sm:p-7 rounded-3xl bg-[#0c0a09]/90 border border-white/10 hover:border-[rgb(var(--tema-acento-rgb)/0.45)] hover:shadow-[0_0_25px_rgb(var(--tema-acento-rgb)/0.16)] transition-all duration-300 flex flex-col justify-between gap-6 group shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <span className="text-xs font-mono font-bold text-[rgb(var(--tema-acento-claro-rgb))] bg-[rgb(var(--tema-acento-rgb)/0.12)] px-3 py-1 rounded-full border border-[rgb(var(--tema-acento-rgb)/0.3)]">
                        {traducciones("paso")} {numero}
                      </span>

                      <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-neutral-800 to-neutral-950 border border-[rgb(var(--tema-acento-rgb)/0.4)] flex items-center justify-center shadow-[0_0_18px_rgb(var(--tema-acento-rgb)/0.25)] group-hover:border-[rgb(var(--tema-acento-claro-rgb))] transition-colors">
                        <Icono className="w-4.5 h-4.5 text-[rgb(var(--tema-acento-claro-rgb))]" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">
                      {titulo}
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      {descripcion}
                    </p>
                  </div>

                  {/* Lista compacta de entregables de la etapa */}
                  <ul className="pt-4 border-t border-white/10 flex flex-col gap-2">
                    {entregables.map((entregable) => (
                      <li
                        key={entregable}
                        className="flex items-center gap-2 text-xs text-neutral-300"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[rgb(var(--tema-acento-claro-rgb))] shrink-0" />
                        <span>{entregable}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
