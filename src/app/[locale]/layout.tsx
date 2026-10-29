import type { Metadata } from "next";
import { Inter, Oswald, Montserrat, Plus_Jakarta_Sans } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ruteo } from "@/i18n/routing";
import { FondoAnimado } from "@/components/animacion/FondoAnimado";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["700"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["800"],
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
  const urlBaseSitio = process.env.NEXT_PUBLIC_SITIO_URL || "https://pablodev.com";

  return {
    metadataBase: new URL(urlBaseSitio),
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
    <html
      lang={locale}
      className={`dark ${inter.variable} ${oswald.variable} ${montserrat.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Aplica el tema seleccionado dinámicamente o azul por defecto */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var temaGuardado=localStorage.getItem("tema");if(temaGuardado==="azul"||temaGuardado==="verde"||temaGuardado==="ambar"){document.documentElement.setAttribute("data-tema",temaGuardado)}else{document.documentElement.setAttribute("data-tema","azul")}}catch(error){}`,
          }}
        />
      </head>
      <body className="bg-[#1c171b] text-slate-100 min-h-screen flex flex-col font-sans">
        <NextIntlClientProvider locale={locale} messages={mensajes}>
          {/* Desactiva las animaciones cuando el usuario activa "reducir movimiento" en su sistema */}
          <MotionConfig reducedMotion="user">
            {/* Capa de fondo animado fija detrás de todo el contenido de la página */}
            <FondoAnimado />
            <div className="relative z-10 flex flex-col min-h-screen overflow-x-clip w-full max-w-full">
              {children}
            </div>
          </MotionConfig>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

