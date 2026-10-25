import Link from "next/link";

export default function PaginaNoEncontrada() {
  return (
    <html lang="es" className="dark">
      <body className="bg-[#1c171b] text-white min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-extrabold text-blue-500 mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-2">Página no encontrada</h2>
          <p className="text-slate-400 mb-6">
            La página que buscas no existe o ha sido movida.
          </p>
          <Link
            href="/es"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </body>
    </html>
  );
}

