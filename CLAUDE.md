# Reglas Frontend - Next.js + TypeScript

## Stack base
- Next.js con App Router
- TypeScript estricto
- Tailwind CSS para estilos
- Axios para llamadas a la API
- Framer Motion para animaciones
- next-intl para internacionalización
- react-hook-form para formularios

## Nomenclatura TypeScript
- Componentes en PascalCase: ListaProductos, FormularioUsuario
- Archivos de componentes en PascalCase: ListaProductos.tsx
- Hooks con prefijo use: useListaProductos, useAutenticacion
- Tipos e interfaces en PascalCase: UsuarioResponse, ProductoRequest
- Variables y funciones en camelCase: listaProductos, obtenerUsuarios
- Constantes en UPPER_SNAKE_CASE: TIEMPO_EXPIRACION_TOKEN

## Estructura de cualquier proyecto frontend
- app/           → rutas y páginas (App Router de Next.js)
- components/    → componentes reutilizables
- services/      → llamadas a la API REST
- hooks/         → custom hooks de React
- types/         → tipos e interfaces TypeScript
- utils/         → funciones utilitarias
- context/       → contextos globales (autenticación, etc.)
- messages/      → archivos de traducción (es.json, en.json, pt.json)

## TypeScript
- Siempre tipar explícitamente, nunca usar any
- Usar interfaces para objetos de datos
- Usar tipos para uniones y primitivos
- Marcar propiedades opcionales con ?: titulo?: string
- Tipar siempre las respuestas de la API

## Componentes React
- Siempre usar componentes funcionales, nunca de clase
- Un componente hace una sola cosa
- Componentes pequeños y reutilizables
- Props tipadas con interfaces TypeScript
- Comentarios en español explicando el propósito del componente

## Llamadas a la API
- Todas las llamadas van en la carpeta services/
- Nunca hacer fetch o axios directamente desde un componente
- Manejar siempre los estados: cargando, éxito y error
- Mostrar mensajes de error descriptivos en español al usuario
- Incluir el token JWT en cada request autenticado

## Estilos con Tailwind CSS
- Usar clases de Tailwind, nunca CSS inline
- Diseño responsive: mobile first
- Reutilizar componentes antes de duplicar estilos
- Clases ordenadas: layout → espaciado → tipografía → colores → efectos

## UI/UX - Estilo SaaS Premium
El diseño debe transmitir profesionalismo, confianza y modernidad.

### Paleta de colores
- Fondo principal oscuro: bg-gray-950 o bg-slate-950
- Fondo de cards y paneles: bg-gray-900 o bg-slate-900
- Bordes sutiles: border-gray-800 o border-white/10
- Color de acento principal: un solo color vibrante (ej: indigo, violet, cyan) consistente en todo el sistema
- Texto principal: text-white o text-gray-100
- Texto secundario: text-gray-400
- Nunca mezclar más de dos colores de acento en el mismo proyecto

### Tipografía
- Fuente principal: Inter o Geist (ambas disponibles en Next.js)
- Jerarquía clara: título de página → subtítulo → texto de cuerpo → texto secundario
- Tamaños consistentes usando la escala de Tailwind: text-sm, text-base, text-lg, text-xl, text-2xl
- Peso: font-semibold para títulos, font-medium para etiquetas, font-normal para cuerpo

### Componentes visuales
- Cards con bordes redondeados: rounded-xl o rounded-2xl
- Sombras suaves con color del acento al 10-20% de opacidad
- Efecto glassmorphism en modales: bg-white/5 backdrop-blur-md border border-white/10
- Botón primario: color de acento sólido con hover más brillante
- Botón secundario: fondo transparente con borde del acento
- Botón de peligro: rojo solo para acciones destructivas (eliminar)
- Inputs con fondo oscuro, borde sutil y foco con color de acento

### Animaciones con Framer Motion
- Transiciones de entrada de páginas: fadeIn + slideUp suave (duration 0.3s)
- Hover en cards: escala sutil (scale 1.01) con transición rápida
- Animaciones de listas: cada item aparece con pequeño delay escalonado
- Modales: fadeIn + scale desde 0.95 a 1
- Nunca usar animaciones que duren más de 0.5s
- Respetar prefers-reduced-motion para usuarios con sensibilidad al movimiento

### Estados visuales
- Cargando: skeleton loaders que imitan la forma del contenido real, nunca spinners solos
- Vacío: ilustración SVG simple + mensaje descriptivo + botón de acción principal
- Error: mensaje claro en rojo con ícono, sin stack traces
- Éxito: toast notification en esquina superior derecha, desaparece en 3 segundos
- Deshabilitado: opacity-50 y cursor not-allowed

