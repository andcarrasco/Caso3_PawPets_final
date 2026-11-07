# PawPets 🐾

**Proyecto de Desarrollo Full Stack II (DSY1104) · Evaluación 3**

PawPets es una tienda de productos para mascotas. La Evaluación 3 lleva el frontend React de la Evaluación 2 a una aplicación fullstack: React pide los datos a una API REST en Spring Boot, la API los guarda en una base de datos y todo se publica en internet con Railway.

> **Estado actual:** el frontend está completo y en proceso de publicarse en Railway. Todavía usa datos estáticos en JSON. El backend Spring Boot, la base de datos y la conexión con la API están pendientes; ver [Checklist de la Evaluación 3](#checklist-de-la-evaluación-3).

## Integrantes

| Integrante | GitHub |
| --- | --- |
| María Pía Sepúlveda | [@Piita3569](https://github.com/Piita3569) |
| Andrés Carrasco | [@andcarrasco](https://github.com/andcarrasco) |
| Luis Veas | [@luchovduoc](https://github.com/luchovduoc) |
| Pablo Rojas | [@pablorojas1983](https://github.com/pablorojas1983) |

El reparto de tareas de la Evaluación 3 está por definir.

## Arquitectura

```
Navegador ──► Frontend React (Railway) ──HTTP/JSON──► API REST Spring Boot (Railway) ──► Base de datos (Railway)
```

| Parte | Tecnología | Estado |
| --- | --- | --- |
| Frontend | React 19, Vite 8, React Router 7, Bootstrap 5 | Listo; usa JSON estático |
| Backend | Spring Boot 3 (Spring Web, Spring Data JPA) en capas `model`, `repository`, `service`, `controller` | Pendiente |
| Base de datos | Base de datos administrada de Railway (MySQL o PostgreSQL) | Pendiente |
| Documentación de la API | Swagger con springdoc-openapi | Pendiente |
| Despliegue | Railway, con un servicio por parte dentro del mismo proyecto | Frontend en curso; backend y base de datos pendientes |

## API REST propuesta

Los recursos salen de los datos que hoy están en `src/datos`. Los nombres finales los confirma el equipo al construir el backend.

| Verbo | Ruta | Acción | Respuesta esperada |
| --- | --- | --- | --- |
| `GET` | `/api/productos` | Listar productos | `200` con la lista |
| `GET` | `/api/productos/{id}` | Ver un producto | `200`, o `404` si no existe |
| `POST` | `/api/productos` | Crear un producto | `201`, o `400` si faltan datos |
| `PUT` | `/api/productos/{id}` | Actualizar un producto | `200`, o `404` |
| `DELETE` | `/api/productos/{id}` | Eliminar un producto | `204`, o `404` |

Las categorías (`/api/categorias`), los usuarios (`/api/usuarios`) y los pedidos (`/api/pedidos`) siguen el mismo patrón.

Una vez publicado, el backend debe ofrecer:

- **Swagger** en `/swagger-ui/index.html`, con todos los endpoints.
- **Manejo global de errores** con `@RestControllerAdvice`: un id inexistente devuelve un JSON con el mensaje, no una página de error.
- **Validaciones** con `@NotBlank` y `@Valid`: un producto sin nombre devuelve `400`.
- **CORS** que autorice el dominio del frontend en Railway y `http://localhost:5173` para desarrollo.

## Ejecución local

Se requiere Node.js compatible con Vite 8 y npm.

```bash
npm ci
npm run dev        # http://localhost:5173
npm run build      # compilación de producción en dist/
npm run lint       # revisión con ESLint
npm test -- --single-run
```

Las pruebas usan Jasmine y Karma, y requieren Chrome o Chromium.

## Despliegue en Railway

Con el repositorio conectado a Railway, cada push a `main` vuelve a publicar el frontend.

- **Sitio publicado:** _pendiente de agregar la URL_
- **API publicada:** _pendiente_

### Frontend (este repositorio)

Railway detecta el proyecto Vite, ejecuta `npm run build` y sirve la carpeta `dist`. No necesita configuración extra.

Pasos para crearlo desde cero:

1. En [railway.com](https://railway.com), entrar con GitHub y elegir **New Project → Deploy from GitHub repo**.
2. Elegir `andcarrasco/Caso3_PawPets_final`.
3. En **Settings → Networking**, pulsar **Generate Domain** para obtener la URL pública.

### Conexión con el backend

Cuando la API esté publicada, la dirección del backend no se escribe en el código. Se lee de una variable de entorno:

| Servicio | Variable | Valor |
| --- | --- | --- |
| Frontend | `VITE_API_URL` | URL pública del backend, por ejemplo `https://pawpets-api.up.railway.app` |
| Backend | `PORT` | La asigna Railway; en `application.properties` usar `server.port=${PORT:8080}` |
| Backend | `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` | Datos de conexión de la base de datos de Railway |
| Backend | Orígenes permitidos en CORS | URL pública del frontend |

Vite incorpora `VITE_API_URL` al compilar. Por eso, si cambia, hay que volver a desplegar el frontend.

Las contraseñas y los datos de conexión se guardan solo en las variables de Railway, nunca en el repositorio.

## Funcionalidades del frontend

**Tienda:** inicio y navegación adaptable; catálogo, categorías y ofertas; búsqueda y detalle de productos; carrito con cantidades y total; checkout con entrega a domicilio o retiro; pago simulado con resultado exitoso o fallido y reintento.

**Usuarios:** registro e inicio de sesión simulados; roles de cliente, vendedor y administrador; edición de perfil; sesión en `sessionStorage`; rutas protegidas según el rol.

**Administración:** consulta de productos con filtro de stock crítico; categorías con la cantidad de productos; gestión de usuarios; reportes de ventas simuladas; historial y detalle de pedidos con comprobante imprimible.

### Datos actuales

Mientras no exista la API, el catálogo se lee de `src/datos/productos.json` y `src/datos/categorias.json`. El carrito y los pedidos viven en el estado de React y se pierden al recargar la página. La autenticación es simulada, así que la protección de rutas no reemplaza la autorización de un servidor. El pago y los comprobantes son demostrativos.

## Pruebas

Hay 45 casos en `src/test`, verificados localmente el 23 de octubre de 2026. Antes de cada `it` hay tres comentarios: los datos iniciales, la acción y el resultado esperado.

| Archivo | Casos | Qué comprueba |
| --- | ---: | --- |
| `Login.spec.jsx` | 3 | Campos del login, correo inválido y rol obligatorio |
| `catalogo.spec.jsx` | 5 | Productos del JSON, detalle, filtro de stock y cantidad por categoría |
| `tienda.spec.jsx` | 3 | Tarjetas por props, agregar al carrito y cambio de cantidad |
| `compras.spec.js` | 6 | Agregar y quitar, límites de stock, cálculo del pedido y validación de entrega |
| `checkout.spec.jsx` | 5 | Autocompletado, pago fallido con reintento, pago exitoso y datos de otra cuenta |
| `integracionCompra.spec.jsx` | 8 | Flujo completo de login, compra, perfil, sesión y comprobante |
| `reportes.spec.jsx` | 4 | Reporte vacío, ventas del mes y comprobante por ID |
| `headerRoles.spec.jsx` | 5 | Enlaces según el rol y menú principal único |
| `rutaProtegida.spec.jsx` | 6 | Acceso o redirección según sesión y rol |

Karma genera el informe de cobertura en `coverage/html/index.html`.

Cuando exista la API, se probará además con una **colección de Postman** que incluya las cinco operaciones CRUD y al menos un caso de error.

## Checklist de la Evaluación 3

| Requisito | Estado |
| --- | --- |
| Frontend React publicado en Railway | 🔄 En curso |
| Backend Spring Boot separado en capas `model`, `repository`, `service`, `controller` | ⬜ |
| CRUD completo: `GET` (todos y uno), `POST`, `PUT` y `DELETE` | ⬜ |
| Códigos de estado correctos con `ResponseEntity` (`201`, `204`, `404`) | ⬜ |
| Manejo global de errores con `@RestControllerAdvice` | ⬜ |
| Validaciones con `@NotBlank` y `@Valid` (`400`) | ⬜ |
| Swagger funcionando en `/swagger-ui/index.html` | ⬜ |
| Base de datos en Railway conectada al backend | ⬜ |
| Backend publicado en Railway | ⬜ |
| Frontend conectado a la API con Axios, en lugar del JSON estático | ⬜ |
| URL del backend en `VITE_API_URL`, no escrita en el código | ⬜ |
| CORS configurado para el frontend local y el publicado | ⬜ |
| Colección de Postman con el CRUD y un caso de error | ⬜ |

**Puntos extra sugeridos por las guías:** búsqueda, paginación, excepciones personalizadas, pruebas unitarias del backend, autenticación real y mensajes de error en pantalla.

## Historial

La Evaluación 2 se desarrolló en [Piita3569/Caso3_PawPets_React](https://github.com/Piita3569/Caso3_PawPets_React). Ahí están el historial de commits y los aportes de cada integrante. Este repositorio parte de una copia limpia de su rama `main`.
