"use client";

import React from "react";
import { HeroContenidoV2 } from "./HeroContenidoV2";
import { CintaStackV3 } from "@/components/diseno-v3/CintaStackV3";
import { GrillaBentoV3 } from "@/components/diseno-v3/GrillaBentoV3";
import { ProcesoTrabajoV3 } from "@/components/diseno-v3/ProcesoTrabajoV3";
import { CatalogoProyectosV3 } from "@/components/diseno-v3/CatalogoProyectosV3";
import { PreguntasFrecuentesV3 } from "@/components/diseno-v3/PreguntasFrecuentesV3";
import { CtaContactoV3 } from "@/components/diseno-v3/CtaContactoV3";

/**
 * Columna de contenido central de la nueva Versión 2.
 * Aloja todas las secciones interactivas del portafolio en flujo de scroll suave.
 */
export function CuerpoContenidoV2() {
  return (
    <div className="flex flex-col gap-16 sm:gap-24">
      {/* 1. Hero con Cubo 3D y métricas */}
      <HeroContenidoV2 />

      {/* 2. Cinta de Stack tecnológico */}
      <CintaStackV3 />

      {/* 3. Servicios y Arquitectura en Grilla Bento 2x2 */}
      <GrillaBentoV3 />

      {/* 4. Metodología Ágil de Trabajo */}
      <ProcesoTrabajoV3 />

      {/* 5. Catálogo de Proyectos Interactivos */}
      <CatalogoProyectosV3 />

      {/* 6. Preguntas Frecuentes */}
      <PreguntasFrecuentesV3 />

      {/* 7. Contacto y Vías Directas */}
      <CtaContactoV3 />

      {/* Pie de página sutil para la columna */}
      <footer className="pt-8 pb-12 border-t border-white/5 text-center text-xs text-neutral-500 font-mono">
        © 2026 Pablo Bejas — Full Stack Developer & Software Architecture
      </footer>
    </div>
  );
}
