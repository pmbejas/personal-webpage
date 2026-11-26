import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { servicioCatalogo } from "@/services/ServicioCatalogo";
import { ExperienciaCotizador } from "@/components/cotizador/ExperienciaCotizador";
import { EsqueletoCotizador } from "@/components/cotizador/EsqueletoCotizador";

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
      canonical: locale === "es" ? "/cotizador" : `/${locale}/cotizador`,
      languages: {
        es: "/cotizador",
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

const TIEMPO_LIMITE_SSR_CATALOGO_MS = 6000;

/**
 * Subcomponente servidor que consulta el catálogo en vivo dentro de un límite Suspense,
 * evitando bloquear el primer render del skeleton al navegar hacia /cotizador.
 */
async function CargadorCotizadorServidor() {
  const catalogoInicial = await servicioCatalogo.obtenerCatalogoEnVivo({
    tiempoLimiteMs: TIEMPO_LIMITE_SSR_CATALOGO_MS,
  });

  return <ExperienciaCotizador catalogoInicial={catalogoInicial} />;
}

/**
 * Página dedicada del Cotizador Online (/[locale]/cotizador).
 * Transmite el skeleton de inmediato vía Suspense y consulta las tarifas oficiales en vivo
 * desde el Backend sin recurrir jamás a valores estáticos desactualizados.
 */
export default async function PaginaCotizador({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<EsqueletoCotizador />}>
      <CargadorCotizadorServidor />
    </Suspense>
  );
}
