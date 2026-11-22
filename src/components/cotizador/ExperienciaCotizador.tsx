"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter } from "@/i18n/routing";
import {
  AdicionalResponse,
  CatalogoPublicoResponse,
} from "@/types/Catalogo";
import { servicioCatalogo } from "@/services/ServicioCatalogo";
import { CONFIGURACION_CONTACTO } from "@/data/datosContacto";
import { VERSION_SITIO } from "@/data/datosVersion";
import { FondoHumoSutil } from "@/components/animacion/FondoHumoSutil";
import { MenuFlotanteDerecho } from "@/components/diseno-v2/MenuFlotanteDerecho";
import { TarjetaServicioCotizador } from "./TarjetaServicioCotizador";
import { SelectorAdicionalesPorGrupo } from "./SelectorAdicionalesPorGrupo";
import { ResumenCotizacionLateral } from "./ResumenCotizacionLateral";

interface PropiedadesExperienciaCotizador {
  catalogo: CatalogoPublicoResponse;
}

/**
 * Contenedor interactivo principal de la página dedicada del Cotizador (/cotizador).
 * Estructura Split-Screen: Resumen fijo a la izquierda en escritorio (oculto con botón en móvil),
 * columna de configuración a la derecha con margen libre para no colisionar con el MenuFlotanteDerecho.
 */
