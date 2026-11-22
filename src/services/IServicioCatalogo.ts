import {
  CalculoPrecioPromocional,
  CatalogoPublicoResponse,
  CrearPresupuestoRequest,
  CrearPresupuestoResponse,
  PromocionVigenteResponse,
  RespuestaApi,
  ValidacionPresupuestoResponse,
  ValidarCuponResponse,
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

  /**
   * Envía la solicitud de creación de presupuesto al Backend (POST /api/public/presupuestos),
   * congelando el snapshot por 7 días, generando el PDF con QuestPDF y disparando los emails con Resend.
   */
  crearPresupuestoFormal(
    peticion: CrearPresupuestoRequest
  ): Promise<RespuestaApi<CrearPresupuestoResponse>>;

  /**
   * Construye la URL absoluta de descarga del PDF On-Demand para un código de presupuesto.
   */
  obtenerUrlDescargaPdf(codigoPresupuesto: string): string;

  /**
   * Valida la vigencia y autenticidad pública de un presupuesto emitido.
   */
  validarPresupuesto(codigo: string): Promise<ValidacionPresupuestoResponse | null>;

  /**
   * Valida un cupón de descuento comercial con el subtotal actual de la cotización.
   */
  validarCupon(
    codigo: string,
    subtotal: number
  ): Promise<RespuestaApi<ValidarCuponResponse>>;
}
