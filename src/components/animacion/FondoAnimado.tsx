"use client";

import Image from "next/image";
import { FondoParticulas } from "./FondoParticulas";

/**
 * Capa de fondo fija para toda la página: fotografía urbana nocturna apenas
 * visible bajo un velo oscuro (el look del banner de contacto) combinada con
 * partículas sutiles que reaccionan al mouse. Vive detrás de todo el
 * contenido (z-0) y no captura eventos del mouse.
 */
export function FondoAnimado() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
    >
      {/* Fotografía urbana nocturna con velo oscuro para que solo se insinúe */}
      <Image
        src="/imagenes/fondo-cta.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#070B14]/85" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#070B14]/70 via-transparent to-[#070B14]" />

      <FondoParticulas multiplicadorOpacidad={0.55} cantidadMaxima={60} />
    </div>
  );
}
