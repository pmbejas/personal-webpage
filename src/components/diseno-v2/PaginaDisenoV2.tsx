"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PreloaderCinematico } from "./PreloaderCinematico";
import { BarraNavegacionV2 } from "./BarraNavegacionV2";
import { HeroV2 } from "./HeroV2";
import { CintaStackV2 } from "./CintaStackV2";
import { GrillaBentoV2 } from "./GrillaBentoV2";
import { ProcesoTrabajoV2 } from "./ProcesoTrabajoV2";
import { CatalogoProyectosV2 } from "./CatalogoProyectosV2";
import { PreguntasFrecuentesV2 } from "./PreguntasFrecuentesV2";
import { CtaFinalV2 } from "./CtaFinalV2";
import { PiePaginaV2 } from "./PiePaginaV2";

/**
 * Contenedor interactivo principal del diseño experimental V2.
 * Administra el estado del preloader cinemático y la entrada fluida del contenido.
 */
export const PaginaDisenoV2: React.FC = () => {
  const [cargando, setCargando] = useState<boolean>(true);

  return (
    <div className="relative min-h-screen bg-[#070606] text-neutral-100 selection:bg-amber-500 selection:text-black">
      {/* Preloader cinemático animado */}
      {cargando && (
        <PreloaderCinematico alFinalizar={() => setCargando(false)} />
      )}

      {/* Estructura del contenido V2 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: cargando ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col min-h-screen"
      >
        {/* Barra de navegación flotante */}
        <BarraNavegacionV2 />

        {/* Secciones principales */}
        <main className="flex-grow">
          <HeroV2 />
          <CintaStackV2 />
          <GrillaBentoV2 />
          <ProcesoTrabajoV2 />
          <CatalogoProyectosV2 />
          <PreguntasFrecuentesV2 />
          <CtaFinalV2 />
        </main>

        {/* Pie de página con horizonte ámbar */}
        <PiePaginaV2 />
      </motion.div>
    </div>
  );
};
