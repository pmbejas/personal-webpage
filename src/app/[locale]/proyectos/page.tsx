import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { BarraNavegacion } from "@/components/layout/BarraNavegacion";
import { EncabezadoPaginaProyectos } from "@/components/proyectos/EncabezadoPaginaProyectos";
import { CatalogoProyectos } from "@/components/proyectos/CatalogoProyectos";
import { BannerContacto } from "@/components/secciones/BannerContacto";
import { PiePagina } from "@/components/layout/PiePagina";

export const metadata: Metadata = {
  title: "Proyectos | Pablo Bejas - Full Stack Developer",
  description:
    "Catálogo completo de proyectos desarrollados por Pablo Bejas: sistemas institucionales, aplicaciones web, plataformas e-commerce y mapas interactivos.",
};

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

