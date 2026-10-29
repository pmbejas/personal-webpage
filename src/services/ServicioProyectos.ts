import { ElementoProyecto, CategoriaProyecto, CategoriaFiltroProyecto } from "@/types/Proyecto";
import { IServicioProyectos } from "./IServicioProyectos";
import { LISTA_PROYECTOS } from "@/data/datosProyectos";

/**
 * Implementación de la capa de servicio para la gestión y consulta de proyectos.
 * Sigue el patrón Service Layer y el principio de Responsabilidad Única (SRP).
 */
export class ServicioProyectos implements IServicioProyectos {
  async obtenerTodos(): Promise<ElementoProyecto[]> {
    return this.obtenerTodosSincrono();
  }

  async obtenerDestacados(): Promise<ElementoProyecto[]> {
    return this.obtenerDestacadosSincrono();
  }

  async obtenerPorCategoria(categoria: CategoriaProyecto): Promise<ElementoProyecto[]> {
    return LISTA_PROYECTOS.filter((proyecto) => proyecto.categoria === categoria);
  }

  async obtenerConteoPorCategoria(): Promise<Record<CategoriaFiltroProyecto, number>> {
    return this.obtenerConteoPorCategoriaSincrono();
  }

  obtenerTodosSincrono(): ElementoProyecto[] {
    return [...LISTA_PROYECTOS];
  }

  obtenerDestacadosSincrono(): ElementoProyecto[] {
    return LISTA_PROYECTOS.filter((proyecto) => proyecto.destacado);
  }

  obtenerConteoPorCategoriaSincrono(): Record<CategoriaFiltroProyecto, number> {
    const conteos: Record<CategoriaFiltroProyecto, number> = {
      todos: LISTA_PROYECTOS.length,
      sistemas: 0,
      web: 0,
      outdoor: 0,
    };

    LISTA_PROYECTOS.forEach((proyecto) => {
      if (conteos[proyecto.categoria] !== undefined) {
        conteos[proyecto.categoria]++;
      }
    });

    return conteos;
  }
}

/** Instancia única compartida del servicio de proyectos */
export const servicioProyectos = new ServicioProyectos();
