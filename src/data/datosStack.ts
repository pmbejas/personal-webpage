import React from "react";
import {
  Terminal,
  Globe,
  Database,
  Layers,
  Box,
  Zap,
  Server,
  Cpu,
} from "lucide-react";

/**
 * Representa cada tecnología destacada en la cinta de stack técnico.
 */
export interface ElementoStack {
  identificador: string;
  nombre: string;
  claveCategoria: string;
  icono: React.ElementType;
}

/**
 * Fuente única de verdad para el stack tecnológico principal de Pablo Bejas.
 */
export const LISTA_TECNOLOGIAS_STACK: ElementoStack[] = [
  {
    identificador: "dotnet",
    nombre: ".NET 9 / C#",
    claveCategoria: "backendRobusto",
    icono: Terminal,
  },
  {
    identificador: "nextjs",
    nombre: "Next.js 15",
    claveCategoria: "appRouterSsr",
    icono: Globe,
  },
  {
    identificador: "postgres",
    nombre: "PostgreSQL",
    claveCategoria: "baseDatos",
    icono: Database,
  },
  {
    identificador: "typescript",
    nombre: "TypeScript",
    claveCategoria: "tipadoEstricto",
    icono: Layers,
  },
  {
    identificador: "docker",
    nombre: "Docker",
    claveCategoria: "contenedores",
    icono: Box,
  },
  {
    identificador: "tailwind",
    nombre: "Tailwind CSS",
    claveCategoria: "disenoModerno",
    icono: Zap,
  },
  {
    identificador: "efcore",
    nombre: "EF Core & Dapper",
    claveCategoria: "accesoDatos",
    icono: Server,
  },
  {
    identificador: "cleanarch",
    nombre: "Clean Architecture",
    claveCategoria: "buenasPracticas",
    icono: Cpu,
  },
];
