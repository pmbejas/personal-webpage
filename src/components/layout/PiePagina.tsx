"use client";

import { useTranslations } from "next-intl";
import { Linkedin, Github, Instagram } from "lucide-react";
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
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <footer className="border-t border-white/10 py-8 text-slate-400 bg-[#1c171b]/80">
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
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 hover:bg-white/[0.08] transition-colors"
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

