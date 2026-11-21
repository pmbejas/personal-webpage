"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, Clock, Layers, Minus, Plus, Sparkles } from "lucide-react";
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
  cantidadSeccionesExtra: number;
  alSeleccionar: (servicioId: string) => void;
  alCambiarSeccionesExtra: (nuevaCantidad: number) => void;
}

const MAXIMO_SECCIONES_EXTRA = 20;

/**
 * Tarjeta interactiva para un Servicio Base dentro del Cotizador.
 * Incluye Banner Cruzado (Ribbon) de campaña activa, precio original tachado en gris,
 * precio final promocional en color de realce y selector interactivo de secciones extra.
 */
export function TarjetaServicioCotizador({
  servicio,
  calculoPrecio,
  estaSeleccionado,
  cantidadSeccionesExtra,
  alSeleccionar,
  alCambiarSeccionesExtra,
}: PropiedadesTarjetaServicioCotizador) {
  const idioma = useLocale();
  const traducciones = useTranslations("cotizador");

  const textosLocalizados = localizarTextoCatalogo(
    idioma,
    servicio.clave,
    servicio.nombre,
    servicio.descripcionComercial
  );

  const disminuirSecciones = (evento: React.MouseEvent) => {
    evento.stopPropagation();
    if (cantidadSeccionesExtra > 0) {
      alCambiarSeccionesExtra(cantidadSeccionesExtra - 1);
    }
  };

  const aumentarSecciones = (evento: React.MouseEvent) => {
    evento.stopPropagation();
    if (cantidadSeccionesExtra < MAXIMO_SECCIONES_EXTRA) {
      alCambiarSeccionesExtra(cantidadSeccionesExtra + 1);
    }
  };

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
      className={`group relative rounded-3xl p-6 sm:p-7 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden border text-left ${
        estaSeleccionado
          ? "bg-[#110e10] border-[rgb(var(--tema-acento-rgb))] shadow-[0_0_35px_rgba(var(--tema-acento-rgb),0.22)]"
          : "bg-[#0c0a09]/90 border-white/10 hover:border-white/25 hover:bg-[#0f0d0e]"
      }`}
    >
      {/* 1. Banner Cruzado (Ribbon) si existe promoción activa */}
      {calculoPrecio.tienePromocion && calculoPrecio.textoBanner && (
        <ListonPromocional
          textoBanner={calculoPrecio.textoBanner}
          variante="esquinaDiagonal"
        />
      )}

      {/* Halo ambiental superior cuando está seleccionado */}
      {estaSeleccionado && (
        <div className="pointer-events-none absolute -top-20 -left-20 w-56 h-56 rounded-full bg-[rgb(var(--tema-acento-rgb)/0.14)] blur-3xl" />
      )}

      <div>
        {/* 2. Cabecera: Estado de selección y título del servicio */}
        <div className="flex items-center gap-3 pr-20">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 border ${
              estaSeleccionado
                ? "bg-[rgb(var(--tema-acento-rgb))] border-[rgb(var(--tema-acento-claro-rgb))] text-black shadow-[0_0_12px_rgba(var(--tema-acento-rgb),0.6)]"
                : "bg-white/5 border-white/20 text-transparent group-hover:border-white/40"
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>

          <span
            className={`text-xs font-mono uppercase tracking-wider font-semibold ${
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

        <h3 className="text-xl sm:text-2xl font-bold text-white mt-3 pr-14 leading-snug">
          {textosLocalizados.nombre}
        </h3>

        <p className="mt-2.5 text-xs sm:text-sm text-neutral-400 leading-relaxed">
          {textosLocalizados.descripcion}
        </p>

        {/* 3. Metadatos de alcance base: Secciones incluidas y Días de entrega */}
        <div className="flex flex-wrap items-center gap-2.5 mt-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-neutral-300 font-mono">
            <Layers className="w-3.5 h-3.5 text-[rgb(var(--tema-acento-claro-rgb))]" />
            <span>
              {servicio.seccionesIncluidas} {traducciones("seccionesIncluidas")}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-neutral-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-[rgb(var(--tema-acento-claro-rgb))]" />
            <span>
              ~{servicio.diasEntregaBase} {traducciones("diasHabiles")}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Bloque de Precios (Original Tachado + Precio Promocional en color de realce) */}
      <div className="mt-6 pt-5 border-t border-white/10">
        {calculoPrecio.tienePromocion ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-sm font-mono text-neutral-500 line-through decoration-neutral-500/80 decoration-2">
                {formatearMonedaArs(calculoPrecio.precioOriginal)}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-realce-500/15 text-realce-300 border border-realce-500/35">
                <Sparkles className="w-3 h-3 text-realce-400" />
                <span>
                  {traducciones("ahorro")}{" "}
                  {formatearMonedaArs(calculoPrecio.montoDescuento)}
                </span>
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-realce-400 drop-shadow-[0_0_14px_rgb(var(--tema-realce-rgb)/0.25)]">
                {formatearMonedaArs(calculoPrecio.precioFinal)}
              </span>
              <span className="text-xs font-mono text-neutral-400">ARS</span>
            </div>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              {formatearMonedaArs(servicio.precioBase)}
            </span>
            <span className="text-xs font-mono text-neutral-400">ARS</span>
          </div>
        )}

        {/* 5. Control interactivo de Secciones Extra (visible cuando el servicio está seleccionado) */}
        {estaSeleccionado && servicio.permiteSeccionesExtra && (
          <div
            onClick={(evento) => evento.stopPropagation()}
            className="mt-5 p-3.5 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <span className="text-xs font-semibold text-neutral-200 block">
                {traducciones("seccionesExtraTitulo")}
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                +{formatearMonedaArs(servicio.precioSeccionExtra)} / +
                {servicio.diasPorSeccionExtra}{" "}
                {servicio.diasPorSeccionExtra === 1
                  ? traducciones("diaHabil")
                  : traducciones("diasHabiles")}{" "}
                {traducciones("seccionesExtraDetalle")}
              </span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={disminuirSecciones}
                disabled={cantidadSeccionesExtra <= 0}
                aria-label={traducciones("quitarSeccion")}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none border border-white/10 flex items-center justify-center text-white transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <span className="w-8 text-center font-mono font-bold text-sm text-[rgb(var(--tema-acento-claro-rgb))]">
                {cantidadSeccionesExtra}
              </span>

              <button
                type="button"
                onClick={aumentarSecciones}
                disabled={cantidadSeccionesExtra >= MAXIMO_SECCIONES_EXTRA}
                aria-label={traducciones("agregarSeccion")}
                className="w-8 h-8 rounded-xl bg-[rgb(var(--tema-acento-rgb)/0.2)] hover:bg-[rgb(var(--tema-acento-rgb)/0.35)] border border-[rgb(var(--tema-acento-rgb)/0.45)] flex items-center justify-center text-[rgb(var(--tema-acento-claro-rgb))] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
