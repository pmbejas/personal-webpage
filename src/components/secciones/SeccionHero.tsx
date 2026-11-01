"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { Boton } from "@/components/ui/Boton";
import { CuboCodigo } from "@/components/animacion/CuboCodigo";

/**
 * Sección Hero: presentación del desarrollador y cubo de código 3D
 * interactivo. El fondo (ciudad nocturna translúcida + partículas) lo provee
 * la capa global FondoAnimado, uniforme en todo el sitio.
 */
export function SeccionHero() {
  const traducciones = useTranslations("hero");

  return (
    <section
      id="inicio"
      className="relative min-h-[90vh] flex items-center overflow-hidden pt-28 pb-12 lg:pt-36 lg:pb-16"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Columna Izquierda: Información de presentación */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col max-w-3xl"
          >
            {/* Saludo */}
            <div className="inline-flex items-center gap-2 text-blue-400 font-semibold text-xs uppercase tracking-widest mb-3">
              <Sparkles className="h-4 w-4" />
              <span>{traducciones("saludo")}</span>
            </div>

            {/* Nombre y Título Principal con Escala Áurea (68px / 42px) */}
            <h1 className="text-4xl sm:text-5xl lg:text-[68px] font-extrabold tracking-tight text-white leading-[1.08]">
              {traducciones("nombre")}
              <span className="block text-2xl sm:text-3xl lg:text-[42px] font-bold text-blue-400 mt-2 leading-tight">
                {traducciones("rol")}
              </span>
            </h1>

            {/* Descripción Profesional (Texto Base 16px) */}
            <p className="mt-6 text-base text-slate-300 max-w-xl leading-relaxed">
              {traducciones("descripcion")}
            </p>

            {/* Botones de Acción */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Boton
                href="#proyectos"
                variante="primario"
                tamanio="grande"
                iconoDerecha={<ArrowRight className="h-4 w-4" />}
              >
                {traducciones("verProyectos")}
              </Boton>
              <Boton
                href="#contacto"
                variante="secundario"
                tamanio="grande"
                iconoIzquierda={<Mail className="h-4 w-4 text-blue-400" />}
              >
                {traducciones("contactarme")}
              </Boton>
            </div>
          </motion.div>

          {/* Columna Derecha: Cubo de código 3D interactivo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <CuboCodigo />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
