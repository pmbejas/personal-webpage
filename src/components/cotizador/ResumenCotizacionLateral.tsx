"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronUp,
  FileDown,
  Info,
  Loader2,
  Lock,
  MessageCircle,
  Receipt,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import {
  AdicionalResponse,
  CrearPresupuestoResponse,
  PromocionVigenteResponse,
  ServicioBaseResponse,
  ValidarCuponResponse,
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
  cuponAplicado: ValidarCuponResponse | null;
  alAplicarCupon: (cupon: ValidarCuponResponse) => void;
  alRemoverCupon: () => void;
  cotizacionFinalizada: boolean;
  presupuestoCreado: CrearPresupuestoResponse | null;
  descripcionProyecto: string;
  nombreCliente: string;
}

/**
 * Construye el enlace universal de WhatsApp (wa.me) con el desglose completo o solicitud a medida.
 */
function construirEnlaceWhatsAppResumen(
  codigoPresupuesto: string | null,
  nombreCliente: string,
  nombreServicio: string,
  esCotizacionAMedida: boolean,
  cantidadSeccionesExtra: number,
  nombresAdicionales: string[],
  textoPromocion: string | null,
  totalPresupuestado: number,
  montoSenaSugerida: number,
  tiempoEntregaDias: number,
  descripcionProyecto: string
): string {
  const encabezadoCodigo = codigoPresupuesto
    ? ` (${codigoPresupuesto})`
    : "";
  const presentacion = nombreCliente.trim()
    ? `¡Hola Pablo! Soy ${nombreCliente.trim()}. Finalicé mi configuración en tu Cotizador Online${encabezadoCodigo}:`
    : `¡Hola Pablo! Finalicé mi configuración en tu Cotizador Online${encabezadoCodigo}:`;

  const lineas: string[] = [presentacion, "", `• Solución base: ${nombreServicio}`];

  if (esCotizacionAMedida) {
    lineas.push("• Presupuesto: A convenir luego de la primera entrevista");
  } else {
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
      `• Plazo estimado: ~${tiempoEntregaDias} días hábiles`
    );
  }

  if (descripcionProyecto.trim().length > 0) {
    lineas.push("", `• Mi proyecto: "${descripcionProyecto.trim()}"`);
  }

  lineas.push("", "Me gustaría coordinar los próximos pasos.");

  return `https://wa.me/${NUMERO_WHATSAPP_PABLO}?text=${encodeURIComponent(
    lineas.join("\n")
  )}`;
}

/**
 * Card de Resumen del Presupuesto:
 * - En Desktop (>= lg): Fijo a la izquierda con alto completo del viewport (lg:h-[calc(100vh-3rem)]).
 * - En Móvil (< lg): Oculto por defecto, desplegable mediante botón inferior.
 * - Sus botones de PDF y WhatsApp se habilitan una vez que el usuario hace clic en 'Finalizar' en el último paso.
 */
