import { ConfiguracionContacto, EnlaceRedSocial } from "@/types/Contacto";

/**
 * Fuente única de verdad para los datos de contacto y redes sociales del desarrollador.
 */
export const CONFIGURACION_CONTACTO: ConfiguracionContacto = {
  correo: "pmwebdeveloper79@gmail.com",
  telefono: "+54 9 381 463-6143",
  telefonoFormatoLlamada: "+5493814636143",
  urlWhatsApp: "https://wa.me/5493814636143",
  usuarioLinkedIn: "pablomartinbejas",
  urlLinkedIn: "https://www.linkedin.com/in/pablomartinbejas/",
  usuarioInstagram: "@pablomartin2206",
  urlInstagram: "https://www.instagram.com/pablomartin2206/",
  urlGitHub: "https://github.com/pmbejas",
};

/**
 * Enlaces a redes sociales para navegación y pie de página.
 */
export const REDES_SOCIALES: EnlaceRedSocial[] = [
  {
    nombre: "LinkedIn",
    url: CONFIGURACION_CONTACTO.urlLinkedIn,
    icono: "linkedin",
  },
  {
    nombre: "GitHub",
    url: CONFIGURACION_CONTACTO.urlGitHub,
    icono: "github",
  },
  {
    nombre: "Instagram",
    url: CONFIGURACION_CONTACTO.urlInstagram,
    icono: "instagram",
  },
];

export const EMPRESAS_TECNOLOGIAS = [
  { nombre: "Next.js" },
  { nombre: "React" },
  { nombre: "TypeScript" },
  { nombre: "Node.js" },
  { nombre: "PostgreSQL" },
  { nombre: "Tailwind CSS" },
];
