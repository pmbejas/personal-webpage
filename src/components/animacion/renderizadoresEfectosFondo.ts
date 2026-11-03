import { ColoresTemaHumo } from "./tiposEfectoFondo";

export interface MotaLuzBokeh {
  coordenadaX: number;
  coordenadaY: number;
  velocidadX: number;
  velocidadY: number;
  radioMota: number;
  opacidadMaxima: number;
  faseParpadeo: number;
  tipoProfundidad: "fondo-difuso" | "medio-suave" | "frente-nitido";
}

export interface PulsoDatosReticula {
  coordenadaX: number;
  coordenadaY: number;
  esHorizontal: boolean;
  velocidadPulso: number;
  longitudEstela: number;
  opacidadPulso: number;
}

export interface NodoConstelacion {
  coordenadaX: number;
  coordenadaY: number;
  velocidadX: number;
  velocidadY: number;
  radioNodo: number;
}

const PASO_RETICULA_PIXELES = 72;

export function crearListaMotasBokeh(ancho: number, alto: number): MotaLuzBokeh[] {
  const cantidad = ancho < 768 ? 28 : 54;
  const listaMotas: MotaLuzBokeh[] = [];

  for (let indice = 0; indice < cantidad; indice++) {
    let tipoProfundidad: MotaLuzBokeh["tipoProfundidad"] = "frente-nitido";
    let radioMota = 1.2 + Math.random() * 1.6;
    let opacidadMaxima = 0.5 + Math.random() * 0.4;

    if (indice % 5 === 0) {
      tipoProfundidad = "fondo-difuso";
      radioMota = 16 + Math.random() * 24;
      opacidadMaxima = 0.12 + Math.random() * 0.1;
    } else if (indice % 3 === 0) {
      tipoProfundidad = "medio-suave";
      radioMota = 4 + Math.random() * 5;
      opacidadMaxima = 0.22 + Math.random() * 0.16;
    }

    listaMotas.push({
      coordenadaX: Math.random() * ancho,
      coordenadaY: Math.random() * alto,
      velocidadX: (Math.random() - 0.5) * 0.2,
      velocidadY: -(0.14 + Math.random() * 0.3),
      radioMota,
      opacidadMaxima,
      faseParpadeo: Math.random() * Math.PI * 2,
      tipoProfundidad,
    });
  }

  return listaMotas;
}

export function actualizarYDibujarMotasBokeh(
  contextoDifuso: CanvasRenderingContext2D,
  contextoNitido: CanvasRenderingContext2D,
  listaMotas: MotaLuzBokeh[],
  ancho: number,
  alto: number,
  tiempo: number,
  colores: ColoresTemaHumo
): void {
  for (const mota of listaMotas) {
    mota.coordenadaX += mota.velocidadX + Math.sin(tiempo * 0.65 + mota.faseParpadeo) * 0.14;
    mota.coordenadaY += mota.velocidadY;

    if (mota.coordenadaY < -40) {
      mota.coordenadaY = alto + 35;
      mota.coordenadaX = Math.random() * ancho;
    }

    const factorParpadeo = 0.5 + 0.5 * Math.sin(tiempo * 1.5 + mota.faseParpadeo);
    const opacidadActual = mota.opacidadMaxima * factorParpadeo;

    if (mota.tipoProfundidad === "fondo-difuso") {
      contextoDifuso.beginPath();
      contextoDifuso.arc(mota.coordenadaX, mota.coordenadaY, mota.radioMota, 0, Math.PI * 2);
      contextoDifuso.fillStyle = `rgba(${colores.acentoClaroRgb}, ${opacidadActual})`;
      contextoDifuso.fill();
    } else if (mota.tipoProfundidad === "medio-suave") {
      const gradienteOrbe = contextoNitido.createRadialGradient(
        mota.coordenadaX,
        mota.coordenadaY,
        0,
        mota.coordenadaX,
        mota.coordenadaY,
        mota.radioMota
      );
      gradienteOrbe.addColorStop(0, `rgba(255, 255, 255, ${opacidadActual})`);
      gradienteOrbe.addColorStop(0.5, `rgba(${colores.acentoClaroRgb}, ${opacidadActual * 0.7})`);
      gradienteOrbe.addColorStop(1, "rgba(0, 0, 0, 0)");

      contextoNitido.fillStyle = gradienteOrbe;
      contextoNitido.beginPath();
      contextoNitido.arc(mota.coordenadaX, mota.coordenadaY, mota.radioMota, 0, Math.PI * 2);
      contextoNitido.fill();
    } else {
      contextoNitido.beginPath();
      contextoNitido.arc(mota.coordenadaX, mota.coordenadaY, mota.radioMota, 0, Math.PI * 2);
      contextoNitido.fillStyle = `rgba(245, 250, 255, ${opacidadActual})`;
      contextoNitido.fill();
    }
  }
}

