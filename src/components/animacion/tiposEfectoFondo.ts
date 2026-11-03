export type TipoEfectoFondo =
  | "sin-fondo"
  | "humo-bokeh"
  | "aurora-seda"
  | "rayos-cenitales"
  | "reticula-datos"
  | "constelacion-bruma";

export type ClaveTraduccionEfectoFondo =
  | "efectos.sinFondo"
  | "efectos.humoBokeh"
  | "efectos.auroraSeda"
  | "efectos.rayosCenitales"
  | "efectos.reticulaDatos"
  | "efectos.constelacionBruma";

export interface OpcionEfectoFondo {
  identificador: TipoEfectoFondo;
  claveTraduccion: ClaveTraduccionEfectoFondo;
}

export interface ColoresTemaHumo {
  acentoRgb: string;
  acentoClaroRgb: string;
}

export const CLAVE_ALMACENAMIENTO_EFECTO = "efectoFondo";
export const EVENTO_CAMBIO_EFECTO_FONDO = "cambio-efecto-fondo";
export const EFECTO_FONDO_POR_DEFECTO: TipoEfectoFondo = "humo-bokeh";

export const LISTA_OPCIONES_EFECTO_FONDO: OpcionEfectoFondo[] = [
  { identificador: "sin-fondo", claveTraduccion: "efectos.sinFondo" },
  { identificador: "humo-bokeh", claveTraduccion: "efectos.humoBokeh" },
  { identificador: "aurora-seda", claveTraduccion: "efectos.auroraSeda" },
  { identificador: "rayos-cenitales", claveTraduccion: "efectos.rayosCenitales" },
  { identificador: "reticula-datos", claveTraduccion: "efectos.reticulaDatos" },
  { identificador: "constelacion-bruma", claveTraduccion: "efectos.constelacionBruma" },
];

export function esEfectoFondoValido(valor: string | null): valor is TipoEfectoFondo {
  if (!valor) return false;
  return LISTA_OPCIONES_EFECTO_FONDO.some((opcion) => opcion.identificador === valor);
}

export function obtenerEfectoFondoAlmacenado(): TipoEfectoFondo {
  try {
    if (typeof document !== "undefined") {
      const efectoEnDocumento = document.documentElement.getAttribute("data-efecto");
      if (esEfectoFondoValido(efectoEnDocumento)) {
        return efectoEnDocumento;
      }
    }
    const valorGuardado = localStorage.getItem(CLAVE_ALMACENAMIENTO_EFECTO);
    if (esEfectoFondoValido(valorGuardado)) {
      return valorGuardado;
    }
  } catch {
    // Retornar efecto por defecto si el almacenamiento local o DOM no están disponibles
  }
  return EFECTO_FONDO_POR_DEFECTO;
}

export function guardarEfectoFondoSeleccionado(nuevoEfecto: TipoEfectoFondo): void {
  try {
    localStorage.setItem(CLAVE_ALMACENAMIENTO_EFECTO, nuevoEfecto);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-efecto", nuevoEfecto);
    }
    window.dispatchEvent(new Event(EVENTO_CAMBIO_EFECTO_FONDO));
  } catch {
    // Manejo seguro ante restricciones de almacenamiento local
  }
}