export function ExperienciaCotizador({
  catalogo,
}: PropiedadesExperienciaCotizador) {
  const traducciones = useTranslations("cotizador");
  const traduccionesPie = useTranslations("piePagina");
  const router = useRouter();

  const serviciosOrdenados = useMemo(
    () =>
      [...catalogo.servicios].sort(
        (a, b) => a.ordenVisualizacion - b.ordenVisualizacion
      ),
    [catalogo.servicios]
  );

  const gruposOrdenados = useMemo(
    () =>
      [...catalogo.gruposAdicionales].sort(
        (a, b) => a.ordenVisualizacion - b.ordenVisualizacion
      ),
    [catalogo.gruposAdicionales]
  );

  const servicioInicialId = serviciosOrdenados[0]?.id ?? "";

  const [servicioBaseId, setServicioBaseId] = useState<string>(servicioInicialId);
  const [cantidadSeccionesExtra, setCantidadSeccionesExtra] = useState<number>(0);
  const [adicionalesSeleccionadosIds, setAdicionalesSeleccionadosIds] = useState<
    string[]
  >([]);
  const [huboCambioManual, setHuboCambioManual] = useState<boolean>(false);
  const [modalConfirmarSalidaAbierto, setModalConfirmarSalidaAbierto] =
    useState<boolean>(false);

  const tieneCambiosEnCotizador =
    huboCambioManual ||
    servicioBaseId !== servicioInicialId ||
    cantidadSeccionesExtra > 0 ||
    adicionalesSeleccionadosIds.length > 0;

  const servicioSeleccionado = useMemo(
    () =>
      serviciosOrdenados.find((item) => item.id === servicioBaseId) ??
      serviciosOrdenados[0],
    [serviciosOrdenados, servicioBaseId]
  );

  const todosLosAdicionales = useMemo(() => {
    const mapa = new Map<string, AdicionalResponse>();
    gruposOrdenados.forEach((grupo) => {
      grupo.adicionales.forEach((adicional) => {
        mapa.set(adicional.id, adicional);
      });
    });
    return mapa;
  }, [gruposOrdenados]);

  const adicionalesSeleccionados = useMemo(() => {
    return adicionalesSeleccionadosIds
      .map((id) => todosLosAdicionales.get(id))
      .filter((item): item is AdicionalResponse => item !== undefined);
  }, [adicionalesSeleccionadosIds, todosLosAdicionales]);

  const promocionActivaServicioActual = useMemo(() => {
    if (!servicioSeleccionado) {
      return null;
    }
    return servicioCatalogo.resolverPromocionParaServicio(
      servicioSeleccionado.id,
      catalogo.promocionesActivas
    );
  }, [servicioSeleccionado, catalogo.promocionesActivas]);

  // Al cambiar de servicio base, limpia automáticamente adicionales que no sean compatibles con la nueva base
  const seleccionarServicioBase = (nuevoServicioId: string) => {
    setHuboCambioManual(true);
    if (nuevoServicioId === servicioBaseId) {
      return;
    }

    const nuevoServicio = serviciosOrdenados.find(
      (item) => item.id === nuevoServicioId
    );
    setServicioBaseId(nuevoServicioId);

    if (!nuevoServicio) {
      return;
    }

    if (!nuevoServicio.permiteSeccionesExtra) {
      setCantidadSeccionesExtra(0);
    }

    if (
      nuevoServicio.adicionalesCompatiblesIds &&
      nuevoServicio.adicionalesCompatiblesIds.length > 0
    ) {
      setAdicionalesSeleccionadosIds((previos) =>
        previos.filter((id) =>
          nuevoServicio.adicionalesCompatiblesIds.includes(id)
        )
      );
    }
  };

  const cambiarSeccionesExtra = (nuevaCantidad: number) => {
    setHuboCambioManual(true);
    setCantidadSeccionesExtra(nuevaCantidad);
  };

  const alternarAdicional = (adicionalId: string) => {
    setHuboCambioManual(true);
    setAdicionalesSeleccionadosIds((previos) =>
      previos.includes(adicionalId)
        ? previos.filter((id) => id !== adicionalId)
        : [...previos, adicionalId]
    );
  };

  const manejarIntentoVolverInicio = () => {
    if (tieneCambiosEnCotizador) {
      setModalConfirmarSalidaAbierto(true);
      return;
    }
    router.push("/");
  };

  const confirmarSalidaAlInicio = () => {
    setModalConfirmarSalidaAbierto(false);
    router.push("/");
  };

  if (!servicioSeleccionado) {
    return null;
  }

  return (
    <div
      data-v2="true"
      className="relative min-h-screen bg-[#070606] text-neutral-100 selection:bg-[rgb(var(--tema-acento-rgb))] selection:text-black"
    >
      {/* Fondo Ambiental de Humo Sutil */}
      <FondoHumoSutil />

      {/* Menú Dock Flotante Derecho */}
      <MenuFlotanteDerecho />

      {/* Disposición Espacial Split-Screen (Resumen Fijo a la Izquierda + Configurador a la Derecha con corredor libre para el Dock) */}
      <div className="relative z-10 max-w-[1700px] mx-auto p-3 sm:p-6 lg:p-8 pt-16 sm:pt-20 lg:pt-6 pb-24 lg:pb-12 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* 1. Columna Izquierda Fija: Resumen de Presupuesto (Sticky en Desktop / Botón flotante en Móvil) */}
        <ResumenCotizacionLateral
          servicioSeleccionado={servicioSeleccionado}
          cantidadSeccionesExtra={cantidadSeccionesExtra}
          adicionalesSeleccionados={adicionalesSeleccionados}
          promocionAplicada={promocionActivaServicioActual}
        />

        {/* 2. Columna Principal Derecha: Configurador con margen derecho (lg:pr-16 xl:pr-20) para no chocar con el Dock */}
        <main className="flex-1 min-w-0 w-full pr-0 lg:pr-16 xl:pr-20 flex flex-col gap-7">
          {/* Barra superior con botón 'Volver al inicio' y control de cambios */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={manejarIntentoVolverInicio}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white border border-white/10 hover:border-[rgb(var(--tema-acento-rgb)/0.45)] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[rgb(var(--tema-acento-claro-rgb))]" />
              <span>{traducciones("volverAlPortafolio")}</span>
            </button>
          </div>

          {/* PASO 01: Selección de Servicio Base (3 Cards Compactas con gap reducido) */}
          <section aria-labelledby="titulo-paso-1">
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-[rgb(var(--tema-acento-claro-rgb))]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{traducciones("paso1Etiqueta")}</span>
              </span>
              <h1
                id="titulo-paso-1"
                className="text-xl sm:text-2xl font-bold text-white mt-0.5"
              >
                {traducciones("paso1Titulo")}
              </h1>
              <p className="text-xs text-neutral-400 mt-0.5">
                {traducciones("paso1Descripcion")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-3.5">
              {serviciosOrdenados.map((servicio) => {
                const promoParaServicio =
                  servicioCatalogo.resolverPromocionParaServicio(
                    servicio.id,
                    catalogo.promocionesActivas
                  );
                const calculoPrecio =
                  servicioCatalogo.calcularPrecioConPromocion(
                    servicio.precioBase,
                    promoParaServicio
                  );

                return (
                  <TarjetaServicioCotizador
                    key={servicio.id}
                    servicio={servicio}
                    calculoPrecio={calculoPrecio}
                    estaSeleccionado={servicio.id === servicioSeleccionado.id}
                    cantidadSeccionesExtra={
                      servicio.id === servicioSeleccionado.id
                        ? cantidadSeccionesExtra
                        : 0
                    }
                    alSeleccionar={seleccionarServicioBase}
                    alCambiarSeccionesExtra={cambiarSeccionesExtra}
                  />
                );
              })}
            </div>
          </section>

          {/* PASO 02: Selección de Módulos Adicionales Compatibles */}
          <section aria-labelledby="titulo-paso-2">
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-[rgb(var(--tema-acento-claro-rgb))]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{traducciones("paso2Etiqueta")}</span>
              </span>
              <h2
                id="titulo-paso-2"
                className="text-xl sm:text-2xl font-bold text-white mt-0.5"
              >
                {traducciones("paso2Titulo")}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                {traducciones("paso2Descripcion")}
              </p>
            </div>

            <SelectorAdicionalesPorGrupo
              grupos={gruposOrdenados}
              adicionalesCompatiblesIds={
                servicioSeleccionado.adicionalesCompatiblesIds
              }
              adicionalesSeleccionadosIds={adicionalesSeleccionadosIds}
              alAlternarAdicional={alternarAdicional}
            />
          </section>

          {/* Bloque para proyectos corporativos a medida */}
          <section className="rounded-2xl bg-gradient-to-r from-[#0c0a09] via-[#120f11] to-[#0c0a09] border border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">
                {traducciones("proyectoAMedidaTitulo")}
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                {traducciones("proyectoAMedidaTexto")}
              </p>
            </div>

            <a
              href={CONFIGURACION_CONTACTO.urlWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/15 hover:border-[rgb(var(--tema-acento-rgb)/0.5)] transition-all shrink-0"
            >
              <MessageSquare className="w-4 h-4 text-[rgb(var(--tema-acento-claro-rgb))]" />
              <span>WhatsApp</span>
            </a>
          </section>

          {/* Pie de página sutil */}
          <footer className="mt-4 pt-6 border-t border-white/5 text-center text-xs text-neutral-500 font-mono flex items-center justify-center gap-2">
            <span>{traduccionesPie("derechos")}</span>
            <span>·</span>
            <span className="text-neutral-400 font-semibold">
              v{VERSION_SITIO}
            </span>
          </footer>
        </main>
      </div>

      {/* Ventana Modal de Control de Cambios al pulsar 'Volver al inicio' */}
      <AnimatePresence>
        {modalConfirmarSalidaAbierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setModalConfirmarSalidaAbierto(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              onClick={(evento) => evento.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="titulo-modal-salida"
              className="relative w-full max-w-md rounded-3xl bg-[#0c0a09]/95 border border-white/15 shadow-[0_24px_64px_rgba(0,0,0,0.9)] p-6 overflow-hidden"
            >
              {/* Halo ambiental del tema activo */}
              <div className="pointer-events-none absolute -top-20 -left-20 w-52 h-52 rounded-full bg-[rgb(var(--tema-acento-rgb)/0.16)] blur-3xl" />

              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[rgb(var(--tema-acento-rgb)/0.12)] border border-[rgb(var(--tema-acento-rgb)/0.35)] flex items-center justify-center text-[rgb(var(--tema-acento-claro-rgb))] shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>

                <button
                  type="button"
                  onClick={() => setModalConfirmarSalidaAbierto(false)}
                  aria-label={traducciones("modalSalidaCancelar")}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative z-10 mt-4">
                <h3
                  id="titulo-modal-salida"
                  className="text-lg sm:text-xl font-bold text-white"
                >
                  {traducciones("modalSalidaTitulo")}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {traducciones("modalSalidaDescripcion")}
                </p>
              </div>

              <div className="relative z-10 mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalConfirmarSalidaAbierto(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white border border-white/10 transition-all cursor-pointer"
                >
                  {traducciones("modalSalidaCancelar")}
                </button>

                <button
                  type="button"
                  onClick={confirmarSalidaAlInicio}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-[rgb(var(--tema-acento-rgb))] text-black shadow-[0_0_18px_rgba(var(--tema-acento-rgb),0.4)] hover:shadow-[0_0_24px_rgba(var(--tema-acento-rgb),0.65)] transition-all cursor-pointer"
                >
                  {traducciones("modalSalidaConfirmar")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