function dibujarCortinaBorealIndividual(
  contextoDifuso: CanvasRenderingContext2D,
  contextoNitido: CanvasRenderingContext2D,
  ancho: number,
  alturaBaseCortina: number,
  tiempo: number,
  desfaseCortina: number,
  colores: ColoresTemaHumo
): void {
  const pasoHorizontal = ancho < 768 ? 16 : 12;

  for (let coordX = -20; coordX <= ancho + 20; coordX += pasoHorizontal) {
    const ondaPrincipal = Math.sin(coordX * 0.0026 + tiempo * 0.38 + desfaseCortina) * 62;
    const ondaSecundaria = Math.cos(coordX * 0.0062 - tiempo * 0.26 + desfaseCortina * 1.4) * 28;
    const crestaInferiorY = alturaBaseCortina + ondaPrincipal + ondaSecundaria;

    const modulacionRayo =
      0.5 +
      0.5 *
        Math.sin(
          coordX * 0.019 - tiempo * 0.85 + Math.sin(coordX * 0.0045 + tiempo * 0.25) * 2.8 + desfaseCortina
        );
    const intensidadRayo = Math.pow(modulacionRayo, 1.5);
    const alturaRayoVertical = 110 + intensidadRayo * 210;
    const inclinacionSuperiorX = coordX + Math.sin(tiempo * 0.2 + coordX * 0.002) * 26;
    const opacidadRayo = (0.04 + intensidadRayo * 0.14) * (desfaseCortina === 0 ? 1 : 0.75);

    const gradienteRayo = contextoNitido.createLinearGradient(
      coordX,
      crestaInferiorY + 18,
      inclinacionSuperiorX,
      crestaInferiorY - alturaRayoVertical
    );
    gradienteRayo.addColorStop(0, "rgba(0, 0, 0, 0)");
    gradienteRayo.addColorStop(0.14, `rgba(220, 255, 245, ${opacidadRayo * 1.15})`);
    gradienteRayo.addColorStop(0.32, `rgba(${colores.acentoClaroRgb}, ${opacidadRayo})`);
    gradienteRayo.addColorStop(0.68, `rgba(${colores.acentoRgb}, ${opacidadRayo * 0.55})`);
    gradienteRayo.addColorStop(0.9, `rgba(139, 92, 246, ${opacidadRayo * 0.28})`);
    gradienteRayo.addColorStop(1, "rgba(0, 0, 0, 0)");

    contextoNitido.strokeStyle = gradienteRayo;
    contextoNitido.lineWidth = pasoHorizontal * 0.85;
    contextoNitido.lineCap = "round";
    contextoNitido.beginPath();
    contextoNitido.moveTo(coordX, crestaInferiorY + 14);
    contextoNitido.lineTo(inclinacionSuperiorX, crestaInferiorY - alturaRayoVertical);
    contextoNitido.stroke();

    if (coordX % (pasoHorizontal * 3) === 0) {
      contextoDifuso.strokeStyle = `rgba(${colores.acentoClaroRgb}, ${opacidadRayo * 0.55})`;
      contextoDifuso.lineWidth = pasoHorizontal * 2.6;
      contextoDifuso.beginPath();
      contextoDifuso.moveTo(coordX, crestaInferiorY);
      contextoDifuso.lineTo(inclinacionSuperiorX, crestaInferiorY - alturaRayoVertical * 0.75);
      contextoDifuso.stroke();
    }
  }
}

export function dibujarOndasAuroraSeda(
  contextoDifuso: CanvasRenderingContext2D,
  contextoNitido: CanvasRenderingContext2D,
  ancho: number,
  alto: number,
  tiempo: number,
  colores: ColoresTemaHumo
): void {
  dibujarCortinaBorealIndividual(contextoDifuso, contextoNitido, ancho, alto * 0.42, tiempo, 0, colores);
  dibujarCortinaBorealIndividual(contextoDifuso, contextoNitido, ancho, alto * 0.68, tiempo, 2.4, colores);
}

