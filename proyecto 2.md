
---

# Sistema de Gestión Integral para su Distribuidora

## Propuesta funcional y plan de implementación

*Documento comercial — explica qué hace el sistema, cómo se usa en el día a día y cómo se implementa por etapas.*

---

## 1. El problema que venimos a resolver

Hoy la operación del negocio depende de planillas de Excel y de la memoria de cada persona: las cobranzas que los preventistas juntan en la calle, las rendiciones de dinero, las deudas de cada heladería, el stock del depósito y las compras a proveedores se registran a mano, cada uno a su manera.

Eso trae consecuencias concretas:

- **No hay visibilidad en tiempo real**: para saber cuánto debe un cliente hay que abrir planillas y llamar a alguien.
- **Se pierde información**: una cobranza que no se anotó, una boleta que quedó sin registrar.
- **Rendiciones sin control**: no siempre está claro qué cobró cada preventista y cuánto rindió.
- **El stock es un misterio**: no se sabe con certeza cuánto helado, cuántos baldes o cuántos cucuruchos quedan hasta que falta.
- **Nadie rastrea los pedidos**: se factura, pero no se sigue si el pedido se preparó, salió y llegó.

Este sistema reemplaza esas planillas por una **aplicación web que funciona en el celular y en la computadora**, donde queda registrado todo el negocio: las ventas, las deudas, los cobros, los pedidos, el stock y las compras — con un historial completo de quién hizo qué y cuándo.

---

## 2. ¿Qué es y qué no es este sistema?

**Es** su sistema de gestión: controla clientes, deudas, cobranzas, pedidos, stock, compras y reportes.

**No** reemplaza su sistema de facturación actual (Conquer). Las boletas siguen emitiéndose ahí, como hasta ahora. Lo que hace este sistema es **conectarse automáticamente a ese sistema y traerse todo**: los clientes, los productos con sus precios y cada boleta que se emite. A partir de ahí, todo el resto del ciclo — cobrar, preparar, entregar, reponer — se administra acá. Se puede implementar a futuro el modulo de emision de boletas (facturación).

Además, **todo también se puede cargar a mano**: si un cliente no está en el sistema de facturación, o hay que emitir una venta por fuera, se carga manualmente y convive perfectamente con lo que llega automáticamente.

---

## 3. ¿Cómo funciona en el día a día?

**El preventista** factura la venta en el sistema de facturación que ya usa. No cambia su forma de trabajar. Minutos después, esa boleta aparece sola en el sistema, la deuda del cliente se actualiza y el pedido queda listo para que el depósito lo prepare.

**El depósito** ve en la pantalla los pedidos del día en una lista simple: pendientes, en preparación, en reparto y entregados. Cuando entrega, marca "entregado" y el stock se descuenta solo.

**El encargado o el dueño** ve en el celular, en cualquier momento y desde cualquier lugar:

- Cuánto debe cada heladería y desde cuándo.
- Quién cobró hoy, cuánto y con qué método (efectivo, transferencia o cheque).
- Qué pedidos están demorados.
- Qué productos están con stock bajo.

**Cuando entra un pago**, el sistema lo imputa solo a la boleta más antigua pendiente de ese cliente. Si el pago cubre una boleta y alcanza para parte de otra, lo reparte automáticamente y deja registrado exactamente cómo se aplicó cada peso.

**Cuando llega mercadería del proveedor**, se registra la recepción: entra al stock, queda la factura pendiente de pago en la cuenta corriente del proveedor y el sistema recuerda pagar primero lo más viejo.

Y si algo se carga mal, no se borra: se anula, y el sistema deja registro de la anulación con quién la hizo. Todo queda trazado.

---

## 4. Los módulos del sistema

### 4.1 Clientes
Ficha completa de cada heladería o comercio: datos de contacto, ubicación, días de visita, preventista asignado y **límite de crédito**. Cada cliente tiene su **cuenta corriente**: un extracto claro de lo que debe (boletas) y lo que pagó, con el saldo actualizado en tiempo real.

### 4.2 Productos — por kilo y por unidad
El catálogo soporta la lógica real del negocio: el helado a granel **se vende por kilo** (0,5 kg, 1,25 kg, con decimales) y los conos, potes y baldes **se venden por unidad**. El sistema entiende ambas formas: en la pantalla de carga, el producto por kilo pide decimales y el producto por unidad pide cantidades enteras. Cada producto tiene precio mayorista y precio minorista, y se sugiere el correcto según el tipo de cliente.

### 4.3 Ventas (boletas)
Todas las boletas — las que llegan del sistema de facturación y las que se cargan a mano — quedan en un solo lugar, con su detalle de productos y montos. Cada boleta genera automáticamente la deuda del cliente en su cuenta corriente. Si una boleta se anula en el sistema de facturación, el sistema lo detecta y la anula acá también, revirtiendo la deuda.

### 4.4 Cobranzas y cuenta corriente
Registro de cada cobro con su método: efectivo, transferencia bancaria (con número de operación, fecha y foto/PDF del comprobante) o cheque. La imputación automática FIFO paga primero la deuda más vieja, y el sistema muestra siempre cuánto quedó de cada boleta: impaga, pago parcial o pagada. Incluye reporte de **morosos con días de atraso** y rendimiento de cobranza por preventista.

