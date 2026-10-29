"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Compass, Rocket } from "lucide-react";

interface PasoMetodologia {
  numero: string;
  titulo: string;
  descripcion: string;
  icono: React.ElementType;
}

const PASOS_PROCESO: PasoMetodologia[] = [
  {
    numero: "01",
    titulo: "Visión & Arquitectura",
    descripcion:
      "Relevamos en detalle las metas de tu negocio, los requerimientos técnicos y definimos la arquitectura óptima (.NET 9, Next.js, PostgreSQL) sin ambigüedades.",
    icono: Search,
  },
  {
    numero: "02",
    titulo: "Desarrollo Ágil & Testing",
    descripcion:
      "Construyo la solución paso a paso aplicando Clean Architecture, código limpio, APIs seguras y componentes visuales reactivos con entregas periódicas.",
    icono: Compass,
  },
  {
    numero: "03",
    titulo: "Despliegue & Escalado",
    descripcion:
      "Pruebas de calidad automatizadas, pipelines de CI/CD en contenedores Docker y puesta en marcha en la nube con monitoreo para máxima estabilidad.",
    icono: Rocket,
  },
];

/**
 * Sección de proceso y metodología ágil de 3 pasos.
 */
export function ProcesoTrabajo() {
  return (
    <section id="proceso" className="py-24 sm:py-32 relative bg-[#070606] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Cabecera */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 mb-3"
          >
            Metodología Ágil
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight"
          >
            Proceso claro, rápido y seguro
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed"
          >
            Sin demoras innecesarias ni desvíos. Un flujo de trabajo probado que lleva tu proyecto de la idea a producción.
          </motion.p>
        </div>

        {/* Tarjetas de proceso */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PASOS_PROCESO.map((paso, indice) => {
            const Icono = paso.icono;
            return (
              <motion.div
                key={paso.numero}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: indice * 0.1 }}
                className="relative p-7 sm:p-8 rounded-3xl bg-[#0c0a09]/90 border border-white/10 hover:border-sky-500/40 hover:shadow-[0_0_25px_rgba(14,165,233,0.15)] transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
                      PASO {paso.numero}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{paso.titulo}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{paso.descripcion}</p>
                </div>

                {/* Ilustración de cápsula metálica inferior */}
                <div className="mt-8 relative h-36 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-center overflow-hidden">
                  <div className="absolute w-24 h-24 rounded-full bg-sky-500/15 blur-xl group-hover:scale-125 transition-transform duration-500" />
                  
                  <div className="relative w-14 h-14 rounded-full bg-gradient-to-b from-neutral-800 to-neutral-950 border border-sky-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.3)] group-hover:border-sky-400 transition-colors">
                    <Icono className="w-6 h-6 text-sky-400" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
