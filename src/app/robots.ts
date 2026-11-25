import type { MetadataRoute } from "next";

/**
 * Generador de directivas para rastreadores de motores de búsqueda (Robots.txt) en Next.js.
 */
export default function robots(): MetadataRoute.Robots {
  const urlBase =
    process.env.NEXT_PUBLIC_SITIO_URL || "https://pablobejas.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/_next/", "/api/"],
    },
    sitemap: `${urlBase}/sitemap.xml`,
  };
}
