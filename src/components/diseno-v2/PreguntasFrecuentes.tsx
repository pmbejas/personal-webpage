"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ElementoPregunta {
  pregunta: string;
  respuesta: string;
}

const LISTA_PREGUNTAS: ElementoPregunta[] = [
  {
    pregunta: "¿Qué tecnologías utilizas para el desarrollo Full Stack?",
    respuesta:
      "Me especializo en el ecosistema Microsoft .NET (C#, ASP.NET Core Web API, EF Core, Dapper) para arquitecturas backend robustas y de alto rendimiento, complementado con Next.js 15, TypeScript y Tailwind CSS en el frontend para interfaces modernas, ultrarrápidas y optimizadas para SEO.",
  },
  {
    pregunta: "¿Cómo es el flujo de trabajo y la comunicación durante el proyecto?",
    respuesta:
      "Trabajo bajo metodologías ágiles con sprints bien definidos. Mantendremos reuniones periódicas de avance, demos funcionales en entornos de staging y acceso directo a un repositorio de código o tablero para que tengas visibilidad total en cada etapa.",
  },
  {
    pregunta: "¿Cuánto tiempo suele demorar el desarrollo de una aplicación o sistema?",
    respuesta:
      "Depende de la complejidad y alcance. Un sitio web moderno o landing page optimizada suele estar listo en 1 a 2 semanas, mientras que un MVP o sistema de gestión a medida (.NET + Next.js) suele estructurarse en sprints quincenales a lo largo de 4 a 10 semanas con entregas continuas.",
  },
  {
    pregunta: "¿El software entregado cuenta con buenas prácticas y pruebas?",
    respuesta:
      "Absolutamente. Todo el código sigue principios SOLID, Clean Architecture y separación estricta en capas (Repository, Service, Controller). Incluyo pruebas en los puntos críticos y documentación técnica clara para facilitar su escalabilidad.",
  },
  {
    pregunta: "¿Te encargas de la configuración del servidor, dominio y despliegue a producción?",
    respuesta:
      "Sí, entrego soluciones llave en mano. Configuro la infraestructura completa: vinculación de dominios, certificados SSL (HTTPS), bases de datos (PostgreSQL/SQL Server) y pipelines de despliegue automatizado en la nube (Vercel, Azure, VPS o contenedores Docker).",
  },
  {
    pregunta: "¿Trabajas sobre proyectos ya existentes o únicamente desde cero?",
    respuesta:
      "Puedo tanto iniciar un desarrollo desde cero como sumarme a proyectos en marcha. Realizo auditorías de código, optimización de consultas en base de datos, refactorización de código heredado y modernización de arquitecturas monolíticas hacia APIs modernas.",
  },
  {
    pregunta: "¿Qué sucede después de la entrega? ¿Ofreces garantía o soporte?",
    respuesta:
      "Todos los proyectos cuentan con un período de garantía post-lanzamiento (de 15 a 30 días) para resolver cualquier ajuste o inconsistencia sin costo adicional. Además, ofrezco esquemas de mantenimiento mensual y soporte evolutivo para acompañar el crecimiento de tu negocio.",
  },
  {
    pregunta: "¿El código fuente y los accesos quedan en mi poder?",
    respuesta:
      "El 100% de la propiedad intelectual, repositorios de código (GitHub/GitLab), accesos a servidores y credenciales de despliegue te pertenecen exclusivamente a ti o a tu empresa desde el momento en que se completa la entrega.",
  },
  {
    pregunta: "¿Qué modalidades de contratación ofreces?",
    respuesta:
      "Ofrezco colaboración tanto por proyecto cerrado (con alcance, hitos y entregables detallados desde el inicio) como por asignación de horas o sprints para desarrollo evolutivo y consultoría técnica de arquitectura.",
  },
  {
    pregunta: "¿Cómo se coordinan los pagos y la facturación?",
    respuesta:
      "Trabajo con hitos de pago transparentes (habitualmente 50% anticipo y 50% contra entrega aprobada, o por entrega de sprint quincenal). Emito factura fiscal y acepto transferencias bancarias locales e internacionales para clientes del exterior.",
  },
];

/**
 * Acordeón de preguntas frecuentes.
 */
export function PreguntasFrecuentes() {
  const [indiceAbierto, setIndiceAbierto] = useState<number | null>(0);

  const alternarPregunta = (indice: number) => {
    setIndiceAbierto(indiceAbierto === indice ? null : indice);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 relative bg-[#070606] overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Cabecera */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 mb-3">
            Preguntas Frecuentes
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Respuestas directas y claras
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base">
            Todo lo que necesitas saber antes de dar inicio a nuestro próximo desarrollo.
          </p>
        </div>

        {/* Lista de preguntas */}
        <div className="flex flex-col gap-3">
          {LISTA_PREGUNTAS.map((item, index) => {
            const estaAbierto = indiceAbierto === index;
            return (
              <div
                key={item.pregunta}
                className="rounded-2xl bg-[#0c0a09]/90 border border-white/10 hover:border-sky-500/30 transition-colors overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => alternarPregunta(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-semibold text-neutral-200 hover:text-white transition-colors">
                    {item.pregunta}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-sky-400 shrink-0 transition-transform duration-300 ${
                      estaAbierto ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {estaAbierto && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-1 text-sm text-neutral-400 leading-relaxed border-t border-white/5">
                        {item.respuesta}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
