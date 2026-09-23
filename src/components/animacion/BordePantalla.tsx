"use client";

/**
 * Componente que renderiza un marco perimetral sutil en los cuatro bordes de la pantalla.
 * Cuenta con un resplandor tipo neón sutil y una animación de respiración suave de 6 segundos
 * que modula la luminosidad en sincronía con los colores del tema activo (azul, verde o naranja).
 * 
 * Es totalmente no invasivo: utiliza pointer-events-none para permitir la interacción normal
 * con cualquier elemento interactivo y scroll de la interfaz.
 */
export function BordePantalla() {
  return (
    <div
      aria-hidden="true"
      className="borde-neon-perimetral pointer-events-none fixed inset-0 z-50 transition-colors duration-500"
    />
  );
}
