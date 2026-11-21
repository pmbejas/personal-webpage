"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, Clock, RefreshCw } from "lucide-react";
import {
  AdicionalResponse,
  GrupoAdicionalResponse,
} from "@/types/Catalogo";
import {
  formatearMonedaArs,
  localizarTextoCatalogo,
} from "@/utils/utilidadesCotizador";

interface PropiedadesSelectorAdicionalesPorGrupo {
  grupos: GrupoAdicionalResponse[];
  adicionalesCompatiblesIds: string[];
  adicionalesSeleccionadosIds: string[];
  alAlternarAdicional: (adicionalId: string) => void;
}

/**
 * Grilla agrupada de módulos adicionales.
 * Filtra dinámicamente los ítems según la matriz de compatibilidad del servicio base seleccionado.
 */
export function SelectorAdicionalesPorGrupo({
  grupos,
  adicionalesCompatiblesIds,
  adicionalesSeleccionadosIds,
  alAlternarAdicional,
}: PropiedadesSelectorAdicionalesPorGrupo) {
  const idioma = useLocale();
  const traducciones = useTranslations("cotizador");

  const esCompatible = (adicionalId: string): boolean => {
    if (!adicionalesCompatiblesIds || adicionalesCompatiblesIds.length === 0) {
      return true;
    }
    return adicionalesCompatiblesIds.includes(adicionalId);
  };

  return (
    <div className="flex flex-col gap-8">
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
            className="rounded-3xl bg-[#0c0a09]/85 border border-white/10 p-6 sm:p-7"
          >
            {/* Cabecera del Grupo */}
            <div className="mb-5 pb-4 border-b border-white/10">
              <h4 className="text-lg font-bold text-white">
                {textosGrupo.nombre}
              </h4>
              {textosGrupo.descripcion && (
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  {textosGrupo.descripcion}
                </p>
              )}
            </div>

            {/* Lista de Adicionales Compatibles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className={`group relative p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer ${
                      estaMarcado
                        ? "bg-[rgb(var(--tema-acento-rgb)/0.1)] border-[rgb(var(--tema-acento-rgb))] shadow-[0_0_22px_rgba(var(--tema-acento-rgb),0.15)]"
                        : "bg-black/40 border-white/10 hover:border-white/25 hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Casilla de verificación */}
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                          estaMarcado
                            ? "bg-[rgb(var(--tema-acento-rgb))] border-[rgb(var(--tema-acento-claro-rgb))] text-black"
                            : "bg-white/5 border-white/20 text-transparent group-hover:border-white/40"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-bold text-white block leading-snug">
                          {textosAdicional.nombre}
                        </span>
                        <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                          {textosAdicional.descripcion}
                        </p>
                      </div>
                    </div>

                    {/* Pie del adicional: Precio y Plazo / Recurrencia */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5 pl-8">
                      <span
                        className={`text-sm font-mono font-bold ${
                          estaMarcado
                            ? "text-[rgb(var(--tema-acento-claro-rgb))]"
                            : "text-neutral-200"
                        }`}
                      >
                        +{formatearMonedaArs(adicional.precio)}
                      </span>

                      {adicional.esRecurrente ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-realce-500/15 text-realce-300 border border-realce-500/30">
                          <RefreshCw className="w-2.5 h-2.5" />
                          <span>{traducciones("abonoMensualOpcional")}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400">
                          <Clock className="w-3 h-3 text-neutral-500" />
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
