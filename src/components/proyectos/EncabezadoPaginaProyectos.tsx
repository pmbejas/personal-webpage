"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Encabezado de la página de proyectos con título, descripción y botón para volver al inicio.
 */
export function EncabezadoPaginaProyectos() {
  const traducciones = useTranslations("proyectos");

  return (
    <div className="pt-28 pb-12 md:pt-36 md:pb-16 text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Botón de retorno al inicio */}
        <div className="mb-6 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-200"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-blue-400" />
            <span>{traducciones("volverInicio")}</span>
          </Link>
        </div>

        {/* Insignia / Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400 mb-3"
        >
          <Sparkles className="h-4 w-4" />
          <span>{traducciones("etiqueta")}</span>
        </motion.div>

        {/* Título Principal */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight"
        >
          {traducciones("todosLosProyectos")}
        </motion.h1>

        {/* Subtítulo Descriptivo */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          {traducciones("subtituloCatalogo")}
        </motion.p>
      </div>
    </div>
  );
}

