"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Download, MessageCircle, Github, Linkedin, Instagram, ArrowUpRight } from "lucide-react";
import { CONFIGURACION_CONTACTO } from "@/data/datosContacto";
import { WordmarkLogo } from "@/components/layout/WordmarkLogo";
import { IsotipoLogo } from "@/components/layout/IsotipoLogo";

/**
 * Tarjeta Lateral Fija con fotografía difusa y accesos directos.
 * Se mantiene sticky a la izquierda en pantallas de escritorio y actúa como
 * tarjeta de presentación principal fluida en dispositivos móviles.
 */
export function TarjetaLateralFija() {
  const traduccionesSobreMi = useTranslations("sobreMi");
  const traduccionesTarjeta = useTranslations("tarjetaLateral");

  return (
    <aside className="relative w-full h-[calc(100dvh-1.5rem)] min-h-[540px] sm:h-[calc(100dvh-3rem)] lg:min-h-0 lg:w-[380px] xl:w-[420px] lg:sticky lg:top-6 lg:self-start lg:h-[calc(100vh-3rem)] rounded-[32px] overflow-hidden bg-[#0c0a09]/95 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col justify-between p-6 sm:p-7 flex-shrink-0 group">
      {/* 1. Fotografía de fondo difusa con gradiente cinematográfico */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Image
          src="/imagenes/pablo.png"
          alt="Pablo Bejas"
          fill
          priority
          className="object-cover object-top opacity-65 filter grayscale contrast-115 blur-[0.5px] scale-105 group-hover:scale-110 group-hover:opacity-80 transition-all duration-700"
          sizes="(max-width: 1024px) 100vw, 420px"
        />
        {/* Máscara de gradiente oscuro con resplandor cyan en la cabecera */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/80 to-transparent" />
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-600/15 blur-3xl" />
      </div>

      {/* 2. Insignia lateral vertical (oculta en pantallas muy pequeñas, visible en desktop) */}
      <div className="hidden lg:flex absolute left-3 top-1/2 -translate-y-1/2 -rotate-90 origin-left items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[rgb(var(--tema-acento-claro-rgb))] bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-[rgb(var(--tema-acento-rgb)/0.3)] z-10 shadow-lg">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[rgb(var(--tema-acento-claro-rgb))] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[rgb(var(--tema-acento-rgb))]" />
        </span>
        <span>{traduccionesTarjeta("disponible")}</span>
      </div>

      {/* 4. Cuerpo inferior: Datos esenciales, rol y llamadas a la acción */}
      <div className="relative z-10 flex flex-col mt-auto pt-6 lg:pt-8">
        {/* Insignia disponible para pantallas móviles */}
        <div className="lg:hidden inline-flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[rgb(var(--tema-acento-claro-rgb))] bg-[rgb(var(--tema-acento-rgb)/0.1)] px-3 py-1 rounded-full border border-[rgb(var(--tema-acento-rgb)/0.3)] w-fit mb-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[rgb(var(--tema-acento-claro-rgb))] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[rgb(var(--tema-acento-rgb))]" />
          </span>
          <span>{traduccionesTarjeta("disponible")}</span>
        </div>

        {/* Isotipo y Wordmark alineados sobre el borde inferior */}
        <div className="flex items-end gap-2 sm:gap-2.5 mb-3">
          <div className="relative h-20 sm:h-[84px] w-auto flex-shrink-0 flex items-end">
            <IsotipoLogo className="h-full w-auto" />
          </div>
          <div className="relative flex items-end pb-0.5 sm:pb-1">
            <WordmarkLogo className="h-10 sm:h-11 w-auto drop-shadow-[0_4px_14px_rgba(0,0,0,0.7)]" />
          </div>
        </div>

        <p className="text-xs font-mono tracking-wider uppercase text-[rgb(var(--tema-acento-claro-rgb))] font-semibold mt-1">
          {traduccionesTarjeta("rol")}
        </p>

        {/* Breve bio de presentación */}
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mt-3 max-w-sm">
          {traduccionesTarjeta("bio")}
        </p>

        {/* Botones de acción principales: WhatsApp + Descargar CV + Redes sociales */}
        <div className="flex items-center gap-2 sm:gap-2.5 mt-5">
          {/* Botón WhatsApp: Háblame */}
          <a
            href={CONFIGURACION_CONTACTO.urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-[rgb(var(--tema-acento-rgb))] text-black shadow-[0_0_16px_rgba(var(--tema-acento-rgb),0.35)] hover:shadow-[0_0_22px_rgba(var(--tema-acento-rgb),0.6)] hover:scale-105 active:scale-95 transition-all flex-shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{traduccionesTarjeta("hablame")}</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>

          {/* Botón Descargar CV */}
          <a
            href="/cv-pablo-bejas.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white border border-white/10 hover:border-[rgb(var(--tema-acento-rgb)/0.4)] hover:scale-105 active:scale-95 transition-all flex-shrink-0"
            title={traduccionesSobreMi("descargarCv")}
          >
            <Download className="w-3.5 h-3.5 text-[rgb(var(--tema-acento-claro-rgb))]" />
            <span>{traduccionesTarjeta("cv")}</span>
          </a>

          {/* Divisor vertical sutil */}
          <div className="w-[1px] h-5 bg-white/10 mx-0.5 flex-shrink-0" />

          {/* Canales sociales en cápsulas redondas de cristal */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <a
              href={CONFIGURACION_CONTACTO.urlGitHub}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[rgb(var(--tema-acento-rgb)/0.5)] hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
              title={traduccionesTarjeta("perfilGithub")}
            >
              <Github className="w-3.5 h-3.5" />
            </a>
            <a
              href={CONFIGURACION_CONTACTO.urlLinkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[rgb(var(--tema-acento-claro-rgb))] hover:border-[rgb(var(--tema-acento-rgb)/0.5)] hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
              title={traduccionesTarjeta("perfilLinkedin")}
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a
              href={CONFIGURACION_CONTACTO.urlInstagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[rgb(var(--tema-acento-rgb)/0.5)] hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
              title={traduccionesTarjeta("perfilInstagram")}
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
