"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { LISTA_SERVICIOS } from "@/data/datosServicios";
import { TarjetaServicio } from "@/components/ui/TarjetaServicio";

/**
 * Sección de Servicios que muestra las habilidades y ofertas en una cuadrícula responsiva.
 */
export function SeccionServicios() {
  const traducciones = useTranslations("servicios");

  return (
    <section id="servicios" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado de la Sección */}
        <div className="text-center max-w-3xl mx-auto mb-16">
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
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            {traducciones("titulo")}
          </motion.h2>

          {/* Línea decorativa azul */}
          <div className="h-1 w-12 bg-blue-500 rounded-full mx-auto mt-4" />
        </div>

        {/* Cuadrícula de Servicios (4 Columnas) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {LISTA_SERVICIOS.map((servicio, indice) => (
            <TarjetaServicio
              key={servicio.identificador}
              titulo={traducciones(`${servicio.claveTraduccion}.titulo`)}
              descripcion={traducciones(`${servicio.claveTraduccion}.descripcion`)}
              nombreIcono={servicio.icono}
              indice={indice}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

