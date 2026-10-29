"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { servicioProyectos } from "@/services/ServicioProyectos";
import { CategoriaFiltroProyecto, ElementoProyecto } from "@/types/Proyecto";

const OPCIONES_FILTRO: { clave: CategoriaFiltroProyecto; etiqueta: string }[] = [
  { clave: "todos", etiqueta: "Todos" },
  { clave: "sistemas", etiqueta: "Sistemas & Gestión" },
  { clave: "web", etiqueta: "Web Apps" },
  { clave: "outdoor", etiqueta: "Outdoor & Mapas" },
  { clave: "ecommerce", etiqueta: "E-Commerce" },
];

/**
 * Catálogo de proyectos destacados con estilo Dark Obsidian y detalles ámbar.
 * Consume directamente la capa desacoplada ServicioProyectos.
 */
export const CatalogoProyectosV2: React.FC = () => {
  const [filtroActivo, setFiltroActivo] = useState<CategoriaFiltroProyecto>("todos");
  const todosLosProyectos = servicioProyectos.obtenerTodosSincrono();

  const proyectosFiltrados = filtroActivo === "todos"
    ? todosLosProyectos
    : todosLosProyectos.filter((p) => p.categoria === filtroActivo);

  return (
    <section id="proyectos" className="py-24 sm:py-32 relative bg-[#070606]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Cabecera */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 mb-3">
            Portafolio Real
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Proyectos que generan valor
          </h2>
          <p className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed">
            Una selección de sistemas institucionales, aplicaciones full stack y plataformas digitales en producción.
          </p>
        </div>

        {/* Barra de filtros minimalista */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {OPCIONES_FILTRO.map((filtro) => {
            const estaActivo = filtroActivo === filtro.clave;
            return (
              <button
                key={filtro.clave}
                onClick={() => setFiltroActivo(filtro.clave)}
                type="button"
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  estaActivo
                    ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]"
                    : "bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-white/5"
                }`}
              >
                {filtro.etiqueta}
              </button>
            );
          })}
        </div>

        {/* Grilla de proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {proyectosFiltrados.map((proyecto: ElementoProyecto) => (
            <div
              key={proyecto.identificador}
              className="group relative rounded-3xl bg-[#0c0a09]/90 border border-white/10 hover:border-amber-500/40 transition-all duration-300 overflow-hidden flex flex-col shadow-xl"
            >
              {/* Imagen de vista previa con overlay */}
              <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-neutral-900">
                <Image
                  src={proyecto.imagenUrl}
                  alt={proyecto.identificador}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-black/30" />
                
                {/* Badge de año / categoría */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-black/60 backdrop-blur-md border border-white/10 text-neutral-200">
                    {proyecto.anio}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300">
                    {proyecto.categoria}
                  </span>
                </div>
              </div>

              {/* Información del proyecto */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {proyecto.identificador
                      .replace("proyecto-", "")
                      .split("-")
                      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
                      .join(" ")}
                  </h3>

                  {/* Etiquetas de tecnologías */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {proyecto.tecnologias.map((tec) => (
                      <span
                        key={tec}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/[0.04] text-neutral-300 border border-white/5"
                      >
                        {tec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Enlaces y acciones */}
                <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                  {proyecto.enlaceDemo && proyecto.enlaceDemo !== "#" ? (
                    <a
                      href={proyecto.enlaceDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <span>Ver Demo Online</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-neutral-500 font-mono">Implementación Privada</span>
                  )}

                  {proyecto.enlaceRepositorio && (
                    <a
                      href={proyecto.enlaceRepositorio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                      title="Ver repositorio"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
