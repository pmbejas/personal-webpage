"use client";

import { useEffect, useRef } from "react";
import { IsotipoLogo } from "@/components/layout/IsotipoLogo";

/* [MEJORA-VISUAL-08] Constantes físicas normalizadas por segundo (independientes de 60/120/144Hz) */
const SENSIBILIDAD_ARRASTRE = 0.42;
const VELOCIDAD_GIRO_AUTOMATICO_GRADOS_SEG = 14;
const FACTOR_AMORTIGUACION_SEG = 4.5;
const LIMITE_INCLINACION_X = 72;
const MAXIMO_DELTA_SEGUNDOS = 0.05;

/* Superficie oscura neutra armonizada con los 4 temas, mayor legibilidad y backface-visibility:hidden */
const CLASE_BASE_CARA =
  "absolute inset-0 flex flex-col justify-between rounded-2xl border border-[rgb(var(--tema-acento-rgb)/0.5)] bg-[#0c0a09]/95 p-3.5 text-left font-mono text-[10.5px] leading-[1.45] text-neutral-200 overflow-hidden shadow-[inset_0_0_24px_rgb(var(--tema-acento-rgb)/0.12),0_0_18px_rgb(var(--tema-acento-rgb)/0.14)] select-none [backface-visibility:hidden]";

interface PropiedadesCabeceraVentana {
  etiquetaArchivo: string;
}

/* Barra superior estilo editor con puntos y nombre breve del archivo */
function BarraVentana({ etiquetaArchivo }: PropiedadesCabeceraVentana) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2 pb-1.5 border-b border-white/10">
      <div className="flex gap-1">
        <i className="h-1.5 w-1.5 rounded-full bg-rose-500/90" />
        <i className="h-1.5 w-1.5 rounded-full bg-amber-400/90" />
        <i className="h-1.5 w-1.5 rounded-full bg-emerald-400/90" />
      </div>
      <span className="text-[8.5px] uppercase tracking-wider text-neutral-500 truncate">
        {etiquetaArchivo}
      </span>
    </div>
  );
}

