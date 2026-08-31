import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases condicionales de Tailwind CSS resolviendo conflictos de especificidad.
 */
export function combinarClases(...entradas: ClassValue[]): string {
  return twMerge(clsx(entradas));
}

