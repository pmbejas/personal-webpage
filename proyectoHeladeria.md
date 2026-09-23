
---

# Especificación Técnica y Funcional

## Sistema Integral de Gestión Comercial (ERP) — Proveedor de Heladerías

*Documento base para desarrollo asistido por IA — v3. Modelo de operación: facturación en sistema externo con sincronización por API REST desde la Fase 1, carga manual complementaria (doble origen), cobranzas priorizadas sobre pedidos, control integral de stock y compras. Venta por kilo y por unidad.*

---

# 1. Resumen Ejecutivo y Propósito

Este sistema nace para reemplazar el manejo manual en planillas de Excel de la trazabilidad de cobranzas, rendiciones, cuentas corrientes y stock de una empresa distribuidora que provee mercadería a **heladerías** y a **comercios minoristas que venden helados y productos relacionados**.

**Modelo de operación (define todo el diseño):**

- Las **ventas se facturan en el sistema externo** (por ejemplo Conquer), que la empresa ya usa y que expone una API REST. Los preventistas emiten las boletas ahí.
- **Este sistema se sincroniza por API REST con el externo desde la Fase 1** y trae: clientes, productos (catálogo y precios) y boletas emitidas con su detalle.
- A partir de cada boleta, **todo el ciclo operativo vive en este sistema**: cuenta corriente del cliente, cobranzas con imputación FIFO, generación del pedido, preparación, despacho, entrega con trazabilidad y descarga de stock. También gestiona localmente compras, proveedores y su cuenta corriente.

La particularidad central del negocio: **hay productos que se venden por kilo** (helado a granel, con cantidades fraccionadas como 0,5 kg o 1,25 kg) **y productos que se venden por unidad** (conos, baldes, cajas). El sistema soporta ambas modalidades en ventas, compras y stock.

**División de responsabilidades (regla de oro):**

| Sistema externo (facturación) | Este sistema (ERP) |
|---|---|
| Fuente de verdad de: clientes, catálogo de productos, precios, emisión y anulación de boletas | Fuente de verdad de: pedidos y su trazabilidad, stock, cobranzas, cuenta corriente de clientes, compras y cuenta corriente de proveedores |

**Doble origen de datos**: la sincronización del externo es la vía principal de carga de clientes, productos y boletas, pero el sistema permite además la **carga manual completa** de los tres, con los mismos efectos de negocio (cuenta corriente, pedidos, stock). Cada registro distingue su origen en `origen_carga` (MANUAL o API_REST). Las boletas manuales **no** se envían al externo (la integración es unidireccional, pull): se registran solo en este sistema y conviven en la cuenta corriente con las sincronizadas.

**Prioridad de construcción**: la Fase 2 entrega cobranzas y cuenta corriente (el dolor original del negocio) antes que el módulo de pedidos, que llega en la Fase 3.

La arquitectura es Clean Architecture con segregación de lectura/escritura (EF Core para escritura transaccional, Dapper para lectura), de modo que cada módulo se sume sin rehacer lo construido.

---

# 2. Pila Tecnológica (Tech Stack)

## 2.1 Frontend

- **Next.js (React) + TypeScript + Tailwind CSS**, con el App Router (carpeta `/app`).
- Diseño **mobile-first** (preventistas y depósito operan desde el celular), responsivo hacia tablet y escritorio.
- Cliente HTTP: **Axios**, con una instancia central (`api.client.ts`) que agrega el token JWT en cada request, captura errores 401/403/500 de forma centralizada y maneja el refresco de sesión.
- Autenticación en la UI: **NextAuth** integrado con OAuth 2.0 de Google, validando que la cuenta ya exista y esté activa.
- Formularios: React Hook Form + Zod. Los campos de cantidad se comportan según la unidad de medida del producto (decimal para kilo, entero para unidad).

## 2.2 Backend

