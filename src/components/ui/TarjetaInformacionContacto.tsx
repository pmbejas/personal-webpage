"use client";

import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Instagram,
  PhoneCall,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CONFIGURACION_CONTACTO } from "@/data/datosContacto";

/**
 * Tarjeta horizontal de datos de contacto rápidos (ubicación, correo, teléfono
 * con botones de llamada y WhatsApp, LinkedIn, Instagram e idiomas).
 * Consume los datos fijos desde CONFIGURACION_CONTACTO como fuente única de verdad.
 */
export function TarjetaInformacionContacto() {
  const traducciones = useTranslations("contacto");

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6 sm:p-8 text-left shadow-2xl shadow-black/40">
      {/* Cabecera con el logotipo completo dark */}
      <div className="flex flex-col sm:flex-row items-center justify-center pb-6 mb-8 border-b border-white/10 gap-4">
        <Image
          src="/logo-completo-dark.svg"
          alt="Pablo Bejas - Full Stack Developer"
          width={310}
          height={88}
          className="h-16 sm:h-20 md:h-24 w-auto select-none drop-shadow-md transition-transform duration-300 hover:scale-[1.02]"
          priority
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-14 gap-y-8">
        {/* 1. Ubicación */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              {traducciones("ubicacion")}
            </span>
            <span className="text-sm font-semibold text-white mt-1">
              {traducciones("valorUbicacion")}
            </span>
          </div>
        </div>

        {/* 2. Correo Electrónico */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Mail className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              {traducciones("correo")}
            </span>
            <a
              href={`mailto:${CONFIGURACION_CONTACTO.correo}`}
              className="text-sm font-semibold text-white hover:text-blue-400 transition-colors mt-1 break-all sm:break-normal"
            >
              {CONFIGURACION_CONTACTO.correo}
            </a>
          </div>
        </div>

        {/* 3. Teléfono con acciones rápidas: Llamar y WhatsApp */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Phone className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0 flex-grow">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              {traducciones("telefono")}
            </span>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <a
                href={`tel:${CONFIGURACION_CONTACTO.telefonoFormatoLlamada}`}
                className="text-sm font-semibold text-white hover:text-blue-400 transition-colors"
              >
                {CONFIGURACION_CONTACTO.telefono}
              </a>
              <div className="flex items-center gap-2 ml-auto sm:ml-2">
                <a
                  href={`tel:${CONFIGURACION_CONTACTO.telefonoFormatoLlamada}`}
                  aria-label={traducciones("llamar")}
                  title={traducciones("llamar")}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <PhoneCall className="h-4 w-4" />
                </a>
                <a
                  href={CONFIGURACION_CONTACTO.urlWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={traducciones("whatsapp")}
                  title={traducciones("whatsapp")}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4. LinkedIn */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Linkedin className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              {traducciones("linkedin")}
            </span>
            <a
              href={CONFIGURACION_CONTACTO.urlLinkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-white hover:text-blue-400 transition-colors mt-1"
            >
              {CONFIGURACION_CONTACTO.usuarioLinkedIn}
            </a>
          </div>
        </div>

        {/* 5. Instagram */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
            <Instagram className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              {traducciones("instagram")}
            </span>
            <a
              href={CONFIGURACION_CONTACTO.urlInstagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-white hover:text-pink-400 transition-colors mt-1"
            >
              {CONFIGURACION_CONTACTO.usuarioInstagram}
            </a>
          </div>
        </div>

        {/* 6. Idiomas */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Globe className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              {traducciones("idiomas")}
            </span>
            <span className="text-sm font-semibold text-white mt-1">
              {traducciones("valorIdiomas")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
