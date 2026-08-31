export interface ElementoNavegacion {
  claveTraduccion: "inicio" | "sobreMi" | "servicios" | "proyectos" | "blog" | "contacto";
  href: string;
}

export const ENLACES_NAVEGACION: ElementoNavegacion[] = [
  { claveTraduccion: "inicio", href: "/#inicio" },
  { claveTraduccion: "sobreMi", href: "/#sobre-mi" },
  { claveTraduccion: "servicios", href: "/#servicios" },
  { claveTraduccion: "proyectos", href: "/proyectos" },
  { claveTraduccion: "contacto", href: "/#contacto" },
];
