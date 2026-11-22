"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, Clock, Layers, Minus, Plus, RefreshCw } from "lucide-react";
import {
  AdicionalResponse,
  GrupoAdicionalResponse,
  ServicioBaseResponse,
} from "@/types/Catalogo";
import {
  formatearMonedaArs,
  localizarTextoCatalogo,
} from "@/utils/utilidadesCotizador";

const MAXIMO_SECCIONES_EXTRA = 20;

interface PropiedadesSelectorAdicionalesPorGrupo {
  servicioSeleccionado: ServicioBaseResponse;
  cantidadSeccionesExtra: number;
  alCambiarSeccionesExtra: (nuevaCantidad: number) => void;
  grupos: GrupoAdicionalResponse[];
  adicionalesCompatiblesIds: string[];
  adicionalesSeleccionadosIds: string[];
  alAlternarAdicional: (adicionalId: string) => void;
}

/**
 * Contenido del Paso 02 del Cotizador:
 * 1. Selector interactivo de Secciones o páginas adicionales (+ / -).
 * 2. Grilla agrupada de módulos adicionales parametrizados según el producto elegido.
 */
export function SelectorAdicionalesPorGrupo({
  servicioSeleccionado,
  cantidadSeccionesExtra,
  alCambiarSeccionesExtra,
  grupos,
  adicionalesCompatiblesIds,
  adicionalesSeleccionadosIds,
  alAlternarAdicional,
}: PropiedadesSelectorAdicionalesPorGrupo) {
  const idioma = useLocale();
  const traducciones = useTranslations("cotizador");

  const esCompatible = (adicionalId: string): boolean => {
    if (!adicionalesCompatiblesIds || adicionalesCompatiblesIds.length === 0) {
      return false;
    }
    return adicionalesCompatiblesIds.includes(adicionalId);
  };

  const disminuirSecciones = () => {
    if (cantidadSeccionesExtra > 0) {
      alCambiarSeccionesExtra(cantidadSeccionesExtra - 1);
    }
  };

  const aumentarSecciones = () => {
    if (cantidadSeccionesExtra < MAXIMO_SECCIONES_EXTRA) {
      alCambiarSeccionesExtra(cantidadSeccionesExtra + 1);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 1. Tarjeta Superior de Secciones o Páginas Adicionales (si el producto lo permite) */}
      {servicioSeleccionado.permiteSeccionesExtra && (
        <div className="rounded-2xl bg-[#0c0a09]/90 border border-[rgb(var(--tema-acento-rgb)/0.35)] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_24px_rgba(var(--tema-acento-rgb),0.1)]">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[rgb(var(--tema-acento-rgb)/0.15)] border border-[rgb(var(--tema-acento-rgb)/0.35)] flex items-center justify-center text-[rgb(var(--tema-acento-claro-rgb))] shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                {traducciones("seccionesExtraTitulo")}
              </h4>
              <p className="text-xs font-mono text-neutral-400 mt-0.5">
                <span className="text-realce-400 font-bold">
                  +{formatearMonedaArs(servicioSeleccionado.precioSeccionExtra)}
                </span>{" "}
                /{" "}
                <span className="text-realce-400/90 font-medium">
                  +{servicioSeleccionado.diasPorSeccionExtra}{" "}
                  {servicioSeleccionado.diasPorSeccionExtra === 1
                    ? traducciones("diaHabil")
                    : traducciones("diasHabiles")}
                </span>{" "}
                {traducciones("seccionesExtraDetalle")} (
                {servicioSeleccionado.seccionesIncluidas}{" "}
                {traducciones("seccionesIncluidas")})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center">
            <button
              type="button"
              onClick={disminuirSecciones}
              disabled={cantidadSeccionesExtra <= 0}
              aria-label={traducciones("quitarSeccion")}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none border border-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="w-9 text-center font-mono font-extrabold text-base text-[rgb(var(--tema-acento-claro-rgb))]">
              {cantidadSeccionesExtra}
            </span>

            <button
              type="button"
              onClick={aumentarSecciones}
              disabled={cantidadSeccionesExtra >= MAXIMO_SECCIONES_EXTRA}
              aria-label={traducciones("agregarSeccion")}
              className="w-9 h-9 rounded-xl bg-[rgb(var(--tema-acento-rgb)/0.2)] hover:bg-[rgb(var(--tema-acento-rgb)/0.35)] border border-[rgb(var(--tema-acento-rgb)/0.45)] flex items-center justify-center text-[rgb(var(--tema-acento-claro-rgb))] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Grupos de Módulos Adicionales Compatibles */}
      {grupos.map((grupo) => {
        const adicionalesCompatiblesDelGrupo = grupo.adicionales.filter((item) =>
          esCompatible(item.id)
        );

        if (adicionalesCompatiblesDelGrupo.length === 0) {
          return null;
        }

        const textosGrupo = localizarTextoCatalogo(
          idioma,
          grupo.clave,
          grupo.nombre,
          grupo.descripcion
        );

        return (
          <div
            key={grupo.id}
            className="rounded-2xl sm:rounded-3xl bg-[rgb(var(--tema-acento-rgb)/0.08)] border border-[rgb(var(--tema-acento-rgb)/0.35)] p-4 sm:p-6 shadow-[0_0_28px_rgba(var(--tema-acento-rgb),0.12)] transition-all"
          >
            {/* Cabecera del Grupo */}
            <div className="mb-3.5 pb-3 border-b border-[rgb(var(--tema-acento-rgb)/0.2)]">
              <h4 className="text-sm sm:text-base font-bold text-[rgb(var(--tema-acento-claro-rgb))]">
                {textosGrupo.nombre}
              </h4>
              {textosGrupo.descripcion && (
                <p className="text-xs text-neutral-400 mt-0.5">
                  {textosGrupo.descripcion}
                </p>
              )}
            </div>

            {/* Lista de Adicionales Compatibles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {adicionalesCompatiblesDelGrupo.map((adicional: AdicionalResponse) => {
                const estaMarcado = adicionalesSeleccionadosIds.includes(
                  adicional.id
                );
                const textosAdicional = localizarTextoCatalogo(
                  idioma,
                  adicional.clave,
                  adicional.nombre,
                  adicional.descripcionComercial
                );

                return (
                  <button
                    key={adicional.id}
                    type="button"
                    onClick={() => alAlternarAdicional(adicional.id)}
                    className={`group relative p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between gap-3 cursor-pointer ${
                      estaMarcado
                        ? "bg-[rgb(var(--tema-acento-rgb)/0.1)] border-[rgb(var(--tema-acento-rgb))] shadow-[0_0_20px_rgba(var(--tema-acento-rgb),0.15)]"
                        : "bg-black/40 border-white/10 hover:border-white/25 hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Casilla de verificación */}
                      <div
                        className={`mt-0.5 w-4.5 h-4.5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                          estaMarcado
                            ? "bg-[rgb(var(--tema-acento-rgb))] border-[rgb(var(--tema-acento-claro-rgb))] text-black"
                            : "bg-white/5 border-white/20 text-transparent group-hover:border-white/40"
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="text-xs sm:text-sm font-bold text-white block leading-snug">
                          {textosAdicional.nombre}
                        </span>
                        <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
                          {textosAdicional.descripcion}
                        </p>
                      </div>
                    </div>

                    {/* Pie del adicional: Precio y Plazo / Recurrencia */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-white/5 pl-7">
                      <span className="text-xs sm:text-sm font-mono font-bold text-realce-400">
                        +{formatearMonedaArs(adicional.precio)}
                      </span>

                      {adicional.esRecurrente ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-realce-500/15 text-realce-300 border border-realce-500/30">
                          <RefreshCw className="w-2.5 h-2.5" />
                          <span>{traducciones("abonoMensualOpcional")}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-realce-400/90">
                          <Clock className="w-3 h-3 text-realce-400" />
                          <span>
                            +{adicional.diasEntregaExtra}{" "}
                            {adicional.diasEntregaExtra === 1
                              ? traducciones("diaHabil")
                              : traducciones("diasHabiles")}
                          </span>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
