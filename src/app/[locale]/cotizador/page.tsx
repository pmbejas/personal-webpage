import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { servicioCatalogo } from "@/services/ServicioCatalogo";
import { ExperienciaCotizador } from "@/components/cotizador/ExperienciaCotizador";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadatos.cotizador" });

  return {
    title: t("titulo"),
    description: t("descripcion"),
    alternates: {
      canonical: `/${locale}/cotizador`,
      languages: {
        es: "/es/cotizador",
        en: "/en/cotizador",
        pt: "/pt/cotizador",
      },
    },
    openGraph: {
      title: t("titulo"),
      description: t("descripcion"),
      locale: locale === "en" ? "en_US" : locale === "pt" ? "pt_BR" : "es_ES",
      type: "website",
    },
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Página dedicada del Cotizador Online (/[locale]/cotizador).
 * Consume el catálogo y las promociones vigentes en tiempo real
 * con respaldo estático automático ante cold starts en Render Free.
 */
export default async function PaginaCotizador({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const catalogo = await servicioCatalogo.obtenerCatalogoPublico();

  return <ExperienciaCotizador catalogo={catalogo} />;
}
