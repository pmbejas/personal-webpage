import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { BarraNavegacion } from "@/components/layout/BarraNavegacion";
import { EncabezadoPaginaProyectos } from "@/components/proyectos/EncabezadoPaginaProyectos";
import { CatalogoProyectos } from "@/components/proyectos/CatalogoProyectos";
import { BannerContacto } from "@/components/secciones/BannerContacto";
import { PiePagina } from "@/components/layout/PiePagina";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadatos.proyectos" });

  return {
    title: t("titulo"),
    description: t("descripcion"),
    alternates: {
      canonical: `/${locale}/proyectos`,
      languages: {
        es: "/es/proyectos",
        en: "/en/proyectos",
        pt: "/pt/proyectos",
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

export default async function PaginaProyectos({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Barra de navegación */}
      <BarraNavegacion />

      {/* Contenido principal */}
      <main className="flex-grow">
        <EncabezadoPaginaProyectos />
        <CatalogoProyectos />
        <BannerContacto />
      </main>

      {/* Pie de página */}
      <PiePagina />
    </div>
  );
}

