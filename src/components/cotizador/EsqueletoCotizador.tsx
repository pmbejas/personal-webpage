"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { FondoHumoSutil } from "@/components/animacion/FondoHumoSutil";
import { MenuFlotanteDerecho } from "@/components/diseno-v2/MenuFlotanteDerecho";
import { IsotipoLogo } from "@/components/layout/IsotipoLogo";

const CANTIDAD_TARJETAS_ESQUELETO = 6;

interface PropiedadesResumenEsqueleto {
  tituloResumen: string;
}

/**
 * Réplica skeleton de la columna fija izquierda de resumen y su barra móvil inferior.
 */
function ResumenEsqueletoLateral({ tituloResumen }: PropiedadesResumenEsqueleto) {
  return (
    <>
      <aside className="hidden lg:block lg:fixed lg:top-6 lg:left-[max(2rem,calc((100vw-1700px)/2+2rem))] lg:w-[360px] xl:w-[395px] lg:h-[calc(100vh-3rem)] z-20 shrink-0">
        <div className="relative rounded-[32px] bg-[#0c0a09]/95 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-5 sm:p-6 overflow-hidden flex flex-col justify-between h-full">
          <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[rgb(var(--tema-acento-rgb)/0.14)] blur-3xl" />

          <div className="relative z-10 flex flex-col min-h-0 flex-1">
            <div className="flex items-center gap-3 pb-3.5 border-b border-white/10">
              <div className="relative h-11 w-auto shrink-0 flex items-center justify-center">
                <IsotipoLogo className="h-full w-auto relative z-10" />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight truncate">
                  {tituloResumen}
                </h2>
                <div className="h-3 w-36 rounded-md bg-white/10 animate-pulse" />
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-5 pb-4 border-b border-white/10 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="h-2.5 w-20 rounded bg-white/10 animate-pulse" />
                  <div className="h-4 w-40 rounded bg-white/15 animate-pulse" />
                </div>
                <div className="h-4 w-20 rounded bg-white/15 animate-pulse shrink-0" />
              </div>

              <div className="pt-3 border-t border-white/5 space-y-2.5">
                <div className="h-2.5 w-28 rounded bg-white/10 animate-pulse" />
                <div className="h-3.5 w-44 rounded bg-white/[0.07] animate-pulse" />
              </div>

              <div className="mt-auto pt-3 border-t border-white/5 space-y-2">
                <div className="h-2.5 w-36 rounded bg-white/10 animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-8 flex-1 rounded-xl bg-white/[0.06] animate-pulse" />
                  <div className="h-8 w-20 rounded-xl bg-white/10 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-4 flex flex-col gap-3 shrink-0">
            <div className="flex items-baseline justify-between gap-2">
              <div className="h-4 w-36 rounded bg-white/10 animate-pulse" />
              <div className="h-7 w-28 rounded-lg bg-[rgb(var(--tema-acento-rgb)/0.2)] animate-pulse" />
            </div>

            <div className="h-9 w-full rounded-xl bg-white/[0.04] border border-white/10 animate-pulse" />

            <div className="flex flex-col gap-1.5 mt-0.5">
              <div className="h-3 w-52 mx-auto rounded bg-white/[0.07] animate-pulse" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-9 rounded-xl bg-white/[0.06] border border-white/10 animate-pulse" />
                <div className="h-9 rounded-xl bg-white/[0.04] border border-white/10 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:hidden fixed bottom-4 inset-x-4 z-40">
        <div className="w-full px-4 py-3 rounded-2xl bg-[#0c0a09]/95 backdrop-blur-xl border border-[rgb(var(--tema-acento-rgb)/0.35)] shadow-[0_12px_35px_rgba(0,0,0,0.85)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[rgb(var(--tema-acento-rgb)/0.15)] animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-2.5 w-20 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-28 rounded bg-white/15 animate-pulse" />
            </div>
          </div>
          <div className="h-8 w-24 rounded-xl bg-[rgb(var(--tema-acento-rgb)/0.25)] animate-pulse" />
        </div>
      </div>
    </>
  );
}

