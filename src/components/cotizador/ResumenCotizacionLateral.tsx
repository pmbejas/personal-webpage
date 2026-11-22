"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronUp,
  Clock,
  FileText,
  MessageCircle,
  Receipt,
  ShieldCheck,
  Sparkles,
  X,
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
import { IsotipoLogo } from "@/components/layout/IsotipoLogo";

const NUMERO_WHATSAPP_PABLO = "5493814636143";

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
 * - En Desktop (>= lg): Fijo a la izquierda (sticky).
 * - En Móvil (< lg): Oculto por defecto; se despliega mediante un botón flotante inferior.
 */
export function ResumenCotizacionLateral({
  servicioSeleccionado,
  cantidadSeccionesExtra,
  adicionalesSeleccionados,
  promocionAplicada,
  alSolicitarFormalizacion,
}: PropiedadesResumenCotizacionLateral) {
  const [panelMovilAbierto, setPanelMovilAbierto] = useState<boolean>(false);
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

  const renderizarContenidoResumen = (esVistaMovil: boolean) => (
    <div className="relative rounded-3xl bg-[#0c0a09]/95 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-5 sm:p-6 overflow-hidden">
      {/* Resplandor ambiental superior */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[rgb(var(--tema-acento-rgb)/0.14)] blur-3xl" />

      {/* Cabecera del Resumen con Robot Isotipo a la izquierda */}
      <div className="relative z-10 flex items-center justify-between gap-3 pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-11 w-auto shrink-0 flex items-center justify-center">
            <div
              className="absolute inset-0 -m-1.5 rounded-full bg-[radial-gradient(circle_at_center,rgba(var(--tema-acento-rgb),0.4)_0%,transparent_75%)] blur-md pointer-events-none"
              aria-hidden="true"
            />
            <IsotipoLogo className="h-full w-auto relative z-10" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
              {traducciones("resumenTitulo")}
            </h3>
            <p className="text-[11px] text-neutral-400 font-mono mt-0.5 truncate">
              {traducciones("resumenSubtitulo")}
            </p>
          </div>
        </div>

        {esVistaMovil && (
          <button
            type="button"
            onClick={() => setPanelMovilAbierto(false)}
            aria-label={traducciones("ocultarDetalleMovil")}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Desglose de Ítems */}
      <div className="relative z-10 flex flex-col gap-3 mt-4 pb-4 border-b border-white/10">
        {/* 1. Servicio Base */}
        <div className="flex items-start justify-between gap-3 text-xs sm:text-sm">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
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
          <div className="flex items-center justify-between gap-3 text-xs pt-2 border-t border-white/5">
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
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
            {traducciones("conceptoAdicionales")} (
            {adicionalesSeleccionados.length})
          </span>

          {adicionalesSeleccionados.length === 0 ? (
            <span className="text-xs text-neutral-500 italic">
              {traducciones("sinAdicionales")}
            </span>
          ) : (
            <ul className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
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
                    className="flex items-start justify-between gap-2 text-xs text-neutral-300"
                  >
                    <span className="leading-snug truncate">
                      {textoAdicional.nombre}
                    </span>
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
          <div className="mt-0.5 p-2.5 rounded-2xl bg-realce-500/12 border border-realce-500/35 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-realce-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-bold text-realce-300 block truncate">
                  {traducciones("descuentoPromocional")}
                </span>
                <span className="text-[10px] font-mono text-realce-400/90 block truncate">
                  {promocionAplicada?.nombre}
                </span>
              </div>
            </div>
            <span className="font-mono font-extrabold text-xs sm:text-sm text-realce-400 shrink-0">
              -{formatearMonedaArs(montoDescuento)}
            </span>
          </div>
        )}
      </div>

      {/* Bloque de Totales: Inversión Total Neta, Seña 50% y Plazo */}
      <div className="relative z-10 mt-4 flex flex-col gap-3.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs sm:text-sm font-semibold text-neutral-200">
            {traducciones("inversionTotalNeta")}
          </span>
          <div className="text-right">
            {calculoPromocion.tienePromocion && (
              <span className="text-xs font-mono text-neutral-500 line-through block">
                {formatearMonedaArs(subtotalSinDescuento)}
              </span>
            )}
            <span
              className={`text-xl sm:text-2xl font-extrabold font-mono ${
                calculoPromocion.tienePromocion
                  ? "text-realce-400 drop-shadow-[0_0_16px_rgb(var(--tema-realce-rgb)/0.3)]"
                  : "text-white"
              }`}
            >
              {formatearMonedaArs(totalPresupuestado)}
            </span>
            <span className="text-[11px] font-mono text-neutral-400 ml-1">
              ARS
            </span>
          </div>
        </div>

        {/* Seña Sugerida (50%) y Tiempo de Entrega */}
        <div className="grid grid-cols-1 gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">
              {traducciones("senaSugerida")}
            </span>
            <span className="font-mono font-bold text-[rgb(var(--tema-acento-claro-rgb))]">
              {formatearMonedaArs(montoSenaSugerida)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/5">
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
          <p className="text-[11px] font-mono text-realce-300/90 bg-realce-500/10 border border-realce-500/20 rounded-xl px-3 py-1.5">
            {traducciones("notaAbonoMensual")}{" "}
            {formatearMonedaArs(adicionalRecurrente.precio)}/mes.
          </p>
        )}

        {/* Botones de Acción Comercial */}
        <div className="flex flex-col gap-2 mt-0.5">
          {alSolicitarFormalizacion ? (
            <button
              type="button"
              onClick={alSolicitarFormalizacion}
              className="w-full py-3 px-4 rounded-2xl font-semibold text-xs bg-[rgb(var(--tema-acento-rgb))] text-black shadow-[0_0_24px_rgba(var(--tema-acento-rgb),0.4)] hover:shadow-[0_0_32px_rgba(var(--tema-acento-rgb),0.65)] hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{traducciones("botonFormalizarPdf")}</span>
            </button>
          ) : (
            <a
              href={urlWhatsAppDirecto}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl font-semibold text-xs bg-[rgb(var(--tema-acento-rgb))] text-black shadow-[0_0_24px_rgba(var(--tema-acento-rgb),0.4)] hover:shadow-[0_0_32px_rgba(var(--tema-acento-rgb),0.65)] hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>{traducciones("botonFormalizarPdf")}</span>
            </a>
          )}

          <a
            href={urlWhatsAppDirecto}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-2xl font-medium text-xs bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white border border-white/10 hover:border-[rgb(var(--tema-acento-rgb)/0.4)] transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-[rgb(var(--tema-acento-claro-rgb))]" />
            <span>{traducciones("botonConsultarWhatsApp")}</span>
          </a>
        </div>

        {/* Sello de Garantía y Validez */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-neutral-400 text-center pt-0.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[rgb(var(--tema-acento-claro-rgb))] shrink-0" />
          <span>{traducciones("garantiaValidez")}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. VERSIÓN ESCRITORIO (>= lg): Columna fija a la IZQUIERDA */}
      <aside className="hidden lg:block lg:w-[340px] xl:w-[375px] lg:sticky lg:top-6 lg:self-start shrink-0">
        {renderizarContenidoResumen(false)}
      </aside>

      {/* 2. VERSIÓN MÓVIL (< lg): Oculto por defecto; botón/barra flotante inferior */}
      <div className="lg:hidden fixed bottom-4 inset-x-4 z-40">
        <button
          type="button"
          onClick={() => setPanelMovilAbierto(true)}
          className="w-full px-4 py-3 rounded-2xl bg-[#0c0a09]/95 backdrop-blur-xl border border-[rgb(var(--tema-acento-rgb)/0.5)] shadow-[0_12px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(var(--tema-acento-rgb),0.25)] flex items-center justify-between gap-3 text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[rgb(var(--tema-acento-rgb)/0.15)] border border-[rgb(var(--tema-acento-rgb)/0.35)] flex items-center justify-center text-[rgb(var(--tema-acento-claro-rgb))] shrink-0">
              <Receipt className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                {traducciones("verDetalleMovil")}
              </span>
              <span className="text-sm font-extrabold font-mono text-white block truncate">
                {formatearMonedaArs(totalPresupuestado)} ARS
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgb(var(--tema-acento-rgb))] text-black font-semibold text-xs shrink-0">
            <span>{traducciones("verDetalleMovil")}</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>

      {/* 3. DRAWER / MODAL MÓVIL DESPLEGABLE */}
      <AnimatePresence>
        {panelMovilAbierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setPanelMovilAbierto(false)}
            className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center p-3"
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(evento) => evento.stopPropagation()}
              className="w-full max-w-lg max-h-[88dvh] overflow-y-auto rounded-3xl"
            >
              {renderizarContenidoResumen(true)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
