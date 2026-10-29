"use client";

import React from "react";
import { Terminal, Database, Globe, Layers, Cpu, Server, Box, Zap } from "lucide-react";

interface ElementoStack {
  nombre: string;
  categoria: string;
  icono: React.ElementType;
}

const LISTA_TECNOLOGIAS: ElementoStack[] = [
  { nombre: ".NET 9 / C#", categoria: "Backend Robusto", icono: Terminal },
  { nombre: "Next.js 15", categoria: "App Router / SSR", icono: Globe },
  { nombre: "PostgreSQL", categoria: "Base de Datos", icono: Database },
  { nombre: "TypeScript", categoria: "Tipado Estricto", icono: Layers },
  { nombre: "Docker", categoria: "Contenedores", icono: Box },
  { nombre: "Tailwind CSS", categoria: "Diseño Moderno", icono: Zap },
  { nombre: "EF Core & Dapper", categoria: "Acceso a Datos", icono: Server },
  { nombre: "Clean Architecture", categoria: "Buenas Prácticas", icono: Cpu },
];

/**
 * Ticker tecnológico minimalista con badges metálicos y brillo al interactuar.
 */
export const CintaStackV2: React.FC = () => {
  return (
    <section className="relative py-12 bg-transparent overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 mb-6">
          Stack de desarrollo y arquitectura de alto rendimiento
        </p>

        {/* Grilla flexible de tecnologías */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {LISTA_TECNOLOGIAS.map((item) => {
            const Icono = item.icono;
            return (
              <div
                key={item.nombre}
                className="group p-3 rounded-2xl bg-white/[0.02] hover:bg-amber-500/[0.06] border border-white/5 hover:border-amber-500/30 transition-all duration-300 flex flex-col items-center justify-center text-center shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-white/[0.04] group-hover:bg-amber-500/20 flex items-center justify-center mb-2 transition-colors">
                  <Icono className="w-4 h-4 text-neutral-400 group-hover:text-amber-400 transition-colors" />
                </div>
                <span className="text-xs font-semibold text-neutral-300 group-hover:text-white transition-colors">
                  {item.nombre}
                </span>
                <span className="text-[10px] text-neutral-400 mt-0.5 truncate max-w-full">
                  {item.categoria}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
