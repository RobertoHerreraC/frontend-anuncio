# Frontend Anuncios (Angular)

Aplicación Angular 21 que consume la API del backend de anuncios (`/api`).

## Requisitos

- Node.js 22.12+ o 24.x
- Backend en ejecución (ver [`../backend-anuncio/README.md`](../backend-anuncio/README.md))

## Ejecución con Docker

El frontend está incluido en el `docker-compose.yml` del backend. Desde
`../backend-anuncio`:

```bash
docker compose up --build
```

Disponible en `http://localhost:4200`. La imagen compila la app con
`npm run build` y la sirve con nginx, que además redirige `/api` al backend.

## Ejecución en local

```bash
npm install
npm start
```

Aplicación: `http://localhost:4200`

El servidor de desarrollo usa `proxy.conf.json`, que redirige las peticiones
`/api` al backend en `http://127.0.0.1:3000`.

Si el backend se ejecuta con Docker Compose (puerto `89`), cambia el `target`
de `proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://127.0.0.1:89",
    "secure": false,
    "changeOrigin": true
  }
}
```

## Funcionalidades

- **Publicaciones** (`/publicaciones`)
  - Listado con filtros por categoría y estado (`activa`, `pausada`, `vendida`).
  - Crear, editar y eliminar publicaciones.
  - Select de categorías cargado desde el backend.
  - Validación de título, precio y categoría.
- **Categorías** (`/categorias`)
  - Listado de categorías.
  - Crear, editar y eliminar.
  - Manejo del error `409` cuando la categoría tiene publicaciones o el nombre
    está duplicado.

## Endpoints consumidos

| Servicio              | Acción    | Endpoint                          |
| --------------------- | --------- | --------------------------------- |
| `CategoriaService`    | Listar    | `GET /api/categorias`             |
| `CategoriaService`    | Obtener   | `GET /api/categorias/:id`         |
| `CategoriaService`    | Crear     | `POST /api/categorias`            |
| `CategoriaService`    | Actualizar| `PUT /api/categorias/:id`         |
| `CategoriaService`    | Eliminar  | `DELETE /api/categorias/:id`      |
| `PublicacionService`  | Listar    | `GET /api/publicaciones`          |
| `PublicacionService`  | Obtener   | `GET /api/publicaciones/:id`      |
| `PublicacionService`  | Crear     | `POST /api/publicaciones`         |
| `PublicacionService`  | Actualizar| `PUT /api/publicaciones/:id`      |
| `PublicacionService`  | Eliminar  | `DELETE /api/publicaciones/:id`   |

## Estructura

```
src/app/
├── core/
│   ├── models/
│   │   ├── categoria.model.ts
│   │   └── publicacion.model.ts
│   ├── services/
│   │   ├── categoria.service.ts
│   │   └── publicacion.service.ts
│   └── http-error.ts
├── features/
│   ├── categorias/
│   │   ├── categorias.ts
│   │   ├── categorias.html
│   │   └── categorias.scss
│   └── publicaciones/
│       ├── publicaciones.ts
│       ├── publicaciones.html
│       └── publicaciones.scss
├── app.config.ts
├── app.routes.ts
├── app.ts
├── app.html
└── app.scss
```

## Build de producción

```bash
npm run build
```

Los archivos se generan en `dist/frontend/browser`.

> Nota: en producción el backend debe exponer `/api` en el mismo origen o
> configurar CORS. El backend ya tiene `cors()` habilitado.
