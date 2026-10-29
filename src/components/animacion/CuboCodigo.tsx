"use client";

import { useEffect, useRef } from "react";

/* Constantes del movimiento del cubo */
const SENSIBILIDAD_ARRASTRE = 0.42; // Grados por píxel de movimiento
const VELOCIDAD_GIRO_AUTOMATICO_Y = 0.22; // Velocidad de rotación automática suave (~13°/seg)
const FRICCION_INERCIA = 0.93; // Factor de amortiguación del impulso al soltar
const LIMITE_INCLINACION_X = 72; // Límite máximo para evitar volteo invertido en X

/* Clases base de cada cara del cubo (posición 3D + estilo de mini ventana de código) */
const CLASE_BASE_CARA =
  "absolute inset-0 flex flex-col rounded-xl border border-[rgb(var(--tema-acento-rgb)/0.45)] bg-[rgba(10,15,28,0.92)] p-3 text-left font-mono text-[9px] leading-relaxed text-slate-300 overflow-hidden shadow-[0_0_15px_rgb(var(--tema-acento-rgb)/0.1)] select-none";

/* Barra de puntitos estilo ventana Mac que encabeza cada cara */
const BarraVentana = () => (
  <div className="mb-1.5 flex gap-1">
    <i className="h-1.5 w-1.5 rounded-full bg-red-500" />
    <i className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
    <i className="h-1.5 w-1.5 rounded-full bg-green-500" />
  </div>
);

