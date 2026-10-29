"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { CONFIGURACION_CONTACTO } from "@/data/datosContacto";

interface ElementoNavegacion {
  etiqueta: string;
  enlace: string;
}

const ENLACES_NAV: ElementoNavegacion[] = [
  { etiqueta: "Inicio", enlace: "#inicio" },
  { etiqueta: "Arquitectura", enlace: "#arquitectura" },
  { etiqueta: "Proceso", enlace: "#proceso" },
  { etiqueta: "Proyectos", enlace: "#proyectos" },
  { etiqueta: "FAQ", enlace: "#faq" },
];

/**
 * Barra de navegación flotante estilo píldora de cristal con destellos ámbar.
 */
export const BarraNavegacionV2: React.FC = () => {
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);

  const alternarMenu = () => setMenuAbierto(!menuAbierto);
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-5xl">
      <nav className="relative flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#0c0a09]/85 backdrop-blur-xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
        {/* Identidad de marca / Logo */}
        <a
          href="#inicio"
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 p-[1px] shadow-[0_0_15px_rgba(245,158,11,0.4)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.7)] transition-all">
            <div className="w-full h-full rounded-full bg-[#0e0c0b] flex items-center justify-center">
              <span className="text-xs font-bold text-amber-400 font-mono tracking-tighter">PB</span>
            </div>
          </div>
          <span className="text-sm font-semibold tracking-wide text-neutral-100 group-hover:text-amber-300 transition-colors hidden xs:inline-block">
            Pablo Bejas
          </span>
        </a>

        {/* Enlaces centrales de escritorio */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {ENLACES_NAV.map((item) => (
            <a
              key={item.enlace}
              href={item.enlace}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              {item.etiqueta}
            </a>
          ))}
        </div>

        {/* Acciones del lado derecho */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Enlace para volver a la versión clásica */}
          <Link
            href="/"
            className="text-[11px] font-medium text-neutral-400 hover:text-neutral-200 px-2.5 py-1 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] transition-all hidden sm:flex items-center gap-1"
            title="Ver el diseño actual del sitio"
          >
            <span>Diseño Original</span>
            <ArrowUpRight className="w-3 h-3 text-neutral-500" />
          </Link>

          {/* Botón CTA principal */}
          <a
            href={CONFIGURACION_CONTACTO.urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_25px_rgba(234,88,12,0.7)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Hablemos</span>
          </a>

          {/* Botón menú móvil */}
          <button
            onClick={alternarMenu}
            type="button"
            className="md:hidden p-1.5 rounded-full text-neutral-300 hover:text-white bg-white/[0.05] border border-white/10"
            aria-label="Abrir menú"
          >
            {menuAbierto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Menú desplegable para móviles */}
      {menuAbierto && (
        <div className="md:hidden mt-2 p-4 rounded-3xl bg-[#0c0a09]/95 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          {ENLACES_NAV.map((item) => (
            <a
              key={item.enlace}
              href={item.enlace}
              onClick={cerrarMenu}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-200 hover:bg-white/[0.06] hover:text-amber-300 transition-all"
            >
              {item.etiqueta}
            </a>
          ))}
          <div className="pt-2 mt-1 border-t border-white/10 flex justify-between items-center px-2">
            <Link
              href="/"
              onClick={cerrarMenu}
              className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1"
            >
              <span>Volver a Diseño Original</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
