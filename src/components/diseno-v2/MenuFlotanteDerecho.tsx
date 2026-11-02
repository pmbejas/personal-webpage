"use client";

import React, { useEffect, useState, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { VERSION_SITIO } from "@/data/datosVersion";
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
  claveTraduccion: "inicio" | "stack" | "servicios" | "proceso" | "proyectos" | "faq" | "contacto";
  icono: React.ElementType;
}

const SECCIONES_MENU: ElementoSeccion[] = [
  { identificador: "inicio", claveTraduccion: "inicio", icono: Home },
  { identificador: "stack", claveTraduccion: "stack", icono: Layers },
  { identificador: "servicios", claveTraduccion: "servicios", icono: Cpu },
  { identificador: "proceso", claveTraduccion: "proceso", icono: Rocket },
  { identificador: "proyectos", claveTraduccion: "proyectos", icono: Briefcase },
  { identificador: "faq", claveTraduccion: "faq", icono: HelpCircle },
  { identificador: "contacto", claveTraduccion: "contacto", icono: Mail },
];

const IDIOMAS = [
  { codigo: "es", etiqueta: "ES" },
  { codigo: "en", etiqueta: "EN" },
  { codigo: "pt", etiqueta: "PT" },
];

type TipoTemaColor = "azul" | "verde" | "ambar";

interface OpcionColorTema {
  id: TipoTemaColor;
  claveTraduccion: "colores.azul" | "colores.verde" | "colores.ambar";
  hex: string;
}

const COLORES_TEMA: OpcionColorTema[] = [
  { id: "azul", claveTraduccion: "colores.azul", hex: "#38bdf8" },
  { id: "verde", claveTraduccion: "colores.verde", hex: "#10b981" },
  { id: "ambar", claveTraduccion: "colores.ambar", hex: "#f59e0b" },
];

