import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const ruteo = defineRouting({
  locales: ["es", "en", "pt"],
  defaultLocale: "es",
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(ruteo);

