import type { MetadataRoute } from "next";
import { ruteo } from "@/i18n/routing";

/**
 * Generador dinámico de mapa del sitio (Sitemap) compatible con el App Router de Next.js.
 * Provee indexación canónica para todos los idiomas soportados (es, en, pt).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const urlBase = process.env.NEXT_PUBLIC_SITIO_URL || "https://pablodev.com";
  const fechaModificacion = new Date();

  const entradasInicio: MetadataRoute.Sitemap = ruteo.locales.map((locale) => ({
    url: `${urlBase}/${locale}`,
    lastModified: fechaModificacion,
    changeFrequency: "weekly" as const,
    priority: 1.0,
    alternates: {
      languages: {
        es: `${urlBase}/es`,
        en: `${urlBase}/en`,
        pt: `${urlBase}/pt`,
      },
    },
  }));

  const entradasProyectos: MetadataRoute.Sitemap = ruteo.locales.map((locale) => ({
    url: `${urlBase}/${locale}/proyectos`,
    lastModified: fechaModificacion,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    alternates: {
      languages: {
        es: `${urlBase}/es/proyectos`,
        en: `${urlBase}/en/proyectos`,
        pt: `${urlBase}/pt/proyectos`,
      },
    },
  }));

  return [...entradasInicio, ...entradasProyectos];
}
