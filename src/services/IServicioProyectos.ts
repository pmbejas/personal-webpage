import { ElementoProyecto, CategoriaProyecto, CategoriaFiltroProyecto } from "@/types/Proyecto";

/**
 * Contrato de la capa de servicios para la consulta y filtrado de proyectos.
 * Desacopla la interfaz de usuario del origen de datos (estático, API o base de datos).
 */
export interface IServicioProyectos {
  /**
   * Obtiene la lista completa de proyectos registrados (asíncrono).
   */
  obtenerTodos(): Promise<ElementoProyecto[]>;

  /**
   * Obtiene los proyectos marcados como destacados para la página de inicio (asíncrono).
   */
  obtenerDestacados(): Promise<ElementoProyecto[]>;

  /**
   * Obtiene los proyectos filtrados por su categoría específica (asíncrono).
   */
  obtenerPorCategoria(categoria: CategoriaProyecto): Promise<ElementoProyecto[]>;

  /**
   * Calcula el número total de proyectos agrupados por categoría y el total global (asíncrono).
   */
  obtenerConteoPorCategoria(): Promise<Record<CategoriaFiltroProyecto, number>>;

  /**
   * Obtiene la lista completa de proyectos de forma síncrona para renderizado inicial sin parpadeo.
   */
  obtenerTodosSincrono(): ElementoProyecto[];

  /**
   * Obtiene los proyectos destacados de forma síncrona.
   */
  obtenerDestacadosSincrono(): ElementoProyecto[];

  /**
   * Obtiene el conteo de proyectos por categoría de forma síncrona.
   */
  obtenerConteoPorCategoriaSincrono(): Record<CategoriaFiltroProyecto, number>;
}
