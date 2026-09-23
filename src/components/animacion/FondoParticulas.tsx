"use client";

import { useEffect, useRef } from "react";

/* Interfaz de cada punto de la constelación */
interface Particula {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radio: number;
}

export interface PropiedadesFondoParticulas {
  /* Multiplicador de opacidad para líneas y puntos (1 = intensidad plena) */
  multiplicadorOpacidad?: number;
  /* Cantidad máxima de partículas en pantalla */
  cantidadMaxima?: number;
}

/**
 * Fondo de constelación de partículas sobre un canvas, con conexiones entre
 * puntos cercanos y reacción al movimiento del mouse. Reutilizable en
 * cualquier contenedor con posición relativa.
 */
export function FondoParticulas({
  multiplicadorOpacidad = 1,
  cantidadMaxima = 80,
}: PropiedadesFondoParticulas) {
  const referenciaLienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const lienzo = referenciaLienzo.current;
    if (!lienzo) return;

    const contexto = lienzo.getContext("2d");
    if (!contexto) return;

    const reducirMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let ancho = 0;
    let alto = 0;
    let particulas: Particula[] = [];
    let idAnimacion = 0;
    const mouse = { x: -9999, y: -9999 };

    let colorLineas = "59, 130, 246";
    let colorPuntos = "96, 165, 250";

    const actualizarColoresTema = () => {
      try {
        const estilosRaiz = getComputedStyle(document.documentElement);
        const acentoRgb = estilosRaiz.getPropertyValue("--tema-acento-rgb").trim();
        const acentoClaroRgb = estilosRaiz.getPropertyValue("--tema-acento-claro-rgb").trim();

        if (acentoRgb) {
          colorLineas = acentoRgb.split(/\s+/).join(", ");
        }
        if (acentoClaroRgb) {
          colorPuntos = acentoClaroRgb.split(/\s+/).join(", ");
        }

        if (reducirMovimiento) {
          pintarCuadro();
        }
      } catch {
        // En caso de excepción, mantener los valores por defecto en azul
      }
    };

    const ajustarTamanio = () => {
      ancho = lienzo.width = lienzo.offsetWidth;
      alto = lienzo.height = lienzo.offsetHeight;
    };

    const crearParticulas = () => {
      particulas = [];
      const cantidad = Math.min(cantidadMaxima, Math.floor((ancho * alto) / 16000));
      for (let i = 0; i < cantidad; i++) {
        particulas.push({
          x: Math.random() * ancho,
          y: Math.random() * alto,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radio: Math.random() * 1.8 + 0.8,
        });
      }
    };

    const trazarLinea = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      opacidad: number
    ) => {
      contexto.beginPath();
      contexto.moveTo(x1, y1);
      contexto.lineTo(x2, y2);
      contexto.strokeStyle = `rgba(${colorLineas}, ${opacidad})`;
      contexto.lineWidth = 1;
      contexto.stroke();
    };

    const pintarCuadro = () => {
      contexto.clearRect(0, 0, ancho, alto);

      particulas.forEach((particula) => {
        particula.x += particula.vx;
        particula.y += particula.vy;
        if (particula.x < 0) particula.x = ancho;
        if (particula.x > ancho) particula.x = 0;
        if (particula.y < 0) particula.y = alto;
        if (particula.y > alto) particula.y = 0;

        contexto.beginPath();
        contexto.arc(particula.x, particula.y, particula.radio, 0, Math.PI * 2);
        contexto.fillStyle = `rgba(${colorPuntos}, ${0.85 * multiplicadorOpacidad})`;
        contexto.fill();
      });

      for (let i = 0; i < particulas.length; i++) {
        for (let j = i + 1; j < particulas.length; j++) {
          const distancia = Math.hypot(
            particulas[i].x - particulas[j].x,
            particulas[i].y - particulas[j].y
          );
          if (distancia < 130) {
            trazarLinea(
              particulas[i].x,
              particulas[i].y,
              particulas[j].x,
              particulas[j].y,
              (1 - distancia / 130) * 0.35 * multiplicadorOpacidad
            );
          }
        }

        // Conexión con el mouse para la interactividad
        const distanciaMouse = Math.hypot(
          particulas[i].x - mouse.x,
          particulas[i].y - mouse.y
        );
        if (distanciaMouse < 170) {
          trazarLinea(
            particulas[i].x,
            particulas[i].y,
            mouse.x,
            mouse.y,
            (1 - distanciaMouse / 170) * 0.5 * multiplicadorOpacidad
          );
        }
      }
    };

    const animarCuadros = () => {
      pintarCuadro();
      idAnimacion = requestAnimationFrame(animarCuadros);
    };

    const manejarMouseMove = (evento: MouseEvent) => {
      const rect = lienzo.getBoundingClientRect();
      mouse.x = evento.clientX - rect.left;
      mouse.y = evento.clientY - rect.top;
    };

    const manejarRedimension = () => {
      ajustarTamanio();
      crearParticulas();
    };

    ajustarTamanio();
    crearParticulas();
    actualizarColoresTema();

    if (reducirMovimiento) {
      // Usuarios con "reducir movimiento": un solo cuadro estático, sin bucle
      pintarCuadro();
    } else {
      animarCuadros();
      document.addEventListener("mousemove", manejarMouseMove);
    }

    window.addEventListener("resize", manejarRedimension);
    window.addEventListener("cambio-tema", actualizarColoresTema);

    return () => {
      cancelAnimationFrame(idAnimacion);
      document.removeEventListener("mousemove", manejarMouseMove);
      window.removeEventListener("resize", manejarRedimension);
      window.removeEventListener("cambio-tema", actualizarColoresTema);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiplicadorOpacidad, cantidadMaxima]);

  return (
    <canvas
      ref={referenciaLienzo}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
