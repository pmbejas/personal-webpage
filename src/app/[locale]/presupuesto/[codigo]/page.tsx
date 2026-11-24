import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  FileQuestion,
  Download,
  MessageCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  User,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { servicioCatalogo } from "@/services/ServicioCatalogo";
import { WordmarkLogo } from "@/components/layout/WordmarkLogo";
import { IsotipoLogo } from "@/components/layout/IsotipoLogo";

interface ParametrosPagina {
  params: Promise<{
    locale: string;
    codigo: string;
  }>;
}

export async function generateMetadata({
  params,
}: ParametrosPagina): Promise<Metadata> {
  const { locale, codigo } = await params;
  const traducciones = await getTranslations({
    locale,
    namespace: "validadorPresupuesto",
  });

  const codigoLimpio = codigo.toUpperCase();

  return {
    title: `${traducciones("titulo")} | ${codigoLimpio} - Pablo Bejas`,
    description: traducciones("subtitulo"),
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `/${locale}/presupuesto/${codigoLimpio}`,
      languages: {
        es: `/es/presupuesto/${codigoLimpio}`,
        en: `/en/presupuesto/${codigoLimpio}`,
        pt: `/pt/presupuesto/${codigoLimpio}`,
      },
    },
  };
}

/**
 * Página pública de validación y certificación de autenticidad de presupuestos.
 * Responde al escaneo del código QR incrustado en el PDF y consultas directas por código.
 */
