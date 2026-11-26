"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { VERSION_SITIO } from "@/data/datosVersion";
import { HeroContenidoV2 } from "./HeroContenidoV2";
import { CintaStack } from "./CintaStack";
import { GrillaBento } from "./GrillaBento";
import { ProcesoTrabajo } from "./ProcesoTrabajo";

// Carga diferida de secciones inferiores para aligerar la evaluación JS inicial en móvil manteniendo SSR
const CatalogoProyectosV2 = dynamic(() =>
  import("./CatalogoProyectosV2").then((modulo) => modulo.CatalogoProyectosV2)
);
const PreguntasFrecuentes = dynamic(() =>
  import("./PreguntasFrecuentes").then((modulo) => modulo.PreguntasFrecuentes)
);
const CtaContacto = dynamic(() =>
  import("./CtaContacto").then((modulo) => modulo.CtaContacto)
);

/**
 * Columna de contenido central de la versión oficial.
 * Aloja todas las secciones interactivas del portafolio en flujo de scroll suave.
 */
export function CuerpoContenidoV2() {
  const traducciones = useTranslations("piePagina");

  return (
    /* [MEJORA-VISUAL-04] Ritmo vertical equilibrado evitando doble vacío entre secciones */
    <div className="flex flex-col gap-10 sm:gap-14">
      {/* 1. Hero con Cubo 3D y métricas */}
      <HeroContenidoV2 />

      {/* 2. Cinta de Stack tecnológico */}
      <CintaStack />

      {/* 3. Servicios y Arquitectura en Grilla Bento 2x2 */}
      <GrillaBento />

      {/* 4. Metodología Ágil de Trabajo */}
      <ProcesoTrabajo />

      {/* 5. Catálogo de Proyectos Interactivos */}
      <CatalogoProyectosV2 />

      {/* 6. Preguntas Frecuentes */}
      <PreguntasFrecuentes />

      {/* 7. Contacto y Vías Directas */}
      <CtaContacto />

      {/* Pie de página sutil con contraste WCAG AA/AAA verificado */}
      <footer className="pt-8 pb-12 border-t border-white/5 text-center text-xs text-neutral-400 font-mono flex items-center justify-center gap-2">
        <span>{traducciones("derechos")}</span>
        <span aria-hidden="true">·</span>
        <span className="text-neutral-300 font-semibold">v{VERSION_SITIO}</span>
      </footer>
    </div>
  );
}
