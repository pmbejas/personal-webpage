import { getRequestConfig } from "next-intl/server";
import { ruteo } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validar que el idioma recibido sea soportado; de lo contrario, usar el por defecto (es)
  if (!locale || !ruteo.locales.includes(locale as "es" | "en" | "pt")) {
    locale = ruteo.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

