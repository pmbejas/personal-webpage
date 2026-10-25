"use client";

import { FondoParticulas } from "./FondoParticulas";

/**
 * Capa de fondo fija para toda la página: fondo liso en color plano #1c171b
 * combinado con partículas interactivas sutiles que reaccionan al cursor.
 * Se posiciona detrás de todo el contenido (z-0) y no captura eventos del mouse.
 */
export function FondoAnimado() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#1c171b]"
    >
      <FondoParticulas multiplicadorOpacidad={0.55} cantidadMaxima={60} />
    </div>
  );
}
