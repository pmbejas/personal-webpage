"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { IsotipoLogo } from "@/components/layout/IsotipoLogo";
import { WordmarkLogo } from "@/components/layout/WordmarkLogo";

/**
 * [MEJORA-VISUAL-02] Encabezado de la página de proyectos alineado al lenguaje visual V2.
 */
export function EncabezadoPaginaProyectos() {
  const traducciones = useTranslations("proyectos");

  return (
    <div className="pt-20 pb-10 sm:pt-24 lg:pt-14 md:pb-12 text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Marca y retorno al inicio */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--tema-acento-rgb))] rounded-xl"
          >
            <div className="h-9 w-auto">
              <IsotipoLogo className="h-full w-auto" />
            </div>
            <WordmarkLogo className="h-6 w-auto drop-shadow-md" />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[rgb(var(--tema-acento-rgb)/0.45)] text-xs font-mono font-semibold text-neutral-200 hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--tema-acento-rgb))]"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[rgb(var(--tema-acento-claro-rgb))]" />
            <span>{traducciones("volverInicio")}</span>
          </Link>
        </div>

        {/* Insignia / Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 mb-4"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{traducciones("etiqueta")}</span>
        </motion.div>

        {/* Título Principal */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight"
        >
          {traducciones("todosLosProyectos")}
        </motion.h1>

        {/* Subtítulo Descriptivo */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed"
        >
          {traducciones("subtituloCatalogo")}
        </motion.p>
      </div>
    </div>
  );
}
