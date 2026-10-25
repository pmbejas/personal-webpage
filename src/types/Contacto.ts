/** Estructura unificada para todos los canales de contacto directo y redes */
export interface ConfiguracionContacto {
  correo: string;
  telefono: string;
  telefonoFormatoLlamada: string;
  urlWhatsApp: string;
  usuarioLinkedIn: string;
  urlLinkedIn: string;
  usuarioInstagram: string;
  urlInstagram: string;
  urlGitHub: string;
}

/** Representación de cada enlace a red social para listados o pie de página */
export interface EnlaceRedSocial {
  nombre: string;
  url: string;
  icono: "linkedin" | "github" | "instagram";
}
