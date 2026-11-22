"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useRouter } from "@/i18n/routing";
import {
  AdicionalResponse,
  CatalogoPublicoResponse,
  CrearPresupuestoResponse,
} from "@/types/Catalogo";
import { servicioCatalogo } from "@/services/ServicioCatalogo";
import { VERSION_SITIO } from "@/data/datosVersion";
import { FondoHumoSutil } from "@/components/animacion/FondoHumoSutil";
import { MenuFlotanteDerecho } from "@/components/diseno-v2/MenuFlotanteDerecho";
import { TarjetaServicioCotizador } from "./TarjetaServicioCotizador";
import { SelectorAdicionalesPorGrupo } from "./SelectorAdicionalesPorGrupo";
import { ResumenCotizacionLateral } from "./ResumenCotizacionLateral";

interface PropiedadesExperienciaCotizador {
  catalogo: CatalogoPublicoResponse;
}

type PasoCotizador = 1 | 2 | 3;

/**
 * Contenedor interactivo principal del Cotizador Online (/cotizador) con flujo guiado por pasos (Wizard):
 * - Fila superior única con botón 'Volver al inicio' y títulos PASO 01, PASO 02 (oculto si el producto no tiene adicionales) y PASO 03.
 * - Un solo paso abierto por vez: Paso 1 (Tipo de producto) -> Paso 2 (Secciones y Adicionales) -> Paso 3 (Descripción + Datos + Finalizar).
 * - Al hacer clic en 'Finalizar', persiste el presupuesto en el Backend y habilita los botones de PDF y WhatsApp en el Resumen izquierdo.
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

  // Estado de configuración del presupuesto
  const [pasoActual, setPasoActual] = useState<PasoCotizador>(1);
  const [servicioBaseId, setServicioBaseId] = useState<string>(servicioInicialId);
  const [cantidadSeccionesExtra, setCantidadSeccionesExtra] = useState<number>(0);
  const [adicionalesSeleccionadosIds, setAdicionalesSeleccionadosIds] = useState<
    string[]
  >([]);

  // Estado del formulario del último paso (Descripción + Contacto)
  const [descripcionProyecto, setDescripcionProyecto] = useState<string>("");
  const [nombreCliente, setNombreCliente] = useState<string>("");
  const [emailCliente, setEmailCliente] = useState<string>("");
  const [whatsappCliente, setWhatsappCliente] = useState<string>("");
  const [trampaSpam, setTrampaSpam] = useState<string>("");
  const [mensajeErrorFormulario, setMensajeErrorFormulario] = useState<
    string | null
  >(null);

  // Estado de finalización y sincronización con el Backend
  const [enviandoPresupuesto, setEnviandoPresupuesto] = useState<boolean>(false);
  const [cotizacionFinalizada, setCotizacionFinalizada] =
    useState<boolean>(false);
  const [presupuestoCreado, setPresupuestoCreado] =
    useState<CrearPresupuestoResponse | null>(null);

  // Control de cambios al salir
  const [huboCambioManual, setHuboCambioManual] = useState<boolean>(false);
  const [modalConfirmarSalidaAbierto, setModalConfirmarSalidaAbierto] =
    useState<boolean>(false);

  const tieneCambiosEnCotizador =
    huboCambioManual ||
    pasoActual > 1 ||
    servicioBaseId !== servicioInicialId ||
    cantidadSeccionesExtra > 0 ||
    adicionalesSeleccionadosIds.length > 0 ||
    descripcionProyecto.trim().length > 0 ||
    nombreCliente.trim().length > 0 ||
    emailCliente.trim().length > 0 ||
    whatsappCliente.trim().length > 0;

  const servicioSeleccionado = useMemo(
    () =>
      serviciosOrdenados.find((item) => item.id === servicioBaseId) ??
      serviciosOrdenados[0],
    [serviciosOrdenados, servicioBaseId]
  );

  // Determina si el producto elegido tiene adicionales o secciones extra (Paso 02)
  const productoTieneAdicionales = useMemo(() => {
    if (!servicioSeleccionado) {
      return false;
    }
    const tieneCompatibles =
      Array.isArray(servicioSeleccionado.adicionalesCompatiblesIds) &&
      servicioSeleccionado.adicionalesCompatiblesIds.length > 0;
    return servicioSeleccionado.permiteSeccionesExtra || tieneCompatibles;
  }, [servicioSeleccionado]);

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
    if (!servicioSeleccionado || servicioSeleccionado.precioBase === 0) {
      return null;
    }
    return servicioCatalogo.resolverPromocionParaServicio(
      servicioSeleccionado.id,
      catalogo.promocionesActivas
    );
  }, [servicioSeleccionado, catalogo.promocionesActivas]);

  const reiniciarFinalizacionSiCorresponde = () => {
    if (cotizacionFinalizada) {
      setCotizacionFinalizada(false);
      setPresupuestoCreado(null);
    }
  };

  // Selección de producto en el Paso 01
  const seleccionarServicioBase = (nuevoServicioId: string) => {
    setHuboCambioManual(true);
    reiniciarFinalizacionSiCorresponde();

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
      !nuevoServicio.adicionalesCompatiblesIds ||
      nuevoServicio.adicionalesCompatiblesIds.length === 0
    ) {
      setAdicionalesSeleccionadosIds([]);
    } else {
      setAdicionalesSeleccionadosIds((previos) =>
        previos.filter((id) =>
          nuevoServicio.adicionalesCompatiblesIds.includes(id)
        )
      );
    }
  };

  const cambiarSeccionesExtra = (nuevaCantidad: number) => {
    setHuboCambioManual(true);
    reiniciarFinalizacionSiCorresponde();
    setCantidadSeccionesExtra(nuevaCantidad);
  };

  const alternarAdicional = (adicionalId: string) => {
    setHuboCambioManual(true);
    reiniciarFinalizacionSiCorresponde();
    setAdicionalesSeleccionadosIds((previos) =>
      previos.includes(adicionalId)
        ? previos.filter((id) => id !== adicionalId)
        : [...previos, adicionalId]
    );
  };

  // Navegación entre pasos del Wizard
  const avanzarDesdePaso1 = () => {
    setHuboCambioManual(true);
    if (productoTieneAdicionales) {
      setPasoActual(2);
    } else {
      setPasoActual(3);
    }
  };

  const avanzarDesdePaso2 = () => {
    setPasoActual(3);
  };

  const volverPasoAnterior = () => {
    setMensajeErrorFormulario(null);
    if (pasoActual === 3) {
      setPasoActual(productoTieneAdicionales ? 2 : 1);
    } else if (pasoActual === 2) {
      setPasoActual(1);
    }
  };

  const irAPasoDesdeBarraSuperior = (pasoDestino: PasoCotizador) => {
    if (pasoDestino === 2 && !productoTieneAdicionales) {
      return;
    }
    setMensajeErrorFormulario(null);
    setPasoActual(pasoDestino);
  };

  // Finalizar cotización y habilitar botones del Resumen
  const manejarFinalizarCotizacion = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setMensajeErrorFormulario(null);

    const nombreLimpio = nombreCliente.trim();
    const emailLimpio = emailCliente.trim();
    const whatsappLimpio = whatsappCliente.trim();
    const descripcionLimpia = descripcionProyecto.trim();

    if (
      !descripcionLimpia ||
      !nombreLimpio ||
      !emailLimpio.includes("@") ||
      !emailLimpio.includes(".") ||
      whatsappLimpio.length < 6
    ) {
      setMensajeErrorFormulario(traducciones("errorCamposPasoFinal"));
      return;
    }

    setEnviandoPresupuesto(true);

    const respuesta = await servicioCatalogo.crearPresupuestoFormal({
      nombreCompleto: nombreLimpio,
      email: emailLimpio,
      telefonoWhatsApp: whatsappLimpio,
      descripcionNecesidad: descripcionLimpia,
      servicioBaseId: servicioSeleccionado.id,
      cantidadSeccionesExtra: productoTieneAdicionales
        ? cantidadSeccionesExtra
        : 0,
      adicionalesIds: productoTieneAdicionales
        ? adicionalesSeleccionadosIds
        : [],
      codigoPromocion: promocionActivaServicioActual?.clave ?? null,
      trampaSpam: trampaSpam || undefined,
    });

    setEnviandoPresupuesto(false);

    if (respuesta.exito && respuesta.datos) {
      setPresupuestoCreado(respuesta.datos);
    }

    setCotizacionFinalizada(true);
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

      {/* Disposición Espacial Split-Screen (Resumen Fijo a la Izquierda + Wizard por Pasos a la Derecha) */}
      <div className="relative z-10 max-w-[1700px] mx-auto p-3 sm:p-6 lg:p-8 pt-16 sm:pt-20 lg:pt-6 pb-24 lg:pb-12 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* 1. Columna Izquierda Fija: Resumen de Presupuesto a alto completo del viewport */}
        <ResumenCotizacionLateral
          servicioSeleccionado={servicioSeleccionado}
          cantidadSeccionesExtra={
            productoTieneAdicionales ? cantidadSeccionesExtra : 0
          }
          adicionalesSeleccionados={
            productoTieneAdicionales ? adicionalesSeleccionados : []
          }
          promocionAplicada={promocionActivaServicioActual}
          cotizacionFinalizada={cotizacionFinalizada}
          presupuestoCreado={presupuestoCreado}
          descripcionProyecto={descripcionProyecto}
          nombreCliente={nombreCliente}
        />

        {/* 2. Columna Principal Derecha: Wizard por Pasos con margen derecho libre del Dock */}
        <main className="flex-1 min-w-0 w-full pr-0 lg:pr-16 xl:pr-20 flex flex-col gap-6">
          {/* FILA SUPERIOR ÚNICA: Botón 'Volver al inicio' + Indicadores PASO 01, PASO 02, PASO 03 en la misma fila */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
            <button
              type="button"
              onClick={manejarIntentoVolverInicio}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white border border-white/10 hover:border-[rgb(var(--tema-acento-rgb)/0.45)] transition-all cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[rgb(var(--tema-acento-claro-rgb))]" />
              <span>{traducciones("volverAlPortafolio")}</span>
            </button>

            {/* Títulos PASO 01, PASO 02 (persistente, gris si no aplica), PASO 03 en la misma fila superior */}
            <nav
              aria-label="Pasos del cotizador"
              className="flex flex-wrap items-center gap-2"
            >
              {/* PASO 01 */}
              <button
                type="button"
                onClick={() => irAPasoDesdeBarraSuperior(1)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer border ${
                  pasoActual === 1
                    ? "bg-[rgb(var(--tema-acento-rgb))] text-black border-[rgb(var(--tema-acento-claro-rgb))] shadow-[0_0_18px_rgba(var(--tema-acento-rgb),0.45)]"
                    : "bg-[rgb(var(--tema-acento-rgb)/0.06)] text-[rgb(var(--tema-acento-claro-rgb))] border-[rgb(var(--tema-acento-rgb)/0.35)] hover:bg-[rgb(var(--tema-acento-rgb)/0.12)] hover:border-[rgb(var(--tema-acento-rgb)/0.6)]"
                }`}
              >
                {pasoActual > 1 ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>
                  {traducciones("paso1Etiqueta")} · {traducciones("paso1Corto")}
                </span>
              </button>

              {/* PASO 02 (Visible siempre. Si el producto elegido no tiene adicionales, se muestra en gris deshabilitado) */}
              <button
                type="button"
                onClick={() => irAPasoDesdeBarraSuperior(2)}
                disabled={!productoTieneAdicionales}
                aria-disabled={!productoTieneAdicionales}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all border ${
                  !productoTieneAdicionales
                    ? "bg-white/[0.02] text-neutral-600 border-white/[0.06] opacity-50 cursor-not-allowed select-none"
                    : pasoActual === 2
                    ? "bg-[rgb(var(--tema-acento-rgb))] text-black border-[rgb(var(--tema-acento-claro-rgb))] shadow-[0_0_18px_rgba(var(--tema-acento-rgb),0.45)] cursor-pointer"
                    : "bg-[rgb(var(--tema-acento-rgb)/0.06)] text-[rgb(var(--tema-acento-claro-rgb))] border-[rgb(var(--tema-acento-rgb)/0.35)] hover:bg-[rgb(var(--tema-acento-rgb)/0.12)] hover:border-[rgb(var(--tema-acento-rgb)/0.6)] cursor-pointer"
                }`}
              >
                {productoTieneAdicionales && pasoActual > 2 ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>
                  {traducciones("paso2Etiqueta")} · {traducciones("paso2Corto")}
                  {!productoTieneAdicionales && (
                    <span className="ml-1 text-[10px] opacity-75 font-normal">
                      {traducciones("paso2NoAplica")}
                    </span>
                  )}
                </span>
              </button>

              {/* PASO 03 (Proyecto y Contacto) */}
              <button
                type="button"
                onClick={() => irAPasoDesdeBarraSuperior(3)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer border ${
                  pasoActual === 3
                    ? "bg-[rgb(var(--tema-acento-rgb))] text-black border-[rgb(var(--tema-acento-claro-rgb))] shadow-[0_0_18px_rgba(var(--tema-acento-rgb),0.45)]"
                    : "bg-[rgb(var(--tema-acento-rgb)/0.06)] text-[rgb(var(--tema-acento-claro-rgb))] border-[rgb(var(--tema-acento-rgb)/0.35)] hover:bg-[rgb(var(--tema-acento-rgb)/0.12)] hover:border-[rgb(var(--tema-acento-rgb)/0.6)]"
                }`}
              >
                {cotizacionFinalizada ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>
                  {traducciones("paso3Etiqueta")} · {traducciones("paso3Corto")}
                </span>
              </button>
            </nav>
          </div>

          {/* CONTENIDO DEL PASO ACTIVO (Un solo paso abierto por vez) */}
          <AnimatePresence mode="wait">
            {/* ==================== PASO 01: ELEGIR TIPO DE PRODUCTO ==================== */}
            {pasoActual === 1 && (
              <motion.section
                key="wizard-paso-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                aria-labelledby="titulo-paso-1"
                className="flex flex-col gap-5"
              >
                <div>
                  <h1
                    id="titulo-paso-1"
                    className="text-xl sm:text-2xl font-bold text-white"
                  >
                    {traducciones("paso1Titulo")}
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                    {traducciones("paso1Descripcion")}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-3.5">
                  {serviciosOrdenados.map((servicio) => {
                    const promoParaServicio =
                      servicio.precioBase === 0
                        ? null
                        : servicioCatalogo.resolverPromocionParaServicio(
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
                        estaSeleccionado={
                          servicio.id === servicioSeleccionado.id
                        }
                        alSeleccionar={seleccionarServicioBase}
                      />
                    );
                  })}
                </div>

                {/* Botón Siguiente del Paso 01 */}
                <div className="flex items-center justify-end pt-2">
                  <button
                    type="button"
                    onClick={avanzarDesdePaso1}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-[rgb(var(--tema-acento-rgb))] text-black shadow-[0_0_22px_rgba(var(--tema-acento-rgb),0.4)] hover:shadow-[0_0_30px_rgba(var(--tema-acento-rgb),0.65)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{traducciones("botonSiguiente")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.section>
            )}

            {/* ==================== PASO 02: SECCIONES EXTRA Y ADICIONALES ==================== */}
            {pasoActual === 2 && productoTieneAdicionales && (
              <motion.section
                key="wizard-paso-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                aria-labelledby="titulo-paso-2"
                className="flex flex-col gap-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2
                      id="titulo-paso-2"
                      className="text-xl sm:text-2xl font-bold text-white"
                    >
                      {traducciones("paso2Titulo")}
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                      {traducciones("paso2Descripcion")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={volverPasoAnterior}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white border border-white/10 transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{traducciones("botonAnterior")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={avanzarDesdePaso2}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[rgb(var(--tema-acento-rgb))] text-black shadow-[0_0_20px_rgba(var(--tema-acento-rgb),0.4)] hover:shadow-[0_0_28px_rgba(var(--tema-acento-rgb),0.65)] transition-all cursor-pointer"
                    >
                      <span>{traducciones("botonSiguiente")}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <SelectorAdicionalesPorGrupo
                  servicioSeleccionado={servicioSeleccionado}
                  cantidadSeccionesExtra={cantidadSeccionesExtra}
                  alCambiarSeccionesExtra={cambiarSeccionesExtra}
                  grupos={gruposOrdenados}
                  adicionalesCompatiblesIds={
                    servicioSeleccionado.adicionalesCompatiblesIds
                  }
                  adicionalesSeleccionadosIds={adicionalesSeleccionadosIds}
                  alAlternarAdicional={alternarAdicional}
                />

                {/* Botones inferiores del Paso 02 */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={volverPasoAnterior}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white border border-white/10 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{traducciones("botonAnterior")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={avanzarDesdePaso2}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-[rgb(var(--tema-acento-rgb))] text-black shadow-[0_0_22px_rgba(var(--tema-acento-rgb),0.4)] hover:shadow-[0_0_30px_rgba(var(--tema-acento-rgb),0.65)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{traducciones("botonSiguiente")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.section>
            )}

            {/* ==================== PASO 03: BREVE DESCRIPCIÓN + DATOS DE CONTACTO Y FINALIZAR ==================== */}
            {pasoActual === 3 && (
              <motion.section
                key="wizard-paso-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                aria-labelledby="titulo-paso-3"
                className="flex flex-col gap-5"
              >
                <div>
                  <h2
                    id="titulo-paso-3"
                    className="text-xl sm:text-2xl font-bold text-white"
                  >
                    {traducciones("paso3Titulo")}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                    {traducciones("paso3Descripcion")}
                  </p>
                </div>

                <form
                  onSubmit={manejarFinalizarCotizacion}
                  className="rounded-3xl bg-[#0c0a09]/90 border border-white/10 p-5 sm:p-7 flex flex-col gap-5"
                >
                  {/* Campo invisible señuelo para control anti-spam (honeypot) */}
                  <input
                    type="text"
                    name="sitioWebEmpresaOculto"
                    value={trampaSpam}
                    onChange={(e) => setTrampaSpam(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  {/* 1. Breve Descripción de lo que quiere */}
                  <div>
                    <label
                      htmlFor="campo-descripcion-proyecto"
                      className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-semibold flex items-center gap-2 mb-2"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[rgb(var(--tema-acento-claro-rgb))]" />
                      <span>{traducciones("campoDescripcionEtiqueta")} *</span>
                    </label>
                    <textarea
                      id="campo-descripcion-proyecto"
                      rows={3}
                      required
                      value={descripcionProyecto}
                      onChange={(evento) => {
                        setHuboCambioManual(true);
                        reiniciarFinalizacionSiCorresponde();
                        setDescripcionProyecto(evento.target.value);
                      }}
                      placeholder={traducciones("campoDescripcionPlaceholder")}
                      className="w-full rounded-2xl bg-black/60 border border-white/15 focus:border-[rgb(var(--tema-acento-rgb))] focus:outline-none px-4 py-3 text-xs sm:text-sm text-white placeholder:text-neutral-500 transition-colors resize-none"
                    />
                  </div>

                  {/* 2. Nombre, Email y WhatsApp en grilla limpia */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="campo-nombre-cliente"
                        className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-semibold flex items-center gap-2 mb-2"
                      >
                        <User className="w-3.5 h-3.5 text-[rgb(var(--tema-acento-claro-rgb))]" />
                        <span>{traducciones("campoNombreEtiqueta")} *</span>
                      </label>
                      <input
                        id="campo-nombre-cliente"
                        type="text"
                        required
                        value={nombreCliente}
                        onChange={(evento) => {
                          setHuboCambioManual(true);
                          reiniciarFinalizacionSiCorresponde();
                          setNombreCliente(evento.target.value);
                        }}
                        placeholder={traducciones("campoNombrePlaceholder")}
                        className="w-full rounded-xl bg-black/60 border border-white/15 focus:border-[rgb(var(--tema-acento-rgb))] focus:outline-none px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-neutral-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="campo-email-cliente"
                        className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-semibold flex items-center gap-2 mb-2"
                      >
                        <Mail className="w-3.5 h-3.5 text-[rgb(var(--tema-acento-claro-rgb))]" />
                        <span>{traducciones("campoEmailEtiqueta")} *</span>
                      </label>
                      <input
                        id="campo-email-cliente"
                        type="email"
                        required
                        value={emailCliente}
                        onChange={(evento) => {
                          setHuboCambioManual(true);
                          reiniciarFinalizacionSiCorresponde();
                          setEmailCliente(evento.target.value);
                        }}
                        placeholder={traducciones("campoEmailPlaceholder")}
                        className="w-full rounded-xl bg-black/60 border border-white/15 focus:border-[rgb(var(--tema-acento-rgb))] focus:outline-none px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-neutral-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="campo-whatsapp-cliente"
                        className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-semibold flex items-center gap-2 mb-2"
                      >
                        <Phone className="w-3.5 h-3.5 text-[rgb(var(--tema-acento-claro-rgb))]" />
                        <span>{traducciones("campoWhatsappEtiqueta")} *</span>
                      </label>
                      <input
                        id="campo-whatsapp-cliente"
                        type="tel"
                        required
                        value={whatsappCliente}
                        onChange={(evento) => {
                          setHuboCambioManual(true);
                          reiniciarFinalizacionSiCorresponde();
                          setWhatsappCliente(evento.target.value);
                        }}
                        placeholder={traducciones("campoWhatsappPlaceholder")}
                        className="w-full rounded-xl bg-black/60 border border-white/15 focus:border-[rgb(var(--tema-acento-rgb))] focus:outline-none px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-neutral-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Mensaje de validación si falta algún dato */}
                  {mensajeErrorFormulario && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                      {mensajeErrorFormulario}
                    </div>
                  )}

                  {/* Aviso de éxito cuando ya hizo clic en Finalizar */}
                  {cotizacionFinalizada && (
                    <div className="p-4 rounded-2xl bg-[rgb(var(--tema-acento-rgb)/0.12)] border border-[rgb(var(--tema-acento-rgb)/0.45)] flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[rgb(var(--tema-acento-claro-rgb))] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-sm font-bold text-white block">
                          {traducciones("cotizacionListaTitulo")}
                        </span>
                        <p className="text-xs text-neutral-300 mt-0.5">
                          {traducciones("cotizacionListaTexto")}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Botones Paso Anterior y Finalizar */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={volverPasoAnterior}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white border border-white/10 transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{traducciones("botonAnterior")}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={enviandoPresupuesto}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-[rgb(var(--tema-acento-rgb))] text-black shadow-[0_0_24px_rgba(var(--tema-acento-rgb),0.45)] hover:shadow-[0_0_32px_rgba(var(--tema-acento-rgb),0.7)] hover:scale-[1.02] active:scale-95 disabled:opacity-60 transition-all cursor-pointer"
                    >
                      {enviandoPresupuesto ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{traducciones("procesandoFinalizar")}</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>{traducciones("botonFinalizar")}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.section>
            )}
          </AnimatePresence>

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
