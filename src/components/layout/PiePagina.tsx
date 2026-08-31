"use client";

import { useTranslations } from "next-intl";
import { Linkedin, Github, Twitter } from "lucide-react";
import { REDES_SOCIALES } from "@/data/datosContacto";

/**
 * Pie de página con derechos de autor y enlaces a redes sociales.
 */
export function PiePagina() {
  const traducciones = useTranslations("piePagina");

  const obtenerIconoRedSocial = (icono: string) => {
    switch (icono) {
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      case "github":
        return <Github className="h-4 w-4" />;
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <footer className="border-t border-slate-800/80 py-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Nombre y Rol */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Pablo</span>
            <span className="font-semibold text-blue-400">Bejas</span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-slate-400">
              {traducciones("rol")}
            </span>
          </div>

          {/* Copyright */}
          <div className="text-xs text-slate-400 text-center">
            {traducciones("derechos")}
          </div>

          {/* Redes Sociales */}
          <div className="flex items-center gap-3">
            {REDES_SOCIALES.map((red) => (
              <a
                key={red.nombre}
                href={red.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={red.nombre}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 hover:bg-slate-800/80 transition-colors"
              >
                {obtenerIconoRedSocial(red.icono)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

