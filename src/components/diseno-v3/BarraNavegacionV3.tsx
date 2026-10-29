"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { SelectorIdioma } from "@/components/layout/SelectorIdioma";
import { WordmarkLogo } from "@/components/layout/WordmarkLogo";

interface ElementoNavegacion {
  claveTraduccion: string;
  enlace: string;
}

const ENLACES_NAV: ElementoNavegacion[] = [
  { claveTraduccion: "inicio", enlace: "#inicio" },
  { claveTraduccion: "sobreMi", enlace: "#sobre-mi" },
  { claveTraduccion: "servicios", enlace: "#servicios" },
  { claveTraduccion: "proceso", enlace: "#proceso" },
  { claveTraduccion: "proyectos", enlace: "#proyectos" },
  { claveTraduccion: "faq", enlace: "#faq" },
  { claveTraduccion: "contacto", enlace: "#contacto" },
];

/**
 * Barra de navegación flotante estilo cápsula de cristal con isotipo y wordmark oficiales.
 */
export function BarraNavegacionV3() {
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);
  const traducciones = useTranslations("navegacion");

  const alternarMenu = () => setMenuAbierto(!menuAbierto);
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-6xl">
      <nav className="relative flex items-center justify-between px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#0c0a09]/85 backdrop-blur-xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
        {/* Identidad de marca oficial: Isotipo + Wordmark */}
        <a
          href="#inicio"
          className="flex items-center gap-2.5 group focus:outline-none"
          aria-label="Pablo Bejas - Full Stack Developer"
        >
          <div className="relative h-8 w-7 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/isotipo-dark.svg"
              alt="Isotipo Pablo Bejas"
              width={28}
              height={32}
              className="h-full w-auto object-contain drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]"
              priority
            />
          </div>
          <div className="relative h-6 w-auto hidden min-[380px]:block transition-opacity duration-300 group-hover:opacity-90">
            <WordmarkLogo className="h-6 w-auto" />
          </div>
        </a>

        {/* Enlaces centrales de escritorio */}
        <div className="hidden lg:flex items-center gap-1">
          {ENLACES_NAV.map((item) => (
            <a
              key={item.enlace}
              href={item.enlace}
              className="px-2.5 py-1 rounded-full text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              {traducciones.has(item.claveTraduccion)
                ? traducciones(item.claveTraduccion)
                : item.claveTraduccion.toUpperCase()}
            </a>
          ))}
        </div>

        {/* Acciones del lado derecho: Idioma + CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Selector de idioma */}
          <div className="scale-90 origin-right">
            <SelectorIdioma />
          </div>

          {/* Botón de acción principal en azul eléctrico */}
          <a
            href="#contacto"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white shadow-[0_0_20px_rgba(14,165,233,0.35)] hover:shadow-[0_0_25px_rgba(14,165,233,0.6)] hover:scale-105 active:scale-95 transition-all"
          >
            <span>{traducciones("contratame")}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Botón hamburguesa móvil */}
          <button
            onClick={alternarMenu}
            type="button"
            className="p-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors lg:hidden"
            aria-label={menuAbierto ? traducciones("cerrarMenu") : traducciones("abrirMenu")}
          >
            {menuAbierto ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Menú móvil desplegable */}
      {menuAbierto && (
        <div className="lg:hidden mt-2 p-5 rounded-3xl bg-[#0c0a09]/95 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col gap-1">
            {ENLACES_NAV.map((item) => (
              <a
                key={item.enlace}
                href={item.enlace}
                onClick={cerrarMenu}
                className="px-3 py-2 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                {traducciones.has(item.claveTraduccion)
                  ? traducciones(item.claveTraduccion)
                  : item.claveTraduccion.toUpperCase()}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end">
            <a
              href="#contacto"
              onClick={cerrarMenu}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-sky-500 text-white hover:from-blue-500 hover:to-sky-400 transition-colors shadow-[0_0_15px_rgba(14,165,233,0.4)]"
            >
              {traducciones("contratame")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
