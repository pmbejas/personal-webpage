import {
  CalculoPrecioPromocional,
  CatalogoPublicoResponse,
  PromocionVigenteResponse,
  RespuestaApi,
} from "@/types/Catalogo";
import { CATALOGO_RESPALDO_LOCAL } from "@/data/datosCatalogoRespaldo";
import { IServicioCatalogo } from "./IServicioCatalogo";

export const URL_BASE_API_POR_DEFECTO = "https://pablobejas-backend-api.onrender.com";
export const ETIQUETA_CACHE_CATALOGO = "catalogo-servicios";
const TIEMPO_REVALIDACION_SEGUNDOS = 3600;
const TIEMPO_LIMITE_PETICION_MS = 12000;

/**
 * Obtiene la URL base del Backend API Core limpia de barras finales.
 */
export function obtenerUrlBaseApi(): string {
  const urlConfigurada = process.env.NEXT_PUBLIC_API_URL || URL_BASE_API_POR_DEFECTO;
  return urlConfigurada.replace(/\/+$/, "");
}

/**
 * Implementación del servicio de catálogo comercial con soporte ISR (Incremental Static Regeneration)
 * y respaldo estático resiliente ante cold starts en Render Free.
 */
export class ServicioCatalogo implements IServicioCatalogo {
  async obtenerCatalogoPublico(): Promise<CatalogoPublicoResponse> {
    const urlEndpoint = `${obtenerUrlBaseApi()}/api/public/catalogo`;

    try {
      const respuesta = await fetch(urlEndpoint, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(TIEMPO_LIMITE_PETICION_MS),
        next: {
          tags: [ETIQUETA_CACHE_CATALOGO],
          revalidate: TIEMPO_REVALIDACION_SEGUNDOS,
        },
      });

      if (!respuesta.ok) {
        return CATALOGO_RESPALDO_LOCAL;
      }

      const envoltorio = (await respuesta.json()) as RespuestaApi<CatalogoPublicoResponse>;
      if (!envoltorio.exito || !envoltorio.datos || envoltorio.datos.servicios.length === 0) {
        return CATALOGO_RESPALDO_LOCAL;
      }

      return envoltorio.datos;
    } catch {
      return CATALOGO_RESPALDO_LOCAL;
    }
  }

  async obtenerPromocionesVigentes(): Promise<PromocionVigenteResponse[]> {
    const catalogo = await this.obtenerCatalogoPublico();
    return catalogo.promocionesActivas;
  }

  resolverPromocionParaServicio(
    servicioBaseId: string,
    promocionesActivas: PromocionVigenteResponse[]
  ): PromocionVigenteResponse | null {
    if (!promocionesActivas || promocionesActivas.length === 0) {
      return null;
    }

    const promocionEspecifica = promocionesActivas.find(
      (promocion) => promocion.servicioBaseId === servicioBaseId
    );
    if (promocionEspecifica) {
      return promocionEspecifica;
    }

    const promocionGlobal = promocionesActivas.find(
      (promocion) => promocion.servicioBaseId === null
    );
    return promocionGlobal ?? null;
  }

  calcularPrecioConPromocion(
    precioOriginal: number,
    promocion: PromocionVigenteResponse | null
  ): CalculoPrecioPromocional {
    if (!promocion || promocion.valorDescuento <= 0 || precioOriginal <= 0) {
      return {
        tienePromocion: false,
        precioOriginal,
        montoDescuento: 0,
        precioFinal: precioOriginal,
        textoBanner: null,
        promocionAplicada: null,
      };
    }

    const esPorcentaje = promocion.tipoDescuento === "Porcentaje";
    const descuentoCalculado = esPorcentaje
      ? Math.round((precioOriginal * promocion.valorDescuento) / 100)
      : promocion.valorDescuento;

    const montoDescuento = Math.min(precioOriginal, Math.max(0, descuentoCalculado));
    const precioFinal = Math.max(0, precioOriginal - montoDescuento);

    return {
      tienePromocion: montoDescuento > 0,
      precioOriginal,
      montoDescuento,
      precioFinal,
      textoBanner: promocion.textoBanner,
      promocionAplicada: promocion,
    };
  }
}

/** Instancia única compartida del servicio de catálogo comercial */
export const servicioCatalogo: IServicioCatalogo = new ServicioCatalogo();
