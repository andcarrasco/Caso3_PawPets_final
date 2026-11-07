# PawPets 🐾

**Proyecto de Desarrollo Full Stack II — Evaluación 2**

PawPets es una tienda de productos para mascotas desarrollada con React, Vite, Bootstrap y React Router. Incluye catálogo, carrito de compras, simulación de pagos, gestión de usuarios y herramientas administrativas.

## Tecnologías utilizadas

- React 19
- Vite 8
- React Router 7
- Bootstrap 5
- JavaScript
- Jasmine y Karma para pruebas automatizadas
- ESLint para revisión del código

## Instalación y ejecución

Se requiere Node.js compatible con Vite 8 y npm.

```bash
npm ci
npm run dev
```

Para generar la compilación de producción:

```bash
npm run build
```

Para ejecutar las pruebas automatizadas:

```bash
npm test -- --single-run
```

Las pruebas requieren Chrome o Chromium configurado para Karma.

## Funcionalidades principales

### Tienda

- Página de inicio y navegación adaptable.
- Catálogo de productos, categorías y ofertas.
- Búsqueda y detalle de productos.
- Carrito con control de cantidades y cálculo del total.
- Checkout con datos del cliente.
- Entrega a domicilio o retiro.
- Pago simulado con resultado exitoso o fallido y opción de reintento.

### Usuarios y autenticación

- Registro e inicio de sesión simulados.
- Roles de cliente, vendedor y administrador.
- Edición de perfil.
- Gestión administrativa de usuarios.
- Sesión mediante `sessionStorage`.
- Protección de rutas según el rol.
- Navegación diferenciada según la sesión activa.

### Administración

- Consulta de productos, detalle y filtro de stock crítico.
- Consulta de categorías y cantidad de productos asociados.
- Gestión de usuarios.
- Reportes de ventas simuladas.
- Historial de pedidos de la sesión.
- Detalle de pedidos y comprobantes imprimibles.

## Datos y almacenamiento

El catálogo se consulta desde `src/datos/productos.json` y `src/datos/categorias.json`. App comparte esos datos con la tienda, la administración, los reportes y el vendedor mediante props.

Los productos y categorías son estáticos: la aplicación no los crea, edita ni elimina. Para cambiar el catálogo se modifican los archivos JSON durante el desarrollo.

El carrito y los pedidos de la compra simulada se mantienen en estado React y se pierden al recargar la página. Comprar no cambia el stock del JSON.

La autenticación es simulada y utiliza `sessionStorage`. La gestión de usuarios utiliza el servicio local implementado en el proyecto.

El sistema no cuenta con una pasarela de pagos real ni con un backend para procesar compras. Los comprobantes generados son demostrativos y no constituyen documentos tributarios.

La protección de rutas controla la navegación de React, pero no reemplaza la autorización de un servidor real.

## Pruebas y validaciones

Las pruebas están en `src/test`. Antes de cada `it` hay tres comentarios: los datos iniciales, la acción de la prueba y el resultado esperado. Los `expect` comprueban ese resultado. Se usan `render`, `screen`, `fireEvent` y `cleanup`, junto con spies de Jasmine cuando se debe comprobar una llamada.

Por ejemplo, en la prueba de aumentar la cantidad del carrito:

- Datos: una pelota de $3.000, cantidad 1 y total inicial $3.000.
- Acción: pulsar Aumentar Pelota.
- Resultado esperado: cantidad 2 y total $6.000.

Cada caso describe lo que realmente comprueba. Por ejemplo, la prueba del comprobante verifica los datos y la presencia del botón de impresión; no comprueba una impresión física.

| Archivo | Casos | Qué comprueba |
| --- | ---: | --- |
| `Login.spec.jsx` | 3 | Campos del login, rechazo de un correo inválido y selección obligatoria del rol. |
| `catalogo.spec.jsx` | 5 | Productos del JSON, apertura y cierre del detalle, filtro de stock, cantidad por categoría y consulta sin opciones de crear, editar o eliminar. |
| `tienda.spec.jsx` | 3 | Tarjetas recibidas por props, clic para agregar un producto y cambio de cantidad con su total. |
| `compras.spec.js` | 6 | Agregar y quitar, cantidades válidas, límite de stock, cálculo del pedido, copia de precios y validación de entrega. |
| `checkout.spec.jsx` | 5 | Autocompletado, pago fallido con reintento, pago exitoso, resumen sin pedido y datos de otra cuenta. |
| `integracionCompra.spec.jsx` | 8 | Login y compra, edición de perfil, cierre de sesión, compra como invitado, cambio de cuenta, limpieza del resumen, edición administrativa y consulta del comprobante. |
| `reportes.spec.jsx` | 4 | Reporte vacío, suma de ventas del mes, pedido inexistente y contenido del comprobante buscado por ID. |
| `headerRoles.spec.jsx` | 5 | Enlaces según el rol y un único menú principal con Catálogo, Categorías, Ofertas y Carrito. |
| `rutaProtegida.spec.jsx` | 6 | Acceso permitido o redirección según sesión y rol. |

Son 45 casos. Las pruebas de creación, edición y eliminación del catálogo se retiraron al volver a la consulta de JSON estático.

Verificación local del 23 de octubre de 2026: 45 pruebas aprobadas y compilación correcta.

Karma genera el informe en `coverage/html/index.html`. La configuración mide componentes y páginas cargados por las pruebas; no representa la cobertura global de App y servicios.

Para revisar el código con ESLint:

```bash
npm run lint
```

## Estado del proyecto

Las funcionalidades descritas corresponden a la implementación académica actual de PawPets.

Queda pendiente contrastar el proyecto con la rúbrica oficial de la Evaluación 2 y completar la revisión visual en dispositivos móviles, tabletas y computadores.
