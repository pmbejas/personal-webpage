"use client";

import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { combinarClases } from "@/utils/utilidadesClases";

export interface PropiedadesBoton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: "primario" | "secundario" | "fantasma" | "borde";
  tamanio?: "pequenio" | "mediano" | "grande";
  iconoIzquierda?: ReactNode;
  iconoDerecha?: ReactNode;
  estaCargando?: boolean;
}

/**
 * Componente Boton reutilizable con soporte de variantes, tamaños e iconos accesibles.
 */
export const Boton = forwardRef<HTMLButtonElement, PropiedadesBoton>(
  (
    {
      children,
      className,
      variante = "primario",
      tamanio = "mediano",
      iconoIzquierda,
      iconoDerecha,
      estaCargando = false,
      disabled,
      ...restoPropiedades
    },
    ref
  ) => {
    const estilosBase =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const estilosVariante = {
      primario:
        "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:from-blue-700 active:to-blue-600 text-white shadow-lg shadow-blue-600/25 rounded-lg border border-blue-400/30",
      secundario:
        "bg-slate-800/80 hover:bg-slate-700 active:bg-slate-800 text-slate-100 border border-slate-700/80 rounded-lg backdrop-blur-sm",
      fantasma:
        "bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white rounded-lg",
      borde:
        "bg-transparent hover:bg-blue-600/10 text-blue-400 border border-blue-500/40 rounded-lg",
    };

    const estilosTamanio = {
      pequenio: "text-xs px-3.5 py-1.5 gap-1.5",
      mediano: "text-sm px-5 py-2.5 gap-2",
      grande: "text-base px-7 py-3 gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || estaCargando}
        className={combinarClases(
          estilosBase,
          estilosVariante[variante],
          estilosTamanio[tamanio],
          className
        )}
        {...restoPropiedades}
      >
        {estaCargando ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
        ) : (
          iconoIzquierda && <span className="flex-shrink-0">{iconoIzquierda}</span>
        )}
        <span>{children}</span>
        {!estaCargando && iconoDerecha && (
          <span className="flex-shrink-0">{iconoDerecha}</span>
        )}
      </button>
    );
  }
);

Boton.displayName = "Boton";

