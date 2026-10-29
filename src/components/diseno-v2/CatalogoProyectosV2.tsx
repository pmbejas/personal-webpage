"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CategoriaFiltroProyecto } from "@/types/Proyecto";
import { servicioProyectos } from "@/services/ServicioProyectos";
import { TarjetaProyecto } from "@/components/proyectos/TarjetaProyecto";

const OPCIONES_FILTRO: { clave: CategoriaFiltroProyecto; etiqueta: string }[] = [
  { clave: "todos", etiqueta: "Todos" },
  { clave: "sistemas", etiqueta: "Sistemas & Gestión" },
  { clave: "web", etiqueta: "Web Apps" },
  { clave: "outdoor", etiqueta: "Outdoor & Mapas" },
  { clave: "ecommerce", etiqueta: "E-Commerce" },
];

/**
 * Catálogo de proyectos destacados con cuadrícula moderna de TarjetaProyecto
 * y filtros dinámicos.
 */
export function CatalogoProyectosV2() {
  const [filtroActivo, setFiltroActivo] = useState<CategoriaFiltroProyecto>("todos");
  const traducciones = useTranslations("proyectos");

  const todosLosProyectos = useMemo(
    () => servicioProyectos.obtenerTodosSincrono(),
    []
  );

  const proyectosFiltrados = useMemo(() => {
    if (filtroActivo === "todos") return todosLosProyectos;
    return todosLosProyectos.filter((p) => p.categoria === filtroActivo);
  }, [filtroActivo, todosLosProyectos]);

  return (
    <section id="proyectos" className="py-24 sm:py-32 relative bg-[#070606] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Cabecera */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 mb-3"
          >
            Portafolio Real
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight"
          >
            Proyectos que generan valor
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed"
          >
            {traducciones("subtituloCatalogo")}
          </motion.p>
        </div>

        {/* Barra de filtros minimalista en azul */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {OPCIONES_FILTRO.map((filtro) => {
            const estaActivo = filtroActivo === filtro.clave;
            return (
              <button
                key={filtro.clave}
                onClick={() => setFiltroActivo(filtro.clave)}
                type="button"
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  estaActivo
                    ? "bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]"
                    : "bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-white/5"
                }`}
              >
                {filtro.etiqueta}
              </button>
            );
          })}
        </div>

        {/* Grilla de proyectos limpios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {proyectosFiltrados.map((proyecto, indice) => (
            <TarjetaProyecto
              key={proyecto.identificador}
              proyecto={proyecto}
              indice={indice}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