/**
 * Tarjeta esqueleto con proporciones exactas a TarjetaServicioCotizador.
 */
function TarjetaServicioEsqueleto() {
  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-[rgb(var(--tema-acento-rgb)/0.05)] border border-[rgb(var(--tema-acento-rgb)/0.18)] flex flex-col justify-between min-h-[212px]">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-white/10 animate-pulse shrink-0" />
          <div className="h-3 w-28 rounded bg-white/10 animate-pulse" />
        </div>

        <div className="h-5 w-3/4 rounded-md bg-white/15 animate-pulse mt-3" />

        <div className="space-y-1.5 mt-2.5">
          <div className="h-3 w-full rounded bg-white/[0.08] animate-pulse" />
          <div className="h-3 w-5/6 rounded bg-white/[0.08] animate-pulse" />
        </div>

        <div className="flex items-center gap-2 mt-3.5">
          <div className="h-5 w-28 rounded-lg bg-black/40 border border-white/10 animate-pulse" />
          <div className="h-5 w-20 rounded-lg bg-black/40 border border-white/10 animate-pulse" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[rgb(var(--tema-acento-rgb)/0.15)]">
        <div className="h-7 w-32 rounded-lg bg-white/15 animate-pulse" />
      </div>
    </div>
  );
}

/**
 * Pantalla Skeleton oficial del Cotizador Online.
 * Se muestra al instante durante el streaming de la ruta (loading.tsx / Suspense)
 * y se mantiene sin saltos visuales si el servidor de Render está despertando.
 */
export function EsqueletoCotizador() {
  const traducciones = useTranslations("cotizador");

  return (
    <div
      data-v2="true"
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="relative min-h-screen bg-[#070606] text-neutral-100"
    >
      <FondoHumoSutil />
      <MenuFlotanteDerecho />

      <div className="relative z-10 max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-6 pb-24 lg:pb-8 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        <div
          className="hidden lg:block lg:w-[360px] xl:w-[395px] shrink-0 pointer-events-none opacity-0"
          aria-hidden="true"
        />

        <ResumenEsqueletoLateral tituloResumen={traducciones("resumenTitulo")} />

        <main className="flex-1 min-w-0 w-full pr-0 lg:pr-16 xl:pr-20 flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white border border-white/10 hover:border-[rgb(var(--tema-acento-rgb)/0.45)] transition-all shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[rgb(var(--tema-acento-claro-rgb))]" />
              <span>{traducciones("volverAlPortafolio")}</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2" aria-hidden="true">
              <div className="h-8 w-36 rounded-full bg-[rgb(var(--tema-acento-rgb)/0.25)] border border-[rgb(var(--tema-acento-rgb)/0.4)] animate-pulse" />
              <div className="h-8 w-32 rounded-full bg-white/[0.06] border border-white/10 animate-pulse" />
              <div className="h-8 w-40 rounded-full bg-white/[0.06] border border-white/10 animate-pulse" />
            </div>
          </div>

          <section className="flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {traducciones("paso1Titulo")}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  {traducciones("cargandoTarifasDescripcion")}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-[rgb(var(--tema-acento-rgb)/0.12)] text-[rgb(var(--tema-acento-claro-rgb))] border border-[rgb(var(--tema-acento-rgb)/0.35)] shrink-0 self-start sm:self-center">
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span>{traducciones("cargandoTarifasTitulo")}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-3.5">
              {Array.from({ length: CANTIDAD_TARJETAS_ESQUELETO }).map((_, indice) => (
                <TarjetaServicioEsqueleto key={indice} />
              ))}
            </div>

            <div className="flex items-center justify-end pt-2">
              <div className="h-11 w-36 rounded-2xl bg-[rgb(var(--tema-acento-rgb)/0.25)] animate-pulse" />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
