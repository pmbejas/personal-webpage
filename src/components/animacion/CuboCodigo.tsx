"use client";

import { useEffect, useRef } from "react";

/* Constantes del movimiento del cubo */
const AMPLITUD_MOUSE = 38; // grados máximos de inclinación con el cursor
const VELOCIDAD_GIRO_Y = 0.16; // grados por cuadro (~10°/seg, lento y constante)
const CENTRO_OSCILACION_X = -14; // inclinación central del vaivén en X
const AMPLITUD_OSCILACION_X = 16; // grados del vaivén en X
const FRECUENCIA_OSCILACION = 0.00022; // rapidez del vaivén (rad/ms)
const FACTOR_SUAVIZADO = 0.05; // factor de interpolación (menor = más suave)

/* Clases base de cada cara del cubo (posición 3D + estilo de mini ventana de código) */
const CLASE_BASE_CARA =
  "absolute inset-0 flex flex-col rounded-xl border border-blue-500/45 bg-[rgba(10,15,28,0.9)] p-3 text-left font-mono text-[9px] leading-relaxed text-slate-300 overflow-hidden";

/* Barra de puntitos estilo ventana Mac que encabeza cada cara */
const BarraVentana = () => (
  <div className="mb-1.5 flex gap-1">
    <i className="h-1.5 w-1.5 rounded-full bg-red-500" />
    <i className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
    <i className="h-1.5 w-1.5 rounded-full bg-green-500" />
  </div>
);

/**
 * Cubo 3D con mini ventanas de código en cada cara. En reposo gira de forma
 * continua y lenta (giro constante en Y + oscilación tipo péndulo en X); con
 * el mouse encima se inclina siguiendo el cursor en tiempo real, y al salir
 * retoma el flujo automático sin saltos.
 */
