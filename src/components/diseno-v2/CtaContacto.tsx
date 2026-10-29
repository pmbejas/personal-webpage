"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Mail,
  Linkedin,
  Phone,
  Copy,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { CONFIGURACION_CONTACTO } from "@/data/datosContacto";

/**
 * Sección final de Contacto y Llamada a la Acción.
 * Integra el horizonte curvado en azul eléctrico con las vías directas de contacto.
 */
export function CtaContacto() {
  const traduccionesBanner = useTranslations("bannerContacto");
  const traduccionesContacto = useTranslations("contacto");
  const [copiado, setCopiado] = useState<boolean>(false);

  const copiarCorreo = async () => {
    try {
      await navigator.clipboard.writeText(CONFIGURACION_CONTACTO.correo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Manejo en caso de restricción de portapapeles
    }
  };

  return (
    <section id="contacto" className="relative py-24 sm:py-32 bg-[#070606] overflow-hidden">
      {/* Resplandor de horizonte curvado inferior en azul eléctrico */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] rounded-[100%] bg-gradient-to-b from-blue-600/15 via-sky-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 mb-4"
        >
          {traduccionesBanner("titulo")}
        </motion.span>

        {/* Título de alto impacto */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto"
        >
          Transformemos tu visión en un producto digital de
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-white mt-1">
            clase mundial
          </span>
        </motion.h2>

        {/* Descripción */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-5 text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed"
        >
          {traduccionesBanner("descripcion")}
        </motion.p>

        {/* Canales de Contacto Directo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 text-left"
        >
          {/* WhatsApp Directo */}
          <a
            href={CONFIGURACION_CONTACTO.urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-5 rounded-2xl bg-[#0c0a09]/90 border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-950/10 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div>
              <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider block">
                {traduccionesContacto("whatsapp")}
              </span>
              <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Chatear ahora
              </span>
            </div>
          </a>

          {/* Email con Copiado Rápido */}
          <div className="group p-5 rounded-2xl bg-[#0c0a09]/90 border border-white/10 hover:border-sky-500/40 hover:bg-sky-950/10 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <button
                type="button"
                onClick={copiarCorreo}
                className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors"
                title="Copiar email"
              >
                {copiado ? (
                  <Check className="w-4 h-4 text-sky-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div>
              <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider block">
                {traduccionesContacto("correo")}
              </span>
              <a
                href={`mailto:${CONFIGURACION_CONTACTO.correo}`}
                className="text-xs sm:text-sm font-bold text-white group-hover:text-sky-300 transition-colors truncate block"
              >
                {CONFIGURACION_CONTACTO.correo}
              </a>
            </div>
          </div>

          {/* LinkedIn Profesional */}
          <a
            href={CONFIGURACION_CONTACTO.urlLinkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-5 rounded-2xl bg-[#0c0a09]/90 border border-white/10 hover:border-blue-500/40 hover:bg-blue-950/10 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Linkedin className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-blue-400 transition-colors" />
            </div>
            <div>
              <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider block">
                {traduccionesContacto("linkedin")}
              </span>
              <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                Conectar perfil
              </span>
            </div>
          </a>

          {/* Llamada Telefónica Directa */}
          <a
            href={`tel:${CONFIGURACION_CONTACTO.telefonoFormatoLlamada}`}
            className="group p-5 rounded-2xl bg-[#0c0a09]/90 border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-950/10 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div>
              <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider block">
                {traduccionesContacto("llamar")}
              </span>
              <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                {CONFIGURACION_CONTACTO.telefono}
              </span>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
