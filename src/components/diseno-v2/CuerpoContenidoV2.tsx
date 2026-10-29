"use client";

import React from "react";
import { HeroContenidoV2 } from "./HeroContenidoV2";
import { CintaStack } from "./CintaStack";
import { GrillaBento } from "./GrillaBento";
import { ProcesoTrabajo } from "./ProcesoTrabajo";
import { CatalogoProyectosV2 } from "./CatalogoProyectosV2";
import { PreguntasFrecuentes } from "./PreguntasFrecuentes";
import { CtaContacto } from "./CtaContacto";

/**
 * Columna de contenido central de la versión oficial.
 * Aloja todas las secciones interactivas del portafolio en flujo de scroll suave.
 */
export function CuerpoContenidoV2() {
  return (
    <div className="flex flex-col gap-16 sm:gap-24">
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

      {/* Pie de página sutil para la columna */}
      <footer className="pt-8 pb-12 border-t border-white/5 text-center text-xs text-neutral-500 font-mono">
        © 2026 Pablo Bejas — Full Stack Developer & Software Architecture
      </footer>
    </div>
  );
}
