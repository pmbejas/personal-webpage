import createMiddleware from "next-intl/middleware";
import { ruteo } from "./i18n/routing";

export default createMiddleware(ruteo);

export const config = {
  // Matchear todas las rutas localizadas excluyendo api, archivos internos de Next/Vercel y activos estáticos
  matcher: ["/", "/(es|en|pt)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};

