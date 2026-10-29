import { ReactNode } from "react";

/**
 * Layout raíz global de Next.js App Router.
 * Requerido para dar soporte a páginas globales a nivel raíz (como not-found.tsx)
 * mientras delega la estructura HTML localizada a [locale]/layout.tsx.
 */
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

