"use client";

import { useEffect, useState } from "react";

/* Identificadores de las secciones observables de la página principal */
const IDS_SECCIONES = [
  "inicio",
  "sobre-mi",
  "servicios",
  "proyectos",
  "contacto",
];

/**
 * Hook que detecta la sección visible del viewport mediante IntersectionObserver,
 * usado para resaltar el enlace activo en la barra de navegación.
 */
export function useDeteccionSeccionActiva(): string {
  const [seccionActiva, setSeccionActiva] = useState<string>("");

  useEffect(() => {
    const seccionesObservadas = IDS_SECCIONES.map((id) =>
      document.getElementById(id)
    ).filter((seccion): seccion is HTMLElement => seccion !== null);

    if (seccionesObservadas.length === 0) {
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            setSeccionActiva(entrada.target.id);
          }
        });
      },
      // Activa la sección cuando cruza la franja central de la pantalla
      { rootMargin: "-40% 0px -55% 0px" }
    );

    seccionesObservadas.forEach((seccion) => observador.observe(seccion));

    return () => observador.disconnect();
  }, []);

  return seccionActiva;
}
