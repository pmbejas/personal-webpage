"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { ChangeEvent, useTransition } from "react";

const IDIOMAS_DISPONIBLES = [
  { codigo: "es", nombre: "ES" },
  { codigo: "en", nombre: "EN" },
  { codigo: "pt", nombre: "PT" },
];

/**
 * Selector de idioma accesible para alternar entre Español, Inglés y Portugués.
 */
export function SelectorIdioma() {
  const idiomaActual = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [estaPendiente, iniciarTransicion] = useTransition();
  const traducciones = useTranslations("navegacion");

  const manejarCambioIdioma = (evento: ChangeEvent<HTMLSelectElement>) => {
    const nuevoIdioma = evento.target.value as "es" | "en" | "pt";
    iniciarTransicion(() => {
      router.replace(pathname, { locale: nuevoIdioma });
    });
  };

  return (
    <div className="relative inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 border border-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:border-slate-700 transition-colors">
      <Globe className="h-3.5 w-3.5 text-blue-400" />
      <select
        value={idiomaActual}
        onChange={manejarCambioIdioma}
        disabled={estaPendiente}
        aria-label={traducciones("seleccionarIdioma")}
        className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer pr-1"
      >
        {IDIOMAS_DISPONIBLES.map((idioma) => (
          <option key={idioma.codigo} value={idioma.codigo} className="bg-slate-900 text-white">
            {idioma.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}

