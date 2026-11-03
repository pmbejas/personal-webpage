"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ColoresTemaHumo,
  EVENTO_CAMBIO_EFECTO_FONDO,
  obtenerEfectoFondoAlmacenado,
  TipoEfectoFondo,
} from "./tiposEfectoFondo";
import {
  actualizarYDibujarMotasBokeh,
  crearListaMotasBokeh,
  crearListaNodosConstelacion,
  crearListaPulsosReticula,
  dibujarConstelacionReactiva,
  dibujarOndasAuroraSeda,
  dibujarRayosCenitales,
  dibujarReticulaCyberGrid,
  MotaLuzBokeh,
  NodoConstelacion,
  PulsoDatosReticula,
} from "./renderizadoresEfectosFondo";

interface VeloHumoEspiral {
  origenBaseX: number;
  inclinacionGeneralX: number;
  anchoMaximoVelo: number;
  velocidadFlujo: number;
  desfaseTemporal: number;
  frecuenciaEspiral: number;
  opacidadVelo: number;
}

export interface PropiedadesFondoHumoSutil {
  multiplicadorIntensidad?: number;
}

function leerColoresTemaDocumento(): ColoresTemaHumo {
  const coloresPorDefecto: ColoresTemaHumo = {
    acentoRgb: "14, 165, 233",
    acentoClaroRgb: "56, 189, 248",
  };

  try {
    const estilosRaiz = getComputedStyle(document.documentElement);
    const variableAcento = estilosRaiz.getPropertyValue("--tema-acento-rgb").trim();
    const variableAcentoClaro = estilosRaiz.getPropertyValue("--tema-acento-claro-rgb").trim();

    return {
      acentoRgb: variableAcento
        ? variableAcento.split(/\s+/).join(", ")
        : coloresPorDefecto.acentoRgb,
      acentoClaroRgb: variableAcentoClaro
        ? variableAcentoClaro.split(/\s+/).join(", ")
        : coloresPorDefecto.acentoClaroRgb,
    };
  } catch {
    return coloresPorDefecto;
  }
}

function crearListaVelosHumoEspiral(anchoLienzo: number): VeloHumoEspiral[] {
  if (anchoLienzo < 768) {
    return [
      {
        origenBaseX: anchoLienzo * 0.35,
        inclinacionGeneralX: anchoLienzo * 0.12,
        anchoMaximoVelo: 85,
        velocidadFlujo: 0.42,
        desfaseTemporal: 0.4,
        frecuenciaEspiral: 6.2,
        opacidadVelo: 1.0,
      },
      {
        origenBaseX: anchoLienzo * 0.72,
        inclinacionGeneralX: -anchoLienzo * 0.1,
        anchoMaximoVelo: 75,
        velocidadFlujo: 0.36,
        desfaseTemporal: 3.1,
        frecuenciaEspiral: 5.6,
        opacidadVelo: 0.85,
      },
    ];
  }

  return [
    {
      origenBaseX: anchoLienzo * 0.24,
      inclinacionGeneralX: anchoLienzo * 0.08,
      anchoMaximoVelo: 115,
      velocidadFlujo: 0.4,
      desfaseTemporal: 0.2,
      frecuenciaEspiral: 6.4,
      opacidadVelo: 0.95,
    },
    {
      origenBaseX: anchoLienzo * 0.56,
      inclinacionGeneralX: -anchoLienzo * 0.06,
      anchoMaximoVelo: 130,
      velocidadFlujo: 0.35,
      desfaseTemporal: 2.3,
      frecuenciaEspiral: 5.8,
      opacidadVelo: 1.05,
    },
    {
      origenBaseX: anchoLienzo * 0.84,
      inclinacionGeneralX: -anchoLienzo * 0.09,
      anchoMaximoVelo: 105,
      velocidadFlujo: 0.44,
      desfaseTemporal: 4.5,
      frecuenciaEspiral: 6.8,
      opacidadVelo: 0.88,
    },
  ];
}

