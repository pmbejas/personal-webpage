"use client";

import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LISTA_PROYECTOS } from "@/data/datosProyectos";
import { FilaProyectoDestacado } from "@/components/secciones/FilaProyectoDestacado";
import { DivisorProyecto } from "@/components/ui/DivisorProyecto";

/**
 * Sección de Proyectos Destacados en la Home: filas showcase alternadas con
 * el diseño de la imagen de referencia, y enlace al catálogo completo.
 */
export function SeccionProyectos() {
  const traducciones = useTranslations("proyectos");

  // Mostrar únicamente los proyectos marcados como destacados en la página principal
  const proyectosDestacados = LISTA_PROYECTOS.filter((p) => p.destacado);

  return (
    <section id="proyectos" className="py-10 md:py-14 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado con título a la izquierda y enlace a la derecha */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2"
            >
              {traducciones("etiqueta")}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
            >
              {traducciones("titulo")}
            </motion.h2>
          </div>

          {/* Enlace hacia la página dedicada /proyectos */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/proyectos"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors group"
            >
              <span>{traducciones("verTodos")}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Filas showcase alternadas, separadas por la línea de escaneo:
            un divisor al inicio, uno después de cada fila (queda entre
            proyectos y al final). El ritmo vertical lo aportan los márgenes
            del propio divisor */}
        <div>
          <DivisorProyecto />
          {proyectosDestacados.map((proyecto, indice) => (
            <Fragment key={proyecto.identificador}>
              <FilaProyectoDestacado proyecto={proyecto} indice={indice} />
              <DivisorProyecto />
            </Fragment>
          ))}
        </div>

      </div>
    </section>
  );
}
