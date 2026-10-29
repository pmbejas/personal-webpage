import { setRequestLocale } from "next-intl/server";
import { PaginaDisenoV3 } from "@/components/diseno-v3/PaginaDisenoV3";

/**
 * Página de Inicio Oficial del Sitio Personal de Pablo Bejas.
 * Adopta la Versión 3 (La Fusión) como la versión definitiva y permanente.
 */
export default async function PaginaInicio({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PaginaDisenoV3 />;
}
