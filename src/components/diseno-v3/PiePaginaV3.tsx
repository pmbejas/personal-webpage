"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Github, Linkedin, Instagram } from "lucide-react";
import { CONFIGURACION_CONTACTO } from "@/data/datosContacto";
import { WordmarkLogo } from "@/components/layout/WordmarkLogo";

/**
 * Pie de página oficial para el sitio con isotipo, wordmark y accesos sociales.
 */
export function PiePaginaV3() {
  const traducciones = useTranslations("piePagina");

  return (
    <footer className="relative bg-[#070606] border-t border-white/5 py-12 text-neutral-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
        {/* Identidad de marca oficial: Isotipo + Wordmark + Copyright */}
        <div className="flex items-center gap-3">
          <div className="relative h-7 w-6 flex-shrink-0">
            <Image
              src="/isotipo-dark.svg"
              alt="Isotipo Pablo Bejas"
              width={24}
              height={28}
              className="h-full w-auto object-contain drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]"
            />
          </div>
          <div className="relative h-5 w-auto hidden sm:block opacity-85">
            <WordmarkLogo className="h-5 w-auto" />
          </div>
          <span className="text-neutral-500 sm:border-l sm:border-white/10 sm:pl-3">
            {traducciones("derechos")}
          </span>
        </div>

        {/* Lema técnico sutil */}
        <div className="text-neutral-500 font-mono text-[11px] tracking-wider text-center">
          Desarrollado con <span className="text-sky-400">Next.js 15</span> & <span className="text-sky-400">.NET 9</span>
        </div>

        {/* Redes Sociales */}
        <div className="flex items-center gap-4">
          <a
            href={CONFIGURACION_CONTACTO.urlGitHub}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full hover:bg-white/5 hover:text-sky-400 transition-colors"
            title="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={CONFIGURACION_CONTACTO.urlLinkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full hover:bg-white/5 hover:text-sky-400 transition-colors"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={CONFIGURACION_CONTACTO.urlInstagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full hover:bg-white/5 hover:text-sky-400 transition-colors"
            title="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
