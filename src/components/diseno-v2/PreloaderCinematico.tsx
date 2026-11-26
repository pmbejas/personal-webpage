"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

const DURACION_PRELOADER_MS = 950;
const PAUSA_FINAL_MS = 120;
const DURACION_CIERRE_MS = 320;

interface PropiedadesPreloader {
  alFinalizar: () => void;
}

/**
 * Preloader cinemático minimalista y moderno con el isotipo oficial del robot desarrollador.
 * Optimizado para operar con 0 re-renders de React durante la barra de progreso
 * (animación directa vía requestAnimationFrame + transform acelerado por GPU).
 */
export const PreloaderCinematico: React.FC<PropiedadesPreloader> = ({ alFinalizar }) => {
  const [estaCompletado, setEstaCompletado] = useState<boolean>(false);
  const yaFinalizoRef = useRef<boolean>(false);
  const barraProgresoRef = useRef<HTMLDivElement>(null);
  const hazLuzRef = useRef<HTMLDivElement>(null);
  const porcentajeRef = useRef<HTMLSpanElement>(null);
  const traducciones = useTranslations("preloader");

  useEffect(() => {
    const finalizarUnaSolaVez = () => {
      if (!yaFinalizoRef.current) {
        yaFinalizoRef.current = true;
        alFinalizar();
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEstaCompletado(true);
      finalizarUnaSolaVez();
      return;
    }

    const tiempoInicioMs = performance.now();
    let idAnimacion = 0;
    let idTimeoutPausa: ReturnType<typeof setTimeout> | null = null;
    let idTimeoutCierre: ReturnType<typeof setTimeout> | null = null;

    const actualizarCuadro = (tiempoActualMs: number) => {
      const fraccionLineal = Math.min(1, (tiempoActualMs - tiempoInicioMs) / DURACION_PRELOADER_MS);
      const fraccionSuave = 1 - Math.pow(1 - fraccionLineal, 2.2);
      const porcentaje = Math.round(fraccionSuave * 100);

      if (barraProgresoRef.current) {
        barraProgresoRef.current.style.transform = `scaleX(${fraccionSuave})`;
      }

      if (hazLuzRef.current) {
        hazLuzRef.current.style.left = `calc(${porcentaje}% - 15px)`;
        hazLuzRef.current.style.opacity = porcentaje > 5 && porcentaje < 98 ? "1" : "0";
      }

      if (porcentajeRef.current) {
        porcentajeRef.current.textContent = `${porcentaje.toString().padStart(2, "0")}%`;
      }

      if (fraccionLineal < 1) {
        idAnimacion = requestAnimationFrame(actualizarCuadro);
        return;
      }

      idTimeoutPausa = setTimeout(() => {
        setEstaCompletado(true);
        idTimeoutCierre = setTimeout(finalizarUnaSolaVez, DURACION_CIERRE_MS);
      }, PAUSA_FINAL_MS);
    };

    idAnimacion = requestAnimationFrame(actualizarCuadro);

    return () => {
      cancelAnimationFrame(idAnimacion);
      if (idTimeoutPausa) clearTimeout(idTimeoutPausa);
      if (idTimeoutCierre) clearTimeout(idTimeoutCierre);
    };
  }, [alFinalizar]);

  const saltarIntro = () => {
    setEstaCompletado(true);
    if (!yaFinalizoRef.current) {
      yaFinalizoRef.current = true;
      alFinalizar();
    }
  };

  return (
    <AnimatePresence>
      {!estaCompletado && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -16,
            transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070606] text-white select-none overflow-hidden"
        >
          {/* Resplandor radial de fondo reactivo al tema */}
          <div className="absolute w-[440px] h-[440px] rounded-full bg-gradient-to-tr from-[rgb(var(--tema-acento-oscuro-rgb)/0.2)] via-[rgb(var(--tema-acento-rgb)/0.1)] to-transparent blur-[110px] pointer-events-none" />

          {/* Botón para saltar intro */}
          <button
            onClick={saltarIntro}
            type="button"
            className="absolute top-6 right-6 text-xs tracking-wider uppercase text-neutral-400 hover:text-neutral-200 transition-colors px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] cursor-pointer"
          >
            {traducciones("saltarIntro")}
          </button>

          {/* Isotipo oficial con halo de luz */}
          <div className="relative mb-8 flex items-center justify-center">
            <div className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-[rgb(var(--tema-acento-rgb)/0.35)] to-[rgb(var(--tema-acento-claro-rgb)/0.35)] blur-2xl animate-pulse" />

            <div className="relative w-20 h-20 drop-shadow-[0_0_20px_rgb(var(--tema-acento-claro-rgb)/0.7)] flex items-center justify-center">
              <Image
                src="/isotipo-dark.svg"
                alt={traducciones("altIsotipo")}
                width={80}
                height={80}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>

          {/* Textos de identificación */}
          <div className="text-center">
            <h2 className="text-sm font-semibold tracking-[0.35em] uppercase text-neutral-200">
              Pablo Bejas
            </h2>
            <p className="text-[11px] font-mono tracking-widest text-sky-400 mt-1 uppercase">
              Full Stack & Software Architecture
            </p>
          </div>

          {/* Barra de progreso acelerada por GPU (transform: scaleX) */}
          <div className="relative w-64 max-w-[80vw] mt-8">
            <div className="h-[2px] w-full bg-neutral-900 rounded-full overflow-hidden relative">
              <div
                ref={barraProgresoRef}
                className="h-full w-full origin-left bg-gradient-to-r from-[rgb(var(--tema-acento-oscuro-rgb))] via-[rgb(var(--tema-acento-rgb))] to-[rgb(var(--tema-acento-claro-rgb))] shadow-[0_0_12px_rgb(var(--tema-acento-claro-rgb)/0.8)] will-change-transform"
                style={{ transform: "scaleX(0)" }}
              />
            </div>

            <div
              ref={hazLuzRef}
              className="absolute -top-[5px] h-[12px] w-[30px] rounded-full bg-sky-400/35 blur-sm pointer-events-none"
              style={{ left: "-15px", opacity: 0 }}
            />
          </div>

          {/* Contador numérico sin re-renders de React */}
          <div className="mt-4 font-mono text-xs tracking-wider text-neutral-400 flex items-center gap-2 tabular-nums">
            <span ref={porcentajeRef} className="text-sky-400 font-semibold">
              00%
            </span>
            <span className="text-neutral-500">/</span>
            <span className="text-neutral-400 text-[10px] uppercase tracking-widest">
              {traducciones("iniciandoEntorno")}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
