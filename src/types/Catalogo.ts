/**
 * Envoltorio estándar de respuesta emitido por el Backend API Core (.NET 10 LTS).
 */
export interface RespuestaApi<T> {
  exito: boolean;
  datos: T | null;
  mensaje: string | null;
  errores: string[] | null;
}

/**
 * Tipos de descuento admitidos por el motor de promociones temporales.
 */
export type TipoDescuentoPromocion = "Porcentaje" | "MontoFijo";

/**
 * DTO de salida para un servicio web base del catálogo comercial.
 */
export interface ServicioBaseResponse {
  id: string;
  clave: string;
  nombre: string;
  descripcionComercial: string;
  precioBase: number;
  diasEntregaBase: number;
  seccionesIncluidas: number;
  permiteSeccionesExtra: boolean;
  precioSeccionExtra: number;
  diasPorSeccionExtra: number;
  ordenVisualizacion: number;
  adicionalesCompatiblesIds: string[];
}

/**
 * DTO de salida para un módulo o funcionalidad adicional del catálogo.
 */
export interface AdicionalResponse {
  id: string;
  grupoId: string;
  clave: string;
  nombre: string;
  descripcionComercial: string;
  precio: number;
  diasEntregaExtra: number;
  esRecurrente: boolean;
  ordenVisualizacion: number;
}

/**
 * DTO de salida para un grupo temático que agrupa adicionales relacionados.
 */
export interface GrupoAdicionalResponse {
  id: string;
  clave: string;
  nombre: string;
  descripcion: string | null;
  ordenVisualizacion: number;
  adicionales: AdicionalResponse[];
}

/**
 * DTO de salida para una campaña o promoción temporal vigente (ej. Lanzamiento, Black Friday).
 */
export interface PromocionVigenteResponse {
  id: string;
  clave: string;
  nombre: string;
  textoBanner: string;
  tipoDescuento: TipoDescuentoPromocion;
  valorDescuento: number;
  servicioBaseId: string | null;
  fechaFin: string;
}

/**
 * DTO consolidado del catálogo público comercial y promociones activas.
 * Coincide exactamente con el contrato JSON de GET /api/public/catalogo.
 */
export interface CatalogoPublicoResponse {
  servicios: ServicioBaseResponse[];
  gruposAdicionales: GrupoAdicionalResponse[];
  promocionesActivas: PromocionVigenteResponse[];
}

/**
 * Resultado del cálculo de precio comercial aplicando promoción vigente si corresponde.
 */
export interface CalculoPrecioPromocional {
  tienePromocion: boolean;
  precioOriginal: number;
  montoDescuento: number;
  precioFinal: number;
  textoBanner: string | null;
  promocionAplicada: PromocionVigenteResponse | null;
}

/**
 * DTO de entrada para formalizar y crear un presupuesto en el Backend (POST /api/public/presupuestos).
 */
export interface CrearPresupuestoRequest {
  nombreCompleto: string;
  email: string;
  telefonoWhatsApp: string;
  empresa?: string;
  rubro?: string;
  descripcionNecesidad?: string;
  servicioBaseId: string;
  cantidadSeccionesExtra: number;
  adicionalesIds: string[];
  codigoPromocion?: string | null;
  trampaSpam?: string;
}

/**
 * Enlaces universales de WhatsApp devueltos al formalizar un presupuesto.
 */
export interface EnlacesPresupuestoWhatsAppResponse {
  codigoPresupuesto: string;
  enlaceClienteAPablo: string;
  textoPrearmadoCliente: string;
  enlacePabloACliente: string;
  textoPrearmadoPablo: string;
  numeroPabloNormalizado: string;
  numeroClienteNormalizado: string;
}

/**
 * DTO de salida tras crear y congelar un presupuesto en el servidor.
 */
export interface CrearPresupuestoResponse {
  codigo: string;
  fechaEmision: string;
  fechaVencimiento: string;
  moneda: string;
  subtotalBase: number;
  subtotalSeccionesExtra: number;
  subtotalAdicionales: number;
  montoDescuento: number;
  promocionAplicada: string | null;
  totalPresupuestado: number;
  montoSenaSugerida: number;
  tiempoEntregaDias: number;
  urlDescargaPdf: string;
  enlacesWhatsApp: EnlacesPresupuestoWhatsAppResponse;
  emailEnviado: boolean;
  mensaje: string;
}
