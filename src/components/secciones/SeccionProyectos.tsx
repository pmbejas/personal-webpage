"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { servicioProyectos } from "@/services/ServicioProyectos";
import { TarjetaProyecto } from "@/components/proyectos/TarjetaProyecto";

/**
 * Sección de Proyectos Destacados en la Home: cuadrícula limpia y moderna
 * de tarjetas de proyectos (Estilo V2), sensible al tema de color activo.
 */
export function SeccionProyectos() {
  const traducciones = useTranslations("proyectos");

  const proyectosDestacados = useMemo(
    () => servicioProyectos.obtenerDestacadosSincrono(),
    []
  );

  return (
    <section id="proyectos" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado con título a la izquierda y enlace a la derecha */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-mono font-bold uppercase tracking-widest text-[rgb(var(--tema-acento-claro-rgb))] block mb-3"
            >
              {traducciones("etiqueta")}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="text-3xl sm:text-[42px] font-extrabold text-white tracking-tight leading-tight"
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
              className="inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--tema-acento-claro-rgb))] hover:underline transition-colors group"
            >
              <span>{traducciones("verTodos")}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Cuadrícula limpia de proyectos destacados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {proyectosDestacados.map((proyecto, indice) => (
            <TarjetaProyecto
              key={proyecto.identificador}
              proyecto={proyecto}
              indice={indice}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
