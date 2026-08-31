"use client";

import { useTranslations } from "next-intl";
import { CategoriaProyecto } from "@/types/Proyecto";
import { CATEGORIAS_FILTRO } from "@/data/datosProyectos";
import { combinarClases } from "@/utils/utilidadesClases";

export interface PropiedadesBarraFiltros {
  categoriaActiva: CategoriaProyecto;
  alSeleccionarCategoria: (categoria: CategoriaProyecto) => void;
  conteoPorCategoria: Record<CategoriaProyecto, number>;
}

/**
 * Barra interactiva de botones de filtro por categorías de proyecto.
 */
export function BarraFiltrosProyectos({
  categoriaActiva,
  alSeleccionarCategoria,
  conteoPorCategoria,
}: PropiedadesBarraFiltros) {
  const traducciones = useTranslations("proyectos");

  return (
    <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 pt-2 gap-2 sm:gap-3 no-scrollbar">
      {CATEGORIAS_FILTRO.map((categoria) => {
        const esActiva = categoriaActiva === categoria.clave;
        const total = conteoPorCategoria[categoria.clave] || 0;

        return (
          <button
            key={categoria.clave}
            onClick={() => alSeleccionarCategoria(categoria.clave)}
            className={combinarClases(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50",
              esActiva
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 border border-blue-500/40"
                : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            )}
          >
            <span>{traducciones(categoria.claveTraduccion)}</span>
            <span
              className={combinarClases(
                "inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px]",
                esActiva
                  ? "bg-blue-700/80 text-blue-100"
                  : "bg-slate-800 text-slate-400"
              )}
            >
              {total}
            </span>
          </button>
        );
      })}
    </div>
  );
}

