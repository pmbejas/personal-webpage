"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { FolderGit2 } from "lucide-react";
import { CategoriaFiltroProyecto } from "@/types/Proyecto";
import { servicioProyectos } from "@/services/ServicioProyectos";
import { BarraFiltrosProyectos } from "./BarraFiltrosProyectos";
import { TarjetaProyecto } from "./TarjetaProyecto";

/**
 * Catálogo completo de proyectos: barra de filtros por categoría y cuadrícula
 * limpia y moderna de tarjetas (Estilo V2) reactivas al tema activo.
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

      {/* Cuadrícula limpia de proyectos filtrados */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {proyectosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {proyectosFiltrados.map((proyecto, indice) => (
              <TarjetaProyecto
                key={proyecto.identificador}
                proyecto={proyecto}
                indice={indice}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <FolderGit2 className="mx-auto h-12 w-12 text-slate-600 mb-3" />
            <p className="text-slate-400 text-sm">
              {traducciones("sinResultados")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