export function dibujarRayosCenitales(
  contextoDifuso: CanvasRenderingContext2D,
  ancho: number,
  alto: number,
  tiempo: number,
  colores: ColoresTemaHumo
): void {
  const posicionesOrigenX = [ancho * 0.18, ancho * 0.5, ancho * 0.82];

  posicionesOrigenX.forEach((origenX, indice) => {
    const oscilacion = Math.sin(tiempo * 0.35 + indice * 1.7) * 65;
    const destinoInferiorX = origenX + 180 + oscilacion;
    const anchoSuperior = 90 + indice * 20;
    const anchoInferior = 290 + indice * 45;
    const opacidadHaz = (0.095 + 0.03 * Math.sin(tiempo * 0.5 + indice)) * 1.15;

    const gradienteHaz = contextoDifuso.createLinearGradient(origenX, 0, destinoInferiorX, alto * 0.94);
    gradienteHaz.addColorStop(0, `rgba(${colores.acentoClaroRgb}, ${opacidadHaz * 1.4})`);
    gradienteHaz.addColorStop(0.45, `rgba(${colores.acentoRgb}, ${opacidadHaz * 0.8})`);
    gradienteHaz.addColorStop(0.8, `rgba(225, 232, 245, ${opacidadHaz * 0.32})`);
    gradienteHaz.addColorStop(1, "rgba(7, 6, 6, 0)");

    contextoDifuso.fillStyle = gradienteHaz;
    contextoDifuso.beginPath();
    contextoDifuso.moveTo(origenX - anchoSuperior * 0.5, -20);
    contextoDifuso.lineTo(origenX + anchoSuperior * 0.5, -20);
    contextoDifuso.lineTo(destinoInferiorX + anchoInferior * 0.5, alto * 0.96);
    contextoDifuso.lineTo(destinoInferiorX - anchoInferior * 0.5, alto * 0.96);
    contextoDifuso.closePath();
    contextoDifuso.fill();
  });
}

export function crearListaPulsosReticula(ancho: number, alto: number): PulsoDatosReticula[] {
  const cantidadPulsos = ancho < 768 ? 8 : 14;
  const listaPulsos: PulsoDatosReticula[] = [];

  for (let indice = 0; indice < cantidadPulsos; indice++) {
    const esHorizontal = indice % 2 === 0;
    const filaAlineada = Math.floor((Math.random() * alto) / PASO_RETICULA_PIXELES) * PASO_RETICULA_PIXELES;
    const columnaAlineada = Math.floor((Math.random() * ancho) / PASO_RETICULA_PIXELES) * PASO_RETICULA_PIXELES;

    listaPulsos.push({
      coordenadaX: esHorizontal ? Math.random() * ancho : columnaAlineada,
      coordenadaY: esHorizontal ? filaAlineada : Math.random() * alto,
      esHorizontal,
      velocidadPulso: 1.2 + Math.random() * 1.4,
      longitudEstela: 95 + Math.random() * 75,
      opacidadPulso: 0.38 + Math.random() * 0.28,
    });
  }

  return listaPulsos;
}

export function dibujarReticulaCyberGrid(
  contextoNitido: CanvasRenderingContext2D,
  listaPulsos: PulsoDatosReticula[],
  ancho: number,
  alto: number,
  colores: ColoresTemaHumo
): void {
  contextoNitido.strokeStyle = `rgba(${colores.acentoRgb}, 0.06)`;
  contextoNitido.lineWidth = 1;

  for (let x = 0; x < ancho; x += PASO_RETICULA_PIXELES) {
    contextoNitido.beginPath();
    contextoNitido.moveTo(x, 0);
    contextoNitido.lineTo(x, alto);
    contextoNitido.stroke();
  }

  for (let y = 0; y < alto; y += PASO_RETICULA_PIXELES) {
    contextoNitido.beginPath();
    contextoNitido.moveTo(0, y);
    contextoNitido.lineTo(ancho, y);
    contextoNitido.stroke();
  }

  for (const pulso of listaPulsos) {
    if (pulso.esHorizontal) {
      pulso.coordenadaX += pulso.velocidadPulso;
      if (pulso.coordenadaX - pulso.longitudEstela > ancho) {
        pulso.coordenadaX = -20;
        pulso.coordenadaY = Math.floor((Math.random() * alto) / PASO_RETICULA_PIXELES) * PASO_RETICULA_PIXELES;
      }
    } else {
      pulso.coordenadaY += pulso.velocidadPulso;
      if (pulso.coordenadaY - pulso.longitudEstela > alto) {
        pulso.coordenadaY = -20;
        pulso.coordenadaX = Math.floor((Math.random() * ancho) / PASO_RETICULA_PIXELES) * PASO_RETICULA_PIXELES;
      }
    }

    const colaX = pulso.esHorizontal ? pulso.coordenadaX - pulso.longitudEstela : pulso.coordenadaX;
    const colaY = pulso.esHorizontal ? pulso.coordenadaY : pulso.coordenadaY - pulso.longitudEstela;

    const gradienteEstela = contextoNitido.createLinearGradient(
      colaX,
      colaY,
      pulso.coordenadaX,
      pulso.coordenadaY
    );
    gradienteEstela.addColorStop(0, "rgba(7, 6, 6, 0)");
    gradienteEstela.addColorStop(0.7, `rgba(${colores.acentoRgb}, ${pulso.opacidadPulso * 0.65})`);
    gradienteEstela.addColorStop(1, `rgba(255, 255, 255, ${pulso.opacidadPulso})`);

    contextoNitido.strokeStyle = gradienteEstela;
    contextoNitido.lineWidth = 2;
    contextoNitido.beginPath();
    contextoNitido.moveTo(colaX, colaY);
    contextoNitido.lineTo(pulso.coordenadaX, pulso.coordenadaY);
    contextoNitido.stroke();
  }
}

