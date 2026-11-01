"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { ElementoProyecto } from "@/types/Proyecto";

export interface PropiedadesTarjetaProyecto {
  proyecto: ElementoProyecto;
  indice?: number;
}

/**
 * Tarjeta moderna y limpia para visualización de proyectos (Estilo V2).
 * Presenta captura visual con badges, metadatos, stack tecnológico y accesos directos,
 * sincronizada dinámicamente con el tema de color activo del sitio.
 */
export function TarjetaProyecto({
  proyecto,
  indice = 0,
}: PropiedadesTarjetaProyecto) {
  const traducciones = useTranslations("proyectos");

  const titulo = traducciones(`${proyecto.claveTraduccion}.titulo`);
  const descripcion = traducciones(`${proyecto.claveTraduccion}.descripcion`);
  const categoria = traducciones(`filtros.${proyecto.categoria}`);

  const tieneDemo = Boolean(proyecto.enlaceDemo && proyecto.enlaceDemo !== "#");
  const tieneRepositorio = Boolean(proyecto.enlaceRepositorio);

  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: indice * 0.08 }}
      className="group relative rounded-3xl bg-[#0c0a09]/90 border border-white/10 hover:border-[rgb(var(--tema-acento-rgb)/0.4)] transition-all duration-300 overflow-hidden flex flex-col shadow-xl hover:shadow-[0_0_30px_rgb(var(--tema-acento-rgb)/0.12)]"
    >
      {/* Contenedor de imagen con efecto zoom y gradiente oscuro */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-neutral-900">
        <Image
          src={proyecto.imagenUrl}
          alt={titulo}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-black/30" />

        {/* Insignias flotantes: año y categoría */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-black/60 backdrop-blur-md border border-white/10 text-neutral-200">
            {proyecto.anio}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[rgb(var(--tema-acento-rgb)/0.15)] backdrop-blur-md border border-[rgb(var(--tema-acento-rgb)/0.3)] text-[rgb(var(--tema-acento-claro-rgb))]">
            {categoria}
          </span>
        </div>
      </div>

      {/* Cuerpo de la tarjeta con padding en múltiplos de 4 */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
        <div>
          {/* Título del proyecto con Escala Áurea H3 (26px) */}
          <h3 className="text-xl sm:text-[26px] font-bold text-white group-hover:text-[rgb(var(--tema-acento-claro-rgb))] transition-colors leading-snug">
            {titulo}
          </h3>

          {/* Breve descripción concisa */}
          <p className="mt-3 text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {descripcion}
          </p>

          {/* Píldoras de tecnologías utilizadas */}
          <div className="flex flex-wrap gap-2 mt-5">
            {proyecto.tecnologias.map((tecnologia) => (
              <span
                key={tecnologia}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.04] text-neutral-300 border border-white/5"
              >
                {tecnologia}
              </span>
            ))}
          </div>
        </div>

        {/* Barra inferior de enlaces y acciones */}
        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
          {tieneDemo ? (
            <a
              href={proyecto.enlaceDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[rgb(var(--tema-acento-claro-rgb))] hover:underline transition-colors"
            >
              <span>{traducciones("verDemo")}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="text-xs text-neutral-500 font-mono">
              {traducciones("proyectoPrivado")}
            </span>
          )}

          {tieneRepositorio && (
            <a
              href={proyecto.enlaceRepositorio}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              title={traducciones("verCodigo")}
            >
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
