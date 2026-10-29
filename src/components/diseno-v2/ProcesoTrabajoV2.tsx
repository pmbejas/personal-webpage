"use client";

import React from "react";
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
    titulo: "Visión & Alcance",
    descripcion: "Relevamos en detalle las metas de tu negocio, los requerimientos técnicos y definimos la arquitectura óptima sin ambigüedades.",
    icono: Search,
  },
  {
    numero: "02",
    titulo: "Arquitectura & Desarrollo",
    descripcion: "Construyo la solución paso a paso con código limpio, APIs seguras y componentes visuales reactivos con revisiones periódicas.",
    icono: Compass,
  },
  {
    numero: "03",
    titulo: "Despliegue & Producción",
    descripcion: "Pruebas de calidad automatizadas, configuración de pipelines CI/CD y puesta en marcha en la nube para un lanzamiento impecable.",
    icono: Rocket,
  },
];

/**
 * Sección de proceso en 3 pasos con cápsulas metálicas y halos cálidos.
 * Inspirada directamente en "The Process Fast, Clear, Done".
 */
export const ProcesoTrabajoV2: React.FC = () => {
  return (
    <section id="proceso" className="py-24 sm:py-32 relative bg-[#070606]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Cabecera */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 mb-3">
            Metodología Ágil
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Proceso claro, rápido y seguro
          </h2>
          <p className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed">
            Sin demoras innecesarias ni desvíos. Un flujo de trabajo probado que lleva tu proyecto de la idea a producción.
          </p>
        </div>

        {/* Tarjetas de proceso */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PASOS_PROCESO.map((paso) => {
            const Icono = paso.icono;
            return (
              <div
                key={paso.numero}
                className="relative p-7 rounded-3xl bg-[#0c0a09]/90 border border-white/10 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      PASO {paso.numero}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{paso.titulo}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{paso.descripcion}</p>
                </div>

                {/* Ilustración de cápsula metálica inferior */}
                <div className="mt-8 relative h-36 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-center overflow-hidden">
                  <div className="absolute w-24 h-24 rounded-full bg-amber-500/15 blur-xl group-hover:scale-125 transition-transform duration-500" />
                  
                  <div className="relative w-14 h-14 rounded-full bg-gradient-to-b from-neutral-800 to-neutral-950 border border-amber-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:border-amber-400 transition-colors">
                    <Icono className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
