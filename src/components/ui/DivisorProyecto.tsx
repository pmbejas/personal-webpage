/**
 * Divisor "Línea de escaneo" entre proyectos (opción C elegida en la demo):
 * pista tenue con topes en los extremos, nodo central y un haz de luz que
 * la recorre de punta a punta, como la línea de escaneo del retrato.
 * Es puramente decorativo y sus acentos siguen el tema activo del sitio.
 * Con "reducir movimiento" activado el haz queda fuera de la pista (el
 * left base es -15% y sin animación nunca entra en pantalla).
 */
export function DivisorProyecto() {
  return (
    <div aria-hidden="true" className="relative block h-[3px] my-6 md:my-8 w-full max-w-full">
      {/* Pista principal y haz confinado entre los dos topes */}
      <div className="absolute inset-x-0 top-0 h-full overflow-hidden">
        <span className="absolute inset-x-0 top-px h-px bg-slate-400/20" />

        {/* Haz de luz que recorre la pista estrictamente dentro de los topes */}
        <span className="animate-barrido absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-[72px] bg-gradient-to-r from-transparent via-blue-400 to-transparent drop-shadow-[0_0_6px_rgb(var(--tema-acento-claro-rgb)/0.9)] opacity-0" />
      </div>

      {/* Topes de los extremos (fuera de overflow-hidden para mantener sus 9px de altura) */}
      <span className="absolute -top-[3px] left-0 h-[9px] w-px bg-blue-500/50" />
      <span className="absolute -top-[3px] right-0 h-[9px] w-px bg-blue-500/50" />

      {/* Nodo central */}
      <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-[1.5px] border-blue-400 bg-[#1c171b] shadow-[0_0_10px_rgb(var(--tema-acento-claro-rgb)/0.6)]" />
    </div>
  );
}
