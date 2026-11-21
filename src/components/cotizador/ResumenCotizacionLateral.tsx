"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  AdicionalResponse,
  PromocionVigenteResponse,
  ServicioBaseResponse,
} from "@/types/Catalogo";
import { servicioCatalogo } from "@/services/ServicioCatalogo";
import {
  formatearMonedaArs,
  localizarTextoCatalogo,
} from "@/utils/utilidadesCotizador";
import { ListonPromocional } from "./ListonPromocional";

const NUMERO_WHATSAPP_PABLO = "5493815152178";

interface PropiedadesResumenCotizacionLateral {
  servicioSeleccionado: ServicioBaseResponse;
  cantidadSeccionesExtra: number;
  adicionalesSeleccionados: AdicionalResponse[];
  promocionAplicada: PromocionVigenteResponse | null;
  alSolicitarFormalizacion?: () => void;
}

/**
 * Construye el enlace universal de WhatsApp (wa.me) con el desglose completo de la cotización.
 */
function construirEnlaceWhatsAppResumen(
  nombreServicio: string,
  cantidadSeccionesExtra: number,
  nombresAdicionales: string[],
  textoPromocion: string | null,
  totalPresupuestado: number,
  montoSenaSugerida: number,
  tiempoEntregaDias: number
): string {
  const lineas: string[] = [
    "¡Hola Pablo! Estuve configurando mi proyecto en tu Cotizador Online:",
    "",
    `• Solución base: ${nombreServicio}`,
  ];

  if (cantidadSeccionesExtra > 0) {
    lineas.push(`• Secciones adicionales: +${cantidadSeccionesExtra}`);
  }

  if (nombresAdicionales.length > 0) {
    lineas.push(`• Módulos adicionales: ${nombresAdicionales.join(", ")}`);
  }

  if (textoPromocion) {
    lineas.push(`• Promoción aplicada: ${textoPromocion}`);
  }

  lineas.push(
    "",
    `• Inversión Total Estimada: ${formatearMonedaArs(totalPresupuestado)} ARS`,
    `• Seña sugerida (50%): ${formatearMonedaArs(montoSenaSugerida)} ARS`,
    `• Plazo estimado: ~${tiempoEntregaDias} días hábiles`,
    "",
    "Me gustaría coordinar los próximos pasos."
  );

  const textoCodificado = encodeURIComponent(lineas.join("\n"));
  return `https://wa.me/${NUMERO_WHATSAPP_PABLO}?text=${textoCodificado}`;
}

/**
 * Sidebar flotante con desglose matemático en tiempo real.
 * Sincronizado al 100% con la fórmula de Presupuesto.RecalcularTotales() del Backend (.NET 10).
 */
