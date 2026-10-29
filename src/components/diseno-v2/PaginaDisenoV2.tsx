"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PreloaderCinematico } from "./PreloaderCinematico";
import { TarjetaLateralFija } from "./TarjetaLateralFija";
import { MenuFlotanteDerecho } from "./MenuFlotanteDerecho";
import { CuerpoContenidoV2 } from "./CuerpoContenidoV2";

/**
 * Contenedor Maestro de la Versión 2 Oficial.
 * Estructura Split-Screen con Tarjeta de Identidad fija a la izquierda,
 * Dock de navegación flotante a la derecha y lienzo interactivo de contenido con Cubo 3D.
 */
export function PaginaDisenoV2() {
  const [cargando, setCargando] = useState<boolean>(true);

  return (
    <div
      data-v2="true"
      className="relative min-h-screen bg-[#070606] text-neutral-100 selection:bg-[rgb(var(--tema-acento-rgb))] selection:text-black"
    >
      {/* 1. Preloader Cinemático Oficial */}
      {cargando && (
        <PreloaderCinematico alFinalizar={() => setCargando(false)} />
      )}

      {/* 2. Disposición espacial Split-Screen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: cargando ? 0 : 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative max-w-[1700px] mx-auto p-3 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-14"
      >
        {/* Tarjeta Lateral Izquierda Fija / Sticky */}
        <TarjetaLateralFija />

        {/* Columna Principal Desplazable de Contenido */}
        <main className="flex-1 min-w-0 pr-0 lg:pr-16">
          <CuerpoContenidoV2 />
        </main>

        {/* Menú Dock Flotante Derecho */}
        <MenuFlotanteDerecho />
      </motion.div>
    </div>
  );
}
