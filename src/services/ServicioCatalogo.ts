import {
  CalculoPrecioPromocional,
  CatalogoPublicoResponse,
  CrearPresupuestoRequest,
  CrearPresupuestoResponse,
  PromocionVigenteResponse,
  RespuestaApi,
  ServicioBaseResponse,
  ValidacionPresupuestoResponse,
  ValidarCuponResponse,
} from "@/types/Catalogo";
import {
  IServicioCatalogo,
  OpcionesConsultaCatalogo,
} from "./IServicioCatalogo";

export const URL_BASE_API_POR_DEFECTO =
  "https://pablobejas-backend-api.onrender.com";
export const ETIQUETA_CACHE_CATALOGO = "catalogo-servicios";
const TIEMPO_LIMITE_PETICION_DEFECTO_MS = 12000;
const TIEMPO_LIMITE_CREACION_PRESUPUESTO_MS = 45000;

/**
 * Obtiene la URL base del Backend API Core limpia de barras finales y sufijos /api repetidos.
 */
export function obtenerUrlBaseApi(): string {
  const urlConfigurada =
    process.env.NEXT_PUBLIC_API_URL || URL_BASE_API_POR_DEFECTO;
  return urlConfigurada.replace(/\/api\/?$/, "").replace(/\/+$/, "");
}

/**
 * Normaliza la regla comercial del servicio a medida ("sistema-web-saas") en el cliente.
 */
function normalizarServiciosCatalogo(
  servicios: ServicioBaseResponse[]
): ServicioBaseResponse[] {
  return servicios.map((servicio) =>
    servicio.clave === "sistema-web-saas"
      ? {
          ...servicio,
          precioBase: 0,
          permiteSeccionesExtra: false,
          precioSeccionExtra: 0,
          adicionalesCompatiblesIds: [],
        }
      : servicio
  );
}

/**
 * Parsea de forma segura respuestas RespuestaApi<T> o ProblemDetails de ASP.NET Core.
 */
async function parsearRespuestaApiSegura<T>(
  respuesta: Response,
  mensajeErrorPorDefecto: string
): Promise<RespuestaApi<T>> {
  try {
    const cuerpo = (await respuesta.json()) as Partial<RespuestaApi<T>> & {
      title?: string;
      detail?: string;
      errors?: Record<string, string[]>;
    };

    if (typeof cuerpo.exito === "boolean") {
      return {
        exito: cuerpo.exito && respuesta.ok,
        datos: (cuerpo.datos ?? null) as T | null,
        mensaje: cuerpo.mensaje ?? (respuesta.ok ? null : mensajeErrorPorDefecto),
        errores: cuerpo.errores ?? null,
      };
    }

    const primerErrorValidacion = cuerpo.errors
      ? Object.values(cuerpo.errors).flat()[0]
      : null;

    return {
      exito: false,
      datos: null,
      mensaje:
        primerErrorValidacion ||
        cuerpo.detail ||
        cuerpo.title ||
        mensajeErrorPorDefecto,
      errores: null,
    };
  } catch {
    return {
      exito: false,
      datos: null,
      mensaje: mensajeErrorPorDefecto,
      errores: null,
    };
  }
}

/**
 * Implementación del servicio de catálogo comercial con consulta estricta en tiempo real
 * contra la API oficial (sin sustituir nunca las tarifas vigentes por precios estáticos locales).
 */
export class ServicioCatalogo implements IServicioCatalogo {
  async obtenerCatalogoEnVivo(
    opciones?: OpcionesConsultaCatalogo
  ): Promise<CatalogoPublicoResponse | null> {
    const tiempoLimite =
      opciones?.tiempoLimiteMs ?? TIEMPO_LIMITE_PETICION_DEFECTO_MS;
    const sufijoAntiCache = opciones?.evitarCacheUrl ? `?_t=${Date.now()}` : "";
    const urlEndpoint = `${obtenerUrlBaseApi()}/api/public/catalogo${sufijoAntiCache}`;

    try {
      const respuesta = await fetch(urlEndpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(tiempoLimite),
      });

      if (!respuesta.ok) {
        return null;
      }

      const envoltorio =
        (await respuesta.json()) as RespuestaApi<CatalogoPublicoResponse>;
      if (
        !envoltorio.exito ||
        !envoltorio.datos ||
        envoltorio.datos.servicios.length === 0
      ) {
        return null;
      }

      return {
        ...envoltorio.datos,
        servicios: normalizarServiciosCatalogo(envoltorio.datos.servicios),
      };
    } catch {
      return null;
    }
  }

  async obtenerPromocionesVigentes(): Promise<PromocionVigenteResponse[]> {
    const catalogo = await this.obtenerCatalogoEnVivo();
    return catalogo?.promocionesActivas ?? [];
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

    const montoDescuento = Math.min(
      precioOriginal,
      Math.max(0, descuentoCalculado)
    );
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

  async crearPresupuestoFormal(
    peticion: CrearPresupuestoRequest
  ): Promise<RespuestaApi<CrearPresupuestoResponse>> {
    const urlEndpoint = `${obtenerUrlBaseApi()}/api/public/presupuestos`;
    const mensajeFallo =
      "No fue posible registrar el presupuesto en el servidor en este momento. Podés reintentar o enviarnos tu consulta por WhatsApp.";

    try {
      const respuesta = await fetch(urlEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(peticion),
        cache: "no-store",
        signal: AbortSignal.timeout(TIEMPO_LIMITE_CREACION_PRESUPUESTO_MS),
      });

      return await parsearRespuestaApiSegura<CrearPresupuestoResponse>(
        respuesta,
        mensajeFallo
      );
    } catch {
      return {
        exito: false,
        datos: null,
        mensaje: mensajeFallo,
        errores: null,
      };
    }
  }

  obtenerUrlDescargaPdf(codigoPresupuesto: string): string {
    return `${obtenerUrlBaseApi()}/api/public/presupuestos/${encodeURIComponent(
      codigoPresupuesto
    )}/pdf`;
  }

  async validarPresupuesto(
    codigo: string
  ): Promise<ValidacionPresupuestoResponse | null> {
    const urlEndpoint = `${obtenerUrlBaseApi()}/api/public/presupuestos/${encodeURIComponent(
      codigo
    )}/validacion`;

    try {
      const respuesta = await fetch(urlEndpoint, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!respuesta.ok) {
        return null;
      }

      const envoltorio =
        (await respuesta.json()) as RespuestaApi<ValidacionPresupuestoResponse>;
      return envoltorio.exito && envoltorio.datos ? envoltorio.datos : null;
    } catch {
      return null;
    }
  }

  async validarCupon(
    codigo: string,
    subtotal: number
  ): Promise<RespuestaApi<ValidarCuponResponse>> {
    const urlEndpoint = `${obtenerUrlBaseApi()}/api/public/cupones/validar`;
    const mensajeFallo =
      "No se pudo conectar con el servidor para validar el cupón.";

    try {
      const respuesta = await fetch(urlEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          codigo,
          subtotal,
        }),
        cache: "no-store",
      });

      return await parsearRespuestaApiSegura<ValidarCuponResponse>(
        respuesta,
        mensajeFallo
      );
    } catch {
      return {
        exito: false,
        datos: null,
        mensaje: mensajeFallo,
        errores: null,
      };
    }
  }
}

/** Instancia única compartida del servicio de catálogo comercial */
export const servicioCatalogo: IServicioCatalogo = new ServicioCatalogo();
