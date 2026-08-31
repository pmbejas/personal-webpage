import createMiddleware from "next-intl/middleware";
import { ruteo } from "./i18n/routing";

export default createMiddleware(ruteo);

export const config = {
  // Matchear todas las rutas excepto archivos estáticos, api y favicons
  matcher: ["/", "/(es|en|pt)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};

