"use client";

import { useTranslations } from "next-intl";
import { CategoriaFiltroProyecto } from "@/types/Proyecto";
import { CATEGORIAS_FILTRO } from "@/data/datosProyectos";
import { combinarClases } from "@/utils/utilidadesClases";

export interface PropiedadesBarraFiltros {
  categoriaActiva: CategoriaFiltroProyecto;
  alSeleccionarCategoria: (categoria: CategoriaFiltroProyecto) => void;
  conteoPorCategoria: Record<CategoriaFiltroProyecto, number>;
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
          /* [MEJORA-VISUAL-02] Filtros V2 con superficie neutra y foco accesible */
          <button
            key={categoria.clave}
            type="button"
            onClick={() => alSeleccionarCategoria(categoria.clave)}
            className={combinarClases(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--tema-acento-rgb))]",
              esActiva
                ? "bg-gradient-to-r from-[rgb(var(--tema-acento-oscuro-rgb))] via-[rgb(var(--tema-acento-rgb))] to-[rgb(var(--tema-acento-claro-rgb))] text-white shadow-[0_0_16px_rgb(var(--tema-acento-rgb)/0.38)] border border-[rgb(var(--tema-acento-claro-rgb)/0.4)]"
                : "bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.07] border border-white/10"
            )}
          >
            <span>{traducciones(categoria.claveTraduccion)}</span>
            <span
              className={combinarClases(
                "inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-mono tabular-nums",
                esActiva
                  ? "bg-black/25 text-white"
                  : "bg-white/[0.06] text-neutral-400"
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
