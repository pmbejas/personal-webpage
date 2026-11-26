import type { MetadataRoute } from "next";
import { ruteo } from "@/i18n/routing";

function construirUrlLocalizada(
  urlBase: string,
  locale: string,
  rutaRelativa = ""
): string {
  const prefijo = locale === ruteo.defaultLocale ? "" : `/${locale}`;
  return `${urlBase}${prefijo}${rutaRelativa}` || urlBase;
}

/**
 * Generador dinámico de mapa del sitio (Sitemap) compatible con localePrefix "as-needed".
 * Sirve español directamente en la raíz (/) sin redirección y mantiene /en y /pt.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const urlBase = (
    process.env.NEXT_PUBLIC_SITIO_URL || "https://pablobejas.vercel.app"
  ).replace(/\/$/, "");
  const fechaModificacion = new Date();

  const entradasInicio: MetadataRoute.Sitemap = ruteo.locales.map((locale) => ({
    url: construirUrlLocalizada(urlBase, locale, ""),
    lastModified: fechaModificacion,
    changeFrequency: "weekly" as const,
    priority: 1.0,
    alternates: {
      languages: {
        es: construirUrlLocalizada(urlBase, "es", ""),
        en: construirUrlLocalizada(urlBase, "en", ""),
        pt: construirUrlLocalizada(urlBase, "pt", ""),
      },
    },
  }));

  const entradasCotizador: MetadataRoute.Sitemap = ruteo.locales.map((locale) => ({
    url: construirUrlLocalizada(urlBase, locale, "/cotizador"),
    lastModified: fechaModificacion,
    changeFrequency: "weekly" as const,
    priority: 0.9,
    alternates: {
      languages: {
        es: construirUrlLocalizada(urlBase, "es", "/cotizador"),
        en: construirUrlLocalizada(urlBase, "en", "/cotizador"),
        pt: construirUrlLocalizada(urlBase, "pt", "/cotizador"),
      },
    },
  }));

  const entradasProyectos: MetadataRoute.Sitemap = ruteo.locales.map((locale) => ({
    url: construirUrlLocalizada(urlBase, locale, "/proyectos"),
    lastModified: fechaModificacion,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    alternates: {
      languages: {
        es: construirUrlLocalizada(urlBase, "es", "/proyectos"),
        en: construirUrlLocalizada(urlBase, "en", "/proyectos"),
        pt: construirUrlLocalizada(urlBase, "pt", "/proyectos"),
      },
    },
  }));

  return [...entradasInicio, ...entradasCotizador, ...entradasProyectos];
}
