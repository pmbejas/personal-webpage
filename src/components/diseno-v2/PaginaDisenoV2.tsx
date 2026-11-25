"use client";

import React, { useEffect, useState } from "react";
import { PreloaderCinematico } from "./PreloaderCinematico";
import { TarjetaLateralFija } from "./TarjetaLateralFija";
import { MenuFlotanteDerecho } from "./MenuFlotanteDerecho";
import { CuerpoContenidoV2 } from "./CuerpoContenidoV2";
import { FondoHumoSutil } from "@/components/animacion/FondoHumoSutil";

const CLAVE_INTRO_SESION = "pb_intro_cinematica_vista";

/**
 * Contenedor Maestro de la Versión 2 Oficial.
 * Estructura Split-Screen con Tarjeta de Identidad fija a la izquierda,
 * Dock de navegación flotante a la derecha y lienzo interactivo de contenido con Cubo 3D.
 */
export function PaginaDisenoV2() {
  const [mostrarPreloader, setMostrarPreloader] = useState<boolean>(false);

  useEffect(() => {
    try {
      const yaVista = sessionStorage.getItem(CLAVE_INTRO_SESION) === "1";
      if (!yaVista) {
        setMostrarPreloader(true);
      }
    } catch {
      // Si sessionStorage está bloqueado, omitir preloader para no degradar la experiencia
    }
  }, []);

  const finalizarPreloader = () => {
    try {
      sessionStorage.setItem(CLAVE_INTRO_SESION, "1");
    } catch {
      // Ignorar en navegación privada estricta
    }
    setMostrarPreloader(false);
  };

  return (
    <div
      data-v2="true"
      className="relative min-h-screen bg-[#070606] text-neutral-100 selection:bg-[rgb(var(--tema-acento-rgb))] selection:text-black"
    >
      {/* 1. Preloader Cinemático Oficial (una sola vez por sesión, sin ocultar el contenido al SSR/LCP) */}
      {mostrarPreloader && (
        <PreloaderCinematico alFinalizar={finalizarPreloader} />
      )}

      {/* 2. Fondo Ambiental de Humo Sutil (Estilo Vapor / Cigarrillo) */}
      <FondoHumoSutil />

      {/* [MEJORA-VISUAL-06] Aire superior en móvil para que el dock fijo no superponga la Tarjeta Lateral */}
      <div className="relative z-10 max-w-[1700px] mx-auto px-3 pb-3 pt-16 sm:px-6 sm:pb-6 sm:pt-20 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-14">
        {/* Tarjeta Lateral Izquierda Fija / Sticky */}
        <TarjetaLateralFija />

        {/* Columna Principal Desplazable de Contenido */}
        <main className="flex-1 min-w-0 pr-0 lg:pr-16">
          <CuerpoContenidoV2 />
        </main>

        {/* Menú Dock Flotante Derecho */}
        <MenuFlotanteDerecho />
      </div>
    </div>
  );
}
