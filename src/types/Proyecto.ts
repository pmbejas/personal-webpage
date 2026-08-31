export type CategoriaProyecto = "todos" | "sistemas" | "web" | "outdoor" | "ecommerce";

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

export interface CategoriaFiltro {
  clave: CategoriaProyecto;
  claveTraduccion: string;
}
