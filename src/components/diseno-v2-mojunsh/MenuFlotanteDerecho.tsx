"use client";

import React, { useEffect, useState, useRef } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Layers,
  Cpu,
  Rocket,
  Briefcase,
  HelpCircle,
  Mail,
  Settings,
  ArrowUp,
  Check,
} from "lucide-react";

interface ElementoSeccion {
  identificador: string;
  etiqueta: string;
  icono: React.ElementType;
}

const SECCIONES_MENU: ElementoSeccion[] = [
  { identificador: "inicio", etiqueta: "Inicio", icono: Home },
  { identificador: "stack", etiqueta: "Tecnologías", icono: Layers },
  { identificador: "servicios", etiqueta: "Servicios", icono: Cpu },
  { identificador: "proceso", etiqueta: "Metodología", icono: Rocket },
  { identificador: "proyectos", etiqueta: "Proyectos", icono: Briefcase },
  { identificador: "faq", etiqueta: "Preguntas", icono: HelpCircle },
  { identificador: "contacto", etiqueta: "Contacto", icono: Mail },
];

const IDIOMAS = [
  { codigo: "es", etiqueta: "ES" },
  { codigo: "en", etiqueta: "EN" },
  { codigo: "pt", etiqueta: "PT" },
];

type TipoTemaColor = "azul" | "verde" | "ambar";

interface OpcionColorTema {
  id: TipoTemaColor;
  nombre: string;
  hex: string;
}

const COLORES_TEMA: OpcionColorTema[] = [
  { id: "azul", nombre: "Azul Eléctrico", hex: "#38bdf8" },
  { id: "verde", nombre: "Verde", hex: "#10b981" },
  { id: "ambar", nombre: "Amarillo Ámbar", hex: "#f59e0b" },
];

/**
 * Menú flotante lateral derecho estilo Dock minimalista inspirado en mojunsh.com.
 * Integra:
 * - Botones de navegación por secciones con scrollspy e indicador activo.
 * - Botón de configuración que despliega opciones de idioma y paleta de colores.
 * - Botón inferior de 'Volver al Inicio' (Scroll to top) visible fuera de la cabecera.
 */