export function crearListaNodosConstelacion(ancho: number, alto: number): NodoConstelacion[] {
  const cantidadNodos = Math.min(60, Math.floor((ancho * alto) / 22000));
  const listaNodos: NodoConstelacion[] = [];

  for (let indice = 0; indice < cantidadNodos; indice++) {
    listaNodos.push({
      coordenadaX: Math.random() * ancho,
      coordenadaY: Math.random() * alto,
      velocidadX: (Math.random() - 0.5) * 0.32,
      velocidadY: (Math.random() - 0.5) * 0.32,
      radioNodo: 1.3 + Math.random() * 1.5,
    });
  }

  return listaNodos;
}

export function dibujarConstelacionReactiva(
  contextoNitido: CanvasRenderingContext2D,
  listaNodos: NodoConstelacion[],
  posicionMouse: { x: number; y: number },
  ancho: number,
  alto: number,
  colores: ColoresTemaHumo
): void {
  for (const nodo of listaNodos) {
    nodo.coordenadaX += nodo.velocidadX;
    nodo.coordenadaY += nodo.velocidadY;
    if (nodo.coordenadaX < 0) nodo.coordenadaX = ancho;
    if (nodo.coordenadaX > ancho) nodo.coordenadaX = 0;
    if (nodo.coordenadaY < 0) nodo.coordenadaY = alto;
    if (nodo.coordenadaY > alto) nodo.coordenadaY = 0;

    contextoNitido.beginPath();
    contextoNitido.arc(nodo.coordenadaX, nodo.coordenadaY, nodo.radioNodo, 0, Math.PI * 2);
    contextoNitido.fillStyle = `rgba(${colores.acentoClaroRgb}, 0.72)`;
    contextoNitido.fill();
  }

  for (let i = 0; i < listaNodos.length; i++) {
    for (let j = i + 1; j < listaNodos.length; j++) {
      const dist = Math.hypot(
        listaNodos[i].coordenadaX - listaNodos[j].coordenadaX,
        listaNodos[i].coordenadaY - listaNodos[j].coordenadaY
      );
      if (dist < 140) {
        contextoNitido.strokeStyle = `rgba(${colores.acentoRgb}, ${(1 - dist / 140) * 0.28})`;
        contextoNitido.lineWidth = 1;
        contextoNitido.beginPath();
        contextoNitido.moveTo(listaNodos[i].coordenadaX, listaNodos[i].coordenadaY);
        contextoNitido.lineTo(listaNodos[j].coordenadaX, listaNodos[j].coordenadaY);
        contextoNitido.stroke();
      }
    }

    const distMouse = Math.hypot(
      listaNodos[i].coordenadaX - posicionMouse.x,
      listaNodos[i].coordenadaY - posicionMouse.y
    );
    if (distMouse < 180) {
      contextoNitido.strokeStyle = `rgba(${colores.acentoClaroRgb}, ${(1 - distMouse / 180) * 0.48})`;
      contextoNitido.lineWidth = 1.15;
      contextoNitido.beginPath();
      contextoNitido.moveTo(listaNodos[i].coordenadaX, listaNodos[i].coordenadaY);
      contextoNitido.lineTo(posicionMouse.x, posicionMouse.y);
      contextoNitido.stroke();
    }
  }
}
