import {
  CalculoPrecioPromocional,
  CatalogoPublicoResponse,
  PromocionVigenteResponse,
} from "@/types/Catalogo";

/**
 * Contrato de la capa de servicios para la consulta del catálogo comercial y promociones vigentes.
 * Desacopla los componentes visuales de Next.js respecto de la llamada HTTP y la caché ISR.
 */
export interface IServicioCatalogo {
  /**
   * Obtiene el catálogo completo (servicios base, grupos de adicionales y promociones vigentes)
   * utilizando Incremental Static Regeneration (ISR) con la etiqueta 'catalogo-servicios'.
   */
  obtenerCatalogoPublico(): Promise<CatalogoPublicoResponse>;

  /**
   * Obtiene únicamente la lista de campañas promocionales vigentes en este momento.
   */
  obtenerPromocionesVigentes(): Promise<PromocionVigenteResponse[]>;

  /**
   * Resuelve qué promoción activa corresponde aplicar a un servicio base determinado.
   * Prioriza una promoción específica para ese servicio por sobre una promoción de alcance global.
   */
  resolverPromocionParaServicio(
    servicioBaseId: string,
    promocionesActivas: PromocionVigenteResponse[]
  ): PromocionVigenteResponse | null;

  /**
   * Calcula el precio original, el monto de descuento y el precio final neto aplicando una promoción.
   */
  calcularPrecioConPromocion(
    precioOriginal: number,
    promocion: PromocionVigenteResponse | null
  ): CalculoPrecioPromocional;
}