### 4.5 Pedidos con seguimiento
Cada venta genera automáticamente su pedido. El pedido avanza por estados — pendiente, en preparación, en reparto, entregado — y **cada cambio queda registrado con fecha, hora y quién lo hizo**. Esto permite saber cuánto tarda cada entrega, detectar demoras y responder al cliente "su pedido salió a las 9:40" con certeza.

### 4.6 Stock
Control completo del depósito: cada entrada (compras), cada salida (entregas), cada ajuste, cada merma o rotura queda registrado con su motivo y responsable. El stock se consulta por producto y por depósito, con alertas cuando un producto baja de su mínimo. Soporta el **despiece**: convertir un balde de 10 litros en kilos para venta a granel, con la merma registrada.

### 4.7 Compras y proveedores
Órdenes de compra con su ciclo completo, recepciones (totales o parciales), cuenta corriente por proveedor y pagos con la misma lógica automática: se paga primero la factura más antigua.

### 4.8 Reportes
Ventas por período, por cliente y por preventista; ranking de productos más vendidos; cobrado versus adeudado; morosos; estado de pedidos; stock valorizado; compras por proveedor. Los números del negocio, actualizados y en un clic.

### 4.9 Seguridad y control
Acceso con usuario y contraseña o cuenta de Google, con **permisos por rol**: el preventista ve sus clientes, el depósito maneja pedidos y stock, el dueño ve todo. Cada movimiento importante queda firmado con su usuario.

---

## 5. Plan de implementación por fases

El sistema se entrega en etapas cortas. Cada fase termina con **algo funcionando que usted puede usar de verdad**, no con promesas a futuro. Así se reduce el riesgo y se puede ir ajustando el rumbo con uso real.

| Fase | Qué se implementa | Qué usted recibe al terminar |
|---|---|---|
| **1 — Arranque y conexión** | Accesos con usuarios y roles. Conexión automática con su sistema de facturación: llegan solos los clientes y los productos con sus precios. Carga manual de clientes y productos para lo que no viene de allí. | El sistema funcionando con sus clientes y productos reales, sincronizados solos. |
| **2 — Cobranzas y cuenta corriente** *(prioridad del negocio)* | Las boletas facturadas llegan al sistema y generan la deuda de cada cliente. Registro de pagos con todos los métodos y asignación automática a la deuda más vieja. Cuenta corriente por cliente, reporte de morosos y rendimiento por preventista. | **El control total de las deudas y las cobranzas**: quién debe, quién cobró y cuánto, sin planillas. Este es el dolor más grande del negocio y es lo primero que se resuelve. |
| **3 — Pedidos con trazabilidad** | Cada venta genera su pedido automáticamente. Estados de preparación y entrega con seguimiento completo (quién, cuándo). Tablero del día para el depósito. | Los pedidos bajo control: se ve en qué estado está cada uno y cuánto demoran las entregas. |
| **4 — Stock** | Depósito configurado con su inventario inicial. Entradas, salidas, ajustes, mermas y roturas todo trazado. El stock se descuenta solo al entregar cada pedido. Alertas de reposición. Despiece de baldes a kilos. | La certeza de cuánto hay de cada producto, con el historial completo de cada movimiento. |
| **5 — Compras y proveedores** | Órdenes de compra, recepción de mercadería (total o parcial), cuentas corrientes de proveedores y pagos automáticos a la factura más vieja. | El ciclo completo de la mercadería: entra por compra, sale por venta, y las deudas de proveedores bajo control. |
| **6 — Reportes y ajustes finales** | Todos los reportes del negocio, panel de inicio con el resumen del día, mejoras y ajustes surgidos del uso real. | Un sistema maduro, con toda la información del negocio en un solo lugar. |

**Tiempo de referencia**: las fases 1 y 2 — las que resuelven el problema de las cobranzas — son el primer gran objetivo. Las siguientes se encadenan una detrás de la otra, y cada una se coordina y valida con usted antes de cerrarse.

---

## 6. Qué necesitamos de su parte

1. **Acceso a la API del sistema de facturación**: la documentación técnica (o el contacto del proveedor) para conectarnos y traer clientes, productos y boletas. El trabajo puede arrancar sin esto, pero la sincronización automática lo necesita.
2. **Un responsable del lado del negocio**: una persona que valide datos, defina preventistas y límites de crédito, y pruebe cada fase.
3. **Datos iniciales**: lista de clientes si hay que cargar algo a mano, catálogo de productos con precios, y el inventario aproximado del depósito para la fase de stock.

---

## 7. Lo que gana el negocio con el sistema

- **Cobranzas bajo control**: cada peso cobrado está registrado, imputado a una boleta y visible desde el celular. Se termina la discusión de "cuánto debe esta heladería".
- **Morosidad visible**: el sistema avisa qué clientes se atrasaron y cuánto, antes de que el problema crezca.
- **Prevención de errores**: nadie repite datos a mano entre planillas; la información fluye sola del sistema de facturación al de gestión.
- **Pedidos que no se pierden**: cada venta tiene su pedido y cada pedido su responsable y su hora.
- **Stock real**: se sabe cuánto queda antes de que falte, y cada merma queda explicada.
- **Decisiones con números**: qué se vende más, quién rinde mejor, qué cliente conviene, qué producto deja margen.
- **Historial completo**: si mañana surge una discrepancia, se puede ver exactamente qué pasó, cuándo y quién lo registró.

---
