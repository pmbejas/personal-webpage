"use client";

import { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { Link } from "@/i18n/routing";
import { combinarClases } from "@/utils/utilidadesClases";

type VarianteBoton = "primario" | "secundario" | "fantasma" | "borde";
type TamanioBoton = "pequenio" | "mediano" | "grande";

interface PropiedadesBaseBoton {
  variante?: VarianteBoton;
  tamanio?: TamanioBoton;
  iconoIzquierda?: ReactNode;
  iconoDerecha?: ReactNode;
  estaCargando?: boolean;
  className?: string;
  children: ReactNode;
}

type PropiedadesElementoBoton = PropiedadesBaseBoton &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "href" | "popover"> & {
    href?: never;
  };

type PropiedadesElementoEnlace = PropiedadesBaseBoton &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "popover"> & {
    href: string;
  };

export type PropiedadesBoton = PropiedadesElementoBoton | PropiedadesElementoEnlace;

const ESTILOS_BASE =
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const ESTILOS_VARIANTE: Record<VarianteBoton, string> = {
  primario:
    "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:from-blue-700 active:to-blue-600 text-white shadow-lg shadow-blue-600/25 rounded-lg border border-blue-400/30",
  secundario:
    "bg-slate-800/80 hover:bg-slate-700 active:bg-slate-800 text-slate-100 border border-slate-700/80 rounded-lg backdrop-blur-sm",
  fantasma:
    "bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white rounded-lg",
  borde:
    "bg-transparent hover:bg-blue-600/10 text-blue-400 border border-blue-500/40 rounded-lg",
};

const ESTILOS_TAMANIO: Record<TamanioBoton, string> = {
  pequenio: "text-xs px-3.5 py-1.5 gap-1.5",
  mediano: "text-sm px-5 py-2.5 gap-2",
  grande: "text-base px-7 py-3 gap-2.5",
};

/**
 * Componente Boton reutilizable con unión discriminada para renderizar
 * un botón nativo o un enlace semántico accesible de forma segura y tipada.
 */
export const Boton = forwardRef<HTMLButtonElement, PropiedadesBoton>(
  (propiedades, ref) => {
    const {
      children,
      className,
      variante = "primario",
      tamanio = "mediano",
      iconoIzquierda,
      iconoDerecha,
      estaCargando = false,
    } = propiedades;

    const clasesFinales = combinarClases(
      ESTILOS_BASE,
      ESTILOS_VARIANTE[variante],
      ESTILOS_TAMANIO[tamanio],
      className
    );

    const contenidoBoton = (
      <>
        {estaCargando ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
        ) : (
          iconoIzquierda && <span className="flex-shrink-0">{iconoIzquierda}</span>
        )}
        <span>{children}</span>
        {!estaCargando && iconoDerecha && (
          <span className="flex-shrink-0">{iconoDerecha}</span>
        )}
      </>
    );

    // Cuando se suministra href, se comporta como enlace semántico
    if ("href" in propiedades && propiedades.href) {
      const { href, target, rel, download, ...restoPropiedadesEnlace } =
        propiedades as PropiedadesElementoEnlace;

      const esEnlaceExternoOAncla =
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        href.endsWith(".pdf");

      if (esEnlaceExternoOAncla) {
        return (
          <a
            href={href}
            target={target}
            rel={target === "_blank" ? rel || "noopener noreferrer" : rel}
            download={download}
            className={clasesFinales}
            {...restoPropiedadesEnlace}
          >
            {contenidoBoton}
          </a>
        );
      }

      return (
        <Link href={href} className={clasesFinales} {...restoPropiedadesEnlace}>
          {contenidoBoton}
        </Link>
      );
    }

    const { disabled, ...restoPropiedadesBoton } =
      propiedades as PropiedadesElementoBoton;

    return (
      <button
        ref={ref}
        disabled={disabled || estaCargando}
        className={clasesFinales}
        {...restoPropiedadesBoton}
      >
        {contenidoBoton}
      </button>
    );
  }
);

Boton.displayName = "Boton";
