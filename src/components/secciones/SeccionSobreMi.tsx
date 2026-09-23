"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Download, Award, CheckCircle2, Briefcase, Globe2 } from "lucide-react";
import { Boton } from "@/components/ui/Boton";
import { RetratoSobreMi } from "@/components/secciones/RetratoSobreMi";

/**
 * Sección "Sobre Mí": retrato emergiendo de un blob brillante a la izquierda
 * y biografía con métricas destacadas a la derecha (estilo de la referencia).
 */
export function SeccionSobreMi() {
  const traducciones = useTranslations("sobreMi");

  const metricasDestacadas = [
    {
      texto: traducciones("aniosExperiencia"),
      icono: <Award className="h-5 w-5 text-blue-400" />,
    },
    {
      texto: traducciones("disponibleFreelance"),
      icono: <Briefcase className="h-5 w-5 text-blue-400" />,
    },
    {
      texto: traducciones("proyectosCompletados"),
      icono: <CheckCircle2 className="h-5 w-5 text-blue-400" />,
    },
    {
      texto: traducciones("clientesGlobales"),
      icono: <Globe2 className="h-5 w-5 text-blue-400" />,
    },
  ];

  return (
    <section id="sobre-mi" className="py-10 md:py-14 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En móvil el orden del DOM es el orden visual: texto, retrato y
            cards de experiencia. En lg cada bloque se coloca explícitamente
            para reproducir el layout de escritorio original */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-x-16 lg:gap-y-0 items-center">

          {/* Bloque de Texto: etiqueta, título y descripción */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-start-6 lg:col-span-7 lg:row-start-1 flex flex-col"
          >
            {/* Tag / Etiqueta */}
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
              {traducciones("etiqueta")}
            </span>

            {/* Título de la sección */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {traducciones("titulo")}
            </h2>

            {/* Descripción */}
            <p className="mt-6 text-base text-slate-300 leading-relaxed">
              {traducciones("descripcion")}
            </p>
          </motion.div>

          {/* Retrato: en móvil aparece entre el texto y las cards de experiencia */}
          <div className="lg:col-start-1 lg:col-span-5 lg:row-start-1 lg:row-span-2 flex justify-center">
            <RetratoSobreMi />
          </div>

          {/* Bloque de Experiencia: métricas y botón de CV (delay escalonado) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-start-6 lg:col-span-7 lg:row-start-2 lg:mt-8"
          >
            {/* Grid de 4 Métricas / Insignias */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {metricasDestacadas.map((metrica, indice) => (
                <div
                  key={indice}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-950/60 border border-blue-800/40 flex-shrink-0">
                    {metrica.icono}
                  </div>
                  <span className="text-sm font-semibold text-slate-200">
                    {metrica.texto}
                  </span>
                </div>
              ))}
            </div>

            {/* Botón Descargar CV */}
            <div className="mt-8">
              <Boton
                href="/cv-pablo-bejas.pdf"
                target="_blank"
                rel="noopener noreferrer"
                variante="primario"
                tamanio="mediano"
                iconoIzquierda={<Download className="h-4 w-4" />}
              >
                {traducciones("descargarCv")}
              </Boton>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
