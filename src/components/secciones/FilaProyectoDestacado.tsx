"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { Boton } from "@/components/ui/Boton";
import { ElementoProyecto } from "@/types/Proyecto";

export interface PropiedadesFilaProyectoDestacado {
  proyecto: ElementoProyecto;
  /* Posición de la fila: las filas impares alternan el orden de las columnas */
  indice: number;
}

/**
 * Fila destacada de proyecto (estilo showcase): información a un lado con
 * título display, cita, stack en píldoras y capacidades; captura con tarjeta
 * flotante de impacto al otro lado. Las filas alternan su orientación.
 */
export function FilaProyectoDestacado({
  proyecto,
  indice,
}: PropiedadesFilaProyectoDestacado) {
  const traducciones = useTranslations("proyectos");

  const titulo = traducciones(`${proyecto.claveTraduccion}.titulo`);
  const descripcion = traducciones(`${proyecto.claveTraduccion}.descripcion`);
  const impacto = traducciones(`${proyecto.claveTraduccion}.impacto`);
  const datosCapacidades = traducciones.raw(
    `${proyecto.claveTraduccion}.capacidades`
  );
  const capacidades = Array.isArray(datosCapacidades)
    ? (datosCapacidades as string[])
    : [];
  const categoria = traducciones(`filtros.${proyecto.categoria}`);

  const columnasInvertidas = indice % 2 === 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-14 items-center"
    >
      {/* 1. Encabezado visible exclusivamente en dispositivos móviles */}
      <div className="w-full block lg:hidden">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
          {categoria}
        </span>
        <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold italic tracking-tight text-white leading-tight">
          {titulo}
        </h3>
      </div>

      {/* 2. Columna visual: captura + tarjeta flotante de impacto (en móvil va inmediatamente tras el título) */}
      <div
        className={`relative w-full ${
          columnasInvertidas ? "lg:order-1" : "lg:order-2"
        }`}
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40">
          <Image
            src={proyecto.imagenUrl}
            alt={`Captura del proyecto ${titulo}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/50 to-transparent" />
        </div>

        {/* Tarjeta flotante de impacto sobre la captura */}
        <div className="absolute -bottom-6 right-4 lg:-right-6 max-w-[240px] rounded-2xl border border-slate-700/70 bg-slate-900/85 backdrop-blur-md px-5 py-4 shadow-xl shadow-black/40">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
            {traducciones("etiquetaImpacto")}
          </span>
          <p className="mt-1 text-sm font-bold text-white leading-snug">
            {impacto}
          </p>
        </div>
      </div>

      {/* 3. Columna de información y detalles */}
      <div
        className={`w-full ${
          columnasInvertidas ? "lg:order-2" : "lg:order-1"
        }`}
      >
        {/* Encabezado visible únicamente en pantallas de escritorio */}
        <div className="hidden lg:block">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
            {categoria}
          </span>
          <h3 className="mt-3 text-3xl sm:text-4xl font-extrabold italic tracking-tight text-white leading-tight">
            {titulo}
          </h3>
        </div>

        {/* Descripción como cita destacada */}
        <blockquote className="mt-5 border-l-2 border-blue-500/70 pl-4 text-slate-300 italic leading-relaxed">
          &ldquo;{descripcion}&rdquo;
        </blockquote>

        {/* Sub-grilla: stack tecnológico + capacidades */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              {traducciones("etiquetaStack")}
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {proyecto.tecnologias.map((tecnologia) => (
                <span
                  key={tecnologia}
                  className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-[11px] font-semibold text-slate-200"
                >
                  {tecnologia}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              {traducciones("etiquetaCapacidades")}
            </h4>
            <ul className="mt-3 space-y-2">
              {capacidades.map((capacidad) => (
                <li
                  key={capacidad}
                  className="flex items-start gap-2 text-sm text-slate-200"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  {capacidad}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {proyecto.enlaceDemo && (
            <Boton
              href={proyecto.enlaceDemo}
              target="_blank"
              rel="noopener noreferrer"
              variante="primario"
              tamanio="mediano"
              iconoDerecha={<ArrowUpRight className="h-4 w-4" />}
            >
              {traducciones("verProyecto")}
            </Boton>
          )}
          {proyecto.enlaceRepositorio && (
            <Boton
              href={proyecto.enlaceRepositorio}
              target="_blank"
              rel="noopener noreferrer"
              variante="borde"
              tamanio="mediano"
              iconoIzquierda={<Github className="h-4 w-4" />}
            >
              {traducciones("verCodigo")}
            </Boton>
          )}
        </div>
      </div>
    </motion.article>
  );
}
