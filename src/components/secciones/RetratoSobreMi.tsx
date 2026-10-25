"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

/**
 * Retrato de la sección "Sobre Mí": la fotografía (recorte sin fondo) dentro
 * de un encuadre HUD futurista con esquinas de mira, retícula tenue, línea
 * de escaneo y etiqueta de rol (opción R1 aprobada en la demo).
 */
export function RetratoSobreMi() {
  const traducciones = useTranslations("sobreMi");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55 }}
      className="relative w-72 sm:w-80 mx-auto lg:mx-0 py-7 px-8"
    >
      {/* Retícula tenue de fondo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[rgba(7,11,20,0.35)] bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:26px_26px]"
      />

      {/* Esquinas del encuadre HUD */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-9 w-9 border-t-2 border-l-2 border-blue-500 drop-shadow-[0_0_6px_rgba(59,130,246,0.7)]"
      />
      <span
        aria-hidden="true"
        className="absolute top-0 right-0 h-9 w-9 border-t-2 border-r-2 border-blue-500 drop-shadow-[0_0_6px_rgba(59,130,246,0.7)]"
      />
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-9 w-9 border-b-2 border-l-2 border-blue-500 drop-shadow-[0_0_6px_rgba(59,130,246,0.7)]"
      />
      <span
        aria-hidden="true"
        className="absolute bottom-0 right-0 h-9 w-9 border-b-2 border-r-2 border-blue-500 drop-shadow-[0_0_6px_rgba(59,130,246,0.7)]"
      />

      {/* Línea de escaneo que recorre el retrato */}
      <motion.span
        aria-hidden="true"
        className="absolute left-3 right-3 h-0.5 z-10 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
        animate={{ top: ["8%", "90%"] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
      />

      {/* Fotografía recortada (sin fondo) */}
      <Image
        src="/imagenes/pablo.png"
        alt={traducciones("altFoto")}
        width={480}
        height={720}
        sizes="(max-width: 1024px) 320px, 380px"
        className="relative z-[5] w-full h-auto"
      />

      {/* Etiqueta de rol estilo consola */}
      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-mono text-[11px] font-semibold tracking-wide text-sky-300 bg-[#1c171b] border border-blue-500/45 rounded-md px-3.5 py-1.5 whitespace-nowrap">
        {traducciones("etiquetaRetrato")}
      </span>
    </motion.div>
  );
}