export function CuboCodigo() {
  const referenciaCubo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cubo = referenciaCubo.current;
    if (!cubo) return;

    const reducirMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducirMovimiento) {
      // Usuarios con "reducir movimiento": cubo estático en una postura legible
      cubo.style.transform = "rotateX(-14deg) rotateY(25deg)";
      return;
    }

    const zonaInteractiva = cubo.closest<HTMLElement>(".zona-cubo") ?? cubo;

    let rotX = CENTRO_OSCILACION_X;
    let rotY = 0;
    let objetivoX = CENTRO_OSCILACION_X;
    let objetivoY = 0;
    let modoAutomatico = true;
    let idAnimacion = 0;
    let estaEnPantalla = true;

    const manejarMouseMove = (evento: MouseEvent) => {
      const rect = zonaInteractiva.getBoundingClientRect();
      const relativoX = (evento.clientX - rect.left) / rect.width - 0.5;
      const relativoY = (evento.clientY - rect.top) / rect.height - 0.5;
      objetivoY = relativoX * AMPLITUD_MOUSE * 2;
      objetivoX = -relativoY * AMPLITUD_MOUSE * 2;
      modoAutomatico = false;
    };

    const manejarMouseLeave = () => {
      modoAutomatico = true;
    };

    const animar = (momento: number) => {
      if (!estaEnPantalla) {
        idAnimacion = 0;
        return;
      }

      if (modoAutomatico) {
        // Movimiento continuo: giro constante en Y + oscilación suave en X
        objetivoY += VELOCIDAD_GIRO_Y;
        objetivoX =
          CENTRO_OSCILACION_X +
          AMPLITUD_OSCILACION_X * Math.sin(momento * FRECUENCIA_OSCILACION);
      }

      // Interpolación suave hacia el objetivo (transiciones fluidas, sin saltos)
      rotX += (objetivoX - rotX) * FACTOR_SUAVIZADO;
      rotY += (objetivoY - rotY) * FACTOR_SUAVIZADO;
      cubo.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

      idAnimacion = requestAnimationFrame(animar);
    };

    // Pausar el renderizado 3D cuando el cubo no esté a la vista para ahorrar GPU y batería
    const observadorVisibilidad = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          estaEnPantalla = entrada.isIntersecting;
          if (estaEnPantalla && !idAnimacion) {
            idAnimacion = requestAnimationFrame(animar);
          }
        });
      },
      { threshold: 0.05 }
    );
    observadorVisibilidad.observe(zonaInteractiva);

    zonaInteractiva.addEventListener("mousemove", manejarMouseMove);
    zonaInteractiva.addEventListener("mouseleave", manejarMouseLeave);
    idAnimacion = requestAnimationFrame(animar);

    return () => {
      cancelAnimationFrame(idAnimacion);
      observadorVisibilidad.disconnect();
      zonaInteractiva.removeEventListener("mousemove", manejarMouseMove);
      zonaInteractiva.removeEventListener("mouseleave", manejarMouseLeave);
    };
  }, []);

  return (
    <div className="zona-cubo flex flex-col items-center">
      {/* Escena con perspectiva 3D */}
      <div className="h-44 w-44 [perspective:640px]">
        <div
          ref={referenciaCubo}
          className="relative h-full w-full [transform-style:preserve-3d] will-change-transform"
        >
          {/* Frente: presentación del desarrollador */}
          <div className={`${CLASE_BASE_CARA} [transform:translateZ(88px)]`}>
            <BarraVentana />
            <span>
              <span className="text-blue-400">const</span>{" "}
              <span className="text-sky-300">pablo</span> = {"{"}
            </span>
            <span className="pl-1">
              rol: <span className="text-emerald-300">"Full Stack"</span>,
            </span>
            <span className="pl-1">
              cafe: <span className="text-violet-400">true</span>,
            </span>
            <span>{"};"}</span>
          </div>

          {/* Atrás: stack tecnológico */}
          <div className={`${CLASE_BASE_CARA} [transform:rotateY(180deg)_translateZ(88px)]`}>
            <BarraVentana />
            <span>stack: [</span>
            <span className="pl-1">
              <span className="text-emerald-300">"React"</span>,
            </span>
            <span className="pl-1">
              <span className="text-emerald-300">"Next.js"</span>,
            </span>
            <span className="pl-1">
              <span className="text-emerald-300">"Node"</span>]
            </span>
          </div>

          {/* Derecha: terminal */}
          <div className={`${CLASE_BASE_CARA} [transform:rotateY(90deg)_translateZ(88px)]`}>
            <BarraVentana />
            <span>
              <span className="text-emerald-300">$</span> npm run dev
            </span>
            <span className="text-emerald-300">▲ ready in 1.2s</span>
            <span className="text-slate-500">localhost:3000</span>
          </div>

          {/* Izquierda: disponibilidad */}
          <div className={`${CLASE_BASE_CARA} [transform:rotateY(-90deg)_translateZ(88px)]`}>
            <BarraVentana />
            <span className="text-sky-300">disponible</span>
            <span className="pl-1">
              = <span className="text-violet-400">true</span> ✅
            </span>
            <span className="text-slate-500">// escribime</span>
          </div>

          {/* Arriba: componente JSX */}
          <div className={`${CLASE_BASE_CARA} items-center justify-center [transform:rotateX(90deg)_translateZ(88px)]`}>
            <BarraVentana />
            <span>
              <span className="text-blue-400">{"<"}</span>
              <span className="text-sky-300">PabloBejas</span>{" "}
              <span className="text-blue-400">{"/>"}</span>
            </span>
          </div>

          {/* Abajo: commit */}
          <div className={`${CLASE_BASE_CARA} [transform:rotateX(-90deg)_translateZ(88px)]`}>
            <BarraVentana />
            <span>git commit -m</span>
            <span className="text-emerald-300">"nueva idea"</span>
          </div>
        </div>
      </div>

      {/* Sombra de piso con pulso y color acorde al tema activo */}
      <div className="animate-pulse mt-7 h-7 w-52 rounded-full bg-[radial-gradient(ellipse,rgb(var(--tema-acento-oscuro-rgb)/0.35),transparent_70%)] blur-md" />
    </div>
  );
}
