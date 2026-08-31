"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Code2, Smartphone, Rocket, ShieldCheck } from "lucide-react";

export interface PropiedadesTarjetaServicio {
  titulo: string;
  descripcion: string;
  nombreIcono: string;
  indice?: number;
}

const DICCIONARIO_ICONOS: Record<string, ReactNode> = {
  Code2: <Code2 className="h-6 w-6 text-blue-400" />,
  Smartphone: <Smartphone className="h-6 w-6 text-blue-400" />,
  Rocket: <Rocket className="h-6 w-6 text-blue-400" />,
  ShieldCheck: <ShieldCheck className="h-6 w-6 text-blue-400" />,
};

/**
 * Componente de tarjeta de servicio con animación y estética SaaS Dark.
 */
export function TarjetaServicio({
  titulo,
  descripcion,
  nombreIcono,
  indice = 0,
}: PropiedadesTarjetaServicio) {
  const iconoSeleccionado = DICCIONARIO_ICONOS[nombreIcono] || (
    <Code2 className="h-6 w-6 text-blue-400" />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: indice * 0.1 }}
      className="group relative flex flex-col p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 backdrop-blur-sm"
    >
      {/* Contenedor del ícono */}
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-950/60 border border-blue-800/40 text-blue-400 group-hover:scale-105 group-hover:border-blue-500/60 transition-transform duration-300">
        {iconoSeleccionado}
      </div>

      {/* Título del servicio */}
      <h3 className="text-lg font-semibold text-white mb-2.5 group-hover:text-blue-200 transition-colors">
        {titulo}
      </h3>

      {/* Descripción */}
      <p className="text-sm text-slate-400 leading-relaxed">
        {descripcion}
      </p>
    </motion.div>
  );
}

