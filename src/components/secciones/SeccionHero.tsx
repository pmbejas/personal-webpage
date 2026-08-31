"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { Boton } from "@/components/ui/Boton";
import { EMPRESAS_TECNOLOGIAS } from "@/data/datosContacto";
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
      className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

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
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              {traducciones("descripcion")}
            </p>

            {/* Botones de Acción */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#proyectos">
                <Boton
                  variante="primario"
                  tamanio="grande"
                  iconoDerecha={<ArrowRight className="h-4 w-4" />}
                >
                  {traducciones("verProyectos")}
                </Boton>
              </a>
              <a href="#contacto">
                <Boton
                  variante="secundario"
                  tamanio="grande"
                  iconoIzquierda={<Mail className="h-4 w-4 text-blue-400" />}
                >
                  {traducciones("contactarme")}
                </Boton>
              </a>
            </div>

            {/* Logos / Empresas y Tecnologías */}
            <div className="mt-14 pt-8 border-t border-slate-800/80">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                {traducciones("empresasConfianza")}
              </p>
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 opacity-80 hover:opacity-100 transition-opacity">
                {EMPRESAS_TECNOLOGIAS.map((item) => (
                  <span
                    key={item.nombre}
                    className="text-lg font-bold tracking-tight text-slate-400 hover:text-white transition-colors"
                  >
                    {item.nombre}
                  </span>
                ))}
              </div>
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
