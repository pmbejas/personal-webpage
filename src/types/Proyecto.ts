/** Categorías reales a las que puede pertenecer un proyecto */
export type CategoriaProyecto = "sistemas" | "web" | "outdoor" | "ecommerce";

/** Claves válidas para el filtrado en el catálogo (incluyendo la vista general 'todos') */
export type CategoriaFiltroProyecto = "todos" | CategoriaProyecto;

/** Entidad que describe la información estructural de un proyecto */
export interface ElementoProyecto {
  identificador: string;
  claveTraduccion: string;
  imagenUrl: string;
  tecnologias: string[];
  categoria: CategoriaProyecto;
  destacado: boolean;
  anio: string;
  enlaceDemo?: string;
  enlaceRepositorio?: string;
}

/** Configuración de cada botón de filtro en la barra del catálogo */
export interface CategoriaFiltro {
  clave: CategoriaFiltroProyecto;
  claveTraduccion: string;
}
