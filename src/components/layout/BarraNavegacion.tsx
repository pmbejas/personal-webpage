"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { ENLACES_NAVEGACION } from "@/data/datosNavegacion";
import { SelectorIdioma } from "./SelectorIdioma";
import { SelectorTema } from "./SelectorTema";
import { Boton } from "@/components/ui/Boton";
import { LogotipoPB } from "@/components/ui/LogotipoPB";
import { useDeteccionSeccionActiva } from "@/hooks/useDeteccionSeccionActiva";

/* Mapeo entre el id de cada sección del DOM y su clave de navegación */
const CLAVE_POR_SECCION: Record<string, string> = {
  inicio: "inicio",
  "sobre-mi": "sobreMi",
  servicios: "servicios",
  proyectos: "proyectos",
  contacto: "contacto",
};

/**
 * Barra de navegación principal responsive con soporte de rutas localizadas y efectos de desenfoque.
 */
export function BarraNavegacion() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [conScroll, setConScroll] = useState(false);
  const traducciones = useTranslations("navegacion");
  const seccionActiva = useDeteccionSeccionActiva();
  const rutaActual = usePathname();

  const claveSeccionVisible = CLAVE_POR_SECCION[seccionActiva] ?? "";
  const estaEnPaginaProyectos = rutaActual === "/proyectos";

  const obtenerRutaEnlace = (enlaceHref: string) => {
    if (estaEnPaginaProyectos) {
      return enlaceHref;
    }
    if (enlaceHref.startsWith("/#")) {
      return enlaceHref.substring(1);
    }
    return enlaceHref;
  };

  const rutaBotonContacto = estaEnPaginaProyectos ? "/#contacto" : "#contacto";

  const esEnlaceActivo = (claveTraduccion: string) =>
    estaEnPaginaProyectos
      ? claveTraduccion === "proyectos"
      : claveTraduccion === claveSeccionVisible;

  useEffect(() => {
    const manejarScroll = () => {
      setConScroll(window.scrollY > 20);
    };

    manejarScroll();
    window.addEventListener("scroll", manejarScroll, { passive: true });
    return () => window.removeEventListener("scroll", manejarScroll);
  }, []);

  const alternarMenu = () => {
    setMenuAbierto((estadoAnterior) => !estadoAnterior);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        conScroll
          ? "bg-[#1c171b]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/30 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Nombre del desarrollador */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Ir a la página principal"
          >
            <LogotipoPB className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  Pablo
                </span>
                <span className="text-xl font-bold tracking-tight text-blue-500">
                  Bejas
                </span>
              </div>
              <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                Full Stack Developer
              </span>
            </div>
          </Link>

          {/* Enlaces en escritorio */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Navegación principal"
          >
            {ENLACES_NAVEGACION.map((enlace) => (
              <Link
                key={enlace.claveTraduccion}
                href={obtenerRutaEnlace(enlace.href)}
                className={`text-sm font-medium transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500 after:scale-x-0 after:transition-transform ${
                  esEnlaceActivo(enlace.claveTraduccion)
                    ? "text-white after:scale-x-100"
                    : "text-slate-300 hover:text-white hover:after:scale-x-100"
                }`}
              >
                {traducciones(enlace.claveTraduccion)}
              </Link>
            ))}
          </nav>

          {/* Acciones de cabecera (Idioma + Tema + Botón CTA) */}
          <div className="hidden md:flex items-center gap-4">
            <SelectorIdioma />
            <SelectorTema />
            <Boton
              href={rutaBotonContacto}
              variante="primario"
              tamanio="pequenio"
              iconoDerecha={<ArrowUpRight className="h-3.5 w-3.5" />}
            >
              {traducciones("contratame")}
            </Boton>
          </div>

          {/* Botón de menú móvil */}
          <div className="flex items-center gap-3 md:hidden">
            <SelectorIdioma />
            <button
              onClick={alternarMenu}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none cursor-pointer"
              aria-label={menuAbierto ? traducciones("cerrarMenu") : traducciones("abrirMenu")}
              aria-expanded={menuAbierto}
            >
              {menuAbierto ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5 text-blue-400" />
              )}
            </button>
          </div>
        </div>

        {/* Menú desplegable para móviles */}
        {menuAbierto && (
          <div className="md:hidden mt-3 pt-4 pb-6 border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-lg rounded-2xl p-5 shadow-2xl space-y-4">
            <nav className="flex flex-col space-y-3">
              {ENLACES_NAVEGACION.map((enlace) => (
                <Link
                  key={enlace.claveTraduccion}
                  href={obtenerRutaEnlace(enlace.href)}
                  onClick={cerrarMenu}
                  className={`text-sm font-medium py-1.5 transition-colors ${
                    esEnlaceActivo(enlace.claveTraduccion)
                      ? "text-blue-400"
                      : "text-slate-200 hover:text-blue-400"
                  }`}
                >
                  {traducciones(enlace.claveTraduccion)}
                </Link>
              ))}
            </nav>
            {/* Selector de tema de color (azul / verde / naranja) */}
            <div className="pt-2">
              <SelectorTema />
            </div>
            <div className="pt-2">
              <Boton
                href={rutaBotonContacto}
                onClick={cerrarMenu}
                variante="primario"
                tamanio="mediano"
                className="w-full justify-center"
              >
                {traducciones("contratame")}
              </Boton>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
