"use client";

import React from "react";
import Link from "next/link";
import { Github, Linkedin, Instagram, Mail, Phone, ArrowUp } from "lucide-react";
import { CONFIGURACION_CONTACTO } from "@/data/datosContacto";

/**
 * Pie de página moderno con resplandor cálido ámbar y datos unificados de contacto.
 */
export const PiePaginaV2: React.FC = () => {
  const subirArriba = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contacto" className="relative bg-[#070606] border-t border-white/[0.04] pt-16 pb-12 overflow-hidden">
      {/* Resplandor ambiental inferior */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-amber-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Columna 1: Marca y descripción */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 p-[1px]">
                <div className="w-full h-full rounded-full bg-[#0e0c0b] flex items-center justify-center">
                  <span className="text-xs font-bold text-amber-400 font-mono">PB</span>
                </div>
              </div>
              <span className="text-base font-bold text-white tracking-wide">Pablo Bejas</span>
            </div>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Desarrollador Full Stack especializado en arquitecturas de alto rendimiento con ASP.NET Core (.NET 9) y Next.js 15. Código limpio, seguro y orientado a resultados.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href={CONFIGURACION_CONTACTO.urlLinkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 flex items-center justify-center text-neutral-300 hover:text-amber-300 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href={CONFIGURACION_CONTACTO.urlGitHub}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 flex items-center justify-center text-neutral-300 hover:text-amber-300 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href={CONFIGURACION_CONTACTO.urlInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 flex items-center justify-center text-neutral-300 hover:text-amber-300 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${CONFIGURACION_CONTACTO.correo}`}
                className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 flex items-center justify-center text-neutral-300 hover:text-amber-300 transition-colors"
                aria-label="Correo"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-200 mb-4">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <a href="#inicio" className="hover:text-amber-300 transition-colors">Inicio</a>
              </li>
              <li>
                <a href="#arquitectura" className="hover:text-amber-300 transition-colors">Arquitectura</a>
              </li>
              <li>
                <a href="#proceso" className="hover:text-amber-300 transition-colors">Metodología</a>
              </li>
              <li>
                <a href="#proyectos" className="hover:text-amber-300 transition-colors">Proyectos</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-amber-300 transition-colors">Preguntas Frecuentes</a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto directo */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-200 mb-4">
              Contacto Directo
            </h4>
            <div className="space-y-3 text-xs text-neutral-400">
              <a
                href={`mailto:${CONFIGURACION_CONTACTO.correo}`}
                className="flex items-center gap-2 hover:text-amber-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{CONFIGURACION_CONTACTO.correo}</span>
              </a>
              <a
                href={CONFIGURACION_CONTACTO.urlWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-amber-300 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{CONFIGURACION_CONTACTO.telefono}</span>
              </a>
            </div>

            <div className="mt-5">
              <Link
                href="/"
                className="inline-block text-[11px] text-neutral-500 hover:text-neutral-300 underline underline-offset-4"
              >
                ← Volver a la versión clásica del sitio
              </Link>
            </div>
          </div>
        </div>

        {/* Fila inferior de derechos y botón volver arriba */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 font-mono">
          <p>© {new Date().getFullYear()} Pablo Bejas. Todos los derechos reservados.</p>

          <button
            onClick={subirArriba}
            type="button"
            className="flex items-center gap-1.5 text-neutral-400 hover:text-amber-400 transition-colors"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
