"use client";

import React from "react";
import { Cpu, Zap, ShieldCheck } from "lucide-react";

/**
 * Grilla Bento de 4 tarjetas inspirada en la sección "Why Clients Stick With Us"
 * con cápsulas circulares metálicas, circuitos resplandecientes y ambient glow ámbar.
 */
export const GrillaBentoV2: React.FC = () => {
  return (
    <section id="arquitectura" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Luz ambiental sutil en el fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-tr from-amber-600/10 via-orange-500/5 to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Cabecera de la sección */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 mb-3">
            ¿Por qué trabajar conmigo?
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ingeniería que transforma negocios
          </h2>
          <p className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed">
            Combino arquitectura limpia, diseño moderno de alta conversión y código mantenible para generar resultados tangibles y medibles.
          </p>
        </div>

        {/* Grilla Bento 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta 1: Implementación y Arquitectura */}
          <div className="relative p-7 sm:p-8 rounded-3xl bg-[#0c0a09]/90 border border-white/10 hover:border-amber-500/40 transition-all duration-300 overflow-hidden group shadow-xl">
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="text-xs font-mono text-amber-400/90 tracking-wider uppercase">01 / BACKEND</span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">Arquitectura & Herramientas</h3>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                  Desarrollo de servicios escalables con <strong className="text-neutral-200">ASP.NET Core (.NET 9)</strong>, Clean Architecture, Repository Pattern y PostgreSQL para garantizar estabilidad y alta concurrencia.
                </p>
              </div>

              {/* Ilustración de cápsula metálica con circuitos ámbar */}
              <div className="mt-8 relative h-44 rounded-2xl bg-black/60 border border-white/5 flex items-center justify-center overflow-hidden">
                {/* Circuitos decorativos */}
                <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
                
                {/* Halo brillante */}
                <div className="absolute w-28 h-28 rounded-full bg-amber-500/20 blur-xl group-hover:scale-125 transition-transform duration-500" />
                
                {/* Cápsula circular metálica */}
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-b from-neutral-800 to-neutral-950 border border-amber-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.35)] group-hover:border-amber-400 transition-colors">
                  <Cpu className="w-8 h-8 text-amber-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Alta Conversión & Performance */}
          <div className="relative p-7 sm:p-8 rounded-3xl bg-[#0c0a09]/90 border border-white/10 hover:border-amber-500/40 transition-all duration-300 overflow-hidden group shadow-xl">
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="text-xs font-mono text-amber-400/90 tracking-wider uppercase">02 / FRONTEND</span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">Alto Rendimiento & UX</h3>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                  Experiencias fluidas construidas en <strong className="text-neutral-200">Next.js 15</strong>, Tailwind CSS y Framer Motion con tiempos de carga inferiores a 1 segundo y puntuación máxima en Core Web Vitals.
                </p>
              </div>

              {/* Ilustración de cápsula metálica con rayo de velocidad */}
              <div className="mt-8 relative h-44 rounded-2xl bg-black/60 border border-white/5 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent" />
                <div className="absolute w-32 h-32 rounded-full bg-orange-500/25 blur-2xl group-hover:scale-125 transition-transform duration-500" />
                
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-b from-neutral-800 to-neutral-950 border border-amber-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(234,88,12,0.4)] group-hover:border-amber-400 transition-colors">
                  <Zap className="w-8 h-8 text-amber-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta 3: Retorno de Inversión & Eficiencia */}
          <div className="relative p-7 sm:p-8 rounded-3xl bg-[#0c0a09]/90 border border-white/10 hover:border-amber-500/40 transition-all duration-300 overflow-hidden group shadow-xl">
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="text-xs font-mono text-amber-400/90 tracking-wider uppercase">03 / NEGOCIO</span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">Máximo Retorno & Eficiencia</h3>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                  Automatización de procesos operativos, reducción de costos en servidores y código limpio que ahorra cientos de horas en mantenimiento futuro.
                </p>
              </div>

              {/* Gráfico ascendente con métrica +120% */}
              <div className="mt-8 relative h-44 rounded-2xl bg-black/60 border border-white/5 p-5 flex flex-col justify-end overflow-hidden">
                <div className="absolute top-4 left-5 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white font-mono">+120%</span>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider">Eficiencia de Procesos</span>
                </div>

                {/* Barras de progreso ascendentes */}
                <div className="flex items-end gap-3 h-20 w-full pt-4">
                  <div className="flex-1 h-[30%] bg-neutral-800 rounded-lg" />
                  <div className="flex-1 h-[45%] bg-neutral-800 rounded-lg" />
                  <div className="flex-1 h-[65%] bg-amber-600/50 rounded-lg" />
                  <div className="flex-1 h-[85%] bg-amber-500/80 rounded-lg" />
                  <div className="flex-1 h-[100%] bg-gradient-to-t from-orange-600 to-amber-400 rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta 4: Metodología Clara & Confianza */}
          <div className="relative p-7 sm:p-8 rounded-3xl bg-[#0c0a09]/90 border border-white/10 hover:border-amber-500/40 transition-all duration-300 overflow-hidden group shadow-xl">
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="text-xs font-mono text-amber-400/90 tracking-wider uppercase">04 / CONFIANZA</span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">Transparencia & Entregas Claras</h3>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                  Sin tecnicismos oscuros ni sorpresas. Entregas continuas, comunicación honesta y código totalmente documentado para tu equipo.
                </p>
              </div>

              {/* Escalera iluminada que asciende hacia el objetivo */}
              <div className="mt-8 relative h-44 rounded-2xl bg-black/60 border border-white/5 flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute w-28 h-28 rounded-full bg-amber-500/15 blur-xl" />
                <div className="relative flex flex-col items-center gap-1.5 w-44">
                  <div className="w-16 h-2 rounded-full bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.7)]" />
                  <div className="w-24 h-2 rounded-full bg-amber-500/70" />
                  <div className="w-32 h-2 rounded-full bg-amber-600/40" />
                  <div className="w-40 h-2 rounded-full bg-neutral-800" />
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-300 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Garantía de calidad & testing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
