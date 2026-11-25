"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarCheck, Check, Clock, Layers, Sparkles } from "lucide-react";
import {
  CalculoPrecioPromocional,
  ServicioBaseResponse,
} from "@/types/Catalogo";
import {
  formatearMonedaArs,
  localizarTextoCatalogo,
} from "@/utils/utilidadesCotizador";
import { ListonPromocional } from "./ListonPromocional";

interface PropiedadesTarjetaServicioCotizador {
  servicio: ServicioBaseResponse;
  calculoPrecio: CalculoPrecioPromocional;
  estaSeleccionado: boolean;
  alSeleccionar: (servicioId: string) => void;
}

/**
 * Tarjeta interactiva compacta para el Paso 01 (Selección del Tipo de Producto).
 * - No incluye selector de secciones adicionales (movido al Paso 02).
 * - Si el precio es 0 (Software a Medida), muestra la leyenda "A convenir luego de la primera entrevista".
 */
export function TarjetaServicioCotizador({
  servicio,
  calculoPrecio,
  estaSeleccionado,
  alSeleccionar,
}: PropiedadesTarjetaServicioCotizador) {
  const idioma = useLocale();
  const traducciones = useTranslations("cotizador");
  const esPrecioAConvenir = servicio.precioBase === 0;

  const textosLocalizados = localizarTextoCatalogo(
    idioma,
    servicio.clave,
    servicio.nombre,
    servicio.descripcionComercial
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => alSeleccionar(servicio.id)}
      onKeyDown={(evento) => {
        if (evento.key === "Enter" || evento.key === " ") {
          evento.preventDefault();
          alSeleccionar(servicio.id);
        }
      }}
      /* [MEJORA-VISUAL-05] Superficie neutra en tarjetas no seleccionadas; glow exclusivo en la elegida */
      className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden border text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--tema-acento-rgb))] ${
        estaSeleccionado
          ? "bg-[rgb(var(--tema-acento-rgb)/0.16)] border-[rgb(var(--tema-acento-rgb))] shadow-[0_0_32px_rgb(var(--tema-acento-rgb)/0.32)]"
          : "bg-[#0c0a09]/90 border-white/10 hover:border-[rgb(var(--tema-acento-rgb)/0.5)] hover:bg-white/[0.04]"
      }`}
    >
      {/* 1. Banner Cruzado (Ribbon) si tiene precio > 0 y promoción activa */}
      {!esPrecioAConvenir &&
        calculoPrecio.tienePromocion &&
        calculoPrecio.textoBanner && (
          <ListonPromocional
            textoBanner={calculoPrecio.textoBanner}
            variante="esquinaDiagonal"
          />
        )}

      {/* Halo ambiental superior cuando está seleccionado */}
      {estaSeleccionado && (
        <div className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 rounded-full bg-[rgb(var(--tema-acento-rgb)/0.25)] blur-3xl" />
      )}

      <div>
        {/* 2. Cabecera: Estado de selección y título del servicio */}
        <div className="flex items-center gap-2 pr-14">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 border ${
              estaSeleccionado
                ? "bg-[rgb(var(--tema-acento-rgb))] border-[rgb(var(--tema-acento-claro-rgb))] text-black shadow-[0_0_10px_rgba(var(--tema-acento-rgb),0.6)]"
                : "bg-white/5 border-white/20 text-transparent group-hover:border-white/40"
            }`}
          >
            <Check className="w-3 h-3 stroke-[3]" />
          </div>

          <span
            className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
              estaSeleccionado
                ? "text-[rgb(var(--tema-acento-claro-rgb))]"
                : "text-neutral-400"
            }`}
          >
            {estaSeleccionado
              ? traducciones("seleccionado")
              : traducciones("seleccionarPlan")}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white mt-2 pr-10 leading-tight">
          {textosLocalizados.nombre}
        </h3>

        <p
          title={textosLocalizados.descripcion}
          className="mt-1.5 text-xs text-neutral-400 leading-snug line-clamp-2"
        >
          {textosLocalizados.descripcion}
        </p>

        {/* 3. Metadatos de alcance base */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {!esPrecioAConvenir ? (
            <>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/40 border border-[rgb(var(--tema-acento-rgb)/0.25)] text-[11px] text-neutral-200 font-mono">
                <Layers className="w-3 h-3 text-[rgb(var(--tema-acento-claro-rgb))]" />
                <span>
                  {servicio.seccionesIncluidas}{" "}
                  {traducciones("seccionesIncluidas")}
                </span>
              </div>

              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/40 border border-[rgb(var(--tema-acento-rgb)/0.25)] text-[11px] text-neutral-200 font-mono">
                <Clock className="w-3 h-3 text-[rgb(var(--tema-acento-claro-rgb))]" />
                <span>
                  ~{servicio.diasEntregaBase} {traducciones("diasHabiles")}
                </span>
              </div>
            </>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-black/40 border border-[rgb(var(--tema-acento-rgb)/0.25)] text-[11px] text-neutral-200 font-mono">
              <CalendarCheck className="w-3 h-3 text-[rgb(var(--tema-acento-claro-rgb))]" />
              <span>{traducciones("plazoAConvenir")}</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Bloque de Precios (Precio con oferta o Leyenda 'A convenir luego de la primera entrevista') */}
      <div className="mt-3.5 pt-3 border-t border-[rgb(var(--tema-acento-rgb)/0.2)]">
        {esPrecioAConvenir ? (
          <div className="p-2.5 rounded-xl bg-[rgb(var(--tema-acento-rgb)/0.1)] border border-[rgb(var(--tema-acento-rgb)/0.3)]">
            <span className="text-xs sm:text-sm font-bold text-[rgb(var(--tema-acento-claro-rgb))] block leading-snug">
              {traducciones("precioAConvenirCard")}
            </span>
          </div>
        ) : calculoPrecio.tienePromocion ? (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono tabular-nums text-neutral-500 line-through decoration-neutral-500/80 decoration-2">
                {formatearMonedaArs(calculoPrecio.precioOriginal)}
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums font-bold bg-realce-500/15 text-realce-300 border border-realce-500/35">
                <Sparkles className="w-2.5 h-2.5 text-realce-400" />
                <span>
                  {traducciones("ahorro")}{" "}
                  {formatearMonedaArs(calculoPrecio.montoDescuento)}
                </span>
              </span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-realce-400 drop-shadow-[0_0_12px_rgb(var(--tema-realce-rgb)/0.25)]">
                {formatearMonedaArs(calculoPrecio.precioFinal)}
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                ARS
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-white">
              {formatearMonedaArs(servicio.precioBase)}
            </span>
            <span className="text-[11px] font-mono text-neutral-400">ARS</span>
          </div>
        )}
      </div>
    </div>
  );
}