function calcularCoordenadaVeloEspiral(
  velo: VeloHumoEspiral,
  fibraNormalizadaU: number,
  progresoVerticalV: number,
  altoLienzo: number,
  tiempo: number
): { coordenadaX: number; coordenadaY: number } {
  const faseViajera = progresoVerticalV * velo.frecuenciaEspiral - tiempo * velo.velocidadFlujo + velo.desfaseTemporal;
  const baseY = (altoLienzo + 60) - progresoVerticalV * (altoLienzo + 140);
  const aperturaConica = 0.16 + Math.pow(progresoVerticalV, 0.82) * 0.95;

  const ondaColumna1 = Math.sin(faseViajera * 0.75) * 68 * aperturaConica;
  const ondaColumna2 = Math.cos(faseViajera * 1.35 - 0.8) * 34 * aperturaConica;
  const espinaX = velo.origenBaseX + progresoVerticalV * velo.inclinacionGeneralX + ondaColumna1 + ondaColumna2;

  const anguloTorsion = faseViajera * 1.15 + Math.sin(faseViajera * 0.6) * 0.9;
  const intensidadVortice = (0.4 + 0.6 * Math.pow(0.5 + 0.5 * Math.sin(faseViajera * 1.25), 1.4)) * (0.3 + progresoVerticalV * 0.9);
  const signoU = fibraNormalizadaU >= 0 ? 1 : -1;
  const magnitudCurvatura = Math.pow(Math.abs(fibraNormalizadaU), 1.65);
  const anguloEspiral = anguloTorsion + signoU * magnitudCurvatura * (2.6 * intensidadVortice);

  const radioActual = velo.anchoMaximoVelo * aperturaConica;
  const desplazamientoX =
    radioActual * (fibraNormalizadaU * Math.cos(anguloTorsion) + 0.58 * magnitudCurvatura * Math.sin(anguloEspiral));
  const desplazamientoY =
    radioActual * (0.48 * fibraNormalizadaU * Math.sin(anguloTorsion) - 0.52 * magnitudCurvatura * Math.cos(anguloEspiral));

  return {
    coordenadaX: espinaX + desplazamientoX,
    coordenadaY: baseY + desplazamientoY,
  };
}

function trazarMicroFibraVelo(
  contexto: CanvasRenderingContext2D,
  velo: VeloHumoEspiral,
  fibraNormalizadaU: number,
  altoLienzo: number,
  tiempo: number
): void {
  const pasosVerticales = 52;
  contexto.beginPath();

  const puntoInicial = calcularCoordenadaVeloEspiral(velo, fibraNormalizadaU, 0, altoLienzo, tiempo);
  contexto.moveTo(puntoInicial.coordenadaX, puntoInicial.coordenadaY);

  let puntoPrevio = puntoInicial;
  for (let paso = 1; paso <= pasosVerticales; paso++) {
    const progresoV = paso / pasosVerticales;
    const puntoActual = calcularCoordenadaVeloEspiral(velo, fibraNormalizadaU, progresoV, altoLienzo, tiempo);
    const medioX = (puntoPrevio.coordenadaX + puntoActual.coordenadaX) * 0.5;
    const medioY = (puntoPrevio.coordenadaY + puntoActual.coordenadaY) * 0.5;

    contexto.quadraticCurveTo(puntoPrevio.coordenadaX, puntoPrevio.coordenadaY, medioX, medioY);
    puntoPrevio = puntoActual;
  }
}

