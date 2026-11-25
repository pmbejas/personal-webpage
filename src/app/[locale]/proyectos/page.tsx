import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { MenuFlotanteDerecho } from "@/components/diseno-v2/MenuFlotanteDerecho";
import { EncabezadoPaginaProyectos } from "@/components/proyectos/EncabezadoPaginaProyectos";
import { CatalogoProyectos } from "@/components/proyectos/CatalogoProyectos";
import { CtaContacto } from "@/components/diseno-v2/CtaContacto";
import { FondoHumoSutil } from "@/components/animacion/FondoHumoSutil";
import { VERSION_SITIO } from "@/data/datosVersion";

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

/**
 * [MEJORA-VISUAL-02] Página de catálogo completo de proyectos unificada al sistema visual V2
 * (fondo #070606, data-v2, MenuFlotanteDerecho y CtaContacto).
 */
export default async function PaginaProyectos({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const traduccionesPie = await getTranslations({ locale, namespace: "piePagina" });

  return (
    <div
      data-v2="true"
      className="relative flex flex-col min-h-screen bg-[#070606] text-neutral-100 selection:bg-[rgb(var(--tema-acento-rgb))] selection:text-black"
    >
      <FondoHumoSutil />
      <MenuFlotanteDerecho />

      {/* Contenido principal con margen derecho libre para el dock en escritorio */}
      <main className="relative z-10 flex-grow lg:pr-16">
        <EncabezadoPaginaProyectos />
        <CatalogoProyectos />
        <CtaContacto />
      </main>

      <footer className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 pt-8 pb-12 border-t border-white/5 text-center text-xs text-neutral-500 font-mono flex items-center justify-center gap-2">
        <span>{traduccionesPie("derechos")}</span>
        <span>·</span>
        <span className="text-neutral-400 font-semibold">v{VERSION_SITIO}</span>
      </footer>
    </div>
  );
}
