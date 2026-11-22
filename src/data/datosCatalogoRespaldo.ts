import { CatalogoPublicoResponse } from "@/types/Catalogo";

const ID_SERVICIO_LANDING = "5dd49148-7678-41e9-ab45-64bf6695e41f";
const ID_SERVICIO_INSTITUCIONAL = "6a0be1df-6a7d-4fdf-abdb-16e4dcb364fa";
const ID_SERVICIO_SAAS = "9b91162c-3bf3-4b7c-bec8-ad07ea437289";

const ID_GRUPO_DISENO = "a692fde7-6882-4a0a-82e7-f501d1ab5938";
const ID_GRUPO_FUNCIONALIDADES = "0d0667b4-6fea-47f9-b5ba-9e70725774fc";
const ID_GRUPO_INTEGRACIONES = "3041b7ad-d2bb-4047-bbb4-b74e69b2f7ef";
const ID_GRUPO_INFRAESTRUCTURA = "f9f6ae9e-bba2-403b-b97a-35faeae9de3d";

const ID_ADICIONAL_TEMA = "48e42a91-95da-409c-87d1-f869db098809";
const ID_ADICIONAL_ANIMACIONES = "dac0a800-b70e-4a1b-873f-d3cf2fe5294c";
const ID_ADICIONAL_BLOG = "0c4bc364-27a2-499e-88ca-190b16337cb1";
const ID_ADICIONAL_CITAS = "9141cd4f-87ba-4f89-9fb8-a879d6430146";
const ID_ADICIONAL_COTIZADOR = "c0757cfd-700f-4c1d-b0c0-ebb80a6916e7";
const ID_ADICIONAL_WHATSAPP = "2e0f36d5-905a-4a6b-922c-246a510a2d15";
const ID_ADICIONAL_EMAIL = "52c86d06-f022-4614-b607-eedbe1632407";
const ID_ADICIONAL_SEO = "86b6b925-bd1f-4ea9-b8a1-374be4a0d567";
const ID_ADICIONAL_MANTENIMIENTO = "f7ec24b3-67c6-4029-91b6-97410fe348c4";

/**
 * Catálogo estático de respaldo sincronizado con InicializadorCatalogo.cs del Backend.
 * Garantiza disponibilidad ininterrumpida durante compilaciones en Vercel (next build)
 * o cuando el contenedor gratuito de Render se encuentra despertando de un cold start.
 */