function dibujarVeloHumoContraluz(
  contextoDifuso: CanvasRenderingContext2D,
  contextoNitido: CanvasRenderingContext2D,
  velo: VeloHumoEspiral,
  altoLienzo: number,
  tiempo: number,
  coloresTema: ColoresTemaHumo,
  multiplicadorIntensidad: number
): void {
  const cantidadFibras = 28;
  const opacidadEscalada = velo.opacidadVelo * multiplicadorIntensidad;

  const gradienteGasa = contextoNitido.createLinearGradient(0, altoLienzo + 40, 0, -40);
  gradienteGasa.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradienteGasa.addColorStop(0.12, `rgba(${coloresTema.acentoRgb}, ${0.022 * opacidadEscalada})`);
  gradienteGasa.addColorStop(0.5, `rgba(${coloresTema.acentoClaroRgb}, ${0.026 * opacidadEscalada})`);
  gradienteGasa.addColorStop(0.88, `rgba(220, 235, 255, ${0.018 * opacidadEscalada})`);
  gradienteGasa.addColorStop(1, "rgba(0, 0, 0, 0)");

  const gradienteFilamento = contextoNitido.createLinearGradient(0, altoLienzo + 40, 0, -40);
  gradienteFilamento.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradienteFilamento.addColorStop(0.12, `rgba(235, 245, 255, ${0.048 * opacidadEscalada})`);
  gradienteFilamento.addColorStop(0.45, `rgba(${coloresTema.acentoClaroRgb}, ${0.055 * opacidadEscalada})`);
  gradienteFilamento.addColorStop(0.85, `rgba(240, 248, 255, ${0.042 * opacidadEscalada})`);
  gradienteFilamento.addColorStop(1, "rgba(0, 0, 0, 0)");

  contextoDifuso.strokeStyle = `rgba(${coloresTema.acentoRgb}, ${0.065 * opacidadEscalada})`;
  contextoDifuso.lineWidth = 34;
  contextoDifuso.lineCap = "round";
  trazarMicroFibraVelo(contextoDifuso, velo, 0, altoLienzo, tiempo);
  contextoDifuso.stroke();

  contextoNitido.save();
  contextoNitido.globalCompositeOperation = "lighter";
  contextoNitido.lineCap = "round";
  contextoNitido.lineJoin = "round";

  for (let indice = 0; indice < cantidadFibras; indice++) {
    const fibraU = (indice / (cantidadFibras - 1)) * 2 - 1;
    const esBordeRizo = Math.abs(fibraU) > 0.72;

    trazarMicroFibraVelo(contextoNitido, velo, fibraU, altoLienzo, tiempo);
    contextoNitido.strokeStyle = gradienteGasa;
    contextoNitido.lineWidth = 4.2;
    contextoNitido.stroke();

    contextoNitido.strokeStyle = gradienteFilamento;
    contextoNitido.lineWidth = esBordeRizo ? 1.15 : 0.75;
    contextoNitido.stroke();
  }

  contextoNitido.restore();
}

/**
 * Orquestador de los 5 efectos ambientales futuristas sobre doble lienzo (difuso + nítido).
 */
