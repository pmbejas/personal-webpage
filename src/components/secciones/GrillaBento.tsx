"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Cpu, Zap, ShieldCheck } from "lucide-react";

/**
 * Sección de arquitectura y propuesta de valor con formato Grilla Bento 2x2.
 * Incorpora ilustraciones tecnológicas interactivas y responde al tema activo del sitio.
 */
export function GrillaBento() {
  const traducciones = useTranslations("bento");

  return (
    <section id="servicios" className="py-16 md:py-24 relative overflow-hidden">
      {/* Resplandor ambiental de fondo reactivo al tema */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-tr from-[rgb(var(--tema-acento-oscuro-rgb)/0.15)] via-[rgb(var(--tema-acento-rgb)/0.06)] to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Cabecera de la sección */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-[rgb(var(--tema-acento-claro-rgb))] bg-[rgb(var(--tema-acento-rgb)/0.1)] border border-[rgb(var(--tema-acento-rgb)/0.25)] mb-3"
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
            className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed"
          >
            {traducciones("descripcion")}
          </motion.p>
        </div>

        {/* Grilla Bento 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Tarjeta 1: Backend - Arquitectura & Herramientas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative p-7 sm:p-8 rounded-3xl bg-[#0c0a09]/90 border border-white/10 hover:border-[rgb(var(--tema-acento-rgb)/0.4)] transition-all duration-300 overflow-hidden group shadow-xl hover:shadow-[0_0_30px_rgb(var(--tema-acento-rgb)/0.1)]"
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="text-xs font-mono text-[rgb(var(--tema-acento-claro-rgb))] tracking-wider uppercase">
                  {traducciones("tarjeta1.categoria")}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {traducciones("tarjeta1.titulo")}
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {traducciones("tarjeta1.descripcion")}
                </p>
              </div>

              {/* Ilustración de circuitos con cápsula metálica */}
              <div className="mt-8 relative h-44 rounded-2xl bg-black/60 border border-white/5 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(rgb(var(--tema-acento-rgb))_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                <div className="absolute w-28 h-28 rounded-full bg-[rgb(var(--tema-acento-rgb)/0.2)] blur-xl group-hover:scale-125 transition-transform duration-500" />
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-b from-neutral-800 to-neutral-950 border border-[rgb(var(--tema-acento-rgb)/0.4)] flex items-center justify-center shadow-[0_0_25px_rgb(var(--tema-acento-rgb)/0.35)] group-hover:border-[rgb(var(--tema-acento-claro-rgb))] transition-colors">
                  <Cpu className="w-8 h-8 text-[rgb(var(--tema-acento-claro-rgb))]" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tarjeta 2: Frontend - Alto Rendimiento & UX */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative p-7 sm:p-8 rounded-3xl bg-[#0c0a09]/90 border border-white/10 hover:border-[rgb(var(--tema-acento-rgb)/0.4)] transition-all duration-300 overflow-hidden group shadow-xl hover:shadow-[0_0_30px_rgb(var(--tema-acento-rgb)/0.1)]"
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="text-xs font-mono text-[rgb(var(--tema-acento-claro-rgb))] tracking-wider uppercase">
                  {traducciones("tarjeta2.categoria")}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {traducciones("tarjeta2.titulo")}
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {traducciones("tarjeta2.descripcion")}
                </p>
              </div>

              {/* Ilustración de velocidad con rayo */}
              <div className="mt-8 relative h-44 rounded-2xl bg-black/60 border border-white/5 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--tema-acento-oscuro-rgb)/0.15)] via-[rgb(var(--tema-acento-rgb)/0.08)] to-transparent" />
                <div className="absolute w-32 h-32 rounded-full bg-[rgb(var(--tema-acento-rgb)/0.25)] blur-2xl group-hover:scale-125 transition-transform duration-500" />
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-b from-neutral-800 to-neutral-950 border border-[rgb(var(--tema-acento-rgb)/0.4)] flex items-center justify-center shadow-[0_0_25px_rgb(var(--tema-acento-rgb)/0.35)] group-hover:border-[rgb(var(--tema-acento-claro-rgb))] transition-colors">
                  <Zap className="w-8 h-8 text-[rgb(var(--tema-acento-claro-rgb))]" />
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
            className="relative p-7 sm:p-8 rounded-3xl bg-[#0c0a09]/90 border border-white/10 hover:border-[rgb(var(--tema-acento-rgb)/0.4)] transition-all duration-300 overflow-hidden group shadow-xl hover:shadow-[0_0_30px_rgb(var(--tema-acento-rgb)/0.1)]"
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="text-xs font-mono text-[rgb(var(--tema-acento-claro-rgb))] tracking-wider uppercase">
                  {traducciones("tarjeta3.categoria")}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {traducciones("tarjeta3.titulo")}
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {traducciones("tarjeta3.descripcion")}
                </p>
              </div>

              {/* Gráfico ascendente con métrica porcentual */}
              <div className="mt-8 relative h-44 rounded-2xl bg-black/60 border border-white/5 p-5 flex flex-col justify-end overflow-hidden">
                <div className="absolute top-4 left-5 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white font-mono">
                    {traducciones("tarjeta3.metrica")}
                  </span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">
                    {traducciones("tarjeta3.etiquetaMetrica")}
                  </span>
                </div>

                {/* Barras de progreso ascendentes */}
                <div className="flex items-end gap-3 h-20 w-full pt-4">
                  <div className="flex-1 h-[30%] bg-neutral-800 rounded-lg" />
                  <div className="flex-1 h-[45%] bg-neutral-800 rounded-lg" />
                  <div className="flex-1 h-[65%] bg-[rgb(var(--tema-acento-oscuro-rgb)/0.5)] rounded-lg" />
                  <div className="flex-1 h-[85%] bg-[rgb(var(--tema-acento-rgb)/0.8)] rounded-lg" />
                  <div className="flex-1 h-[100%] bg-gradient-to-t from-[rgb(var(--tema-acento-oscuro-rgb))] to-[rgb(var(--tema-acento-claro-rgb))] rounded-lg shadow-[0_0_15px_rgb(var(--tema-acento-rgb)/0.5)]" />
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
            className="relative p-7 sm:p-8 rounded-3xl bg-[#0c0a09]/90 border border-white/10 hover:border-[rgb(var(--tema-acento-rgb)/0.4)] transition-all duration-300 overflow-hidden group shadow-xl hover:shadow-[0_0_30px_rgb(var(--tema-acento-rgb)/0.1)]"
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="text-xs font-mono text-[rgb(var(--tema-acento-claro-rgb))] tracking-wider uppercase">
                  {traducciones("tarjeta4.categoria")}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {traducciones("tarjeta4.titulo")}
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {traducciones("tarjeta4.descripcion")}
                </p>
              </div>

              {/* Escalera iluminada con sello de garantía */}
              <div className="mt-8 relative h-44 rounded-2xl bg-black/60 border border-white/5 flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute w-28 h-28 rounded-full bg-[rgb(var(--tema-acento-rgb)/0.15)] blur-xl" />
                <div className="relative flex flex-col items-center gap-1.5 w-44">
                  <div className="w-16 h-2 rounded-full bg-[rgb(var(--tema-acento-claro-rgb))] shadow-[0_0_15px_rgb(var(--tema-acento-rgb)/0.7)]" />
                  <div className="w-24 h-2 rounded-full bg-[rgb(var(--tema-acento-rgb)/0.7)]" />
                  <div className="w-32 h-2 rounded-full bg-[rgb(var(--tema-acento-oscuro-rgb)/0.4)]" />
                  <div className="w-40 h-2 rounded-full bg-neutral-800" />
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-[rgb(var(--tema-acento-claro-rgb))] font-mono">
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
