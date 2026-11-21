/**
 * Formatea un valor numérico como moneda en Pesos Argentinos (ARS) sin decimales superfluos.
 * Ejemplo: 180000 -> "$ 180.000"
 */
export function formatearMonedaArs(monto: number): string {
  const montoRedondeado = Math.round(monto);
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(montoRedondeado);
}

/**
 * Diccionario de traducciones para ítems del catálogo oficial cuando el usuario navega en inglés o portugués.
 * Si una clave no figura aquí (por ejemplo, un servicio nuevo creado desde el ERP), se utiliza el texto de Neon PostgreSQL.
 */
interface TraduccionItemCatalogo {
  nombre: string;
  descripcion: string;
}

const TRADUCCIONES_CATALOGO_POR_IDIOMA: Record<
  "en" | "pt",
  Record<string, TraduccionItemCatalogo>
> = {
  en: {
    "landing-page": {
      nombre: "Commercial Landing Page",
      descripcion:
        "High-conversion web page strategically engineered for lead generation, product launches, or service sales. Includes premium responsive design, subtle animations, and direct call-to-action.",
    },
    "sitio-web-institucional": {
      nombre: "Institutional Corporate Website",
      descripcion:
        "Multi-page corporate website for companies and professionals seeking authority and credibility. Includes modern architecture, complete sections (Home, About, Services, Contact), and core SEO.",
    },
    "sistema-web-saas": {
      nombre: "Custom Web Application / SaaS",
      descripcion:
        "Custom web platform with administrative dashboard, user authentication, relational database, and advanced business logic. Ideal for digitizing operations, booking systems, or private portals.",
    },
    "diseno-ux": {
      nombre: "Design & User Experience",
      descripcion: "Visual customization, interactive effects, and brand identity.",
    },
    funcionalidades: {
      nombre: "Features & Modules",
      descripcion: "Interactive tools to empower your platform.",
    },
    integraciones: {
      nombre: "Integrations & Communication",
      descripcion: "Connectivity with messaging channels and external services.",
    },
    infraestructura: {
      nombre: "Infrastructure & Support",
      descripcion: "Technical optimization, speed, and ongoing maintenance.",
    },
    "tema-personalizado": {
      nombre: "Custom Neon Theme & Dark Mode",
      descripcion: "Adaptive color palette with neon accents and visual theme switcher.",
    },
    "animaciones-framer": {
      nombre: "Micro-interactions & Fluid Animations",
      descripcion: "Modern scroll and interaction visual effects powered by Framer Motion.",
    },
    "blog-autoadministrable": {
      nombre: "Self-Managed Blog / News Module",
      descripcion: "Dynamic section to publish articles and corporate updates.",
    },
    "sistema-citas": {
      nombre: "Assisted Appointment & Booking System",
      descripcion: "Meeting request calendar with automated reminders.",
    },
    "cotizador-interactivo": {
      nombre: "Dynamic Interactive Quote Builder",
      descripcion: "Interactive budget calculator with on-demand PDF generation.",
    },
    "whatsapp-automatizado": {
      nombre: "Direct WhatsApp with Prefilled Messages",
      descripcion: "Floating action buttons with universal wa.me links and user context.",
    },
    "email-transaccional-resend": {
      nombre: "Transactional Emails with Resend & PDF Attachments",
      descripcion: "Automated email notifications with formal quotes and confirmations.",
    },
    "seo-tecnico-avanzado": {
      nombre: "Advanced Technical SEO & Microdata",
      descripcion: "OpenGraph, Twitter Cards, and Schema.org structured metadata setup.",
    },
    "mantenimiento-mensual": {
      nombre: "Monthly Support, Updates & Backups",
      descripcion: "Continuous uptime monitoring, security patches, and database backups.",
    },
  },
  pt: {
    "landing-page": {
      nombre: "Landing Page Comercial",
      descripcion:
        "Página web de alta conversão projetada estrategicamente para captação de leads, venda de produto/serviço ou lançamento. Inclui design responsivo premium, animações sutis e chamada para ação direta.",
    },
    "sitio-web-institucional": {
      nombre: "Site Institucional Corporativo",
      descripcion:
        "Site multipágina corporativo para empresas e profissionais que buscam transmitir solidez e credibilidade. Inclui arquitetura moderna, seções completas (Início, Sobre, Serviços, Contato) e SEO básico.",
    },
    "sistema-web-saas": {
      nombre: "Aplicação Web / SaaS sob Medida",
      descripcion:
        "Plataforma web personalizada com painel administrativo, autenticação de usuários, banco de dados relacional e regras de negócio avançadas. Ideal para digitalizar processos, agendamentos ou portais privados.",
    },
    "diseno-ux": {
      nombre: "Design & Experiência do Usuário",
      descripcion: "Personalização visual, efeitos e identidade de marca.",
    },
    funcionalidades: {
      nombre: "Funcionalidades & Módulos",
      descripcion: "Ferramentas interativas para potencializar sua plataforma.",
    },
    integraciones: {
      nombre: "Integrações & Comunicação",
      descripcion: "Conectividade com canais de mensagens e serviços externos.",
    },
    infraestructura: {
      nombre: "Infraestrutura & Suporte",
      descripcion: "Otimização técnica, velocidade e manutenção contínua.",
    },
    "tema-personalizado": {
      nombre: "Tema Neon Personalizado e Modo Escuro",
      descripcion: "Paleta de cores adaptativa com destaques neon e seletor visual.",
    },
    "animaciones-framer": {
      nombre: "Microinterações e Animações Fluidas",
      descripcion: "Efeitos visuais modernos ao rolar a página (Framer Motion).",
    },
    "blog-autoadministrable": {
      nombre: "Módulo de Blog / Notícias Autogerenciável",
      descripcion: "Seção dinâmica para publicar artigos e novidades corporativas.",
    },
    "sistema-citas": {
      nombre: "Agenda e Gestão de Reuniões Assistidas",
      descripcion: "Calendário de solicitação de reuniões com lembretes automáticos.",
    },
    "cotizador-interactivo": {
      nombre: "Orçador Interativo Dinâmico",
      descripcion: "Calculadora interativa de orçamentos com geração de PDF.",
    },
    "whatsapp-automatizado": {
      nombre: "WhatsApp Direto com Mensagens Pré-formatadas",
      descripcion: "Botões flutuantes com link universal (wa.me) e contexto do usuário.",
    },
    "email-transaccional-resend": {
      nombre: "E-mails Transacionais com Resend e Anexos PDF",
      descripcion: "Notificações automáticas por e-mail com cotações e confirmações.",
    },
    "seo-tecnico-avanzado": {
      nombre: "Otimização de SEO Técnico e Microdados",
      descripcion: "Configuração de OpenGraph, Twitter Cards e dados estruturados Schema.org.",
    },
    "mantenimiento-mensual": {
      nombre: "Suporte, Atualizações e Backup Mensal",
      descripcion: "Monitoramento contínuo de disponibilidade, correções e cópias de segurança.",
    },
  },
};

/**
 * Obtiene el nombre y descripción localizados para un ítem del catálogo según su clave única,
 * preservando el texto original de la base de datos en español o para ítems nuevos del ERP.
 */
export function localizarTextoCatalogo(
  idioma: string,
  clave: string,
  nombreOriginal: string,
  descripcionOriginal: string | null
): TraduccionItemCatalogo {
  if (idioma !== "en" && idioma !== "pt") {
    return {
      nombre: nombreOriginal,
      descripcion: descripcionOriginal ?? "",
    };
  }

  const traduccion = TRADUCCIONES_CATALOGO_POR_IDIOMA[idioma]?.[clave];
  if (!traduccion) {
    return {
      nombre: nombreOriginal,
      descripcion: descripcionOriginal ?? "",
    };
  }

  return traduccion;
}
