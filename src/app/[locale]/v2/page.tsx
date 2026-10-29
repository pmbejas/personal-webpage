import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PaginaDisenoV2 } from "@/components/diseno-v2/PaginaDisenoV2";

export const metadata: Metadata = {
  title: "Pablo Bejas | Software Architecture & Web Engineering (V2)",
  description:
    "Prueba de diseño experimental Dark Obsidian & Glowing Amber para Pablo Bejas, desarrollador Full Stack especializado en .NET 9, Next.js 15 y PostgreSQL.",
};

export default async function PaginaV2({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PaginaDisenoV2 />;
}