export function ResumenCotizacionLateral({
  servicioSeleccionado,
  cantidadSeccionesExtra,
  adicionalesSeleccionados,
  promocionAplicada,
  cuponAplicado,
  alAplicarCupon,
  alRemoverCupon,
  cotizacionFinalizada,
  presupuestoCreado,
  descripcionProyecto,
  nombreCliente,
}: PropiedadesResumenCotizacionLateral) {
  const [panelMovilAbierto, setPanelMovilAbierto] = useState<boolean>(false);
  const [codigoCupon, setCodigoCupon] = useState<string>("");
  const [validandoCupon, setValidandoCupon] = useState<boolean>(false);
  const [errorCupon, setErrorCupon] = useState<string | null>(null);

  const idioma = useLocale();
  const traducciones = useTranslations("cotizador");

  const esCotizacionAMedida = servicioSeleccionado.precioBase === 0;

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
    esCotizacionAMedida ? null : promocionAplicada
  );

  // Si hay cupón aplicado válido, se prioriza el descuento del cupón
  const tieneCupon = Boolean(cuponAplicado && cuponAplicado.esValido);
  const montoDescuento = tieneCupon
    ? cuponAplicado!.montoDescuento
    : calculoPromocion.montoDescuento;
  const totalPresupuestado = tieneCupon
    ? Math.max(0, subtotalSinDescuento - cuponAplicado!.montoDescuento)
    : calculoPromocion.precioFinal;
  const montoSenaSugerida = Math.round(totalPresupuestado * 0.5);
  const tieneDescuento = tieneCupon || calculoPromocion.tienePromocion;

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

  const manejarValidarCupon = async () => {
    if (!codigoCupon.trim() || esCotizacionAMedida) return;
    setValidandoCupon(true);
    setErrorCupon(null);

    const respuesta = await servicioCatalogo.validarCupon(
      codigoCupon.trim(),
      subtotalSinDescuento
    );
    setValidandoCupon(false);

    if (!respuesta.exito || !respuesta.datos || !respuesta.datos.esValido) {
      setErrorCupon(
        respuesta.datos?.mensaje ||
          respuesta.mensaje ||
          "El cupón ingresado no es válido o ha caducado."
      );
      return;
    }

    alAplicarCupon(respuesta.datos);
    setCodigoCupon("");
  };

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

  const textoPromocionResumen = tieneCupon
    ? `Cupón ${cuponAplicado!.codigo} (-${formatearMonedaArs(montoDescuento)})`
    : calculoPromocion.tienePromocion
    ? calculoPromocion.textoBanner
    : null;

  const urlWhatsAppFinal =
    presupuestoCreado?.enlacesWhatsApp?.enlaceClienteAPablo ||
    construirEnlaceWhatsAppResumen(
      presupuestoCreado?.codigo ?? null,
      nombreCliente,
      textosServicio.nombre,
      esCotizacionAMedida,
      cantidadSeccionesExtra,
      nombresAdicionalesLocalizados,
      textoPromocionResumen,
      totalPresupuestado,
      montoSenaSugerida,
      tiempoEntregaDias,
      descripcionProyecto
    );

  const urlPdfFinal = presupuestoCreado?.codigo
    ? servicioCatalogo.obtenerUrlDescargaPdf(presupuestoCreado.codigo)
    : null;

  const renderizarContenidoResumen = (esVistaMovil: boolean) => (
    <div
      className={`relative rounded-[32px] bg-[#0c0a09]/95 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-5 sm:p-6 overflow-hidden flex flex-col justify-between ${
        esVistaMovil ? "" : "h-full"
      }`}
    >
      {/* Resplandor ambiental superior */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[rgb(var(--tema-acento-rgb)/0.14)] blur-3xl" />

      {/* Zona Superior: Cabecera + Desglose flexible */}
      <div className="relative z-10 flex flex-col min-h-0 flex-1">
        {/* Cabecera del Resumen con Robot Isotipo a la izquierda */}
        <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-white/10 shrink-0">
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
                {presupuestoCreado?.codigo
                  ? `#${presupuestoCreado.codigo}`
                  : traducciones("resumenSubtitulo")}
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
        <div className="flex flex-col gap-3 mt-4 pb-4 border-b border-white/10 min-h-0 flex-1 overflow-y-auto pr-1">
          {/* 1. Servicio Base */}
          <div className="flex items-start justify-between gap-3 text-xs sm:text-sm shrink-0">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                {traducciones("conceptoBase")}
              </span>
              <span className="font-semibold text-white">
                {textosServicio.nombre}
              </span>
            </div>
            <span className="font-mono font-semibold text-neutral-200 shrink-0">
              {esCotizacionAMedida
                ? traducciones("aConvenirCorto")
                : formatearMonedaArs(subtotalBase)}
            </span>
          </div>

          {/* Si es Cotización a Medida ($0), mostrar aclaración formal */}
          {esCotizacionAMedida ? (
            <div className="mt-2 p-3.5 rounded-2xl bg-[rgb(var(--tema-acento-rgb)/0.1)] border border-[rgb(var(--tema-acento-rgb)/0.3)] flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[rgb(var(--tema-acento-claro-rgb))] shrink-0 mt-0.5" />
              <p className="text-xs text-neutral-200 leading-relaxed">
                {traducciones("aclaracionResumenAConvenir")}
              </p>
            </div>
          ) : (
            <>
              {/* 2. Secciones Extra */}
              {cantidadSeccionesExtra > 0 && (
                <div className="flex items-center justify-between gap-3 text-xs pt-2 border-t border-white/5 shrink-0">
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
                  <ul className="flex flex-col gap-1.5">
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

              {/* 4. Línea de Descuento Promocional o Cupón de Descuento */}
              {tieneCupon ? (
                <div className="mt-auto pt-2 shrink-0">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/12 border border-emerald-500/35 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Tag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-emerald-300 block truncate">
                          {traducciones("cuponAplicadoTitulo")} ({cuponAplicado?.codigo})
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400/90 block truncate">
                          {cuponAplicado?.descripcion}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-extrabold text-xs sm:text-sm text-emerald-400">
                        -{formatearMonedaArs(montoDescuento)}
                      </span>
                      {!cotizacionFinalizada && (
                        <button
                          type="button"
                          onClick={alRemoverCupon}
                          title={traducciones("cuponRemover")}
                          className="p-1 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : calculoPromocion.tienePromocion ? (
                <div className="mt-auto pt-2 shrink-0">
                  <div className="p-2.5 rounded-2xl bg-realce-500/12 border border-realce-500/35 flex items-center justify-between gap-2">
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
                </div>
              ) : null}

              {/* 5. Input interactivo para aplicar código de descuento si no hay cupón activo */}
              {!esCotizacionAMedida && !tieneCupon && !cotizacionFinalizada && (
                <div className="mt-2 pt-2 border-t border-white/5 shrink-0">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                    {traducciones("cuponPregunta")}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={codigoCupon}
                      onChange={(e) => {
                        setCodigoCupon(e.target.value.toUpperCase());
                        setErrorCupon(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          manejarValidarCupon();
                        }
                      }}
                      placeholder={traducciones("cuponPlaceholder")}
                      className="w-full min-w-0 bg-white/5 border border-white/15 focus:border-[rgb(var(--tema-acento-rgb))] rounded-xl px-2.5 py-1.5 text-xs font-mono text-white placeholder:text-neutral-500 focus:outline-none transition-colors uppercase tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={manejarValidarCupon}
                      disabled={validandoCupon || !codigoCupon.trim()}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed border border-white/15 text-xs font-mono font-semibold text-white transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {validandoCupon ? (
                        <Loader2 className="w-3 h-3 animate-spin text-[rgb(var(--tema-acento-rgb))]" />
                      ) : (
                        <Tag className="w-3 h-3 text-[rgb(var(--tema-acento-claro-rgb))]" />
                      )}
                      <span>{traducciones("cuponBotonAplicar")}</span>
                    </button>
                  </div>
                  {errorCupon && (
                    <p className="text-[10px] text-red-400 font-mono mt-1 leading-tight">
                      {errorCupon}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Zona Inferior Anclada: Inversión Total Neta, Seña 50%, Plazo y Botones */}
      <div className="relative z-10 mt-4 flex flex-col gap-3 shrink-0">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs sm:text-sm font-semibold text-neutral-200">
            {traducciones("inversionTotalNeta")}
          </span>
          <div className="text-right">
            {esCotizacionAMedida ? (
              <span className="text-sm sm:text-base font-bold font-mono text-[rgb(var(--tema-acento-claro-rgb))]">
                {traducciones("aConvenirCorto")}
              </span>
            ) : (
              <>
                {tieneDescuento && (
                  <span className="text-xs font-mono text-neutral-500 line-through block">
                    {formatearMonedaArs(subtotalSinDescuento)}
                  </span>
                )}
                <span
                  className={`text-xl sm:text-2xl font-extrabold font-mono ${
                    tieneCupon
                      ? "text-emerald-400 drop-shadow-[0_0_16px_rgba(16,185,129,0.3)]"
                      : calculoPromocion.tienePromocion
                      ? "text-realce-400 drop-shadow-[0_0_16px_rgb(var(--tema-realce-rgb)/0.3)]"
                      : "text-white"
                  }`}
                >
                  {formatearMonedaArs(totalPresupuestado)}
                </span>
                <span className="text-[11px] font-mono text-neutral-400 ml-1">
                  ARS
                </span>
              </>
            )}
          </div>
        </div>

        {/* Seña Sugerida (50%) */}
        {!esCotizacionAMedida && (
          <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10">
            <span className="text-neutral-400">
              {traducciones("senaSugerida")}
            </span>
            <span className="font-mono font-bold text-[rgb(var(--tema-acento-claro-rgb))]">
              {formatearMonedaArs(montoSenaSugerida)}
            </span>
          </div>
        )}

        {/* Nota si incluye mantenimiento recurrente */}
        {!esCotizacionAMedida && adicionalRecurrente && (
          <p className="text-[11px] font-mono text-realce-300/90 bg-realce-500/10 border border-realce-500/20 rounded-xl px-3 py-1.5">
            {traducciones("notaAbonoMensual")}{" "}
            {formatearMonedaArs(adicionalRecurrente.precio)}/mes.
          </p>
        )}

        {/* Botones de Acción Comercial (Se habilitan al hacer clic en 'Finalizar' en el último paso) */}
        <div className="flex flex-col gap-1.5 mt-0.5">
          {!cotizacionFinalizada && (
            <p className="text-[10.5px] font-mono text-neutral-400 flex items-center justify-center gap-1.5 text-center whitespace-nowrap overflow-hidden text-ellipsis">
              <Lock className="w-3 h-3 text-neutral-500 shrink-0" />
              <span className="truncate">{traducciones("avisoBotonesBloqueados")}</span>
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            {cotizacionFinalizada && urlPdfFinal ? (
              <a
                href={urlPdfFinal}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-2.5 rounded-xl font-semibold text-xs bg-[rgb(var(--tema-acento-rgb))] text-black shadow-[0_0_20px_rgba(var(--tema-acento-rgb),0.4)] hover:shadow-[0_0_28px_rgba(var(--tema-acento-rgb),0.6)] hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-1.5 truncate"
              >
                <FileDown className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{traducciones("botonEnviarDescargarPdf")}</span>
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-2 px-2.5 rounded-xl font-semibold text-xs bg-white/5 text-neutral-500 border border-white/10 opacity-50 cursor-not-allowed flex items-center justify-center gap-1.5 truncate"
              >
                <FileDown className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{traducciones("botonEnviarDescargarPdf")}</span>
              </button>
            )}

            {cotizacionFinalizada ? (
              <a
                href={urlWhatsAppFinal}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-2.5 rounded-xl font-semibold text-xs bg-white/10 hover:bg-white/15 text-white border border-[rgb(var(--tema-acento-rgb)/0.5)] shadow-[0_0_15px_rgba(var(--tema-acento-rgb),0.2)] transition-all flex items-center justify-center gap-1.5 truncate"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[rgb(var(--tema-acento-claro-rgb))] shrink-0" />
                <span className="truncate">{traducciones("botonComunicarmeConmigo")}</span>
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-2 px-2.5 rounded-xl font-medium text-xs bg-white/[0.03] text-neutral-500 border border-white/10 opacity-50 cursor-not-allowed flex items-center justify-center gap-1.5 truncate"
              >
                <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{traducciones("botonComunicarmeConmigo")}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. VERSIÓN ESCRITORIO (>= lg): Columna fija a la IZQUIERDA con alto completo del viewport e inamovible (fixed) */}
      <aside className="hidden lg:block lg:fixed lg:top-6 lg:left-[max(2rem,calc((100vw-1700px)/2+2rem))] lg:w-[360px] xl:w-[395px] lg:h-[calc(100vh-3rem)] z-20 shrink-0">
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
                {esCotizacionAMedida
                  ? traducciones("aConvenirCorto")
                  : `${formatearMonedaArs(totalPresupuestado)} ARS`}
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
