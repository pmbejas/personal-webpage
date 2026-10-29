import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PaginaDisenoV2Mojunsh } from "@/components/diseno-v2-mojunsh/PaginaDisenoV2Mojunsh";

export const metadata: Metadata = {
  title: "Pablo Bejas | Software Architecture & Web Engineering (Nueva V2)",
  description:
    "Nueva Versión 2 inspirada en la arquitectura de mojunsh.com: tarjeta lateral fija con foto difusa, menú dock flotante con iconos y lienzo central interactivo con Cubo 3D.",
};

/**
 * Ruta experimental de prueba para la nueva Versión 2.
 */
export default async function PaginaV2({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PaginaDisenoV2Mojunsh />;
}