export function FondoHumoSutil({ multiplicadorIntensidad = 1 }: PropiedadesFondoHumoSutil) {
  const [efectoActivo, setEfectoActivo] = useState<TipoEfectoFondo>(obtenerEfectoFondoAlmacenado);
  const referenciaLienzoDifuso = useRef<HTMLCanvasElement>(null);
  const referenciaLienzoNitido = useRef<HTMLCanvasElement>(null);

  // 1. Sincroniza reactivamente el efecto activo ante eventos de cambio
  useEffect(() => {
    const sincronizarEfecto = () => {
      setEfectoActivo(obtenerEfectoFondoAlmacenado());
    };

    window.addEventListener(EVENTO_CAMBIO_EFECTO_FONDO, sincronizarEfecto);
    return () => {
      window.removeEventListener(EVENTO_CAMBIO_EFECTO_FONDO, sincronizarEfecto);
    };
  }, []);

  // 2. Orquestador de animación sobre los lienzos cuando hay un efecto activo
  useEffect(() => {
    if (efectoActivo === "sin-fondo") {
      return;
    }

    const lienzoDifuso = referenciaLienzoDifuso.current;
    const lienzoNitido = referenciaLienzoNitido.current;
    if (!lienzoDifuso || !lienzoNitido) return;

    const contextoDifuso = lienzoDifuso.getContext("2d");
    const contextoNitido = lienzoNitido.getContext("2d");
    if (!contextoDifuso || !contextoNitido) return;

    const prefiereReducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ancho = 0;
    let alto = 0;
    let idAnimacion = 0;
    let tiempo = 0;
    let coloresTema = leerColoresTemaDocumento();
    const posicionMouse = { x: -9999, y: -9999 };

    let listaVelosEspiral: VeloHumoEspiral[] = [];
    let listaMotasBokeh: MotaLuzBokeh[] = [];
    let listaPulsosReticula: PulsoDatosReticula[] = [];
    let listaNodosConstelacion: NodoConstelacion[] = [];

    const inicializarEscena = () => {
      ancho = lienzoDifuso.width = lienzoNitido.width = window.innerWidth;
      alto = lienzoDifuso.height = lienzoNitido.height = window.innerHeight;
      listaVelosEspiral = crearListaVelosHumoEspiral(ancho);
      listaMotasBokeh = crearListaMotasBokeh(ancho, alto);
      listaPulsosReticula = crearListaPulsosReticula(ancho, alto);
      listaNodosConstelacion = crearListaNodosConstelacion(ancho, alto);
    };

    const renderizarFotograma = () => {
      contextoDifuso.clearRect(0, 0, ancho, alto);
      contextoNitido.clearRect(0, 0, ancho, alto);

      tiempo += 0.012;

      if (efectoActivo === "humo-bokeh") {
        for (const velo of listaVelosEspiral) {
          dibujarVeloHumoContraluz(contextoDifuso, contextoNitido, velo, alto, tiempo, coloresTema, multiplicadorIntensidad);
        }
        actualizarYDibujarMotasBokeh(contextoDifuso, contextoNitido, listaMotasBokeh, ancho, alto, tiempo, coloresTema);
      } else if (efectoActivo === "aurora-seda") {
        dibujarOndasAuroraSeda(contextoDifuso, contextoNitido, ancho, alto, tiempo, coloresTema);
        actualizarYDibujarMotasBokeh(contextoDifuso, contextoNitido, listaMotasBokeh, ancho, alto, tiempo, coloresTema);
      } else if (efectoActivo === "rayos-cenitales") {
        dibujarRayosCenitales(contextoDifuso, ancho, alto, tiempo, coloresTema);
        actualizarYDibujarMotasBokeh(contextoDifuso, contextoNitido, listaMotasBokeh, ancho, alto, tiempo, coloresTema);
      } else if (efectoActivo === "reticula-datos") {
        dibujarReticulaCyberGrid(contextoNitido, listaPulsosReticula, ancho, alto, coloresTema);
      } else if (efectoActivo === "constelacion-bruma") {
        dibujarConstelacionReactiva(contextoNitido, listaNodosConstelacion, posicionMouse, ancho, alto, coloresTema);
      }
    };

    const ejecutarBucle = () => {
      renderizarFotograma();
      idAnimacion = requestAnimationFrame(ejecutarBucle);
    };

    const manejarCambioTema = () => {
      coloresTema = leerColoresTemaDocumento();
      if (prefiereReducirMovimiento) {
        renderizarFotograma();
      }
    };

    const manejarMouseMove = (evento: MouseEvent) => {
      posicionMouse.x = evento.clientX;
      posicionMouse.y = evento.clientY;
    };

    const manejarVisibilidad = () => {
      if (document.hidden) {
        cancelAnimationFrame(idAnimacion);
      } else if (!prefiereReducirMovimiento) {
        idAnimacion = requestAnimationFrame(ejecutarBucle);
      }
    };

    inicializarEscena();
    if (prefiereReducirMovimiento) {
      renderizarFotograma();
    } else {
      idAnimacion = requestAnimationFrame(ejecutarBucle);
      window.addEventListener("mousemove", manejarMouseMove, { passive: true });
    }

    window.addEventListener("resize", inicializarEscena);
    window.addEventListener("cambio-tema", manejarCambioTema);
    document.addEventListener("visibilitychange", manejarVisibilidad);

    return () => {
      cancelAnimationFrame(idAnimacion);
      window.removeEventListener("mousemove", manejarMouseMove);
      window.removeEventListener("resize", inicializarEscena);
      window.removeEventListener("cambio-tema", manejarCambioTema);
      document.removeEventListener("visibilitychange", manejarVisibilidad);
    };
  }, [efectoActivo, multiplicadorIntensidad]);

  // Si el usuario selecciona sin fondo, desmontamos por completo los lienzos (0% GPU/CPU)
  if (efectoActivo === "sin-fondo") {
    return null;
  }

  return (
    <>
      <canvas
        ref={referenciaLienzoDifuso}
        aria-hidden="true"
        className="fixed inset-0 w-full h-full pointer-events-none z-0 blur-[14px] opacity-90 lienzo-efecto-ambiental"
      />
      <canvas
        ref={referenciaLienzoNitido}
        aria-hidden="true"
        className="fixed inset-0 w-full h-full pointer-events-none z-0 lienzo-efecto-ambiental"
      />
    </>
  );
}
