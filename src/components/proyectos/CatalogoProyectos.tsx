"use client";

import { Fragment, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { FolderGit2 } from "lucide-react";
import { CategoriaProyecto } from "@/types/Proyecto";
import { LISTA_PROYECTOS } from "@/data/datosProyectos";
import { BarraFiltrosProyectos } from "./BarraFiltrosProyectos";
import { FilaProyectoDestacado } from "@/components/secciones/FilaProyectoDestacado";
import { DivisorProyecto } from "@/components/ui/DivisorProyecto";

/**
 * Catálogo completo de proyectos: barra de filtros por categoría y una fila
 * showcase por proyecto (mismo diseño que la Home), ocupando cada una el
 * alto completo de la pantalla.
 */
export function CatalogoProyectos() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<CategoriaProyecto>("todos");
  const traducciones = useTranslations("proyectos");

  // Cálculo del número de proyectos por categoría
  const conteoPorCategoria = useMemo(() => {
    const conteos: Record<CategoriaProyecto, number> = {
      todos: LISTA_PROYECTOS.length,
      sistemas: 0,
      web: 0,
      outdoor: 0,
      ecommerce: 0,
    };

    LISTA_PROYECTOS.forEach((proyecto) => {
      if (conteos[proyecto.categoria] !== undefined) {
        conteos[proyecto.categoria]++;
      }
    });

    return conteos;
  }, []);

  // Filtrado de proyectos según la categoría activa
  const proyectosFiltrados = useMemo(() => {
    if (categoriaSeleccionada === "todos") {
      return LISTA_PROYECTOS;
    }
    return LISTA_PROYECTOS.filter(
      (proyecto) => proyecto.categoria === categoriaSeleccionada
    );
  }, [categoriaSeleccionada]);

  return (
    <section className="pb-24">
      {/* Barra de Filtros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <BarraFiltrosProyectos
          categoriaActiva={categoriaSeleccionada}
          alSeleccionarCategoria={setCategoriaSeleccionada}
          conteoPorCategoria={conteoPorCategoria}
        />
      </div>

      {/* Filas showcase separadas por la línea de escaneo, alineadas al
          mismo ancho de contenido. Un divisor después de la barra de filtros
          y uno al cierre de cada fila */}
      {proyectosFiltrados.length > 0 ? (
        <Fragment>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DivisorProyecto />
          </div>
          {proyectosFiltrados.map((proyecto, indice) => (
            <Fragment key={proyecto.identificador}>
              <section className="flex items-center py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <FilaProyectoDestacado proyecto={proyecto} indice={indice} />
                </div>
              </section>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <DivisorProyecto />
              </div>
            </Fragment>
          ))}
        </Fragment>
      ) : (
        <div className="py-16 text-center">
          <FolderGit2 className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <p className="text-slate-400 text-sm">
            {traducciones("sinResultados")}
          </p>
        </div>
      )}
    </section>
  );
}
