"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Cpu,
  Database,
  Gauge,
  Layers,
  ShieldCheck,
  Zap,
} from "lucide-react";

const METRICAS_RENDIMIENTO = [
  { etiqueta: "Performance", valor: "99", ancho: "w-[99%]" },
  { etiqueta: "LCP", valor: "<0.8s", ancho: "w-[92%]" },
  { etiqueta: "SEO", valor: "100", ancho: "w-full" },
];

/**
 * Grilla Bento 2x2 de alta gama.
 * [MEJORA-VISUAL-01] Todos los glows y patrones responden al tema cromático activo.
 * [MEJORA-VISUAL-04] Ritmo vertical equilibrado y micro-visualizaciones reales en las 4 tarjetas.
 */
export function GrillaBento() {
  const traducciones = useTranslations("bento");

  return (
    <section id="servicios" className="py-12 sm:py-16 relative overflow-hidden">
      {/* Luz ambiental reactiva al tema activo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-tr from-[rgb(var(--tema-acento-oscuro-rgb)/0.14)] via-[rgb(var(--tema-acento-rgb)/0.05)] to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Cabecera de la sección */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 mb-3"
          >
            {traducciones("etiqueta")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight"
          >
            {traducciones("titulo")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed"
          >
            {traducciones("descripcion")}
          </motion.p>
        </div>

        {/* Grilla Bento 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta 1: Backend - Diagrama de capas reales */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative p-7 sm:p-8 rounded-3xl bg-[#0c0a09]/90 border border-white/10 hover:border-[rgb(var(--tema-acento-rgb)/0.45)] hover:shadow-[0_0_30px_rgb(var(--tema-acento-rgb)/0.16)] transition-all duration-300 overflow-hidden group shadow-xl"
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="text-xs font-mono text-sky-400 tracking-wider uppercase">
                  {traducciones("tarjeta1.categoria")}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {traducciones("tarjeta1.titulo")}
                </h3>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                  {traducciones("tarjeta1.descripcion")}
                </p>
              </div>

              {/* [MEJORA-VISUAL-04] Micro-diagrama arquitectónico real reactivo al tema [MEJORA-VISUAL-01] */}
              <div className="mt-7 relative h-44 rounded-2xl bg-black/60 border border-white/5 p-4 sm:p-5 flex flex-col justify-between overflow-hidden">
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(var(--tema-color-hex) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span className="inline-flex items-center gap-1.5 text-[rgb(var(--tema-acento-claro-rgb))]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--tema-acento-claro-rgb))]" />
                    <span>REST API · Clean Arch</span>
                  </span>
                  <span className="tabular-nums text-neutral-500">99.9% SLA</span>
                </div>

                <div className="relative z-10 flex items-center justify-between gap-2 my-auto">
                  <div className="flex-1 rounded-xl bg-neutral-950/90 border border-[rgb(var(--tema-acento-rgb)/0.35)] px-2.5 py-2.5 text-center shadow-[0_0_16px_rgb(var(--tema-acento-rgb)/0.16)]">
                    <Cpu className="w-4 h-4 text-[rgb(var(--tema-acento-claro-rgb))] mx-auto mb-1" />
                    <span className="text-[10px] font-mono font-semibold text-white block">
                      .NET 10
                    </span>
                  </div>
                  <div className="h-[1px] w-4 sm:w-6 bg-gradient-to-r from-[rgb(var(--tema-acento-rgb)/0.3)] via-[rgb(var(--tema-acento-claro-rgb))] to-[rgb(var(--tema-acento-rgb)/0.3)] shrink-0" />
                  <div className="flex-1 rounded-xl bg-neutral-950/90 border border-white/10 px-2.5 py-2.5 text-center">
                    <Layers className="w-4 h-4 text-neutral-300 mx-auto mb-1" />
                    <span className="text-[10px] font-mono font-semibold text-neutral-200 block">
                      Services
                    </span>
                  </div>
                  <div className="h-[1px] w-4 sm:w-6 bg-gradient-to-r from-[rgb(var(--tema-acento-rgb)/0.3)] via-[rgb(var(--tema-acento-claro-rgb))] to-[rgb(var(--tema-acento-rgb)/0.3)] shrink-0" />
                  <div className="flex-1 rounded-xl bg-neutral-950/90 border border-[rgb(var(--tema-acento-rgb)/0.35)] px-2.5 py-2.5 text-center shadow-[0_0_16px_rgb(var(--tema-acento-rgb)/0.16)]">
                    <Database className="w-4 h-4 text-[rgb(var(--tema-acento-claro-rgb))] mx-auto mb-1" />
                    <span className="text-[10px] font-mono font-semibold text-white block">
                      PostgreSQL
                    </span>
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                  <span>EF Core + Dapper</span>
                  <span>JWT · RBAC</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tarjeta 2: Frontend - Panel Core Web Vitals */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative p-7 sm:p-8 rounded-3xl bg-[#0c0a09]/90 border border-white/10 hover:border-[rgb(var(--tema-acento-rgb)/0.45)] hover:shadow-[0_0_30px_rgb(var(--tema-acento-rgb)/0.16)] transition-all duration-300 overflow-hidden group shadow-xl"
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="text-xs font-mono text-sky-400 tracking-wider uppercase">
                  {traducciones("tarjeta2.categoria")}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {traducciones("tarjeta2.titulo")}
                </h3>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                  {traducciones("tarjeta2.descripcion")}
                </p>
              </div>

              {/* [MEJORA-VISUAL-04] Micro-panel Core Web Vitals reactivo al tema [MEJORA-VISUAL-01] */}
              <div className="mt-7 relative h-44 rounded-2xl bg-black/60 border border-white/5 p-4 sm:p-5 flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--tema-acento-oscuro-rgb)/0.1)] via-[rgb(var(--tema-acento-rgb)/0.04)] to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[rgb(var(--tema-acento-claro-rgb))]">
                    <Gauge className="w-3.5 h-3.5" />
                    <span>Core Web Vitals</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-400">
                    <Zap className="w-3 h-3 text-[rgb(var(--tema-acento-claro-rgb))]" />
                    <span>Next.js 15 SSR</span>
                  </span>
                </div>

                <div className="relative z-10 flex flex-col gap-2.5 my-auto">
                  {METRICAS_RENDIMIENTO.map((metrica) => (
                    <div key={metrica.etiqueta} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-neutral-300">{metrica.etiqueta}</span>
                        <span className="font-bold text-[rgb(var(--tema-acento-claro-rgb))] tabular-nums">
                          {metrica.valor}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className={`h-full ${metrica.ancho} rounded-full bg-gradient-to-r from-[rgb(var(--tema-acento-oscuro-rgb))] to-[rgb(var(--tema-acento-claro-rgb))] shadow-[0_0_10px_rgb(var(--tema-acento-rgb)/0.5)]`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tarjeta 3: Negocio - Máximo Retorno & Eficiencia */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative p-7 sm:p-8 rounded-3xl bg-[#0c0a09]/90 border border-white/10 hover:border-[rgb(var(--tema-acento-rgb)/0.45)] hover:shadow-[0_0_30px_rgb(var(--tema-acento-rgb)/0.16)] transition-all duration-300 overflow-hidden group shadow-xl"
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="text-xs font-mono text-sky-400 tracking-wider uppercase">
                  {traducciones("tarjeta3.categoria")}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {traducciones("tarjeta3.titulo")}
                </h3>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                  {traducciones("tarjeta3.descripcion")}
                </p>
              </div>

              {/* Gráfico ascendente con métrica porcentual reactivo al tema */}
              <div className="mt-7 relative h-44 rounded-2xl bg-black/60 border border-white/5 p-5 flex flex-col justify-end overflow-hidden">
                <div className="absolute top-4 left-5 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
                    {traducciones("tarjeta3.metrica")}
                  </span>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider">
                    {traducciones("tarjeta3.etiquetaMetrica")}
                  </span>
                </div>

                <div className="flex items-end gap-3 h-20 w-full pt-4">
                  <div className="flex-1 h-[30%] bg-neutral-800 rounded-lg" />
                  <div className="flex-1 h-[45%] bg-neutral-800 rounded-lg" />
                  <div className="flex-1 h-[65%] bg-blue-700/50 rounded-lg" />
                  <div className="flex-1 h-[85%] bg-blue-600/80 rounded-lg" />
                  <div className="flex-1 h-[100%] bg-gradient-to-t from-[rgb(var(--tema-acento-oscuro-rgb))] to-[rgb(var(--tema-acento-claro-rgb))] rounded-lg shadow-[0_0_15px_rgb(var(--tema-acento-claro-rgb)/0.5)]" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tarjeta 4: Confianza - Transparencia & Entregas Claras */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative p-7 sm:p-8 rounded-3xl bg-[#0c0a09]/90 border border-white/10 hover:border-[rgb(var(--tema-acento-rgb)/0.45)] hover:shadow-[0_0_30px_rgb(var(--tema-acento-rgb)/0.16)] transition-all duration-300 overflow-hidden group shadow-xl"
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="text-xs font-mono text-sky-400 tracking-wider uppercase">
                  {traducciones("tarjeta4.categoria")}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {traducciones("tarjeta4.titulo")}
                </h3>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                  {traducciones("tarjeta4.descripcion")}
                </p>
              </div>

              {/* Escalera iluminada con sello de garantía reactivo al tema */}
              <div className="mt-7 relative h-44 rounded-2xl bg-black/60 border border-white/5 flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute w-28 h-28 rounded-full bg-[rgb(var(--tema-acento-rgb)/0.15)] blur-xl" />
                <div className="relative flex flex-col items-center gap-1.5 w-44">
                  <div className="w-16 h-2 rounded-full bg-[rgb(var(--tema-acento-claro-rgb))] shadow-[0_0_15px_rgb(var(--tema-acento-claro-rgb)/0.7)]" />
                  <div className="w-24 h-2 rounded-full bg-[rgb(var(--tema-acento-rgb)/0.7)]" />
                  <div className="w-32 h-2 rounded-full bg-[rgb(var(--tema-acento-oscuro-rgb)/0.5)]" />
                  <div className="w-40 h-2 rounded-full bg-neutral-800" />
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-sky-300 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{traducciones("tarjeta4.insignia")}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
