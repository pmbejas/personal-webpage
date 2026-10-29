"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PropiedadesPreloader {
  alFinalizar: () => void;
}

/**
 * Preloader cinemático minimalista y moderno con trazo láser ámbar y contador digital.
 * Proporciona una entrada estética de alto impacto antes de revelar el contenido.
 */
export const PreloaderCinematico: React.FC<PropiedadesPreloader> = ({ alFinalizar }) => {
  const [progreso, setProgreso] = useState<number>(0);
  const [estaCompletado, setEstaCompletado] = useState<boolean>(false);

  useEffect(() => {
    const duracionTotal = 1900;
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
          }, 600);
        }, 300);
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
            y: -40,
            filter: "blur(14px)",
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070606] text-white select-none overflow-hidden"
        >
          {/* Resplandor radial de fondo */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-600/15 via-orange-500/10 to-transparent blur-[120px] pointer-events-none" />

          {/* Botón sutil para saltar */}
          <button
            onClick={saltarIntro}
            type="button"
            className="absolute top-6 right-6 text-xs tracking-wider uppercase text-neutral-500 hover:text-neutral-300 transition-colors px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02]"
          >
            Saltar intro ✕
          </button>

          {/* Monograma central animado */}
          <div className="relative mb-8 flex items-center justify-center">
            {/* Halo de luz tras el logo */}
            <motion.div
              animate={{
                scale: [0.9, 1.15, 0.95],
                opacity: [0.4, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-amber-500/30 to-orange-500/30 blur-2xl"
            />

            {/* SVG con trazo de vector animado */}
            <svg
              className="w-20 h-20 text-amber-500 drop-shadow-[0_0_25px_rgba(245,158,11,0.6)]"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="gradienteAmbar" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="50%" stopColor="#EA580C" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>

              {/* Contorno exterior hexagonal / diamante suave */}
              <motion.polygon
                points="50,6 90,28 90,72 50,94 10,72 10,28"
                stroke="url(#gradienteAmbar)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />

              {/* Letra P estilizada */}
              <motion.path
                d="M 36 28 L 36 72 M 36 28 L 54 28 C 62 28 66 33 66 40 C 66 47 62 52 54 52 L 36 52"
                stroke="url(#gradienteAmbar)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progreso / 100 }}
                transition={{ duration: 0.2 }}
              />

              {/* Detalle interno de la B */}
              <motion.path
                d="M 52 52 L 58 52 C 65 52 69 57 69 62 C 69 68 65 72 57 72 L 48 72"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progreso > 50 ? (progreso - 50) / 50 : 0 }}
                transition={{ duration: 0.2 }}
              />
            </svg>
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
            <p className="text-[11px] font-mono tracking-widest text-amber-400/90 mt-1 uppercase">
              Full Stack & Software Architecture
            </p>
          </motion.div>

          {/* Barra de progreso y haz de luz */}
          <div className="relative w-64 max-w-[80vw] mt-8">
            <div className="h-[2px] w-full bg-neutral-900 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-600 via-orange-400 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                style={{ width: `${progreso}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            {/* Haz de luz horizontal expansivo */}
            <div
              className="absolute -top-[5px] h-[12px] rounded-full bg-amber-400/30 blur-sm pointer-events-none transition-all duration-100"
              style={{
                left: `calc(${progreso}% - 15px)`,
                width: "30px",
                opacity: progreso > 5 && progreso < 98 ? 1 : 0,
              }}
            />
          </div>

          {/* Contador numérico de porcentaje */}
          <div className="mt-4 font-mono text-xs tracking-wider text-neutral-400 flex items-center gap-2">
            <span className="text-amber-400 font-semibold">{progreso.toString().padStart(2, "0")}%</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-500 text-[10px] uppercase tracking-widest">Iniciando entorno</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