/**
 * [MEJORA-VISUAL-08] Cubo 3D interactivo optimizado:
 * - Escala ampliada (h-48 w-48) con tipografía nítida (10.5px) y superficie neutra reactiva a los 4 temas.
 * - Stack actualizado (.NET 10, Next.js 15, PostgreSQL, Clean Architecture, Docker).
 * - Física normalizada por deltaTime (velocidad idéntica en 60Hz, 120Hz y 144Hz).
 * - Listeners globales registrados únicamente durante el arrastre activo + touch-none local.
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
      cubo.style.transform = "rotateX(-14deg) rotateY(25deg)";
      return;
    }

    const zonaInteractiva = cubo.closest<HTMLElement>(".zona-cubo") ?? cubo;

    let rotX = -14;
    let rotY = 25;
    let velocidadX = 0;
    let velocidadY = VELOCIDAD_GIRO_AUTOMATICO_GRADOS_SEG;

    let estaArrastrando = false;
    let ultimoCursorX = 0;
    let ultimoCursorY = 0;
    let ultimoTiempoMs = performance.now();
    let idAnimacion = 0;
    let estaEnPantalla = true;

    const moverArrastre = (clienteX: number, clienteY: number) => {
      if (!estaArrastrando) return;

      const deltaX = clienteX - ultimoCursorX;
      const deltaY = clienteY - ultimoCursorY;
      ultimoCursorX = clienteX;
      ultimoCursorY = clienteY;

      rotY += deltaX * SENSIBILIDAD_ARRASTRE;
      rotX = Math.max(
        -LIMITE_INCLINACION_X,
        Math.min(LIMITE_INCLINACION_X, rotX - deltaY * SENSIBILIDAD_ARRASTRE)
      );

      // Convertir impulso del puntero a grados/segundo para inercia consistente
      velocidadX = -deltaY * SENSIBILIDAD_ARRASTRE * 45;
      velocidadY = deltaX * SENSIBILIDAD_ARRASTRE * 45;
    };

    const manejarMouseMoveVentana = (evento: MouseEvent) => {
      moverArrastre(evento.clientX, evento.clientY);
    };

    const manejarTouchMoveVentana = (evento: TouchEvent) => {
      if (evento.touches.length > 0 && estaArrastrando) {
        evento.preventDefault();
        moverArrastre(evento.touches[0].clientX, evento.touches[0].clientY);
      }
    };

    const desvincularListenersArrastre = () => {
      window.removeEventListener("mousemove", manejarMouseMoveVentana);
      window.removeEventListener("mouseup", finalizarArrastre);
      window.removeEventListener("touchmove", manejarTouchMoveVentana);
      window.removeEventListener("touchend", finalizarArrastre);
      window.removeEventListener("touchcancel", finalizarArrastre);
    };

    const finalizarArrastre = () => {
      if (!estaArrastrando) return;
      estaArrastrando = false;
      zonaInteractiva.classList.remove("cursor-grabbing");
      zonaInteractiva.classList.add("cursor-grab");
      desvincularListenersArrastre();
    };

    const iniciarArrastre = (clienteX: number, clienteY: number) => {
      estaArrastrando = true;
      ultimoCursorX = clienteX;
      ultimoCursorY = clienteY;
      velocidadX = 0;
      velocidadY = 0;
      zonaInteractiva.classList.add("cursor-grabbing");
      zonaInteractiva.classList.remove("cursor-grab");

      window.addEventListener("mousemove", manejarMouseMoveVentana);
      window.addEventListener("mouseup", finalizarArrastre);
      window.addEventListener("touchmove", manejarTouchMoveVentana, {
        passive: false,
      });
      window.addEventListener("touchend", finalizarArrastre);
      window.addEventListener("touchcancel", finalizarArrastre);
    };

    const manejarMouseDown = (evento: MouseEvent) => {
      iniciarArrastre(evento.clientX, evento.clientY);
    };

    const manejarTouchStart = (evento: TouchEvent) => {
      if (evento.touches.length > 0) {
        iniciarArrastre(evento.touches[0].clientX, evento.touches[0].clientY);
      }
    };

    const animar = (tiempoActualMs: number) => {
      if (!estaEnPantalla) {
        idAnimacion = 0;
        return;
      }

      const deltaSegundos = Math.min(
        MAXIMO_DELTA_SEGUNDOS,
        Math.max(0.001, (tiempoActualMs - ultimoTiempoMs) / 1000)
      );
      ultimoTiempoMs = tiempoActualMs;

      if (!estaArrastrando) {
        rotX = Math.max(
          -LIMITE_INCLINACION_X,
          Math.min(LIMITE_INCLINACION_X, rotX + velocidadX * deltaSegundos)
        );
        rotY += velocidadY * deltaSegundos;

        const decaimiento = Math.exp(-FACTOR_AMORTIGUACION_SEG * deltaSegundos);
        velocidadX *= decaimiento;
        velocidadY =
          VELOCIDAD_GIRO_AUTOMATICO_GRADOS_SEG +
          (velocidadY - VELOCIDAD_GIRO_AUTOMATICO_GRADOS_SEG) * decaimiento;
      }

      cubo.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      idAnimacion = requestAnimationFrame(animar);
    };

    const observadorVisibilidad = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          estaEnPantalla = entrada.isIntersecting;
          if (estaEnPantalla && !idAnimacion) {
            ultimoTiempoMs = performance.now();
            idAnimacion = requestAnimationFrame(animar);
          }
        });
      },
      { threshold: 0.05 }
    );
    observadorVisibilidad.observe(zonaInteractiva);

    zonaInteractiva.classList.add("cursor-grab");
    zonaInteractiva.addEventListener("mousedown", manejarMouseDown);
    zonaInteractiva.addEventListener("touchstart", manejarTouchStart, {
      passive: true,
    });

    idAnimacion = requestAnimationFrame(animar);

    return () => {
      cancelAnimationFrame(idAnimacion);
      observadorVisibilidad.disconnect();
      zonaInteractiva.removeEventListener("mousedown", manejarMouseDown);
      zonaInteractiva.removeEventListener("touchstart", manejarTouchStart);
      desvincularListenersArrastre();
    };
  }, []);

  return (
    <div
      className="zona-cubo flex flex-col items-center select-none touch-none"
      role="img"
      aria-label="Cubo 3D interactivo con el stack tecnológico de Pablo Bejas"
    >
      {/* Escena con perspectiva 3D optimizada */}
      <div className="h-48 w-48 [perspective:720px] select-none">
        <div
          ref={referenciaCubo}
          className="relative h-full w-full [transform-style:preserve-3d] will-change-transform"
        >
          {/* Frente: perfil técnico */}
          <div className={`${CLASE_BASE_CARA} [transform:translateZ(96px)]`}>
            <BarraVentana etiquetaArchivo="perfil.ts" />
            <div className="flex flex-col gap-0.5 my-auto">
              <span>
                <span className="text-[rgb(var(--tema-acento-claro-rgb))]">const</span>{" "}
                <span className="text-white font-semibold">pablo</span> = {"{"}
              </span>
              <span className="pl-2 text-neutral-300">
                rol: <span className="text-emerald-300">&quot;Full Stack&quot;</span>,
              </span>
              <span className="pl-2 text-neutral-300">
                arq: <span className="text-emerald-300">&quot;Clean Arch&quot;</span>
              </span>
              <span>{"};"}</span>
            </div>
            <span className="text-[8.5px] text-neutral-500">SOLID · DDD</span>
          </div>

          {/* Atrás: stack real actualizado */}
          <div className={`${CLASE_BASE_CARA} [transform:rotateY(180deg)_translateZ(96px)]`}>
            <BarraVentana etiquetaArchivo="stack.json" />
            <div className="flex flex-col gap-0.5 my-auto">
              <span className="text-neutral-400">stack: [</span>
              <span className="pl-2 text-[rgb(var(--tema-acento-claro-rgb))] font-semibold">
                &quot;.NET 10 / C#&quot;,
              </span>
              <span className="pl-2 text-emerald-300">&quot;Next.js 15&quot;,</span>
              <span className="pl-2 text-amber-300">&quot;PostgreSQL&quot;</span>
              <span className="text-neutral-400">]</span>
            </div>
            <span className="text-[8.5px] text-neutral-500">EF Core · Dapper</span>
          </div>

          {/* Derecha: terminal de compilación */}
          <div className={`${CLASE_BASE_CARA} [transform:rotateY(90deg)_translateZ(96px)]`}>
            <BarraVentana etiquetaArchivo="terminal" />
            <div className="flex flex-col gap-1 my-auto">
              <span>
                <span className="text-[rgb(var(--tema-acento-claro-rgb))]">$</span>{" "}
                dotnet build
              </span>
              <span className="text-emerald-400">✓ 0 warnings · 0 err</span>
              <span className="text-neutral-400">▲ Next.js SSR ready</span>
            </div>
            <span className="text-[8.5px] text-neutral-500">prod · ssl</span>
          </div>

          {/* Izquierda: disponibilidad */}
          <div className={`${CLASE_BASE_CARA} [transform:rotateY(-90deg)_translateZ(96px)]`}>
            <BarraVentana etiquetaArchivo="estado.ts" />
            <div className="flex flex-col gap-0.5 my-auto">
              <span className="text-[rgb(var(--tema-acento-claro-rgb))] font-semibold">
                disponible
              </span>
              <span className="pl-2">
                = <span className="text-emerald-400 font-semibold">true</span>;
              </span>
              <span className="text-neutral-400 mt-1">{"// remoto global"}</span>
            </div>
            <span className="text-[8.5px] text-neutral-500">ES · EN · PT</span>
          </div>

          {/* Arriba: marca oficial con isotipo robot + JSX */}
          <div className={`${CLASE_BASE_CARA} [transform:rotateX(90deg)_translateZ(96px)]`}>
            <BarraVentana etiquetaArchivo="marca.tsx" />
            <div className="my-auto flex flex-col items-center text-center">
              <IsotipoLogo className="h-12 w-auto mb-2" />
              <span className="text-xs font-bold block">
                <span className="text-[rgb(var(--tema-acento-claro-rgb))]">{"<"}</span>
                <span className="text-white">PabloBejas</span>
                <span className="text-[rgb(var(--tema-acento-claro-rgb))]">{" />"}</span>
              </span>
              <span className="text-[9px] text-neutral-400 mt-0.5 block">
                Software Architecture
              </span>
            </div>
            <span className="text-[8.5px] text-neutral-500 text-center">v3 · 2026</span>
          </div>

          {/* Abajo: infraestructura */}
          <div className={`${CLASE_BASE_CARA} [transform:rotateX(-90deg)_translateZ(96px)]`}>
            <BarraVentana etiquetaArchivo="deploy.yml" />
            <div className="flex flex-col gap-1 my-auto">
              <span className="text-neutral-300">docker compose up</span>
              <span className="text-[rgb(var(--tema-acento-claro-rgb))]">
                CI/CD · Cloud
              </span>
              <span className="text-emerald-400">status: healthy</span>
            </div>
            <span className="text-[8.5px] text-neutral-500">Vercel · Render</span>
          </div>
        </div>
      </div>

      {/* Sombra de piso suave acorde al tema activo */}
      <div className="animate-pulse mt-8 h-7 w-56 rounded-full bg-[radial-gradient(ellipse,rgb(var(--tema-acento-rgb)/0.38),transparent_70%)] blur-md" />
    </div>
  );
}
