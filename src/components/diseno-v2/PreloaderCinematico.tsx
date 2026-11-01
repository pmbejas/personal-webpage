"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

interface PropiedadesPreloader {
  alFinalizar: () => void;
}

/**
 * Preloader cinemático minimalista y moderno con el isotipo oficial del robot desarrollador,
 * estética azul eléctrico / cyan y barra de progreso de carga.
 */
export const PreloaderCinematico: React.FC<PropiedadesPreloader> = ({ alFinalizar }) => {
  const [progreso, setProgreso] = useState<number>(0);
  const [estaCompletado, setEstaCompletado] = useState<boolean>(false);
  const traducciones = useTranslations("preloader");

  useEffect(() => {
    const duracionTotal = 1800;
    const intervaloMs = 25;
    const pasos = duracionTotal / intervaloMs;
    let pasoActual = 0;

    const temporizador = setInterval(() => {
      pasoActual++;
      const porcentajeCalculado = Math.min(100, Math.round((pasoActual / pasos) * 100));
      setProgreso(porcentajeCalculado);

      if (porcentajeCalculado >= 100) {
        clearInterval(temporizador);
        setTimeout(() => {
          setEstaCompletado(true);
          setTimeout(() => {
            alFinalizar();
          }, 500);
        }, 250);
      }
    }, intervaloMs);

    return () => clearInterval(temporizador);
  }, [alFinalizar]);

  const saltarIntro = () => {
    setEstaCompletado(true);
    alFinalizar();
  };

  return (
    <AnimatePresence>
      {!estaCompletado && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -30,
            filter: "blur(14px)",
            transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070606] text-white select-none overflow-hidden"
        >
          {/* Resplandor radial de fondo azul cian */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-600/20 via-sky-500/10 to-transparent blur-[130px] pointer-events-none" />

          {/* Botón para saltar intro */}
          <button
            onClick={saltarIntro}
            type="button"
            className="absolute top-6 right-6 text-xs tracking-wider uppercase text-neutral-500 hover:text-neutral-300 transition-colors px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02]"
          >
            {traducciones("saltarIntro")}
          </button>

          {/* Isotipo oficial con halo de luz azul */}
          <div className="relative mb-8 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [0.92, 1.12, 0.96],
                opacity: [0.5, 0.9, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-blue-500/35 to-sky-400/35 blur-2xl"
            />

            {/* Isotipo Dark renderizado */}
            <div className="relative w-20 h-20 drop-shadow-[0_0_20px_rgba(56,189,248,0.7)] flex items-center justify-center">
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-sm font-semibold tracking-[0.35em] uppercase text-neutral-200">
              Pablo Bejas
            </h2>
            <p className="text-[11px] font-mono tracking-widest text-sky-400 mt-1 uppercase">
              Full Stack & Software Architecture
            </p>
          </motion.div>

          {/* Barra de progreso y haz de luz azul */}
          <div className="relative w-64 max-w-[80vw] mt-8">
            <div className="h-[2px] w-full bg-neutral-900 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.8)]"
                style={{ width: `${progreso}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            {/* Haz de luz horizontal expansivo */}
            <div
              className="absolute -top-[5px] h-[12px] rounded-full bg-sky-400/35 blur-sm pointer-events-none transition-all duration-100"
              style={{
                left: `calc(${progreso}% - 15px)`,
                width: "30px",
                opacity: progreso > 5 && progreso < 98 ? 1 : 0,
              }}
            />
          </div>

          {/* Contador numérico de porcentaje */}
          <div className="mt-4 font-mono text-xs tracking-wider text-neutral-400 flex items-center gap-2">
            <span className="text-sky-400 font-semibold">{progreso.toString().padStart(2, "0")}%</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-500 text-[10px] uppercase tracking-widest">{traducciones("iniciandoEntorno")}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