/**
 * Cubo 3D con mini ventanas de código interactivo.
 * Permite rotación completa de 360° mediante arrastre (drag) con física de inercia
 * y reanudación automática continua sin reiniciar su orientación en ningún momento.
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

    // Estados angulares acumulativos (nunca se resetean)
    let rotX = -14;
    let rotY = 25;
    let velocidadX = 0;
    let velocidadY = VELOCIDAD_GIRO_AUTOMATICO_Y;

    let estaArrastrando = false;
    let ultimoCursorX = 0;
    let ultimoCursorY = 0;
    let idAnimacion = 0;
    let estaEnPantalla = true;

    // --- Manejo de eventos de arrastre (Mouse & Touch) ---
    const iniciarArrastre = (clienteX: number, clienteY: number) => {
      estaArrastrando = true;
      ultimoCursorX = clienteX;
      ultimoCursorY = clienteY;
      velocidadX = 0;
      velocidadY = 0;
      zonaInteractiva.classList.add("cursor-grabbing");
      zonaInteractiva.classList.remove("cursor-grab");
    };

    const moverArrastre = (clienteX: number, clienteY: number) => {
      if (!estaArrastrando) return;

      const deltaX = clienteX - ultimoCursorX;
      const deltaY = clienteY - ultimoCursorY;
      ultimoCursorX = clienteX;
      ultimoCursorY = clienteY;

      // Actualizar rotaciones sumando el desplazamiento diferencial
      rotY += deltaX * SENSIBILIDAD_ARRASTRE;
      rotX -= deltaY * SENSIBILIDAD_ARRASTRE;

      // Limitar inclinación en X para mantener legibilidad y orientación natural
      rotX = Math.max(-LIMITE_INCLINACION_X, Math.min(LIMITE_INCLINACION_X, rotX));

      // Guardar velocidad instantánea para inercia al soltar
      velocidadX = -deltaY * SENSIBILIDAD_ARRASTRE;
      velocidadY = deltaX * SENSIBILIDAD_ARRASTRE;
    };

    const finalizarArrastre = () => {
      if (!estaArrastrando) return;
      estaArrastrando = false;
      zonaInteractiva.classList.remove("cursor-grabbing");
      zonaInteractiva.classList.add("cursor-grab");
    };

    // Listeners del mouse
    const manejarMouseDown = (evento: MouseEvent) => {
      iniciarArrastre(evento.clientX, evento.clientY);
    };

    const manejarMouseMoveVentana = (evento: MouseEvent) => {
      moverArrastre(evento.clientX, evento.clientY);
    };

    const manejarMouseUpVentana = () => {
      finalizarArrastre();
    };

    // Listeners táctiles para móviles
    const manejarTouchStart = (evento: TouchEvent) => {
      if (evento.touches.length > 0) {
        iniciarArrastre(evento.touches[0].clientX, evento.touches[0].clientY);
      }
    };

    const manejarTouchMoveVentana = (evento: TouchEvent) => {
      if (evento.touches.length > 0 && estaArrastrando) {
        evento.preventDefault();
        moverArrastre(evento.touches[0].clientX, evento.touches[0].clientY);
      }
    };

    const manejarTouchEndVentana = () => {
      finalizarArrastre();
    };

    // Bucle continuo de renderizado 3D y física
    const animar = () => {
      if (!estaEnPantalla) {
        idAnimacion = 0;
        return;
      }

      if (!estaArrastrando) {
        // Aplicar inercia residual
        rotX += velocidadX;
        rotY += velocidadY;

        // Amortiguar inercia progresivamente
        velocidadX *= FRICCION_INERCIA;
        velocidadY *= FRICCION_INERCIA;

        rotX = Math.max(-LIMITE_INCLINACION_X, Math.min(LIMITE_INCLINACION_X, rotX));

        // Transición natural al giro automático constante en Y
        if (Math.abs(velocidadY) < VELOCIDAD_GIRO_AUTOMATICO_Y) {
          velocidadY = VELOCIDAD_GIRO_AUTOMATICO_Y;
        }
      }

      cubo.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      idAnimacion = requestAnimationFrame(animar);
    };

    // Pausar animación cuando no esté visible en viewport
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

    zonaInteractiva.classList.add("cursor-grab");
    zonaInteractiva.addEventListener("mousedown", manejarMouseDown);
    zonaInteractiva.addEventListener("touchstart", manejarTouchStart, { passive: true });

    window.addEventListener("mousemove", manejarMouseMoveVentana);
    window.addEventListener("mouseup", manejarMouseUpVentana);
    window.addEventListener("touchmove", manejarTouchMoveVentana, { passive: false });
    window.addEventListener("touchend", manejarTouchEndVentana);

    idAnimacion = requestAnimationFrame(animar);

    return () => {
      cancelAnimationFrame(idAnimacion);
      observadorVisibilidad.disconnect();

      zonaInteractiva.removeEventListener("mousedown", manejarMouseDown);
      zonaInteractiva.removeEventListener("touchstart", manejarTouchStart);

      window.removeEventListener("mousemove", manejarMouseMoveVentana);
      window.removeEventListener("mouseup", manejarMouseUpVentana);
      window.removeEventListener("touchmove", manejarTouchMoveVentana);
      window.removeEventListener("touchend", manejarTouchEndVentana);
    };
  }, []);

  return (
    <div className="zona-cubo flex flex-col items-center select-none">
      {/* Escena con perspectiva 3D */}
      <div className="h-44 w-44 [perspective:640px] select-none">
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
              rol: <span className="text-emerald-300">&quot;Full Stack&quot;</span>,
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
              <span className="text-emerald-300">&quot;React&quot;</span>,
            </span>
            <span className="pl-1">
              <span className="text-emerald-300">&quot;Next.js&quot;</span>,
            </span>
            <span className="pl-1">
              <span className="text-emerald-300">&quot;Node&quot;</span>]
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
            <span className="text-slate-500">{"// escribime"}</span>
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
            <span className="text-emerald-300">&quot;nueva idea&quot;</span>
          </div>
        </div>
      </div>

      {/* Sombra de piso con pulso y color acorde al tema activo */}
      <div className="animate-pulse mt-7 h-7 w-52 rounded-full bg-[radial-gradient(ellipse,rgb(var(--tema-acento-oscuro-rgb)/0.35),transparent_70%)] blur-md" />
    </div>
  );
}
