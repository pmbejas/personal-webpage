import { setRequestLocale } from "next-intl/server";
import { PaginaDisenoV2 } from "@/components/diseno-v2/PaginaDisenoV2";

/**
 * Página de Inicio Oficial del Sitio Personal de Pablo Bejas.
 * Adopta la Versión 2 (Arquitectura Split-Screen)
 * como la versión definitiva, oficial y permanente del portafolio.
 */
export default async function PaginaInicio({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PaginaDisenoV2 />;
}
