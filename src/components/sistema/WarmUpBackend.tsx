"use client";

import { useEffect } from "react";
import { obtenerUrlBaseApi } from "@/services/ServicioCatalogo";

const CLAVE_STORAGE_ULTIMO_WARMUP = "pb_ultimo_warmup_backend_ts";
const INTERVALO_MINIMO_WARMUP_MS = 10 * 60 * 1000;

/**
 *Verifica si corresponde disparar un nuevo ping de calentamiento en la sesión actual.
 */
function debeEjecutarWarmUp(): boolean {
  try {
    const marcaAlmacenada = sessionStorage.getItem(CLAVE_STORAGE_ULTIMO_WARMUP);
    if (!marcaAlmacenada) {
      return true;
    }

    const tiempoAnterior = Number(marcaAlmacenada);
    if (Number.isNaN(tiempoAnterior)) {
      return true;
    }

    const tiempoTranscurrido = Date.now() - tiempoAnterior;
    return tiempoTranscurrido >= INTERVALO_MINIMO_WARMUP_MS;
  } catch {
    return true;
  }
}

/**
 * Registra en sessionStorage el instante del último ping de calentamiento.
 */
function registrarEjecucionWarmUp(): void {
  try {
    sessionStorage.setItem(CLAVE_STORAGE_ULTIMO_WARMUP, String(Date.now()));
  } catch {
    // Ignorar en caso de navegación privada con storage restringido
  }
}

/**
 * Componente invisible que despierta silenciosamente el contenedor del Backend en Render Free
 * al ingresar un visitante al sitio web, reduciendo la latencia de cold start.
 */
export function WarmUpBackend() {
  useEffect(() => {
    if (!debeEjecutarWarmUp()) {
      return;
    }

    registrarEjecucionWarmUp();
    const urlHealthcheck = `${obtenerUrlBaseApi()}/health`;

    fetch(urlHealthcheck, {
      method: "GET",
      mode: "cors",
      cache: "no-store",
    }).catch(() => {
      // Silencio intencional: si el backend está despertando, no ensucia la consola del usuario
    });
  }, []);

  return null;
}
