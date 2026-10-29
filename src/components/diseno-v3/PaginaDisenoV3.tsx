"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PreloaderCinematicoV3 } from "./PreloaderCinematicoV3";
import { BarraNavegacionV3 } from "./BarraNavegacionV3";
import { HeroV3 } from "./HeroV3";
import { CintaStackV3 } from "./CintaStackV3";
import { SobreMiV3 } from "./SobreMiV3";
import { GrillaBentoV3 } from "./GrillaBentoV3";
import { ProcesoTrabajoV3 } from "./ProcesoTrabajoV3";
import { CatalogoProyectosV3 } from "./CatalogoProyectosV3";
import { PreguntasFrecuentesV3 } from "./PreguntasFrecuentesV3";
import { CtaContactoV3 } from "./CtaContactoV3";
import { PiePaginaV3 } from "./PiePaginaV3";

/**
 * Contenedor maestro de la Versión 3 (La Fusión) en estética azul eléctrica oficial.
 * Administra el estado del Preloader Cinemático y la entrada orquestada del sitio.
 */
export function PaginaDisenoV3() {
  const [cargando, setCargando] = useState<boolean>(true);

  return (
    <div className="relative min-h-screen bg-[#070606] text-neutral-100 selection:bg-sky-500 selection:text-white">
      {/* Preloader cinemático con isotipo oficial y estética azul */}
      {cargando && (
        <PreloaderCinematicoV3 alFinalizar={() => setCargando(false)} />
      )}

      {/* Estructura del contenido V3 con animación de entrada */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: cargando ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col min-h-screen"
      >
        {/* Barra de navegación flotante estilo cápsula de cristal */}
        <BarraNavegacionV3 />

        {/* Flujo de secciones principales */}
        <main className="flex-grow">
          <HeroV3 />
          <CintaStackV3 />
          <SobreMiV3 />
          <GrillaBentoV3 />
          <ProcesoTrabajoV3 />
          <CatalogoProyectosV3 />
          <PreguntasFrecuentesV3 />
          <CtaContactoV3 />
        </main>

        {/* Pie de página oficial */}
        <PiePaginaV3 />
      </motion.div>
    </div>
  );
}
