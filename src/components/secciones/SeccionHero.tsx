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
      className="relative min-h-[90vh] flex items-center overflow-hidden pt-24 pb-8 lg:pt-32 lg:pb-12"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* Columna Izquierda: Información de presentación */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col max-w-3xl"
          >
            {/* Saludo */}
            <div className="inline-flex items-center gap-2 text-blue-400 font-semibold text-sm tracking-wide mb-3">
              <Sparkles className="h-4 w-4" />
              <span>{traducciones("saludo")}</span>
            </div>

            {/* Nombre y Título Principal */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {traducciones("nombre")}
              <span className="block text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-400 mt-2">
                {traducciones("rol")}
              </span>
            </h1>

            {/* Descripción Profesional */}
            <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              {traducciones("descripcion")}
            </p>

            {/* Botones de Acción */}
            <div className="mt-7 flex flex-wrap items-center gap-4">
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