export function MenuFlotanteDerecho() {
  const [seccionActiva, setSeccionActiva] = useState<string>("inicio");
  const [mostrarBotonArriba, setMostrarBotonArriba] = useState<boolean>(false);
  const [panelConfiguracionAbierto, setPanelConfiguracionAbierto] = useState<boolean>(false);
  const [temaActivo, setTemaActivo] = useState<TipoTemaColor>("azul");

  const contenedorConfigRef = useRef<HTMLDivElement>(null);
  const idiomaActual = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // 1. Sincroniza el tema activo leyendo la propiedad en el DOM o en localStorage
  useEffect(() => {
    try {
      const temaEnDocumento = document.documentElement.getAttribute("data-tema") as TipoTemaColor | null;
      if (temaEnDocumento && ["azul", "verde", "ambar"].includes(temaEnDocumento)) {
        setTemaActivo(temaEnDocumento);
      } else {
        const temaAlmacenado = localStorage.getItem("tema") as TipoTemaColor | null;
        if (temaAlmacenado && ["azul", "verde", "ambar"].includes(temaAlmacenado)) {
          setTemaActivo(temaAlmacenado);
        }
      }
    } catch {
      // Ignorar si no hay acceso a almacenamiento local
    }
  }, []);

  // 2. ScrollSpy para detectar la sección activa y visibilidad del botón para volver arriba
  useEffect(() => {
    const manejarScroll = () => {
      // Visibilidad del botón Volver arriba cuando scrollY > 250
      setMostrarBotonArriba(window.scrollY > 250);

      // Detección de sección activa
      const posicionScroll = window.scrollY + window.innerHeight / 3;

      for (let i = SECCIONES_MENU.length - 1; i >= 0; i--) {
        const elemento = document.getElementById(SECCIONES_MENU[i].identificador);
        if (elemento) {
          const distanciaTop = elemento.offsetTop;
          if (posicionScroll >= distanciaTop) {
            setSeccionActiva(SECCIONES_MENU[i].identificador);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", manejarScroll, { passive: true });
    manejarScroll();

    return () => window.removeEventListener("scroll", manejarScroll);
  }, []);

  // 3. Cerrar el panel de configuración al hacer clic fuera
  useEffect(() => {
    const manejarClicFuera = (evento: MouseEvent) => {
      if (
        contenedorConfigRef.current &&
        !contenedorConfigRef.current.contains(evento.target as Node)
      ) {
        setPanelConfiguracionAbierto(false);
      }
    };

    if (panelConfiguracionAbierto) {
      document.addEventListener("mousedown", manejarClicFuera);
    }

    return () => {
      document.removeEventListener("mousedown", manejarClicFuera);
    };
  }, [panelConfiguracionAbierto]);

  // Cambiar idioma de la aplicación
  const cambiarIdioma = (nuevoIdioma: "es" | "en" | "pt") => {
    router.replace(pathname, { locale: nuevoIdioma });
  };

  // Cambiar paleta de color y propagar el evento
  const cambiarColorTema = (nuevoTema: TipoTemaColor) => {
    setTemaActivo(nuevoTema);
    document.documentElement.setAttribute("data-tema", nuevoTema);
    try {
      localStorage.setItem("tema", nuevoTema);
      window.dispatchEvent(new Event("cambio-tema"));
    } catch {
      // Manejo seguro de cuota o modo incógnito
    }
  };

  // Volver suavemente al inicio de la página
  const volverAlInicio = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 pointer-events-none">
      {/* Dock Principal de Navegación: Mantiene altura y posición vertical constante en todo momento */}
      <nav
        aria-label="Navegación de secciones de la página"
        className="pointer-events-auto relative flex flex-col items-center gap-1 p-1.5 sm:p-2 rounded-full bg-[#0c0a09]/85 backdrop-blur-2xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.6)]"
      >
        {/* Enlaces de secciones con ScrollSpy y deslizamiento suave continuo */}
        {SECCIONES_MENU.map((seccion) => {
          const Icono = seccion.icono;
          const estaActiva = seccionActiva === seccion.identificador;

          return (
            <a
              key={seccion.identificador}
              href={`#${seccion.identificador}`}
              className="group relative p-2.5 sm:p-3 rounded-full transition-colors duration-200 flex items-center justify-center text-neutral-400 hover:text-white"
              aria-label={seccion.etiqueta}
            >
              {/* Difuminado puro con resplandor glow (sin borde duro) animado fluidamente entre opciones */}
              {estaActiva && (
                <motion.span
                  layoutId="resplandor-dock-activo"
                  className="absolute inset-0 rounded-full bg-[rgb(var(--tema-acento-rgb)/0.22)] shadow-[0_0_22px_rgba(var(--tema-acento-rgb),0.55)] pointer-events-none"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 28,
                    mass: 0.8,
                  }}
                />
              )}

              {/* Icono con brillo suave y escala refinada */}
              <Icono
                className={`relative z-10 w-4 h-4 sm:w-4.5 sm:h-4.5 transition-all duration-300 ${
                  estaActiva
                    ? "text-[rgb(var(--tema-acento-claro-rgb))] scale-110 drop-shadow-[0_0_10px_rgba(var(--tema-acento-claro-rgb),0.7)]"
                    : "group-hover:scale-105"
                }`}
              />

              {/* Tooltip lateral hacia la izquierda */}
              <span className="pointer-events-none absolute right-full mr-3 px-2.5 py-1 rounded-lg text-[11px] font-mono tracking-wider font-semibold text-white bg-black/90 border border-white/10 shadow-xl opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap z-20">
                {seccion.etiqueta}
              </span>
            </a>
          );
        })}

        {/* Separador sutil */}
        <div className="w-4 h-[1px] bg-white/10 my-1" />

        {/* Botón de Configuración (Idioma y Colores) */}
        <div className="relative" ref={contenedorConfigRef}>
          <button
            type="button"
            onClick={() => setPanelConfiguracionAbierto(!panelConfiguracionAbierto)}
            className={`group relative p-2 sm:p-2.5 rounded-full transition-all flex items-center justify-center ${
              panelConfiguracionAbierto
                ? "bg-[rgb(var(--tema-acento-rgb)/0.22)] text-[rgb(var(--tema-acento-claro-rgb))] shadow-[0_0_15px_rgba(var(--tema-acento-rgb),0.4)]"
                : "text-neutral-400 hover:text-white hover:bg-white/10"
            }`}
            aria-label="Abrir configuración de idioma y tema"
            title="Configuración"
          >
            <Settings className={`w-4 h-4 transition-transform duration-300 ${panelConfiguracionAbierto ? "rotate-90" : ""}`} />

            {/* Tooltip lateral */}
            {!panelConfiguracionAbierto && (
              <span className="pointer-events-none absolute right-full mr-3 px-2.5 py-1 rounded-lg text-[11px] font-mono tracking-wider font-semibold text-white bg-black/90 border border-white/10 shadow-xl opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap">
                Configuración
              </span>
            )}
          </button>

          {/* Panel Desplegable de Ajustes hacia la izquierda */}
          <AnimatePresence>
            {panelConfiguracionAbierto && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="absolute right-full mr-3 bottom-0 w-56 p-3.5 rounded-2xl bg-[#0c0a09]/95 backdrop-blur-2xl border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex flex-col gap-3.5 z-50 text-left"
              >
                {/* Cabecera del panel */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-neutral-200 flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5 text-[rgb(var(--tema-acento-claro-rgb))]" />
                    <span>Preferencias</span>
                  </span>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                    V2
                  </span>
                </div>

                {/* Selección de Idioma */}
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Idioma
                  </span>
                  <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                    {IDIOMAS.map((item) => {
                      const esSeleccionado = idiomaActual === item.codigo;
                      return (
                        <button
                          key={item.codigo}
                          type="button"
                          onClick={() => cambiarIdioma(item.codigo as "es" | "en" | "pt")}
                          className={`py-1 text-xs font-mono font-semibold rounded-lg transition-all ${
                            esSeleccionado
                              ? "bg-[rgb(var(--tema-acento-rgb))] text-black shadow-sm font-bold"
                              : "text-neutral-400 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {item.etiqueta}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selección de Color de Acento */}
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Color de Acento
                  </span>
                  <div className="flex flex-col gap-1">
                    {COLORES_TEMA.map((color) => {
                      const esActivo = temaActivo === color.id;
                      return (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => cambiarColorTema(color.id)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-sans transition-all border ${
                            esActivo
                              ? "bg-white/10 border-[rgb(var(--tema-acento-rgb)/0.5)] text-white font-medium"
                              : "border-transparent text-neutral-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] flex-shrink-0"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="text-[11px]">{color.nombre}</span>
                          </div>
                          {esActivo && (
                            <Check className="w-3.5 h-3.5 text-[rgb(var(--tema-acento-claro-rgb))]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Botón Flotante 'Volver al Inicio' anclado absolutamente debajo del dock sin alterar la altura del nav */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 pointer-events-none">
        <AnimatePresence>
          {mostrarBotonArriba && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: -10 }}
              transition={{ duration: 0.2 }}
              type="button"
              onClick={volverAlInicio}
              className="pointer-events-auto group relative p-2.5 sm:p-3 rounded-full bg-[#0c0a09]/85 backdrop-blur-2xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.6)] text-neutral-400 hover:text-[rgb(var(--tema-acento-claro-rgb))] hover:border-[rgb(var(--tema-acento-rgb)/0.4)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
              aria-label="Volver al inicio de la página"
              title="Volver al inicio"
            >
              <ArrowUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:-translate-y-0.5 transition-transform" />

              {/* Tooltip lateral hacia la izquierda */}
              <span className="pointer-events-none absolute right-full mr-3 px-2.5 py-1 rounded-lg text-[11px] font-mono tracking-wider font-semibold text-white bg-black/90 border border-white/10 shadow-xl opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap">
                Volver arriba
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
