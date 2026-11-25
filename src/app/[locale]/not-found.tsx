import { getTranslations } from "next-intl/server";
import { ArrowLeft, Compass } from "lucide-react";
import { Link } from "@/i18n/routing";
import { FondoHumoSutil } from "@/components/animacion/FondoHumoSutil";
import { IsotipoLogo } from "@/components/layout/IsotipoLogo";

/**
 * Página 404 localizada dentro del layout de idioma ([locale]).
 */
export default async function PaginaNoEncontrada() {
  const traducciones = await getTranslations("noEncontrada");

  return (
    <main className="relative min-h-screen bg-[#070606] text-neutral-100 flex items-center justify-center px-4 py-12 overflow-hidden">
      <FondoHumoSutil />

      <section className="relative z-10 max-w-md w-full rounded-3xl bg-[#0c0a09]/95 border border-white/15 shadow-[0_24px_64px_rgba(0,0,0,0.85)] p-7 sm:p-9 text-center flex flex-col items-center gap-5">
        <div className="h-12 w-auto">
          <IsotipoLogo className="h-full w-auto" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[rgb(var(--tema-acento-rgb)/0.12)] text-[rgb(var(--tema-acento-claro-rgb))] border border-[rgb(var(--tema-acento-rgb)/0.35)]">
          <Compass className="w-3.5 h-3.5" />
          <span>ERROR 404</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {traducciones("titulo")}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            {traducciones("descripcion")}
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-[rgb(var(--tema-acento-rgb))] text-black shadow-[0_0_22px_rgba(var(--tema-acento-rgb),0.4)] hover:shadow-[0_0_30px_rgba(var(--tema-acento-rgb),0.65)] hover:scale-[1.02] active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{traducciones("volverInicio")}</span>
        </Link>
      </section>
    </main>
  );
}