export default async function PaginaValidacionPresupuesto({
  params,
}: ParametrosPagina) {
  const { locale, codigo } = await params;
  setRequestLocale(locale);

  const traducciones = await getTranslations({
    locale,
    namespace: "validadorPresupuesto",
  });

  const codigoNormalizado = codigo.trim().toUpperCase();
  const presupuesto = await servicioCatalogo.validarPresupuesto(codigoNormalizado);

  const formatearFecha = (fechaIso: string) => {
    try {
      return new Date(fechaIso).toLocaleDateString(
        locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-AR",
        { day: "2-digit", month: "2-digit", year: "numeric" }
      );
    } catch {
      return fechaIso;
    }
  };

  const formatearMonto = (monto: number, moneda: string) => {
    try {
      return monto.toLocaleString(
        locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-AR",
        { style: "currency", currency: moneda }
      );
    } catch {
      return `$ ${monto.toFixed(2)} ${moneda}`;
    }
  };

  return (
    <main className="min-h-screen bg-[#080706] text-white flex flex-col justify-between py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Resplandor ambiental de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />

      {/* Cabecera con Marca Oficial */}
      <header className="max-w-2xl mx-auto w-full flex items-center justify-between pb-8 border-b border-white/10 relative z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-10 w-auto">
            <IsotipoLogo className="h-full w-auto" />
          </div>
          <WordmarkLogo className="h-7 w-auto drop-shadow-md" />
        </Link>

        <span className="text-[11px] font-mono uppercase tracking-widest text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
          Validador SSL
        </span>
      </header>

      {/* Contenido Central: Certificado Digital */}
      <section className="max-w-2xl mx-auto w-full my-auto py-8 relative z-10">
        <div className="rounded-3xl bg-[#0c0a09]/95 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-6 sm:p-9 backdrop-blur-xl relative overflow-hidden">
          {/* Resplandor interno sutil */}
          <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

          {/* Estado: 1. VIGENTE */}
          {presupuesto && presupuesto.esValido && (
            <div className="flex flex-col gap-6">
              {/* Badge de Estado Vigente */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span>{traducciones("insigniaVigente")}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/20">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {presupuesto.diasRestantes === 1
                      ? traducciones("diaRestante")
                      : traducciones("diasRestantes", {
                          dias: presupuesto.diasRestantes,
                        })}
                  </span>
                </div>
              </div>

              {/* Título y Certificación */}
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                  <span>{traducciones("titulo")}</span>
                </h1>
                <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
                  {traducciones("descripcionVigente")}
                </p>
              </div>

              {/* Cuadrícula de Datos Clave Congelados */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                    {traducciones("etiquetaCodigo")}
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-white font-mono mt-0.5 block">
                    {presupuesto.codigo}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                    {traducciones("etiquetaCliente")}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white mt-0.5 block truncate">
                    {presupuesto.clienteNombre}
                    {presupuesto.clienteEmpresa && (
                      <span className="text-neutral-400 text-xs block truncate">
                        {presupuesto.clienteEmpresa}
                      </span>
                    )}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                    {traducciones("etiquetaServicio")}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-sky-300 mt-0.5 block">
                    {presupuesto.servicioNombre}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                    {traducciones("etiquetaVencimiento")}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-neutral-200 mt-0.5 block">
                    {formatearFecha(presupuesto.fechaVencimiento)} ({presupuesto.diasValidez} d)
                  </span>
                </div>

                <div className="sm:col-span-2 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                      {traducciones("etiquetaTotal")}
                    </span>
                    <span className="text-base sm:text-lg font-black text-white font-mono mt-0.5 block">
                      {formatearMonto(presupuesto.totalPresupuestado, presupuesto.moneda)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 block">
                      {traducciones("etiquetaSena")}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-sky-300 font-mono mt-0.5 block">
                      {formatearMonto(presupuesto.montoSenaSugerida, presupuesto.moneda)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de Acción: Descargar PDF + WhatsApp */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={servicioCatalogo.obtenerUrlDescargaPdf(presupuesto.codigo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-95 transition-all flex-1"
                >
                  <Download className="w-4 h-4" />
                  <span>{traducciones("botonDescargarPdf")}</span>
                </a>

                {presupuesto.urlWhatsApp && (
                  <a
                    href={presupuesto.urlWhatsApp.replace(
                      /wa\.me\/[0-9]*/,
                      "wa.me/5493814636143"
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:scale-[1.02] active:scale-95 transition-all flex-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{traducciones("botonWhatsApp")}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Estado: 2. VENCIDO */}
          {presupuesto && !presupuesto.esValido && (
            <div className="flex flex-col gap-6">
              {/* Badge de Estado Vencido */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/35 w-fit">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>{traducciones("insigniaVencido")}</span>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Presupuesto {presupuesto.codigo}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
                  {traducciones("descripcionVencido")}
                </p>
              </div>

              {/* Detalle resumen del vencimiento */}
              <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-xs sm:text-sm text-neutral-300 space-y-2">
                <p>
                  <span className="text-neutral-400 font-mono uppercase text-[10px] block">
                    {traducciones("etiquetaVencimiento")}
                  </span>
                  <span className="font-bold text-rose-300">
                    {formatearFecha(presupuesto.fechaVencimiento)} ({presupuesto.diasValidez} días de validez cumplidos)
                  </span>
                </p>
                <p>
                  <span className="text-neutral-400 font-mono uppercase text-[10px] block">
                    {traducciones("etiquetaCliente")}
                  </span>
                  <span className="font-semibold text-white">
                    {presupuesto.clienteNombre}
                  </span>
                </p>
              </div>

              {/* Botón de Recotizar */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-realce-500/20 hover:bg-realce-500/30 text-realce-300 hover:text-white border border-realce-500/50 shadow-[0_0_24px_rgb(var(--tema-realce-rgb)/0.3)] hover:scale-[1.02] active:scale-95 transition-all flex-1"
                >
                  <Sparkles className="w-4 h-4 text-realce-400 animate-pulse" />
                  <span>{traducciones("botonRecotizar")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 active:scale-95 transition-all"
                >
                  <span>{traducciones("volverInicio")}</span>
                </Link>
              </div>
            </div>
          )}

          {/* Estado: 3. NO ENCONTRADO */}
          {!presupuesto && (
            <div className="flex flex-col gap-6 text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-neutral-800 border border-white/10 flex items-center justify-center text-neutral-400 mx-auto">
                <FileQuestion className="w-7 h-7 text-neutral-400" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-400 border border-white/10 mb-3">
                  <span>{traducciones("insigniaNoEncontrado")}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Código: {codigoNormalizado}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-md mx-auto leading-relaxed">
                  {traducciones("descripcionNoEncontrado")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-sm mx-auto w-full">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-white text-black hover:bg-neutral-200 shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex-1"
                >
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>{traducciones("botonRecotizar")}</span>
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 active:scale-95 transition-all flex-1"
                >
                  <span>{traducciones("volverInicio")}</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pie de Página */}
      <footer className="max-w-2xl mx-auto w-full text-center pt-8 border-t border-white/10 relative z-10 text-[11px] font-mono text-neutral-400">
        Pablo Bejas · Software Architecture & Development · pablobejas.vercel.app
      </footer>
    </main>
  );
}
