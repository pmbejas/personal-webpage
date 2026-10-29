import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PaginaDisenoV3 } from "@/components/diseno-v3/PaginaDisenoV3";

export const metadata: Metadata = {
  title: "Pablo Bejas | Software Architecture & Full Stack Engineering (Versión 3 - Fusión)",
  description:
    "Versión 3: Fusión integral entre el dinamismo interactivo de la V1 (Cubo 3D, retrato personal) y la atmósfera cinemática de la V2 (Dark Obsidian, Bento Grid, Preloader).",
};

export default async function PaginaV3({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PaginaDisenoV3 />;
}
