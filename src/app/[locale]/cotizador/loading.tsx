import { EsqueletoCotizador } from "@/components/cotizador/EsqueletoCotizador";

/**
 * Límite de carga inmediato (Next.js App Router) para la ruta /[locale]/cotizador.
 * Garantiza respuesta visual instantánea con skeleton al navegar desde cualquier enlace.
 */
export default function CargandoCotizador() {
  return <EsqueletoCotizador />;
}