/**
 * Menú flotante lateral derecho estilo Dock minimalista.
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
  const traduccionesDock = useTranslations("menuDock");
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
    <div className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:left-auto lg:right-4 xl:right-6 lg:translate-x-0 z-40 pointer-events-none max-w-[calc(100vw-1.5rem)]">
      {/* Dock Principal de Navegación: Horizontal superior en móvil, vertical a la derecha en escritorio */}
      <nav
        aria-label="Navegación de secciones de la página"
        className="pointer-events-auto relative flex flex-row lg:flex-col items-center gap-0.5 sm:gap-1 p-1 sm:p-2 rounded-full bg-[#0c0a09]/90 backdrop-blur-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.7)]"
      >
        {/* Enlaces de secciones con ScrollSpy y deslizamiento suave continuo */}
        {SECCIONES_MENU.map((seccion) => {
          const Icono = seccion.icono;
          const estaActiva = seccionActiva === seccion.identificador;
          const etiquetaTraducida = traduccionesDock(seccion.claveTraduccion);

          return (
            <a
              key={seccion.identificador}
              href={`#${seccion.identificador}`}
              className="group relative p-2 sm:p-2.5 lg:p-3 rounded-full transition-colors duration-200 flex items-center justify-center text-neutral-400 hover:text-white"
              aria-label={etiquetaTraducida}
            >
              {/* Efecto Spotlight (#3): Responsivo (Desde arriba en móvil horizontal, desde la izquierda en desktop vertical) */}
              {estaActiva && (
                <motion.div
                  layoutId="spotlight-dock-activo"
                  className="absolute inset-[-4px] pointer-events-none flex items-center justify-center overflow-visible z-0"
                  transition={{
                    type: "spring",
                    stiffness: 340,
                    damping: 24,
                    mass: 0.6,
                  }}
                >
                  {/* Contenedor del haz con física pendular (Swing) al desplazarse */}
                  <motion.div
                    key={`spotlight-swing-${seccion.identificador}`}
                    initial={{ rotate: -8, scale: 0.94 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 16,
                      mass: 0.5,
                    }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    {/* A. VERSIÓN MÓVIL (< lg): Haz cenital emitido desde el borde SUPERIOR hacia abajo */}
                    <div className="block lg:hidden absolute inset-0">
                      {/* 1. Lente o proyector emisor en borde superior */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 sm:w-5 h-[2px] rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.95),0_0_16px_4px_rgba(var(--tema-acento-claro-rgb),0.85)] z-20" />

                      {/* 2. Haz de luz cónico trapezoidal proyectado de arriba hacia abajo */}
                      <div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[rgb(var(--tema-acento-claro-rgb)/0.55)] via-[rgb(var(--tema-acento-rgb)/0.25)] to-transparent"
                        style={{
                          clipPath: "polygon(22% 0%, 78% 0%, 100% 100%, 0% 100%)",
                          filter: "drop-shadow(0 0 12px rgba(var(--tema-acento-rgb),0.4))",
                        }}
                      />

                      {/* 3. Piscina de luz ambiental difusa bañando el ícono desde arriba */}
                      <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_50%_35%,rgba(var(--tema-acento-rgb),0.45)_0%,rgba(var(--tema-acento-rgb),0.15)_55%,transparent_80%)] blur-[2px]" />
                    </div>

                    {/* B. VERSIÓN ESCRITORIO (>= lg): Haz horizontal emitido desde el borde IZQUIERDO hacia la derecha */}
                    <div className="hidden lg:block absolute inset-0">
                      {/* 1. Lente o proyector emisor en borde izquierdo */}
                      <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[2.5px] h-5 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.95),0_0_16px_4px_rgba(var(--tema-acento-claro-rgb),0.85)] z-20" />

                      {/* 2. Haz de luz cónico trapezoidal proyectado de izquierda a derecha */}
                      <div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[rgb(var(--tema-acento-claro-rgb)/0.55)] via-[rgb(var(--tema-acento-rgb)/0.25)] to-transparent"
                        style={{
                          clipPath: "polygon(0% 22%, 100% 0%, 100% 100%, 0% 78%)",
                          filter: "drop-shadow(0 0 12px rgba(var(--tema-acento-rgb),0.4))",
                        }}
                      />

                      {/* 3. Piscina de luz ambiental difusa bañando el ícono hacia la derecha */}
                      <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_35%_50%,rgba(var(--tema-acento-rgb),0.45)_0%,rgba(var(--tema-acento-rgb),0.15)_55%,transparent_80%)] blur-[2px]" />
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Icono con iluminación activa y brillo */}
              <Icono
                className={`relative z-10 w-4 h-4 sm:w-4.5 sm:h-4.5 transition-all duration-300 ${
                  estaActiva
                    ? "text-[rgb(var(--tema-acento-claro-rgb))] scale-110 drop-shadow-[0_0_12px_rgba(var(--tema-acento-claro-rgb),0.85)]"
                    : "group-hover:scale-105"
                }`}
              />

              {/* Tooltip (hacia abajo en móvil superior, hacia la izquierda en desktop) */}
              <span className="pointer-events-none absolute top-full mt-2.5 left-1/2 -translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:left-auto lg:right-full lg:mr-3 px-2.5 py-1 rounded-lg text-[11px] font-mono tracking-wider font-semibold text-white bg-black/90 border border-white/10 shadow-xl opacity-0 -translate-y-1 lg:translate-y-0 lg:translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 lg:group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap z-20">
                {etiquetaTraducida}
              </span>
            </a>
          );
        })}

        {/* Separador sutil (vertical en móvil horizontal, horizontal en desktop vertical) */}
        <div className="w-[1px] h-4 mx-0.5 sm:mx-1 lg:w-4 lg:h-[1px] lg:my-1 lg:mx-0 bg-white/10" />

        {/* Botón de Configuración (Idioma y Colores) con su propio Spotlight Fijo Cenital (Desde la línea divisoria superior) */}
        <div className="relative" ref={contenedorConfigRef}>
          <button
            type="button"
            onClick={() => setPanelConfiguracionAbierto(!panelConfiguracionAbierto)}
            className="group relative p-2 sm:p-2.5 lg:p-3 rounded-full transition-all flex items-center justify-center text-neutral-400 hover:text-white"
            aria-label={traduccionesDock("abrirConfiguracion")}
            title={traduccionesDock("configuracion")}
          >
            {/* Spotlight Fijo Dedicado (Responsivo: desde la derecha en móvil horizontal, desde arriba en desktop vertical) */}
            <div className="absolute inset-[-4px] pointer-events-none flex items-center justify-center overflow-visible z-0">
              <div className="relative w-full h-full flex flex-col items-center justify-center">

                {/* A. VERSIÓN MÓVIL (< lg): Haz lateral emitido desde el borde DERECHO hacia la izquierda */}
                <div className="block lg:hidden absolute inset-0">
                  {/* 1. Lente o proyector emisor en borde derecho */}
                  <div
                    className={`absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-all duration-300 z-20 ${
                      panelConfiguracionAbierto
                        ? "w-[2.5px] h-5 sm:h-6 shadow-[0_0_10px_3px_rgba(255,255,255,1),0_0_20px_5px_rgba(var(--tema-acento-claro-rgb),0.95)]"
                        : "w-[2px] h-4 sm:h-5 opacity-80 shadow-[0_0_6px_1px_rgba(255,255,255,0.9),0_0_12px_2px_rgba(var(--tema-acento-claro-rgb),0.7)] group-hover:opacity-100 group-hover:h-5"
                    }`}
                  />

                  {/* 2. Haz de luz cónico trapezoidal proyectado de derecha a izquierda */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-l from-[rgb(var(--tema-acento-claro-rgb)/0.50)] via-[rgb(var(--tema-acento-rgb)/0.22)] to-transparent transition-opacity duration-300 ${
                      panelConfiguracionAbierto ? "opacity-100" : "opacity-70 group-hover:opacity-95"
                    }`}
                    style={{
                      clipPath: "polygon(100% 22%, 0% 0%, 0% 100%, 100% 78%)",
                      filter: "drop-shadow(0 0 10px rgba(var(--tema-acento-rgb),0.35))",
                    }}
                  />

                  {/* 3. Piscina de luz ambiental difusa bañando el ícono desde la derecha */}
                  <div
                    className={`absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_65%_50%,rgba(var(--tema-acento-rgb),0.40)_0%,rgba(var(--tema-acento-rgb),0.12)_55%,transparent_80%)] blur-[2px] transition-opacity duration-300 ${
                      panelConfiguracionAbierto ? "opacity-100" : "opacity-65 group-hover:opacity-90"
                    }`}
                  />
                </div>

                {/* B. VERSIÓN ESCRITORIO (>= lg): Haz cenital emitido desde el borde SUPERIOR (línea divisoria) hacia abajo */}
                <div className="hidden lg:block absolute inset-0">
                  {/* 1. Lente o proyector emisor en borde superior */}
                  <div
                    className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-all duration-300 z-20 ${
                      panelConfiguracionAbierto
                        ? "w-5 sm:w-6 h-[2.5px] shadow-[0_0_10px_3px_rgba(255,255,255,1),0_0_20px_5px_rgba(var(--tema-acento-claro-rgb),0.95)]"
                        : "w-4 sm:w-5 h-[2px] opacity-80 shadow-[0_0_6px_1px_rgba(255,255,255,0.9),0_0_12px_2px_rgba(var(--tema-acento-claro-rgb),0.7)] group-hover:opacity-100 group-hover:w-5"
                    }`}
                  />

                  {/* 2. Haz de luz cónico trapezoidal vertical fijo proyectado hacia abajo sobre el ícono */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-b from-[rgb(var(--tema-acento-claro-rgb)/0.50)] via-[rgb(var(--tema-acento-rgb)/0.22)] to-transparent transition-opacity duration-300 ${
                      panelConfiguracionAbierto ? "opacity-100" : "opacity-70 group-hover:opacity-95"
                    }`}
                    style={{
                      clipPath: "polygon(22% 0%, 78% 0%, 100% 100%, 0% 100%)",
                      filter: "drop-shadow(0 0 10px rgba(var(--tema-acento-rgb),0.35))",
                    }}
                  />

                  {/* 3. Piscina de luz ambiental difusa que baña el ícono */}
                  <div
                    className={`absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_60%,rgba(var(--tema-acento-rgb),0.40)_0%,rgba(var(--tema-acento-rgb),0.12)_55%,transparent_80%)] blur-[2px] transition-opacity duration-300 ${
                      panelConfiguracionAbierto ? "opacity-100" : "opacity-65 group-hover:opacity-90"
                    }`}
                  />
                </div>

              </div>
            </div>

            {/* Ícono de Configuración con brillo reactivo */}
            <Settings
              className={`relative z-10 w-4 h-4 sm:w-4.5 sm:h-4.5 transition-all duration-300 ${
                panelConfiguracionAbierto
                  ? "rotate-90 text-[rgb(var(--tema-acento-claro-rgb))] scale-110 drop-shadow-[0_0_12px_rgba(var(--tema-acento-claro-rgb),0.85)]"
                  : "text-[rgb(var(--tema-acento-claro-rgb))] opacity-85 group-hover:opacity-100 group-hover:scale-105 drop-shadow-[0_0_8px_rgba(var(--tema-acento-claro-rgb),0.6)]"
              }`}
            />

            {/* Tooltip (hacia abajo en móvil superior, hacia la izquierda en desktop) */}
            {!panelConfiguracionAbierto && (
              <span className="pointer-events-none absolute top-full mt-2.5 left-1/2 -translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:left-auto lg:right-full lg:mr-3 px-2.5 py-1 rounded-lg text-[11px] font-mono tracking-wider font-semibold text-white bg-black/90 border border-white/10 shadow-xl opacity-0 -translate-y-1 lg:translate-y-0 lg:translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 lg:group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap">
                {traduccionesDock("configuracion")}
              </span>
            )}
          </button>

          {/* Panel Desplegable de Ajustes (hacia abajo en móvil superior, hacia la izquierda en desktop) */}
          <AnimatePresence>
            {panelConfiguracionAbierto && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="absolute top-full mt-3 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 lg:top-auto lg:bottom-0 lg:right-full lg:mr-3 lg:left-auto lg:translate-x-0 w-56 p-3.5 rounded-2xl bg-[#0c0a09]/95 backdrop-blur-2xl border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex flex-col gap-3.5 z-50 text-left"
              >
                {/* Cabecera del panel */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-neutral-200 flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5 text-[rgb(var(--tema-acento-claro-rgb))]" />
                    <span>{traduccionesDock("preferencias")}</span>
                  </span>
                  <span className="text-[9px] font-mono text-neutral-400 font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                    v{VERSION_SITIO}
                  </span>
                </div>

                {/* Selección de Idioma */}
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                    {traduccionesDock("idioma")}
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
                    {traduccionesDock("colorAcento")}
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
                            <span className="text-[11px]">{traduccionesDock(color.claveTraduccion)}</span>
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

      {/* Botón Flotante 'Volver al Inicio' (debajo del dock tanto en móvil como en desktop) */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 lg:mt-2.5 pointer-events-none">
        <AnimatePresence>
          {mostrarBotonArriba && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: -10 }}
              transition={{ duration: 0.2 }}
              type="button"
              onClick={volverAlInicio}
              className="pointer-events-auto group relative p-2 sm:p-2.5 lg:p-3 rounded-full bg-[#0c0a09]/85 backdrop-blur-2xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.6)] text-neutral-400 hover:text-[rgb(var(--tema-acento-claro-rgb))] hover:border-[rgb(var(--tema-acento-rgb)/0.4)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
              aria-label={traduccionesDock("volverInicio")}
              title={traduccionesDock("volverInicio")}
            >
              <ArrowUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:-translate-y-0.5 transition-transform" />

              {/* Tooltip (hacia abajo en móvil superior, hacia la izquierda en desktop) */}
              <span className="pointer-events-none absolute top-full mt-2 left-1/2 -translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:left-auto lg:right-full lg:mr-3 px-2.5 py-1 rounded-lg text-[11px] font-mono tracking-wider font-semibold text-white bg-black/90 border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap">
                {traduccionesDock("volverArriba")}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
