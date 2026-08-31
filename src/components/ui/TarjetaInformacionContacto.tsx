"use client";

import { MapPin, Mail, Phone, Globe } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Tarjeta horizontal de datos de contacto rápidos, ubicada en el banner
 * de contacto final (ubicación, correo, teléfono e idiomas).
 */
export function TarjetaInformacionContacto() {
  const traducciones = useTranslations("contacto");

  const itemsContacto = [
    {
      etiqueta: traducciones("ubicacion"),
      valor: traducciones("valorUbicacion"),
      icono: <MapPin className="h-4 w-4 text-blue-400" />,
    },
    {
      etiqueta: traducciones("correo"),
      valor: traducciones("valorCorreo"),
      icono: <Mail className="h-4 w-4 text-blue-400" />,
      enlace: `mailto:${traducciones("valorCorreo")}`,
    },
    {
      etiqueta: traducciones("telefono"),
      valor: traducciones("valorTelefono"),
      icono: <Phone className="h-4 w-4 text-blue-400" />,
      enlace: `tel:${traducciones("valorTelefono")}`,
    },
    {
      etiqueta: traducciones("idiomas"),
      valor: traducciones("valorIdiomas"),
      icono: <Globe className="h-4 w-4 text-blue-400" />,
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-sm p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
        {itemsContacto.map((item) => (
          <div key={item.etiqueta} className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-950/70 border border-blue-800/40 text-blue-400">
              {item.icono}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                {item.etiqueta}
              </span>
              {item.enlace ? (
                <a
                  href={item.enlace}
                  className="text-sm font-semibold text-white hover:text-blue-400 transition-colors mt-0.5"
                >
                  {item.valor}
                </a>
              ) : (
                <span className="text-sm font-semibold text-white mt-0.5">
                  {item.valor}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