export const CATALOGO_RESPALDO_LOCAL: CatalogoPublicoResponse = {
  servicios: [
    {
      id: ID_SERVICIO_LANDING,
      clave: "landing-page",
      nombre: "Landing Page Comercial",
      descripcionComercial:
        "Página web de alta conversión diseñada estratégicamente para captación de leads, venta de un producto/servicio o lanzamiento. Incluye diseño responsive prémium, animaciones sutiles y llamado a la acción directo.",
      precioBase: 180000,
      diasEntregaBase: 5,
      seccionesIncluidas: 4,
      permiteSeccionesExtra: true,
      precioSeccionExtra: 25000,
      diasPorSeccionExtra: 1,
      ordenVisualizacion: 1,
      adicionalesCompatiblesIds: [
        ID_ADICIONAL_TEMA,
        ID_ADICIONAL_ANIMACIONES,
        ID_ADICIONAL_WHATSAPP,
        ID_ADICIONAL_EMAIL,
        ID_ADICIONAL_SEO,
        ID_ADICIONAL_MANTENIMIENTO,
      ],
    },
    {
      id: ID_SERVICIO_INSTITUCIONAL,
      clave: "sitio-web-institucional",
      nombre: "Sitio Web Institucional",
      descripcionComercial:
        "Sitio multipágina corporativo para empresas y profesionales que buscan transmitir solidez y credibilidad. Incluye arquitectura moderna, secciones completas (Home, Quiénes Somos, Servicios, Contacto) y optimización SEO básica.",
      precioBase: 320000,
      diasEntregaBase: 10,
      seccionesIncluidas: 6,
      permiteSeccionesExtra: true,
      precioSeccionExtra: 30000,
      diasPorSeccionExtra: 1,
      ordenVisualizacion: 2,
      adicionalesCompatiblesIds: [
        ID_ADICIONAL_TEMA,
        ID_ADICIONAL_ANIMACIONES,
        ID_ADICIONAL_BLOG,
        ID_ADICIONAL_CITAS,
        ID_ADICIONAL_WHATSAPP,
        ID_ADICIONAL_EMAIL,
        ID_ADICIONAL_SEO,
        ID_ADICIONAL_MANTENIMIENTO,
      ],
    },
    {
      id: ID_SERVICIO_SAAS,
      clave: "sistema-web-saas",
      nombre: "Aplicación Web / SaaS a Medida",
      descripcionComercial:
        "Plataforma web personalizada con panel administrativo, autenticación de usuarios, base de datos relacional y lógica de negocio avanzada. Ideal para digitalizar procesos internos, sistemas de turnos o portales privados.",
      precioBase: 650000,
      diasEntregaBase: 20,
      seccionesIncluidas: 8,
      permiteSeccionesExtra: true,
      precioSeccionExtra: 45000,
      diasPorSeccionExtra: 2,
      ordenVisualizacion: 3,
      adicionalesCompatiblesIds: [
        ID_ADICIONAL_TEMA,
        ID_ADICIONAL_ANIMACIONES,
        ID_ADICIONAL_BLOG,
        ID_ADICIONAL_CITAS,
        ID_ADICIONAL_COTIZADOR,
        ID_ADICIONAL_WHATSAPP,
        ID_ADICIONAL_EMAIL,
        ID_ADICIONAL_SEO,
        ID_ADICIONAL_MANTENIMIENTO,
      ],
    },
  ],
  gruposAdicionales: [
    {
      id: ID_GRUPO_DISENO,
      clave: "diseno-ux",
      nombre: "Diseño & Experiencia de Usuario",
      descripcion: "Personalización visual, efectos e identidad de marca.",
      ordenVisualizacion: 1,
      adicionales: [
        {
          id: ID_ADICIONAL_TEMA,
          grupoId: ID_GRUPO_DISENO,
          clave: "tema-personalizado",
          nombre: "Tema Neón Personalizado y Modo Oscuro",
          descripcionComercial: "Paleta de colores adaptativa con acentos neón y conmutador visual.",
          precio: 35000,
          diasEntregaExtra: 1,
          esRecurrente: false,
          ordenVisualizacion: 1,
        },
        {
          id: ID_ADICIONAL_ANIMACIONES,
          grupoId: ID_GRUPO_DISENO,
          clave: "animaciones-framer",
          nombre: "Microinteracciones y Animaciones Fluidas",
          descripcionComercial: "Efectos visuales modernos al scrollear (Framer Motion).",
          precio: 45000,
          diasEntregaExtra: 2,
          esRecurrente: false,
          ordenVisualizacion: 2,
        },
      ],
    },
    {
      id: ID_GRUPO_FUNCIONALIDADES,
      clave: "funcionalidades",
      nombre: "Funcionalidades & Módulos",
      descripcion: "Herramientas interactivas para potenciar tu plataforma.",
      ordenVisualizacion: 2,
      adicionales: [
        {
          id: ID_ADICIONAL_BLOG,
          grupoId: ID_GRUPO_FUNCIONALIDADES,
          clave: "blog-autoadministrable",
          nombre: "Módulo de Blog / Novedades Autoadministrable",
          descripcionComercial: "Sección dinámica para publicar artículos y novedades corporativas.",
          precio: 75000,
          diasEntregaExtra: 4,
          esRecurrente: false,
          ordenVisualizacion: 1,
        },
        {
          id: ID_ADICIONAL_CITAS,
          grupoId: ID_GRUPO_FUNCIONALIDADES,
          clave: "sistema-citas",
          nombre: "Agenda y Gestión de Citas Asistidas",
          descripcionComercial: "Calendario de solicitud de reuniones con recordatorios automáticos.",
          precio: 90000,
          diasEntregaExtra: 5,
          esRecurrente: false,
          ordenVisualizacion: 2,
        },
        {
          id: ID_ADICIONAL_COTIZADOR,
          grupoId: ID_GRUPO_FUNCIONALIDADES,
          clave: "cotizador-interactivo",
          nombre: "Cotizador Interactivo Dinámico",
          descripcionComercial: "Calculadora interactiva de presupuestos con generación de PDF.",
          precio: 85000,
          diasEntregaExtra: 4,
          esRecurrente: false,
          ordenVisualizacion: 3,
        },
      ],
    },
    {
      id: ID_GRUPO_INTEGRACIONES,
      clave: "integraciones",
      nombre: "Integraciones & Comunicación",
      descripcion: "Conectividad con canales de mensajería y servicios externos.",
      ordenVisualizacion: 3,
      adicionales: [
        {
          id: ID_ADICIONAL_WHATSAPP,
          grupoId: ID_GRUPO_INTEGRACIONES,
          clave: "whatsapp-automatizado",
          nombre: "WhatsApp Directo con Mensajes Prearmados",
          descripcionComercial: "Botones flotantes con enlace universal (wa.me) y contexto del usuario.",
          precio: 30000,
          diasEntregaExtra: 1,
          esRecurrente: false,
          ordenVisualizacion: 1,
        },
        {
          id: ID_ADICIONAL_EMAIL,
          grupoId: ID_GRUPO_INTEGRACIONES,
          clave: "email-transaccional-resend",
          nombre: "Emails Transaccionales con Resend y Adjuntos PDF",
          descripcionComercial: "Notificaciones automáticas por correo con cotizaciones y confirmaciones.",
          precio: 45000,
          diasEntregaExtra: 2,
          esRecurrente: false,
          ordenVisualizacion: 2,
        },
      ],
    },
    {
      id: ID_GRUPO_INFRAESTRUCTURA,
      clave: "infraestructura",
      nombre: "Infraestructura & Soporte",
      descripcion: "Optimización técnica, velocidad y mantenimiento continuo.",
      ordenVisualizacion: 4,
      adicionales: [
        {
          id: ID_ADICIONAL_SEO,
          grupoId: ID_GRUPO_INFRAESTRUCTURA,
          clave: "seo-tecnico-avanzado",
          nombre: "Optimización SEO Técnica y Microdatos",
          descripcionComercial: "Configuración de OpenGraph, Twitter Cards y etiquetas estructuradas Schema.org.",
          precio: 40000,
          diasEntregaExtra: 2,
          esRecurrente: false,
          ordenVisualizacion: 1,
        },
        {
          id: ID_ADICIONAL_MANTENIMIENTO,
          grupoId: ID_GRUPO_INFRAESTRUCTURA,
          clave: "mantenimiento-mensual",
          nombre: "Soporte, Actualizaciones y Backup Mensual",
          descripcionComercial: "Monitoreo continuo de disponibilidad, parches y copias de seguridad.",
          precio: 35000,
          diasEntregaExtra: 0,
          esRecurrente: true,
          ordenVisualizacion: 2,
        },
      ],
    },
  ],
  promocionesActivas: [
    {
      id: "e4d96522-c260-42e6-b863-11d4e09aa13e",
      clave: "lanzamiento-web",
      nombre: "Promoción Lanzamiento Web",
      textoBanner: "🚀 15% OFF LANZAMIENTO",
      tipoDescuento: "Porcentaje",
      valorDescuento: 15,
      servicioBaseId: null,
      fechaFin: "2027-01-05T05:01:32.703354Z",
    },
  ],
};
