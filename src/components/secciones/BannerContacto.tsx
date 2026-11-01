"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { TarjetaInformacionContacto } from "@/components/ui/TarjetaInformacionContacto";

/**
 * Banner de llamado a la acción. El fondo (ciudad nocturna oscura) lo provee
 * la capa global FondoAnimado, por lo que esta sección es transparente y
 * continua con el resto de la página.
 */
export function BannerContacto() {
  const traducciones = useTranslations("bannerContacto");

  return (
    <section id="contacto" className="relative py-16 md:py-24 overflow-hidden">

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          {/* Título de Impacto con Escala Áurea (42px) */}
          <h2 className="text-3xl sm:text-[42px] font-extrabold text-white tracking-tight leading-tight">
            {traducciones("titulo")}
          </h2>

          {/* Descripción orientando hacia la tarjeta de contacto (Texto Base 16px) */}
          <p className="mt-6 text-base text-slate-300 max-w-2xl leading-relaxed">
            {traducciones("descripcion")}
          </p>

          {/* Datos de contacto rápidos */}
          <div className="mt-12 w-full max-w-4xl">
            <TarjetaInformacionContacto />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