- **.NET 11 Web API (C#)**, organizado en **Clean Architecture** (Domain, Application, Infrastructure, Api).
- **Segregación de acceso a datos (patrón CQS):** EF Core para escritura transaccional, Dapper para lectura de alto rendimiento.
- Cliente HTTP tipado (HttpClientFactory + Refit o HttpClient nombrado) para consumir la API REST del sistema externo de facturación.
- Procesamiento en segundo plano: BackgroundService o Hangfire, para las sincronizaciones periódicas con el sistema externo.
- Validación de entrada: FluentValidation en la capa Application.
- Seguridad: **JWT + RBAC** (permisos por rol granulares).
- Contraseñas: tabla de credenciales separada de la de usuarios, hash con **Argon2id o BCrypt**, tokens efímeros para el reseteo por correo.
- Errores: respuestas en formato **ProblemDetails (RFC 7807)** con código de negocio legible.

## 2.3 Base de Datos e Infraestructura

- **PostgreSQL 16 o superior**, modelado en Tercera Forma Normal (3FN). Excepciones controladas y documentadas: `productos.stock_actual` (caché de agregación) y `saldo_posterior` en los libros mayores (saldo corrido calculado en transacción).
- Despliegue en un VPS Linux con Docker / Docker Compose.
- CI/CD con GitHub Actions y despliegue continuo.
- Backups automáticos, semanales y bajo demanda.
- Esquema gestionado con migraciones Code-First de EF Core.

---

# 3. Estructura de Proyectos y Convenciones de Arquitectura

```
/sistema-gestion-comercial
├── /frontend                        # Proyecto Next.js (App Router)
│   ├── /app
│   │   ├── (auth)                   # login, recuperar-password
│   │   ├── (dashboard)              # clientes, productos, boletas, pedidos, pagos,
│   │   │                            # integraciones, stock, proveedores, compras, reportes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── /components
│   │   ├── /ui
│   │   └── /forms
│   ├── /services
│   │   ├── api.client.ts
│   │   ├── clientes.service.ts
│   │   ├── productos.service.ts
│   │   ├── boletas.service.ts
│   │   ├── pedidos.service.ts
│   │   ├── pagos.service.ts
│   │   ├── integraciones.service.ts
│   │   ├── stock.service.ts
│   │   ├── proveedores.service.ts
│   │   ├── compras.service.ts
│   │   └── reportes.service.ts
│   ├── /hooks
│   ├── /types
│   └── /lib
├── /backend                         # Solución .NET 11 (Clean Architecture)
│   ├── /src
│   │   ├── /Sistema.Domain
│   │   │   ├── /Entities            # Cliente, Producto, Comprobante, Pedido, Pago,
│   │   │   │                        # Deposito, MovimientoStock, Despiece, Proveedor,
│   │   │   │                        # OrdenCompra, Compra, etc.
│   │   │   ├── /Enums               # EstadoPedido, EstadoComprobante, OrigenCarga,
│   │   │   │                        # UnidadMedida, TipoMovimientoStock, EstadoOrdenCompra
│   │   │   └── /Exceptions
│   │   ├── /Sistema.Application
│   │   │   ├── /Interfaces
│   │   │   │   ├── /Persistence
│   │   │   │   ├── /Services        # ISistemaExternoClient, IPedidoService, IStockService,
│   │   │   │   │                    # ICompraService, IReporteService
│   │   │   │   └── /Repositories
│   │   │   ├── /DTOs
│   │   │   ├── /Services            # FIFO, generación de pedidos, descarga de stock,
│   │   │   │                        # despiece, mapeo de sincronización
│   │   │   ├── /Mappings
│   │   │   └── /Common
│   │   ├── /Sistema.Infrastructure
│   │   │   ├── /Persistence         # Context, Configurations, Migrations, Repositories,
│   │   │   │                        # DapperQueries
│   │   │   ├── /Integraciones       # ISistemaExternoClient + mapeadores (mock y real)
│   │   │   ├── /Jobs                # SincronizacionClientesJob, ProductosJob, BoletasJob
│   │   │   ├── /Identity
│   │   │   └── /Services            # IEmailService, FileStorage
│   │   └── /Sistema.Api
│   │       ├── /Controllers
│   │       ├── /Middlewares
│   │       ├── Program.cs
│   │       └── appsettings.json
│   └── /tests
│       ├── /Sistema.UnitTests
│       └── /Sistema.IntegrationTests
└── docker-compose.yml
```

## 3.1 Convenciones de nombres (obligatorias)

| Capa | Convención |
|---|---|
| Base de datos | Tablas y columnas en `snake_case`, nombres en plural (`clientes`, `movimientos_stock`). PK: `id`. FK: `<entidad>_id`. |
| Booleanos (DB) | `activo BOOLEAN DEFAULT TRUE` para baja lógica. |
| Timestamps (DB) | `TIMESTAMPTZ`. Toda tabla lleva `created_at` y `updated_at`. |
| Enums (DB) | `VARCHAR(20-30)` con valores en `MAYÚSCULAS_SNAKE` (ej: `IMPAGA`, `EN_PREPARACION`). |
| Montos | `NUMERIC(14,2)`. |
| Cantidades | `NUMERIC(12,3)` en detalles; stock `NUMERIC(14,3)` (3 decimales soportan venta por kilo hasta gramos). |
| C# | `PascalCase`. Entidades singulares. DTOs: `XxxResponse`, `XxxCreateRequest`, `XxxUpdateRequest`, `XxxQueryFilter`. Interfaces con prefijo `I`. |
| TypeScript | `camelCase` variables/funciones, `PascalCase` componentes y tipos. Servicios por dominio en `/services`. |
| API REST | Rutas en `/api`, recursos en minúscula, multi-palabra en `kebab-case` (`/api/ordenes-compra`, `/api/pagos-proveedores`, `/api/integraciones/historial`). |
| JSON | `camelCase`. |
| Enums (C#) | Valores idénticos a los strings de DB, serializados como string. |

## 3.2 Convenciones de API

- GET = Dapper (lectura); POST/PUT/DELETE = EF Core con transacción cuando toca más de una tabla.
- Paginación estándar: `?page=1&pageSize=20`, respuesta con `data`, `page`, `pageSize`, `total`.
- Todo endpoint protegido salvo `/api/auth/*` públicos.
- Borrado lógico (`activo = false`), nunca DELETE físico de datos de negocio.
- Idempotencia de sincronización: la clave `sistema_origen_id` evita duplicados.

---

# 4. Reglas de Segregación de Datos (EF Core vs. Dapper)

## 4.1 Entity Framework Core — Escritura Transaccional

- Toda mutación de estado: Insert, Update, Delete, BulkInsert.
- Los procesos multi-tabla corren dentro de una transacción (`IDbContextTransaction`):
  - **Sincronización de boletas** (boleta + detalle + DEBE en cuenta corriente + pedido desde Fase 3).
  - **Emisión manual de boletas** (mismos efectos que la sincronizada).
  - **Imputación FIFO de pagos** (pago + imputaciones + estados de boletas + cuenta corriente).
  - **Recepción de compra** (compra + detalle + matching de orden + movimientos de stock + DEBE proveedor).
  - **Entrega de pedido** (estado + seguimiento + descarga de stock, Fase 4).
  - **Anulaciones y anulación propagada desde el externo** (estado + movimientos inversos).
- Esquema con migraciones Code-First.

## 4.2 Dapper — Lectura de Alto Rendimiento

- Todas las consultas GET, reportes, balances, grillas y cálculo de saldos.
- Conexión directa por `IDbConnection` (NpgsqlConnection), SQL puro mapeado a DTOs de lectura.
- Los saldos de cuenta corriente y el stock se leen agregando movimientos (fuente de verdad), no solo el caché.

---

# 5. Roles, Permisos y Seguridad (RBAC)

Roles en `usuarios.rol`: `ADMIN`, `DUENO`, `ENCARGADO`, `PREVENTISTA`, `DEPOSITO`, `COMPRAS`.

| Módulo / acción | ADMIN / DUENO | ENCARGADO | PREVENTISTA | DEPOSITO | COMPRAS |
|---|---|---|---|---|---|
| Usuarios y configuración | Total | — | — | — | — |
| Integración (sincronizar, historial, equivalencias) | Sí | Sí | — | — | — |
| Clientes (CRUD manual) | Sí | Sí | Solo consulta de sus clientes | — | — |
| Productos y categorías | Sí | Sí | Consulta | Consulta | Consulta |
| Boletas (consulta y emisión manual) | Sí | Sí | Sí (sus clientes) | — | — |
| Pedidos (estados, seguimiento) — Fase 3 | Sí | Sí | Consulta | Sí (preparación/reparto/entrega) | — |
| Cobranzas (pagos) | Sí | Sí | Sí (sus clientes) | — | — |
| Stock (ajustes, mermas, despiece, transferencias) — Fase 4 | Sí | Sí | Consulta | Sí | Consulta |
| Proveedores y órdenes de compra — Fase 5 | Sí | Sí | — | Recepción | Sí |
| Pagos a proveedores — Fase 5 | Sí | Sí | — | — | Sí |
| Reportes | Sí | Sí | Los propios | Los operativos | Los de compras |

Reglas adicionales:

- PREVENTISTA solo ve/emite sobre clientes con `preventista_id = su usuario`.
- Alta manual de clientes/productos/boletas permitida como vía permanente (doble origen, sección 7.2.6); los campos dueños del externo en registros API_REST se actualizan solo por sincronización.
- No se emiten boletas manuales a clientes con deuda vencida que supere su `limite_credito` (advertencia en frontend, bloqueo opcional por configuración).
- JWT con claims de rol; autorización por policy en controllers.

---

# 6. Alcance Funcional del Proyecto (por módulos y fases)

## 6.1 Fase 1 — Núcleo y Conexión con el Sistema Externo

**Usuarios y Seguridad**

- Acceso con credenciales locales o Google OAuth, restringido a cuentas ya registradas y activas.
- Recuperación de contraseña vía token temporal enviado por correo.
- CRUD de usuarios con roles (solo ADMIN/DUENO).

**Integración con el Sistema Externo**

- Configuración de la conexión (`integracion_configuracion`), credenciales cifradas, frecuencia del job.
- Sincronización por polling de **clientes** y **productos** (incluye precios), con disparo manual y log auditable (`integraciones_sincronizaciones`).
- Gestión de equivalencias (`integracion_equivalencias`): unidades de medida y categorías del externo → locales.
- Cliente HTTP tipado desarrollado contra mock; el adaptador real se implementa al recibir la documentación (Anexo A).

**Clientes**

- Sincronizados desde el externo **y** con CRUD manual completo (doble origen, 7.2.6), con vinculación de duplicados.
- Datos: código, razón social, contacto, geolocalización, `tipo_cliente`, preventista asignado, límite de crédito, días de crédito.
- Ficha básica del cliente (cuenta corriente se activa en Fase 2).

**Productos**

- Catálogo sincronizado **y** CRUD manual completo (doble origen, 7.2.6).
- Datos: código, nombre, categoría, **unidad de medida** (`KILO`, `LITRO`, `UNIDAD`, `BALDE_10L`, `CAJA`, `BULTO`), **flag `es_fraccionable`**, precios, stock mínimo.
- Regla central de venta por kilo y por unidad (sección 7.3) desde el día uno, tanto para sincronizados como para manuales.

**Pantallas:** login, clientes, productos, integraciones (estado + historial + equivalencias).

## 6.2 Fase 2 — Cobranzas y Cuenta Corriente (prioridad del negocio)

**Boletas (sincronizadas y manuales)**

- Carga por dos vías: sincronización del externo (con su detalle de ítems, precios y cliente mapeados por `sistema_origen_id`) y **emisión manual** desde el frontend (numeración interna `MAN-`, validaciones y efectos según 7.2.6).
- Ambas registran el movimiento **DEBE** en la cuenta corriente del cliente en la misma transacción.
- Boletas API_REST no se editan ni anulan localmente (anulación solo propagada, 7.2.5); las manuales se anulan localmente.
- Alta manual disponible desde el día uno de la fase, para operar aunque la sincronización de boletas esté pendiente de afinar con la documentación de la API.

**Cobranzas y Cuenta Corriente de Clientes**

- Pagos multimétodo: efectivo, transferencia (CBU, fecha/hora, número de operación y comprobante), cheque, mixto.
- Imputación automática FIFO a la boleta pendiente más antigua; estados IMPAGA / PAGO_PARCIAL / PAGADA / ANULADA.
- Libro mayor por cliente (`cuenta_corriente_movimientos`): DEBE por boleta, HABER por pago, saldo corrido. Unifica boletas sincronizadas y manuales.
- Anulación de pagos con reversa completa en transacción.

**Reportes de cobranza**

- Cobrado vs. adeudado; clientes morosos con días de mora; rendimiento por preventista.

**Pantallas:** boletas (grilla/detalle con badge de origen, /boletas/nueva), pagos (nuevo con vista previa FIFO), cuenta corriente por cliente.

*Nota: la Fase 2 ataca el dolor original del negocio — control de cobranzas y rendiciones — con lo mínimo indispensable: la boleta existe como documento de cuenta corriente, aunque el módulo de pedidos aún no esté activo.*

## 6.3 Fase 3 — Pedidos y Trazabilidad

- Generación automática de pedido para toda boleta nueva (sincronizada o manual), en la misma transacción.
- **Generación retroactiva**: al habilitar el módulo, un job idempotente crea pedidos PENDIENTES para todas las boletas vivas que aún no tengan pedido (detalle en 7.4.1).
- Ciclo de vida: PENDIENTE → EN_PREPARACION → EN_REPARTO → ENTREGADO (o CANCELADO), con cada cambio registrado con fecha y usuario en `pedidos_seguimiento`.
- Tablero operativo de pedidos por estado; línea de tiempo por pedido.
- La entrega todavía no descarga stock (eso llega en Fase 4).

## 6.4 Fase 4 — Control Integral de Stock

- Depósitos configurables (uno principal por defecto); carga de `INVENTARIO_INICIAL`.
- Movimientos trazables: ingreso por compra, egreso por entrega de pedido (se activa al ENTREGAR), ajustes, mermas, roturas, transferencias, despiece.
- Consulta por producto/depósito, historial, alertas bajo mínimo, stock valorizado.

## 6.5 Fase 5 — Compras y Proveedores

- CRUD de proveedores con condiciones de crédito.
- Órdenes de compra: BORRADOR → ENVIADA → RECIBIDA_PARCIAL / RECIBIDA_TOTAL → CANCELADA.
- Recepción: compra + matching de orden + ingreso de stock + DEBE proveedor, en una transacción.
- Pagos a proveedores con imputación FIFO y libro mayor por proveedor.

## 6.6 Fase 6 — Reportes Avanzados y Pulido

- Comparativos de ventas, ranking por unidad de medida, mermas del período, compras por proveedor, margen por producto, exportaciones, hardening.

---

# 7. Flujo Operativo y Reglas de Negocio

## 7.1 Autenticación, OAuth y Reseteo de Contraseñas

- Google OAuth: el frontend obtiene el token de Google y lo envía a `POST /api/auth/google`. El backend lo valida contra las APIs de Google y verifica que el email exista en `usuarios` con `activo = TRUE`; si no, responde 403 Forbidden.
- Login local: `POST /api/auth/login` valida hash en `usuario_credenciales` y emite JWT.
- Reseteo: `POST /api/auth/forgot-password` genera token efímero (15 minutos) y lo envía por mail; `POST /api/auth/reset-password` lo valida y actualiza el hash.

## 7.2 Integración con el Sistema Externo (Fase 1 — corazón del flujo)

### 7.2.1 Rol del sistema externo

La empresa factura en el sistema externo (por ejemplo Conquer), que expone una API REST. Este backend se conecta directamente a esa API para traer **clientes, productos y boletas**, y mantenerlos sincronizados. El externo **no** conoce nuestro sistema: no hay callbacks; la sincronización es siempre pull (polling).

### 7.2.2 Autenticación y conexión

- Las credenciales de la API externa (API Key o Bearer Token, según lo que exponga) se guardan cifradas en `integracion_configuracion`, nunca en texto plano ni en el código.
- Cliente HTTP tipado (`ISistemaExternoClient`) armado con HttpClientFactory, que encapsula las llamadas a los endpoints de clientes, productos y boletas del externo.
- Timeout, reintentos con backoff y logs por llamada.
- La implementación concreta de `ISistemaExternoClient` depende de la documentación del proveedor (ver Anexo A). Mientras tanto, se desarrolla contra un mock con datos de prueba: ninguna fase se bloquea por la falta de la documentación.

### 7.2.3 Estrategia: polling programado

Un job (SincronizacionJob) se ejecuta cada N minutos (`frecuencia_sincronizacion_minutos`) y pide los registros nuevos o modificados desde la última sincronización (`ultima_sincronizacion`). También se dispara manualmente con `POST /api/integraciones/sincronizar/{entidad}`.

**Orden obligatorio en cada ciclo:**

1. **Clientes** — altas y modificaciones.
2. **Productos** — altas y modificaciones del catálogo, incluyendo precios.
3. **Boletas** — boletas emitidas con su detalle de ítems; registra el DEBE en la cuenta corriente del cliente y — desde la Fase 3 — dispara la generación automática del pedido (sección 7.4).

*Nota: el orden importa — una boleta necesita que su cliente y sus productos ya existan localmente para poder relacionarlos. Si una boleta llega referenciando un cliente/producto que no existe incluso tras sincronizar, se registra con `accion = ERROR` para revisión manual.*

### 7.2.4 Mapeo, deduplicación y campos dueños vs. locales

- Cada entidad recibida trae su identificador externo, que se guarda en `sistema_origen_id` y se usa como clave de búsqueda: si ya existe, se actualiza; si no, se crea con `origen_carga = API_REST`. Un mismo registro nunca se duplica.
- **Vinculación de duplicados**: si llega del externo un cliente/producto cuyo `codigo_cliente` / `codigo_barra` ya existe localmente con `origen_carga = MANUAL`, se **vincula** (se asigna su `sistema_origen_id` y pasa a `API_REST`) en lugar de crear un duplicado, conservando id, saldo e historial.
- **Campos dueños del externo** (la sincronización los actualiza en cada ciclo):
  - Clientes: razon_social, cuit, contacto, dirección.
  - Productos: nombre, código, categoría (vía equivalencias), unidad_medida (vía equivalencias), precios.
  - Boletas: todo el encabezado y el detalle, incluidos precios por ítem (no se recalculan localmente).
- **Campos locales** (la sincronización jamás los pisa): preventista_id, limite_credito, dias_visita, tipo_cliente, stock_actual, stock_minimo, es_fraccionable, activo (excepto baja confirmada del externo).
- **Regla de derivación**: al crear un producto por sincronización, `es_fraccionable` se deriva automáticamente de la `unidad_medida` mapeada (7.3) y luego queda editable como campo local.
- **Equivalencias**: tabla `integracion_equivalencias` mapea valores del externo a locales (ej: unidad de medida `KG` → `KILO`, categoría del externo → `categorias.id`). Si un valor no tiene equivalencia, el registro se sincroniza con categoría/unidad genérica y queda marcado en el log para configurar la equivalencia.

### 7.2.5 Anulación propagada de boletas

Si en el externo se anula una boleta ya sincronizada (detectado por cambio de estado en la API):

- La boleta local pasa a `ANULADA` (manteniendo montos para auditoría).
- Si existe pedido asociado (módulo habilitado desde la Fase 3), pasa a `CANCELADO` con seguimiento (`observaciones = 'Anulación propagada desde [externo]'`).
- Se registra movimiento inverso HABER en la cuenta corriente del cliente.
- Si el pedido ya se entregó (stock descargado, Fase 4+), se genera `AJUSTE_POSITIVO` de reversa con `documento_tipo = 'ANULACION'`.
- Si la boleta ya recibió pagos, no se anula automáticamente: queda marcada en `integraciones_sincronizaciones` con `accion = ERROR` y detalle "boleta anulada en externo con pagos asociados", para revisión del encargado.

### 7.2.6 Carga manual (doble origen)

Principio: clientes, productos y boletas pueden cargarse por dos vías — **API_REST** (sincronización, sección 7.2) y **MANUAL** (formularios del frontend). Ambas conviven en las mismas tablas, distinguidas por `origen_carga`, y producen la misma estructura y efectos: una boleta manual genera su DEBE en cuenta corriente y su pedido (Fase 3) igual que una sincronizada. La cuenta corriente del cliente es el libro mayor **unificado** de ambos orígenes.

**Clientes manuales**

- CRUD completo desde el frontend (sección 9.3): alta, modificación y baja lógica.
- `codigo_cliente` autogenerado por secuencia interna si no se ingresa (ej: `CLI-000001`).
- Validaciones: `razon_social` requerida; CUIT y email opcionales con formato.
- Si más adelante llega del externo un cliente con el mismo código, se **vincula** (7.2.4): conserva su id, su cuenta corriente y su historial — nunca se duplica.

**Productos manuales**

- CRUD completo (sección 9.4).
- Regla de coherencia obligatoria: si `unidad_medida ∈ (KILO, LITRO)` → `es_fraccionable = TRUE`; si `∈ (UNIDAD, CAJA, BULTO, BALDE_10L)` → `es_fraccionable = FALSE`.
- Si luego llega del externo un producto con el mismo `codigo_barra`, se vincula.

**Boletas manuales** (ventas no facturadas en el externo o carga por contingencia)

- Emisión desde `POST /api/comprobantes` (sección 9.5) con el formulario `/boletas/nueva`.
- Numeración interna asignada server-side desde `secuencias`, con prefijo `MAN-` (ej: `MAN-000001`), para no colisionar con los números de comprobante del externo.
- Validaciones server-side (los totales nunca se confían del frontend): cliente activo; al menos un ítem; `cantidad > 0` con las reglas de fraccionamiento de 7.3; `precio_unitario > 0` (sugerido según `tipo_cliente`, editable con permiso de encargado); `fecha_emision` no futura; `monto_total` recalculado por el backend como suma de subtotales.
- Efectos en una sola transacción: boleta + detalle + **DEBE** en cuenta corriente + (desde Fase 3) pedido con seguimiento + (desde Fase 4) descarga de stock al entregar.
- **Anulación local permitida** (`PUT /api/comprobantes/{id}/anular`, reversas según 7.8) — a diferencia de las boletas API_REST, que solo se anulan por propagación desde el externo (7.2.5).

**Qué se edita según el origen**

| Origen | Campos del externo (nombre, contacto, precios, código) | Campos locales (preventista, límite de crédito, tipo_cliente, dias_visita, stock_minimo, es_fraccionable) | Anulación / baja |
|---|---|---|---|
| MANUAL | Todo editable | Todo editable | Sí, desde este sistema |
| API_REST | Bloqueados — solo la sincronización los actualiza | Editables | Boletas: solo por propagación (7.2.5). Clientes/productos: baja lógica local permitida |

*Mejora futura (no bloquea el roadmap): importación masiva desde Excel/CSV para migración inicial de datos, reutilizando las mismas validaciones de la carga manual.*

### 7.2.7 Stock proveniente del externo

Por defecto se **ignora** el stock que pudiera traer el externo: nuestro control de stock es local (ingresos por compras propias, descargas por entregas, ajustes). Opcional y configurable (`usar_stock_externo_inicial`): usar el stock del externo como inventario inicial en la primera sincronización, registrando `INVENTARIO_INICIAL` con `documento_tipo = 'SINCRONIZACION'`.

### 7.2.8 Trazabilidad y manejo de errores

- Cada intento — por registro — queda anotado en `integraciones_sincronizaciones`: entidad, id externo, si se creó, actualizó, vinculó, omitió o falló, y el detalle del error.
- Si la API externa no responde, el job reintenta con backoff; si sigue fallando, deja la sincronización pendiente para el próximo ciclo sin frenar el resto del sistema.
- El frontend muestra un panel con el estado de la última sincronización por entidad y el log filtrable.

## 7.3 Venta por kilo y por unidad (regla central del negocio)

- `productos.unidad_medida` define la unidad de venta y de stock:
  - **KILO / LITRO**: fraccionables (helado a granel). `es_fraccionable = TRUE`.
  - **UNIDAD / BALDE_10L / CAJA / BULTO**: enteros. `es_fraccionable = FALSE`.
- **Cantidades** en `NUMERIC(12,3)`. El backend valida: no fraccionable → entero; fraccionable → hasta 3 decimales.
- **Precios**: `precio_unitario` es por la unidad de medida del producto (kg para KILO, unidad para UNIDAD). En boletas sincronizadas, el precio viene del externo y no se recalcula; en manuales, se aplica la regla de 7.2.6.
- **Subtotales**: `subtotal = round(cantidad * precio_unitario - bonificacion, 2)`.
- **Precio según cliente** (solo para boletas manuales): HELADERIA/MAYORISTA → `precio_venta_mayorista`; MINORISTA/OTRO → `precio_venta_minorista`.
- **Frontend**: el campo cantidad muestra la unidad (`kg`, `lt`, `un`); input decimal con teclado numérico para fraccionables, stepper entero para no fraccionables.
- **Presentaciones y despiece**: cuando se compra en balde y se vende por kilo, existen dos productos (ej: "Helado chocolate balde 10L" y "Helado chocolate granel kg") y la conversión se hace con un **despiece** (sección 7.7).

## 7.4 Pedidos: generación automática, ciclo de vida y descarga de stock

### 7.4.1 Activación por fases

- **Fase 2 (cobranzas):** las boletas sincronizadas se registran con su DEBE en cuenta corriente; **no se generan pedidos**.
- **Fase 3 (pedidos):**
  - Toda boleta nueva — sincronizada o manual — genera automáticamente, en la misma transacción, su pedido asociado (`comprobante_id`), replicando cliente, preventista, productos y cantidades, con estado inicial PENDIENTE.
  - **Generación retroactiva**: al habilitar el módulo se ejecuta un job único que crea pedidos PENDIENTES para todas las boletas vivas (no ANULADAS) que no tengan pedido, con registro en `pedidos_seguimiento` (`observaciones = 'Generado retroactivamente al habilitar el módulo de pedidos'`, `usuario_id = NULL`). El job es **idempotente**: como `comprobante_id` es UNIQUE en `pedidos`, puede re-ejecutarse sin duplicar.

### 7.4.2 Ciclo de vida

- **PENDIENTE** — generado, aún no se empezó a preparar.
- **EN_PREPARACION** — armándose en depósito.
- **EN_REPARTO** — salió a entregar.
- **ENTREGADO** — el cliente lo recibió; estado final normal.
- **CANCELADO** — anulado (boleta anulada, anulación propagada o cancelación manual); estado final alternativo.

### 7.4.3 Descarga de stock (desde Fase 4)

- Al pasar a ENTREGADO, se generan movimientos `EGRESO_VENTA` por cada línea del detalle (contra el depósito del pedido, por defecto el principal), con `documento_tipo = 'PEDIDO'`, en la misma transacción. Se descarga al ENTREGAR y no antes, para que las cancelaciones no requieran stock negativo.
- Si no hay stock suficiente, el backend lo permite con advertencia (stock puede quedar negativo) y lo marca en el seguimiento; el encargado lo corrige con ajuste. *(Alternativa estricta bloqueable por configuración.)*
- Pedidos entregados antes de habilitar Fase 4 no se re-procesan.

### 7.4.4 Trazabilidad

- Cada cambio de estado se guarda como registro nuevo en `pedidos_seguimiento` (quién, cuándo, observaciones). `GET /api/pedidos/{id}/seguimiento` devuelve la línea de tiempo completa: generación (con su boleta de origen), preparación, reparto, entrega/cancelación — permitiendo medir tiempos de entrega y detectar demoras.

## 7.5 Cobranzas e Imputación de Saldos (FIFO)

- Emisión de boleta (sincronizada o manual): el saldo deudor de la cuenta corriente del cliente aumenta por el importe total (movimiento DEBE).
- Cobranza en la calle: el preventista cobra en efectivo, o el cliente transfiere directo a la cuenta del dueño.
- Carga del pago: efectivo (monto exacto) o transferencia (número de operación, fecha/hora y comprobante obligatorios, validación de CBU de 22 dígitos); cheque con número, banco y fecha de cobro.
- Imputación automática a la boleta pendiente más antigua (FIFO): si sobra, pasa a la siguiente; si no alcanza, la boleta queda PAGO_PARCIAL. Cada imputación crea un HABER. Todo en la misma transacción.
- Anulación de pago: revierte imputaciones, recalcula estados de boletas y saldo de cuenta corriente, en transacción.

## 7.6 Compras: órdenes, recepción y pagos a proveedores (Fase 5)

- **Orden de compra**: se crea en BORRADOR con proveedor y detalle. Al enviarse pasa a ENVIADA y queda como referencia de recepción. La sugerencia de reposición nace del reporte de productos bajo mínimo.
- **Recepción** (`POST /api/ordenes-compra/{id}/recepciones`): registra una compra (FACTURA o REMITO) con el detalle recibido, hace matching contra `ordenes_compra_detalle` (acumula `cantidad_recibida`), genera movimientos `INGRESO_COMPRA` y, si es FACTURA, registra el DEBE en la cuenta corriente del proveedor. Todo en una transacción. Recepciones parciales permitidas.
- **Alta directa de compra** sin orden: mismo efecto, con `orden_compra_id = NULL`.
- **Cuenta corriente de proveedores**: DEBE por FACTURA, HABER por pago. Saldo = lo que se le debe al proveedor.
- **Pagos a proveedores**: `POST /api/pagos-proveedores` con imputación FIFO sobre las facturas más antiguas impagas.
- **Anulación de compra**: solo si no tiene pagos imputados; revierte movimientos de stock y el DEBE, y descuenta `cantidad_recibida` de la orden asociada.
- El `precio_unitario` de `compras_detalle` actualiza como referencia el `precio_costo` del producto (última compra local; el precio del externo no se usa como costo).

## 7.7 Control de stock: movimientos, ajustes y despiece (Fase 4)

- **Fuente de verdad**: el stock es la suma con signo de `movimientos_stock` por producto y depósito. `productos.stock_actual` es un caché actualizado en la misma transacción que cada movimiento.
- **Tipos de movimiento**:
  - `INVENTARIO_INICIAL` — carga inicial (o proveniente del externo, configurable, 7.2.7).
  - `INGRESO_COMPRA` — recepción de compra (+).
  - `EGRESO_VENTA` — entrega de pedido (−).
  - `AJUSTE_POSITIVO` / `AJUSTE_NEGATIVO` — correcciones o inventarios.
  - `MERMA` / `ROTURA` — pérdidas (−), observación obligatoria.
  - `TRANSFERENCIA_SALIDA` / `TRANSFERENCIA_ENTRADA` — entre depósitos, siempre pareados.
  - `DESPIECE_SALIDA` / `DESPIECE_ENTRADA` — transformación de presentaciones, siempre pareados.
- **Trazabilidad**: cada movimiento guarda producto, depósito, tipo, cantidad, `cantidad_posterior` (snapshot), documento de origen (`documento_tipo` + `documento_id`), usuario y fecha. Ningún movimiento se edita ni borra: las correcciones son movimientos nuevos.
- **Despiece (balde → kilos)**: tabla `despieces` con producto origen, producto destino, cantidades y merma. Genera un `DESPIECE_SALIDA` y un `DESPIECE_ENTRADA` pareados por `documento_id`.
- **Alertas**: `GET /api/stock/bajo-minimo` devuelve productos con `stock_actual < stock_minimo` (insumo directo para crear órdenes de compra).

## 7.8 Anulaciones y correcciones (regla transversal)

- Anular boleta **manual** → estado ANULADA, pedido → CANCELADO (si existe), HABER inverso en cuenta corriente, reversa de stock si corresponde.
- Anular boleta **sincronizada** → solo mediante anulación propagada (7.2.5); jamás manual desde este sistema.
- Anular pago / compra → reversas auditables según 7.5 / 7.6.
- Ninguna anulación borra registros: siempre se agregan movimientos inversos.

---

# 8. Diseño de la Base de Datos (PostgreSQL, 3FN)

Todas las tablas siguen Tercera Forma Normal: cada atributo depende únicamente de la clave primaria de su tabla, sin datos derivados ni repetidos — por ejemplo, el detalle de una boleta vive en `comprobante_detalle` y no como texto dentro de `comprobantes`. Excepciones controladas: `productos.stock_actual` y los `saldo_posterior` de los libros mayores.

Convenciones transversales: toda tabla lleva `created_at TIMESTAMPTZ DEFAULT NOW()` y `updated_at TIMESTAMPTZ`; FKs con `ON DELETE RESTRICT`; baja lógica con `activo`.

## 8.1 Núcleo de Seguridad y Autenticación

### usuarios

| Campo | Detalle |
|---|---|
| id | BIGSERIAL, PK |
| nombre / apellido | VARCHAR(100), NOT NULL |
| email | VARCHAR(150), UNIQUE, NOT NULL |
| google_id | VARCHAR(255), UNIQUE, NULL |
| rol | VARCHAR(30) — ADMIN, DUENO, ENCARGADO, PREVENTISTA, DEPOSITO, COMPRAS |
| activo | BOOLEAN, DEFAULT TRUE |

### usuario_credenciales / tokens_reseteo_password

Credenciales separadas de usuarios: `usuario_id FK`, `password_hash`, `password_salt`, `ultimo_cambio`. Tokens efímeros: `usuario_id FK`, `token`, `expira_en`, `usado`.

## 8.2 Clientes y Productos

### clientes

| Campo | Detalle |
|---|---|
| id | BIGSERIAL, PK |
| codigo_cliente | VARCHAR(50), UNIQUE, NOT NULL |
| razon_social / nombre_fantasia | VARCHAR(150) — actualizable por sincronización |
| tipo_cliente | VARCHAR(20), DEFAULT 'HELADERIA' — HELADERIA, MINORISTA, MAYORISTA, OTRO (campo local) |
| cuit_cuil / direccion / telefono / email | datos de contacto — actualizables por sincronización |
| latitud / longitud | NUMERIC(9,6), NULL |
| dias_visita | VARCHAR(50), NULL — campo local |
| preventista_id | FK -> usuarios.id, NULL — campo local |
| limite_credito | NUMERIC(14,2), DEFAULT 0.00 — campo local |
| dias_credito | INT, DEFAULT 7 — campo local |
| origen_carga | VARCHAR(20), DEFAULT 'MANUAL' — MANUAL o API_REST |
| sistema_origen_id | VARCHAR(50), UNIQUE, NULL — id del cliente en el sistema externo |
| activo | BOOLEAN, DEFAULT TRUE |

### categorias

| Campo | Detalle |
|---|---|
| id | SERIAL, PK |
| nombre | VARCHAR(100), NOT NULL |
| descripcion | TEXT, NULL |

### productos

| Campo | Detalle |
|---|---|
| id | BIGSERIAL, PK |
| codigo_barra | VARCHAR(50), UNIQUE, NULL — actualizable por sincronización |
| nombre | VARCHAR(150), NOT NULL — actualizable por sincronización |
| categoria_id | FK -> categorias.id — mapeada vía equivalencias |
| unidad_medida | VARCHAR(20), NOT NULL — KILO, LITRO, UNIDAD, BALDE_10L, CAJA, BULTO — mapeada vía equivalencias |
| es_fraccionable | BOOLEAN, DEFAULT FALSE — derivado de unidad_medida al crear; luego campo local |
| precio_costo | NUMERIC(14,2) — referencia local (última compra); NO se pisa desde el externo |
| precio_venta_mayorista | NUMERIC(14,2) — actualizable por sincronización |
| precio_venta_minorista | NUMERIC(14,2) — actualizable por sincronización |
| stock_actual | NUMERIC(14,3), DEFAULT 0.000 — caché local, jamás actualizado por sincronización (salvo inventario inicial opcional, 7.2.7) |
| stock_minimo | NUMERIC(14,3), DEFAULT 0.000 — campo local |
| origen_carga | VARCHAR(20), DEFAULT 'MANUAL' — MANUAL o API_REST |
| sistema_origen_id | VARCHAR(50), UNIQUE, NULL — id del producto en el sistema externo |
| activo | BOOLEAN, DEFAULT TRUE |

## 8.3 Boletas y Pedidos

### comprobantes (boletas)

| Campo | Detalle |
|---|---|
| id | BIGSERIAL, PK |
| cliente_id | FK -> clientes.id, NOT NULL |
| preventista_id | FK -> usuarios.id, NULL |
| numero_comprobante | VARCHAR(50), NOT NULL — del externo si API_REST; `MAN-000001` si MANUAL |
| sistema_origen_id | VARCHAR(50), UNIQUE, NULL — número en el sistema externo |
| fecha_emision / fecha_vencimiento | DATE, NOT NULL / DATE, NULL |
| monto_total / monto_pagado / saldo_pendiente | NUMERIC(14,2) |
| estado | VARCHAR(20), DEFAULT 'IMPAGA' — IMPAGA, PAGO_PARCIAL, PAGADA, ANULADA |
| origen_carga | VARCHAR(20), DEFAULT 'MANUAL' — MANUAL o API_REST |

### comprobante_detalle (ítems de la boleta)

| Campo | Detalle |
|---|---|
| id | BIGSERIAL, PK |
| comprobante_id | FK -> comprobantes.id, NOT NULL |
| producto_id | FK -> productos.id, NOT NULL |
| cantidad | NUMERIC(12,3), NOT NULL — admite kilos fraccionados |
| precio_unitario | NUMERIC(14,2), NOT NULL — por unidad de medida; en sincronizadas viene del externo |
| bonificacion | NUMERIC(14,2), DEFAULT 0.00 |
| subtotal | NUMERIC(14,2), NOT NULL |

### pedidos

| Campo | Detalle |
|---|---|
| id | BIGSERIAL, PK |
| comprobante_id | FK -> comprobantes.id, UNIQUE, NOT NULL — boleta que originó el pedido |
| cliente_id | FK -> clientes.id, NOT NULL |
| preventista_id | FK -> usuarios.id, NULL |
| deposito_id | FK -> depositos.id, NULL — depósito de despacho (default: principal) |
| fecha_pedido | TIMESTAMPTZ, DEFAULT NOW() |
| estado | VARCHAR(20), DEFAULT 'PENDIENTE' — PENDIENTE, EN_PREPARACION, EN_REPARTO, ENTREGADO, CANCELADO |
| total | NUMERIC(14,2), NOT NULL |

*Nota: el campo `deposito_id` y la tabla `depositos` se agregan por migración en la Fase 4.*

### pedidos_detalle

| Campo | Detalle |
|---|---|
| id | BIGSERIAL, PK |
| pedido_id | FK -> pedidos.id, NOT NULL |
| producto_id | FK -> productos.id, NOT NULL |
| cantidad | NUMERIC(12,3), NOT NULL |
| precio_unitario / subtotal | NUMERIC(14,2), NOT NULL |

### pedidos_seguimiento (trazabilidad — historial de estados)

| Campo | Detalle |
|---|---|
| id | BIGSERIAL, PK |
| pedido_id | FK -> pedidos.id, NOT NULL |
| estado | VARCHAR(20), NOT NULL — el estado al que pasó el pedido |
| usuario_id | FK -> usuarios.id, NULL — quién hizo el cambio (NULL si fue automático/sincronización) |
| observaciones | TEXT, NULL |
| fecha_cambio | TIMESTAMPTZ, DEFAULT NOW() |

## 8.4 Cobranzas y Cuenta Corriente de Clientes

### pagos

| Campo | Detalle |
|---|---|
| id | BIGSERIAL, PK |
| cliente_id | FK -> clientes.id, NOT NULL |
| monto | NUMERIC(14,2), NOT NULL |
| metodo_pago | VARCHAR(20), NOT NULL — EFECTIVO, TRANSFERENCIA, CHEQUE, MIXTO |
| fecha_pago | TIMESTAMPTZ, DEFAULT NOW() |
| preventista_id | FK -> usuarios.id, NULL — quién cobró en la calle |
| numero_operacion / cbu / fecha_hora_transferencia | VARCHAR(50) / VARCHAR(30) / TIMESTAMPTZ, NULL — obligatorios si TRANSFERENCIA |
| numero_cheque / banco / fecha_cobro_cheque | VARCHAR(30) / VARCHAR(100) / DATE, NULL — si CHEQUE |
| comprobante_url | VARCHAR(255), NULL — foto/PDF de la transferencia |
| estado | VARCHAR(20), DEFAULT 'CONFIRMADO' — CONFIRMADO, ANULADO |
| usuario_id | FK -> usuarios.id — quién registró el pago |
| observaciones | TEXT, NULL |

### pagos_imputacion

| Campo | Detalle |
|---|---|
| id | BIGSERIAL, PK |
| pago_id | FK -> pagos.id, NOT NULL |
| comprobante_id | FK -> comprobantes.id, NOT NULL |
| monto_imputado | NUMERIC(14,2), NOT NULL |

### cuenta_corriente_movimientos (libro mayor del cliente)

| Campo | Detalle |
|---|---|
| id | BIGSERIAL, PK |
| cliente_id | FK -> clientes.id, NOT NULL |
| tipo_movimiento | VARCHAR(20), NOT NULL — DEBE (boleta), HABER (pago o reversa) |
| comprobante_id / pago_id | FK, NULL según el tipo |
| monto | NUMERIC(14,2), NOT NULL |
| saldo_posterior | NUMERIC(14,2), NOT NULL — saldo corrido |
| fecha_movimiento | TIMESTAMPTZ, DEFAULT NOW() |
| observaciones | TEXT, NULL |

## 8.5 Stock (Fase 4)

### depositos

| Campo | Detalle |
|---|---|
| id | SERIAL, PK |
| nombre | VARCHAR(100), NOT NULL |
| direccion | VARCHAR(200), NULL |
| es_principal | BOOLEAN, DEFAULT FALSE |
| activo | BOOLEAN, DEFAULT TRUE |

### movimientos_stock

| Campo | Detalle |
|---|---|
| id | BIGSERIAL, PK |
| producto_id | FK -> productos.id, NOT NULL |
| deposito_id | FK -> depositos.id, NOT NULL |
| tipo_movimiento | VARCHAR(30), NOT NULL — INVENTARIO_INICIAL, INGRESO_COMPRA, EGRESO_VENTA, AJUSTE_POSITIVO, AJUSTE_NEGATIVO, MERMA, ROTURA, TRANSFERENCIA_SALIDA, TRANSFERENCIA_ENTRADA, DESPIECE_SALIDA, DESPIECE_ENTRADA |
| cantidad | NUMERIC(14,3), NOT NULL — siempre positivo; el tipo define si suma o resta |
| cantidad_posterior | NUMERIC(14,3), NOT NULL — stock resultante en el depósito |
| documento_tipo | VARCHAR(30), NULL — PEDIDO, COMPRA, ORDEN_COMPRA, DESPIECE, AJUSTE, ANULACION, SINCRONIZACION |
| documento_id | BIGINT, NULL — id del documento de origen |
| usuario_id | FK -> usuarios.id, NOT NULL |
| observaciones | TEXT, NULL |
| fecha_movimiento | TIMESTAMPTZ, DEFAULT NOW() |

### despieces (transformación de presentaciones)

| Campo | Detalle |
|---|---|
| id | BIGSERIAL, PK |
| producto_origen_id | FK -> productos.id, NOT NULL — ej: balde 10L |
| producto_destino_id | FK -> productos.id, NOT NULL — ej: helado granel kg |
| cantidad_origen / cantidad_destino | NUMERIC(14,3), NOT NULL |
| merma | NUMERIC(14,3), DEFAULT 0.000 |
| deposito_id | FK -> depositos.id, NOT NULL |
| usuario_id | FK -> usuarios.id, NOT NULL |
| observaciones | TEXT, NULL |

## 8.6 Proveedores y Compras (Fase 5)

### proveedores

| Campo | Detalle |
|---|---|
| id | BIGSERIAL, PK |
| codigo_proveedor | VARCHAR(50), UNIQUE, NOT NULL |
| razon_social | VARCHAR(150), NOT NULL |
| cuit / direccion / telefono / email / contacto | datos del proveedor |
| dias_credito | INT, DEFAULT 0 |
| activo | BOOLEAN, DEFAULT TRUE |

### ordenes_compra

| Campo | Detalle |
|---|---|
| id | BIGSERIAL, PK |
| numero_orden | VARCHAR(50), UNIQUE, NOT NULL — ej: OC-000001 |
| proveedor_id | FK -> proveedores.id, NOT NULL |
| fecha_orden | DATE, NOT NULL |
| estado | VARCHAR(20), DEFAULT 'BORRADOR' — BORRADOR, ENVIADA, RECIBIDA_PARCIAL, RECIBIDA_TOTAL, CANCELADA |
| monto_total | NUMERIC(14,2), DEFAULT 0.00 |
| usuario_id | FK -> usuarios.id, NOT NULL |
| observaciones | TEXT, NULL |

### ordenes_compra_detalle

| Campo | Detalle |
|---|---|
| id | BIGSERIAL, PK |
| orden_compra_id | FK -> ordenes_compra.id, NOT NULL |
| producto_id | FK -> productos.id, NOT NULL |
| cantidad | NUMERIC(12,3), NOT NULL |
| cantidad_recibida | NUMERIC(12,3), DEFAULT 0.000 |
| precio_unitario / subtotal | NUMERIC(14,2), NOT NULL |

### compras (facturas / remitos de proveedor)

| Campo | Detalle |
|---|---|
| id | BIGSERIAL, PK |
| proveedor_id | FK -> proveedores.id, NOT NULL |
| orden_compra_id | FK -> ordenes_compra.id, NULL |
| tipo_comprobante | VARCHAR(20), DEFAULT 'FACTURA' — FACTURA, REMITO |
| numero_comprobante | VARCHAR(50), NOT NULL |
| fecha_compra | DATE, NOT NULL |
| monto_total / monto_pagado / saldo_pendiente | NUMERIC(14,2) |
| estado | VARCHAR(20), DEFAULT 'IMPAGA' — IMPAGA, PAGO_PARCIAL, PAGADA, ANULADA |
| usuario_id | FK -> usuarios.id, NOT NULL |

### compras_detalle

| Campo | Detalle |
|---|---|
| id | BIGSERIAL, PK |
| compra_id | FK -> compras.id, NOT NULL |
| producto_id | FK -> productos.id, NOT NULL |
| cantidad | NUMERIC(12,3), NOT NULL |
| precio_unitario | NUMERIC(14,2), NOT NULL — actualiza precio_costo como referencia |
| bonificacion | NUMERIC(14,2), DEFAULT 0.00 |
| subtotal | NUMERIC(14,2), NOT NULL |
| orden_compra_detalle_id | FK -> ordenes_compra_detalle.id, NULL — matching con la orden |

### pagos_proveedores / pagos_proveedores_imputacion / cuenta_corriente_proveedor_movimientos

Estructura espejo de `pagos` / `pagos_imputacion` / `cuenta_corriente_movimientos`: la imputación referencia `compra_id`; el libro mayor referencia `proveedor_id` con DEBE (factura) y HABER (pago o reversa), `saldo_posterior` corrido.

## 8.7 Integración con el Sistema Externo (Fase 1)

### integraciones_sincronizaciones (trazabilidad de cada sincronización)

| Campo | Detalle |
|---|---|
| id | BIGSERIAL, PK |
| entidad | VARCHAR(20), NOT NULL — CLIENTE, PRODUCTO o BOLETA |
| sistema_origen_id | VARCHAR(50), NOT NULL — id del registro en el sistema externo |
| entidad_id | BIGINT, NULL — id local creado o actualizado |
| accion | VARCHAR(20), NOT NULL — CREADO, ACTUALIZADO, VINCULADO, OMITIDO, ERROR |
| detalle_error | TEXT, NULL |
| fecha_sincronizacion | TIMESTAMPTZ, DEFAULT NOW() |

### integracion_configuracion

| Campo | Detalle |
|---|---|
| id | SERIAL, PK |
| nombre_sistema_externo | VARCHAR(100), NOT NULL |
| url_base | VARCHAR(255), NOT NULL |
| tipo_autenticacion | VARCHAR(30) — API_KEY, BEARER_TOKEN, OAUTH2 |
| credenciales_encriptadas | TEXT, NOT NULL — almacenado cifrado |
| frecuencia_sincronizacion_minutos | INT, DEFAULT 15 |
| usar_stock_externo_inicial | BOOLEAN, DEFAULT FALSE — si TRUE, el primer sync de productos registra inventario inicial |
| ultima_sincronizacion | TIMESTAMPTZ, NULL |
| activo | BOOLEAN, DEFAULT TRUE |

### integracion_equivalencias (mapeo de valores del externo)

| Campo | Detalle |
|---|---|
| id | SERIAL, PK |
| entidad | VARCHAR(30), NOT NULL — UNIDAD_MEDIDA, CATEGORIA |
| valor_externo | VARCHAR(50), NOT NULL — ej: 'KG' |
| valor_local | VARCHAR(50), NOT NULL — ej: 'KILO' |
| categoria_local_id | FK -> categorias.id, NULL — solo para entidad CATEGORIA |
| activo | BOOLEAN, DEFAULT TRUE |

## 8.8 Secuencias e índices recomendados

- Tabla `secuencias` (`entidad VARCHAR(20) PK, proximo_numero BIGINT`) para numeración interna de órdenes de compra (`OC-000001`), compras (`CMP-000001`) y boletas manuales (`MAN-000001`). Las boletas sincronizadas traen su número del externo.
- Índices: `movimientos_stock (producto_id, deposito_id, fecha_movimiento)`, `cuenta_corriente_movimientos (cliente_id, fecha_movimiento)`, `cuenta_corriente_proveedor_movimientos (proveedor_id, fecha_movimiento)`, `comprobantes (cliente_id, fecha_emision)`, `pedidos (estado)`, `pagos_imputacion (comprobante_id)`, `integraciones_sincronizaciones (entidad, fecha_sincronizacion)`.
- Constraints: `pagos_imputacion.monto_imputado > 0`; `movimientos_stock.cantidad > 0`.

---

# 9. Endpoints Principales de la API (.NET 11)

## 9.1 Autenticación y Seguridad

- POST /api/auth/login, POST /api/auth/google, POST /api/auth/forgot-password, POST /api/auth/reset-password, GET /api/auth/me.
- GET /api/usuarios, POST /api/usuarios, PUT /api/usuarios/{id}, PUT /api/usuarios/{id}/estado (ADMIN/DUENO).

## 9.2 Integración con el Sistema Externo (Fase 1)

- GET /api/integraciones/configuracion — estado y parámetros de la conexión (Dapper).
- PUT /api/integraciones/configuracion — actualizar URL, credenciales cifradas, frecuencia (ADMIN/DUENO).
- POST /api/integraciones/sincronizar/{entidad} — dispara manualmente la sincronización de clientes, productos o boletas (EF Core + job).
- GET /api/integraciones/historial — log de sincronizaciones con filtro por entidad, acción y fechas (Dapper).
- GET /api/integraciones/estado — último resultado por entidad (para el panel del dashboard).
- CRUD de /api/integraciones/equivalencias — gestión del mapeo de unidades y categorías (EF Core).

## 9.3 Clientes

- GET /api/clientes — listado con filtros (texto, preventista, tipo) y estado de deuda (Dapper).
- GET /api/clientes/{id}; GET /api/clientes/{id}/cuenta-corriente — historial Debe/Haber/Saldo (Dapper).
- POST /api/clientes, PUT /api/clientes/{id}, DELETE /api/clientes/{id} — alta/baja lógica manual; PUT solo modifica campos locales si `origen_carga = API_REST` (EF Core).

## 9.4 Productos

- GET /api/productos — filtros por categoría, unidad de medida, texto y estado de stock (Dapper).
- GET /api/productos/{id}; GET /api/categorias.
- POST /api/productos, PUT /api/productos/{id}, DELETE /api/productos/{id} — CRUD manual con las mismas reglas de campos locales (EF Core).

## 9.5 Boletas / Comprobantes

- GET /api/comprobantes — filtrado por cliente, fechas y estado (Dapper).
- GET /api/comprobantes/{id} — encabezado + detalle.
- POST /api/comprobantes — **emisión manual**: valida las reglas de 7.2.6, asigna número `MAN-` desde `secuencias` y crea boleta + detalle + DEBE en cuenta corriente (+ pedido con seguimiento desde Fase 3) en una transacción (EF Core).
- PUT /api/comprobantes/{id}/anular — solo para boletas MANUALES (EF Core).
- Las boletas con `origen_carga = API_REST` no se editan ni anulan por este endpoint (403 con código de negocio).

## 9.6 Pedidos (Fase 3)

- GET /api/pedidos — listado con filtros por estado, cliente, preventista y fecha (Dapper).
- GET /api/pedidos/{id}; GET /api/pedidos/{id}/seguimiento — historial completo (Dapper).
- PUT /api/pedidos/{id}/estado — cambia estado, registra seguimiento y, al ENTREGAR (Fase 4), descarga stock en la misma transacción (EF Core).

## 9.7 Cobranzas y Pagos (Fase 2)

- POST /api/pagos — registro de pago con imputación FIFO automática, transacción atómica (EF Core).
- GET /api/pagos — listado por método, cliente y fecha (Dapper).
- POST /api/pagos/upload-comprobante — subida de foto/PDF de transferencia.
- PUT /api/pagos/{id}/anular — reversa de imputaciones y saldos (EF Core).

## 9.8 Proveedores y Órdenes de Compra (Fase 5)

- GET /api/proveedores (Dapper); GET /api/proveedores/{id}/cuenta-corriente (Dapper).
- POST /api/proveedores, PUT /api/proveedores/{id}, DELETE /api/proveedores/{id} (EF Core).
- GET /api/ordenes-compra (Dapper); GET /api/ordenes-compra/{id}.
- POST /api/ordenes-compra; PUT /api/ordenes-compra/{id} (solo BORRADOR).
- PUT /api/ordenes-compra/{id}/enviar; PUT /api/ordenes-compra/{id}/cancelar.
- POST /api/ordenes-compra/{id}/recepciones — recepción parcial/total: compra + matching + stock + DEBE proveedor (EF Core, transacción).

## 9.9 Compras y Pagos a Proveedores (Fase 5)

- GET /api/compras (Dapper); GET /api/compras/{id}.
- POST /api/compras — alta directa: compra + detalle + stock + DEBE proveedor (EF Core).
- PUT /api/compras/{id}/anular — reversa de stock y cuenta corriente (EF Core).
- POST /api/pagos-proveedores — imputación FIFO (EF Core). GET /api/pagos-proveedores (Dapper). PUT /api/pagos-proveedores/{id}/anular.

## 9.10 Stock (Fase 4)

- GET /api/stock — stock por producto y depósito (Dapper).
- GET /api/stock/movimientos — historial con filtros (Dapper).
- POST /api/stock/ajustes — AJUSTE_POSITIVO/NEGATIVO, MERMA, ROTURA, INVENTARIO_INICIAL (EF Core).
- POST /api/stock/transferencias — dos movimientos pareados en transacción (EF Core).
- POST /api/stock/despieces (EF Core).
- GET /api/stock/bajo-minimo (Dapper).

## 9.11 Reportes (básicos desde Fase 2, completos en Fase 6)

- GET /api/reportes/ventas — por período, cliente o preventista.
- GET /api/reportes/productos-mas-vendidos — ranking por cantidad e importe.
- GET /api/reportes/resumen-semanal — cobrado, emitido, morosidad global.
- GET /api/reportes/morosos — clientes con saldos vencidos y días de mora.
- GET /api/reportes/pedidos-por-estado — pedidos agrupados por estado actual.
- GET /api/reportes/stock-valorizado — stock × precio_costo por producto/depósito.
- GET /api/reportes/compras — compras por proveedor y período.
- GET /api/reportes/margen — ventas vs. costo por producto y período.

---

# 10. Configuración del Cliente HTTP (Axios) en el Frontend

El archivo `api.client.ts` centraliza la inyección del header `Authorization: Bearer <token>` y el manejo de errores — redirige a login ante 401, alerta ante 403 y muestra mensaje genérico ante 500. La respuesta ProblemDetails del backend se normaliza a `{ titulo, detalle, codigo }` para la UI.

Los servicios (`clientes.service.ts`, `integraciones.service.ts`, `stock.service.ts`, etc.) son capas delgadas por dominio con funciones tipadas usando los tipos de `/types`.

---

# 11. Pantallas y Rutas del Frontend (App Router)

| Ruta (grupo `(dashboard)`) | Contenido |
|---|---|
| / (dashboard) | Resumen del día: pedidos por estado, última sincronización por entidad, cobrado del día, alertas de stock |
| /integraciones | Estado de conexión, disparo manual de sincronización, historial con filtros, gestión de equivalencias |
| /clientes, /clientes/nuevo, /clientes/[id] | Grilla con filtros y deuda; ficha con cuenta corriente y boletas |
| /productos, /productos/nuevo, /productos/[id] | Grilla por categoría; formulario con unidad de medida y flag fraccionable |
| /boletas, /boletas/nueva, /boletas/[id] | Grilla con badge de origen (MANUAL / API); **/boletas/nueva**: formulario de emisión manual con búsqueda de cliente y productos, cantidades kg/un según unidad, precio sugerido por tipo de cliente; detalle; anulación solo para manuales |
| /pedidos, /pedidos/[id] | Tablero por estado; detalle con línea de tiempo y acciones de cambio de estado |
| /pagos, /pagos/nuevo | Grilla; carga de pago con campos dinámicos según método y vista previa de imputación FIFO |
| /stock, /stock/movimientos, /stock/ajustes, /stock/despiece, /stock/transferencias | Consulta, historial y formularios operativos |
| /proveedores, /proveedores/[id] | Grilla; ficha con cuenta corriente de proveedor |
| /ordenes-compra, /ordenes-compra/nueva, /ordenes-compra/[id] | Ciclo completo con recepciones parciales |
| /compras, /compras/nueva | Grilla; alta directa y consulta |
| /reportes | Pestañas: ventas, productos, cobranzas, pedidos, stock, compras, margen |

El grupo `(auth)` incluye login (credenciales + Google) y recuperar-password. Layout mobile-first: navegación inferior en celular, lateral en escritorio.

---

# 12. Roadmap de Implementación por Módulos

| Fase | Módulo | Incluye | Dependencias |
|---|---|---|---|
| 1 | Núcleo + Conexión | Auth/usuarios, configuración de integración + jobs, sincronización de clientes y productos, equivalencias, alta manual complementaria, productos kilo/unidad | — |
| 2 | Cobranzas y Cuenta Corriente | Sincronización de boletas con detalle, DEBE en cuenta corriente, emisión manual de boletas (MAN-), pagos multimétodo + imputación FIFO + libro mayor, anulación propagada, anulación de pagos, reportes de cobranza | F1 |
| 3 | Pedidos y Trazabilidad | Generación automática para boletas nuevas + generación retroactiva idempotente, ciclo de estados, seguimiento, tablero | F2 |
| 4 | Stock | Depósitos, inventario inicial, movimientos, descarga al entregar, ajustes/mermas/roturas, transferencias, despiece, alertas | F3 |
| 5 | Compras | Proveedores, órdenes de compra, recepciones, cuenta corriente proveedores, pagos FIFO | F4 |
| 6 | Reportes y pulido | Todos los reportes, dashboard, exportaciones, hardening | F3–F5 |

*Criterio de división: al cerrar la Fase 2, el dueño ya controla cobranzas y cuentas corrientes con datos vivos del sistema externo y de carga manual (el dolor original); la Fase 3 agrega la operación logística de pedidos.*

**Criterios de aceptación mínimos (verificables por un humano):**

- F1: sincronizar dos veces los mismos clientes/productos no duplica registros y deja log auditable; un producto del externo con unidad `KG` llega como `KILO` vía equivalencia; login local/Google y reseteo funcionan; un cliente creado a mano que luego llega del externo se vincula sin duplicarse.
- F2: una boleta sincronizada de 0,75 kg + 2 conos registra un DEBE por el total en la cuenta corriente; un pago de $10.000 sobre boletas de $6.000 y $8.000 imputa $6.000 a la primera (PAGADA) y $4.000 a la segunda (PAGO_PARCIAL); anular la boleta en el externo la marca ANULADA con reversa en cuenta corriente — y si tuviera pagos, queda en ERROR para revisión manual.
- F2 (adicional): una boleta cargada manualmente sin depender del externo recibe número `MAN-000001`, genera su DEBE en la cuenta corriente y su pedido (Fase 3) igual que una sincronizada.
- F3: las boletas ya sincronizadas en F2 reciben su pedido retroactivo sin duplicar; una boleta nueva genera pedido automático; el seguimiento refleja cada estado con usuario y fecha.
- F4: entregar el pedido genera egresos de stock trazables con stock posterior correcto; un despiece de 1 balde refleja salida e ingreso en kilos.
- F5: recibir una orden parcial actualiza cantidades recibidas, ingresa stock y suma DEBE al proveedor; el pago FIFO cancela facturas más antiguas primero.
- F6: los reportes operativos reflejan los datos de las fases anteriores.

Testing: unit tests de la lógica de negocio (FIFO, validaciones de fraccionamiento, generación retroactiva, mapeo de sincronización, anulación propagada) en `Sistema.UnitTests`; integration tests con PostgreSQL en contenedor para las transacciones críticas en `Sistema.IntegrationTests`.

---

# Anexo A — Checklist para solicitar la documentación de la API del sistema externo

*Material para la solicitud al proveedor del sistema de facturación. Mientras tanto, el desarrollo usa un mock de `ISistemaExternoClient`.*

| # | Qué solicitar | Para qué lo necesitamos |
|---|---|---|
| 1 | Método de autenticación (API Key, Bearer Token u OAuth2) y cómo se obtiene/renueva el token, con vigencia | `integracion_configuracion` y el cliente HTTP tipado |
| 2 | URL base de producción y de un entorno de pruebas (sandbox), con credenciales de prueba | Probar sin afectar datos reales |
| 3 | Endpoint de listado de clientes: ruta, método HTTP, ¿permite filtrar por fecha de modificación?, esquema de paginación (page/pageSize, cursor u offset) | Sincronización de clientes |
| 4 | Endpoint de listado de productos: ídem; incluir si expone precios y stock | Sincronización de productos |
| 5 | Endpoint de listado de boletas: ídem; aclarar si el detalle de ítems viene embebido o en endpoint aparte (ej. `GET /boletas/{id}/items`) | Sincronización de boletas |
| 6 | Cómo se representan las anulaciones de boletas (¿campo de estado?, ¿endpoint?, ¿las anuladas aparecen en el listado?) | Regla de anulación propagada (7.2.5) |
| 7 | Diccionario de campos de cada endpoint: nombre exacto JSON, tipos, formato de fechas (¿ISO 8601 con zona?), precisión decimal | Mapeadores de la capa Integraciones |
| 8 | Identificadores: tipo y estabilidad del id de cliente/producto/boleta; unicidad del número de comprobante | Clave `sistema_origen_id` (deduplicación) |
| 9 | Valores que usa el externo para unidades de medida y categorías de producto | Carga inicial de `integracion_equivalencias` |
| 10 | Rate limits, tamaño máximo de página y throttling | Frecuencia del job y reintentos |
| 11 | Profundidad histórica: ¿hasta qué fecha se pueden traer datos? ¿hay exportación inicial masiva o hay que paginar todo? | Primera sincronización |
| 12 | Versionado de la API y política de cambios/avisos | Mantenimiento del adaptador |
````

---