### Feedback al usuario
- Feedback inmediato: el botón muestra estado cargando mientras espera la respuesta
- Confirmación antes de eliminar: modal de confirmación, nunca eliminar sin avisar
- Formularios: validación en tiempo real con mensajes debajo de cada campo
- Toasts para notificaciones no bloqueantes (éxito, error, advertencia, información)

## Accesibilidad (A11y)
- Todos los elementos interactivos tienen aria-label descriptivo en español
- Navegación completa por teclado: Tab, Enter, Escape funcionan en todos los componentes
- Contraste mínimo: 4.5:1 para texto normal, 3:1 para texto grande
- Imágenes siempre con alt descriptivo; si es decorativa, alt=""
- Formularios con htmlFor correctamente vinculado al input
- Modales atrapan el foco mientras están abiertos (focus trap)
- Roles ARIA correctos: role="dialog", role="alert", role="navigation"

## Performance
- Lazy loading de componentes pesados con dynamic() de Next.js
- Todas las imágenes con next/image, nunca con img directamente
- Usar useMemo para cálculos costosos, useCallback para funciones en dependencias
- Skeleton loaders en vez de bloquear la UI mientras carga
- Paginación o scroll infinito en listas largas, nunca cargar todo junto
- Fonts cargadas con next/font para evitar layout shift

## Internacionalización (i18n)
- Usar next-intl para manejo de traducciones
- Idioma por defecto: Español (es)
- Idiomas adicionales requeridos: Inglés (en) y Portugués (pt)
- Estructura de archivos:
  - messages/es.json → Español (archivo principal y fuente de verdad)
  - messages/en.json → Inglés
  - messages/pt.json → Portugués
- Nunca hardcodear texto visible al usuario directamente en el JSX
- Todo texto va en los archivos de traducción: labels, placeholders,
  mensajes de error, tooltips, títulos y botones
- Claves de traducción en camelCase descriptivas:
  "formulario.campoRequerido", "usuario.mensajeBienvenida"
- Al crear un texto nuevo, agregarlo siempre en los tres idiomas al mismo tiempo
- Si falta traducción en un idioma, el sistema muestra el texto en Español como fallback

## Manejo de errores
- Siempre usar try/catch en las llamadas a la API
- Mostrar mensajes de error claros y en español al usuario
- Nunca mostrar errores técnicos crudos al usuario final
- Error boundaries para capturar errores inesperados de componentes

## Seguridad
- Nunca guardar el password en localStorage ni sessionStorage
- El JWT se guarda en memoria o en cookie httpOnly
- Nunca exponer datos sensibles en la URL
- Validar entradas del usuario antes de enviar al backend

## Buenas prácticas
- Evitar lógica compleja dentro del JSX, extraerla a variables o funciones
- Un archivo por componente
- Evitar prop drilling excesivo, usar Context cuando sea necesario
- Estados de formulario manejados con react-hook-form
- Nunca mutar el estado directamente, siempre crear una copia nueva

## Patrones Creacionales
Usar el patrón adecuado según el caso. No forzar un patrón si no agrega valor real.

### Factory Method
- Cuándo usarlo: cuando necesitás crear objetos o componentes sin especificar el tipo exacto
- En este stack se aplica para:
  - Crear instancias de servicios de API según el entorno (desarrollo, producción)
  - Crear componentes de notificación (éxito, error, advertencia) de forma consistente
  - Crear objetos de configuración de Axios con headers predefinidos
- Ejemplo:
  const clienteApi = ClienteApiFactory.crear(); // ya incluye baseURL y headers JWT

### Builder
- Cuándo usarlo: cuando necesitás construir objetos complejos paso a paso con partes opcionales
- En este stack se aplica para:
  - Construir parámetros de query con múltiples filtros opcionales
  - Construir formularios dinámicos con campos opcionales
- Ejemplo:
  const parametros = new FiltroBuilder()
      .conFecha(fechaInicio, fechaFin)
      .conEstado(estadoSeleccionado)
      .conPaginacion(pagina, tamanio)
      .construir();

### Singleton
- Cuándo usarlo: cuando debe existir una única instancia compartida en toda la app
- En este stack se aplica para:
  - El contexto de autenticación (AuthContext)
  - La instancia de Axios configurada con interceptors
- Implementar via Context API, nunca con variable global suelta

### Prototype
- Cuándo usarlo: cuando necesitás copiar objetos con pequeñas modificaciones
- Usar el spread operator: const copia = { ...objetoOriginal, campo: nuevoValor }

### Abstract Factory
- Cuándo usarlo: cuando el sistema necesita soportar múltiples familias de objetos intercambiables
- En este stack se aplica para soporte a múltiples temas o proveedores de autenticación
- Usar solo cuando el proyecto realmente necesite intercambiar implementaciones