export function ResumenCotizacionLateral({
  servicioSeleccionado,
  cantidadSeccionesExtra,
  adicionalesSeleccionados,
  promocionAplicada,
  alSolicitarFormalizacion,
}: PropiedadesResumenCotizacionLateral) {
  const [detalleMovilAbierto, setDetalleMovilAbierto] = useState<boolean>(true);
  const idioma = useLocale();
  const traducciones = useTranslations("cotizador");

  // 1. Cálculos matemáticos sincronizados con Presupuesto.cs
  const subtotalBase = servicioSeleccionado.precioBase;
  const subtotalSeccionesExtra =
    cantidadSeccionesExtra * servicioSeleccionado.precioSeccionExtra;
  const subtotalAdicionales = adicionalesSeleccionados.reduce(
    (acumulado, item) => acumulado + item.precio,
    0
  );
  const subtotalSinDescuento =
    subtotalBase + subtotalSeccionesExtra + subtotalAdicionales;

  const calculoPromocion = servicioCatalogo.calcularPrecioConPromocion(
    subtotalSinDescuento,
    promocionAplicada
  );

  const montoDescuento = calculoPromocion.montoDescuento;
  const totalPresupuestado = calculoPromocion.precioFinal;
  const montoSenaSugerida = Math.round(totalPresupuestado * 0.5);

  const diasSeccionesExtra =
    cantidadSeccionesExtra * servicioSeleccionado.diasPorSeccionExtra;
  const diasAdicionales = adicionalesSeleccionados.reduce(
    (acumulado, item) => acumulado + item.diasEntregaExtra,
    0
  );
  const tiempoEntregaDias =
    servicioSeleccionado.diasEntregaBase + diasSeccionesExtra + diasAdicionales;

  const adicionalRecurrente = adicionalesSeleccionados.find(
    (item) => item.esRecurrente
  );

  // 2. Textos localizados para el resumen
  const textosServicio = localizarTextoCatalogo(
    idioma,
    servicioSeleccionado.clave,
    servicioSeleccionado.nombre,
    servicioSeleccionado.descripcionComercial
  );

  const nombresAdicionalesLocalizados = adicionalesSeleccionados.map(
    (adicional) =>
      localizarTextoCatalogo(
        idioma,
        adicional.clave,
        adicional.nombre,
        adicional.descripcionComercial
      ).nombre
  );

  const urlWhatsAppDirecto = construirEnlaceWhatsAppResumen(
    textosServicio.nombre,
    cantidadSeccionesExtra,
    nombresAdicionalesLocalizados,
    calculoPromocion.tienePromocion ? calculoPromocion.textoBanner : null,
    totalPresupuestado,
    montoSenaSugerida,
    tiempoEntregaDias
  );

  return (
    <aside className="w-full lg:w-[390px] xl:w-[420px] lg:sticky lg:top-6 lg:self-start shrink-0">
      <div className="relative rounded-3xl bg-[#0c0a09]/95 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-6 sm:p-7 overflow-hidden">
        {/* Resplandor ambiental superior */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[rgb(var(--tema-acento-rgb)/0.14)] blur-3xl" />

        {/* Cabecera del Resumen */}
        <div className="relative z-10 flex items-start justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {traducciones("resumenTitulo")}
            </h3>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">
              {traducciones("resumenSubtitulo")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDetalleMovilAbierto(!detalleMovilAbierto)}
            className="lg:hidden inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-neutral-300"
          >
            <span>
              {detalleMovilAbierto
                ? traducciones("ocultarDetalleMovil")
                : traducciones("verDetalleMovil")}
            </span>
            {detalleMovilAbierto ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Badge de Promoción Activa si aplica */}
        {calculoPromocion.tienePromocion && calculoPromocion.textoBanner && (
          <div className="relative z-10 mt-4">
            <ListonPromocional
              textoBanner={calculoPromocion.textoBanner}
              variante="insigniaPildora"
            />
          </div>
        )}

        {/* Desglose de Ítems */}
        <div
          className={`relative z-10 flex-col gap-3.5 mt-5 pb-5 border-b border-white/10 ${
            detalleMovilAbierto ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* 1. Servicio Base */}
          <div className="flex items-start justify-between gap-3 text-sm">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
                {traducciones("conceptoBase")}
              </span>
              <span className="font-semibold text-white">
                {textosServicio.nombre}
              </span>
            </div>
            <span className="font-mono font-semibold text-neutral-200 shrink-0">
              {formatearMonedaArs(subtotalBase)}
            </span>
          </div>

          {/* 2. Secciones Extra */}
          {cantidadSeccionesExtra > 0 && (
            <div className="flex items-center justify-between gap-3 text-sm pt-2 border-t border-white/5">
              <span className="text-neutral-300">
                {traducciones("conceptoSeccionesExtra")} (+
                {cantidadSeccionesExtra})
              </span>
              <span className="font-mono font-semibold text-neutral-200 shrink-0">
                +{formatearMonedaArs(subtotalSeccionesExtra)}
              </span>
            </div>
          )}

          {/* 3. Adicionales Seleccionados */}
          <div className="pt-2 border-t border-white/5">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-2">
              {traducciones("conceptoAdicionales")} (
              {adicionalesSeleccionados.length})
            </span>

            {adicionalesSeleccionados.length === 0 ? (
              <span className="text-xs text-neutral-500 italic">
                {traducciones("sinAdicionales")}
              </span>
            ) : (
              <ul className="flex flex-col gap-2">
                {adicionalesSeleccionados.map((adicional) => {
                  const textoAdicional = localizarTextoCatalogo(
                    idioma,
                    adicional.clave,
                    adicional.nombre,
                    adicional.descripcionComercial
                  );
                  return (
                    <li
                      key={adicional.id}
                      className="flex items-start justify-between gap-3 text-xs text-neutral-300"
                    >
                      <span className="leading-snug">{textoAdicional.nombre}</span>
                      <span className="font-mono text-neutral-200 shrink-0">
                        +{formatearMonedaArs(adicional.precio)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* 4. Línea de Descuento Promocional en color de realce */}
          {calculoPromocion.tienePromocion && (
            <div className="mt-1 p-3 rounded-2xl bg-realce-500/12 border border-realce-500/35 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-4 h-4 text-realce-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-realce-300 block truncate">
                    {traducciones("descuentoPromocional")}
                  </span>
                  <span className="text-[11px] font-mono text-realce-400/90 block truncate">
                    {promocionAplicada?.nombre}
                  </span>
                </div>
              </div>
              <span className="font-mono font-extrabold text-sm text-realce-400 shrink-0">
                -{formatearMonedaArs(montoDescuento)}
              </span>
            </div>
          )}
        </div>

        {/* Bloque de Totales: Inversión Total Neta, Seña 50% y Plazo */}
        <div className="relative z-10 mt-5 flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-semibold text-neutral-200">
              {traducciones("inversionTotalNeta")}
            </span>
            <div className="text-right">
              {calculoPromocion.tienePromocion && (
                <span className="text-xs font-mono text-neutral-500 line-through block">
                  {formatearMonedaArs(subtotalSinDescuento)}
                </span>
              )}
              <span
                className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                  calculoPromocion.tienePromocion
                    ? "text-realce-400 drop-shadow-[0_0_16px_rgb(var(--tema-realce-rgb)/0.3)]"
                    : "text-white"
                }`}
              >
                {formatearMonedaArs(totalPresupuestado)}
              </span>
              <span className="text-xs font-mono text-neutral-400 ml-1">
                ARS
              </span>
            </div>
          </div>

          {/* Seña Sugerida (50%) y Tiempo de Entrega */}
          <div className="grid grid-cols-1 gap-2.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">
                {traducciones("senaSugerida")}
              </span>
              <span className="font-mono font-bold text-[rgb(var(--tema-acento-claro-rgb))]">
                {formatearMonedaArs(montoSenaSugerida)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[rgb(var(--tema-acento-claro-rgb))]" />
                <span>{traducciones("plazoEstimado")}</span>
              </span>
              <span className="font-mono font-bold text-white">
                ~{tiempoEntregaDias} {traducciones("diasHabiles")}
              </span>
            </div>
          </div>

          {/* Nota si incluye mantenimiento recurrente */}
          {adicionalRecurrente && (
            <p className="text-[11px] font-mono text-realce-300/90 bg-realce-500/10 border border-realce-500/20 rounded-xl px-3 py-2">
              {traducciones("notaAbonoMensual")}{" "}
              {formatearMonedaArs(adicionalRecurrente.precio)}/mes.
            </p>
          )}

          {/* Botones de Acción Comercial */}
          <div className="flex flex-col gap-2.5 mt-1">
            {alSolicitarFormalizacion ? (
              <button
                type="button"
                onClick={alSolicitarFormalizacion}
                className="w-full py-3.5 px-5 rounded-2xl font-semibold text-xs sm:text-sm bg-[rgb(var(--tema-acento-rgb))] text-black shadow-[0_0_24px_rgba(var(--tema-acento-rgb),0.4)] hover:shadow-[0_0_32px_rgba(var(--tema-acento-rgb),0.65)] hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>{traducciones("botonFormalizarPdf")}</span>
              </button>
            ) : (
              <a
                href={urlWhatsAppDirecto}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-2xl font-semibold text-xs sm:text-sm bg-[rgb(var(--tema-acento-rgb))] text-black shadow-[0_0_24px_rgba(var(--tema-acento-rgb),0.4)] hover:shadow-[0_0_32px_rgba(var(--tema-acento-rgb),0.65)] hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>{traducciones("botonFormalizarPdf")}</span>
              </a>
            )}

            <a
              href={urlWhatsAppDirecto}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl font-medium text-xs bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white border border-white/10 hover:border-[rgb(var(--tema-acento-rgb)/0.4)] transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[rgb(var(--tema-acento-claro-rgb))]" />
              <span>{traducciones("botonConsultarWhatsApp")}</span>
            </a>
          </div>

          {/* Sello de Garantía y Validez */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-neutral-400 text-center pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[rgb(var(--tema-acento-claro-rgb))] shrink-0" />
            <span>{traducciones("garantiaValidez")}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
