"use client";

import { useEffect, useState } from "react";

type TemaDisponible = "azul" | "verde" | "naranja";

/* Temas disponibles con el gradiente de cada swatch */
const TEMAS_DISPONIBLES: { valor: TemaDisponible; nombre: string; gradiente: string }[] = [
  { valor: "azul", nombre: "Azul", gradiente: "linear-gradient(135deg,#2563EB,#60A5FA)" },
  { valor: "verde", nombre: "Verde menta", gradiente: "linear-gradient(135deg,#059669,#6EE7B7)" },
  { valor: "naranja", nombre: "Naranja pastel", gradiente: "linear-gradient(135deg,#E79150,#FDD9B4)" },
];

const CLAVE_ALMACENAMIENTO = "tema";

/**
 * Selector de tema de color del sitio (azul, verde menta y naranja pastel).
 * Aplica el atributo data-tema en <html>, lo persiste en localStorage y
 * emite el evento "cambio-tema" para que las partículas se recoloreen.
 */
export function SelectorTema() {
  const [temaActivo, setTemaActivo] = useState<TemaDisponible>("azul");

  // Recuperar el tema guardado al montar el componente
  useEffect(() => {
    const temaGuardado = localStorage.getItem(CLAVE_ALMACENAMIENTO) as TemaDisponible | null;
    if (temaGuardado) {
      setTemaActivo(temaGuardado);
    }
  }, []);

  const aplicarTema = (tema: TemaDisponible) => {
    setTemaActivo(tema);
    document.documentElement.setAttribute("data-tema", tema);
    localStorage.setItem(CLAVE_ALMACENAMIENTO, tema);
    window.dispatchEvent(new Event("cambio-tema"));
  };

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 border border-slate-800 px-2.5 py-1"
      role="group"
      aria-label="Seleccionar tema de color"
    >
      {TEMAS_DISPONIBLES.map((tema) => (
        <button
          key={tema.valor}
          type="button"
          onClick={() => aplicarTema(tema.valor)}
          aria-label={`Tema ${tema.nombre}`}
          aria-pressed={temaActivo === tema.valor}
          className={`h-4 w-4 rounded-full cursor-pointer transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500/60 ${
            temaActivo === tema.valor
              ? "ring-2 ring-white/80 ring-offset-2 ring-offset-slate-900"
              : ""
          }`}
          style={{ background: tema.gradiente }}
        />
      ))}
    </div>
  );
}
