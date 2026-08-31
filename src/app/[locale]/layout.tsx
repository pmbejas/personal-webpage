import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ruteo } from "@/i18n/routing";
import { FondoAnimado } from "@/components/animacion/FondoAnimado";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return ruteo.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Pablo Bejas | Full Stack Developer",
  description:
    "Sitio web personal y portafolio de Pablo Bejas, desarrollador Full Stack. Creación de aplicaciones web modernas, rápidas y escalables.",
  keywords: [
    "Pablo Bejas",
    "Full Stack Developer",
    "Desarrollador Web",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
  ],
};

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
            <div className="relative z-10 flex flex-col min-h-screen">
              {children}
            </div>
          </MotionConfig>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

