import { setRequestLocale } from "next-intl/server";
import { BarraNavegacion } from "@/components/layout/BarraNavegacion";
import { SeccionHero } from "@/components/secciones/SeccionHero";
import { SeccionSobreMi } from "@/components/secciones/SeccionSobreMi";
import { SeccionServicios } from "@/components/secciones/SeccionServicios";
import { SeccionProyectos } from "@/components/secciones/SeccionProyectos";
import { BannerContacto } from "@/components/secciones/BannerContacto";
import { PiePagina } from "@/components/layout/PiePagina";

export default async function PaginaInicio({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Barra de navegación fija */}
      <BarraNavegacion />

      {/* Contenido principal */}
      <main className="flex-grow">
        <SeccionHero />
        <SeccionSobreMi />
        <SeccionServicios />
        <SeccionProyectos />
        <BannerContacto />
      </main>

      {/* Pie de página */}
      <PiePagina />
    </div>
  );
}

