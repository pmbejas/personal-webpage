"use client";

import { Fragment, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { FolderGit2 } from "lucide-react";
import { CategoriaFiltroProyecto } from "@/types/Proyecto";
import { servicioProyectos } from "@/services/ServicioProyectos";
import { BarraFiltrosProyectos } from "./BarraFiltrosProyectos";
import { FilaProyectoDestacado } from "@/components/secciones/FilaProyectoDestacado";
import { DivisorProyecto } from "@/components/ui/DivisorProyecto";

/**
 * Catálogo completo de proyectos: barra de filtros por categoría y una fila
 * showcase por proyecto, consumiendo los datos a través de servicioProyectos.
 */
export function CatalogoProyectos() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<CategoriaFiltroProyecto>("todos");
  const traducciones = useTranslations("proyectos");

  const conteoPorCategoria = useMemo(() => {
    return servicioProyectos.obtenerConteoPorCategoriaSincrono();
  }, []);

  const todosLosProyectos = useMemo(() => {
    return servicioProyectos.obtenerTodosSincrono();
  }, []);

  const proyectosFiltrados = useMemo(() => {
    if (categoriaSeleccionada === "todos") {
      return todosLosProyectos;
    }
    return todosLosProyectos.filter(
      (proyecto) => proyecto.categoria === categoriaSeleccionada
    );
  }, [categoriaSeleccionada, todosLosProyectos]);

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

      {/* Filas showcase separadas por la línea de escaneo */}
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
