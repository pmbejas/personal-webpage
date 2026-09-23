import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ruteo } from "@/i18n/routing";
import { FondoAnimado } from "@/components/animacion/FondoAnimado";
import { BordePantalla } from "@/components/animacion/BordePantalla";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return ruteo.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadatos.inicio" });

  return {
    title: t("titulo"),
    description: t("descripcion"),
    keywords: [
      "Pablo Bejas",
      "Full Stack Developer",
      "Desarrollador Web",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "PostgreSQL",
    ],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        es: "/es",
        en: "/en",
        pt: "/pt",
      },
    },
    openGraph: {
      title: t("titulo"),
      description: t("descripcion"),
      locale: locale === "en" ? "en_US" : locale === "pt" ? "pt_BR" : "es_ES",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("titulo"),
      description: t("descripcion"),
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      apple: "/favicon.svg",
    },
  };
}

export default async function LayoutLocalizado({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!ruteo.locales.includes(locale as "es" | "en" | "pt")) {
    notFound();
  }

  setRequestLocale(locale);
  const mensajes = await getMessages();

  return (
    <html lang={locale} className={`dark ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Aplica el tema guardado antes del primer render para evitar un
            parpadeo del color por defecto. Sin tema guardado no hace nada:
            rigen las variables azules de :root en globals.css */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var temaGuardado=localStorage.getItem("tema");if(temaGuardado==="azul"||temaGuardado==="verde"||temaGuardado==="naranja"){document.documentElement.setAttribute("data-tema",temaGuardado)}}catch(error){}`,
          }}
        />
      </head>
      <body className="bg-[#070B14] text-slate-100 min-h-screen flex flex-col font-sans">
        <NextIntlClientProvider locale={locale} messages={mensajes}>
          {/* Desactiva las animaciones cuando el usuario activa "reducir movimiento" en su sistema */}
          <MotionConfig reducedMotion="user">
            {/* Capa de fondo animado fija detrás de todo el contenido de la página */}
            <FondoAnimado />
            {/* Marco perimetral sutil en los 4 bordes de la pantalla con respiración de 6s */}
            <BordePantalla />
            <div className="relative z-10 flex flex-col min-h-screen overflow-x-hidden w-full max-w-full">
              {children}
            </div>
          </MotionConfig>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

