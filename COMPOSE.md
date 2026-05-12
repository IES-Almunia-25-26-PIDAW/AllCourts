# 🐳 Docker — AllCourts

Este documento describe cómo levantar AllCourts completo usando Docker Compose, y explica el funcionamiento de cada servicio.

---

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución
- Fichero `backend/.env` configurado (ver `backend/.env.example`)
- Fichero `frontend/.env` configurado (ver `frontend/.env.example`)

---

## Puesta en marcha

```bash
# 1. Clonar el repositorio
git clone https://github.com/IES-Almunia-25-26-PIDAW/AllCourts.git
cd AllCourts

# 2. Crear los ficheros de variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Editar ambos ficheros con los valores reales

# 3. Construir las imágenes y levantar todos los servicios
docker compose up --build -d

# 4. Verificar que todos los contenedores están en marcha
docker compose ps
```

Una vez levantado:

| Servicio  | URL                   |
|-----------|-----------------------|
| Frontend  | http://localhost:3000 |
| Backend   | http://localhost:5000 |
| Mailpit   | http://localhost:8025 |
| MySQL     | localhost:3306        |

---

## Detener los servicios

```bash
# Detener conservando los datos
docker compose down

# Detener y eliminar también los volúmenes (reset completo de la base de datos)
docker compose down -v
```

---

## Imágenes en DockerHub

| Imagen | Enlace |
|---|---|
| Backend | https://hub.docker.com/r/jesusgxmez/allcourts-backend |
| Frontend | https://hub.docker.com/r/jesusgxmez/allcourts-frontend |

---

## docker-compose.yml explicado

```yaml
services:

  # ── Base de datos ────────────────────────────────────────────────────────
  # Usa la imagen oficial de MySQL 8.4.
  # El healthcheck hace que Docker compruebe cada 10 segundos si MySQL
  # está listo para aceptar conexiones. Mientras no lo esté, el backend
  # permanece en espera y no intenta conectarse.
  db:
    image: mysql:8.4
    container_name: allcourts-db
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root       # Contraseña del usuario root
      MYSQL_DATABASE: allcourts_db    # Base de datos que se crea al arrancar
      MYSQL_USER: allcourts           # Usuario de la aplicación
      MYSQL_PASSWORD: allcourts       # Contraseña del usuario de la aplicación
    ports:
      - "3306:3306"                   # Expone MySQL en el puerto estándar del host
    volumes:
      # Volumen nombrado: los datos de MySQL se guardan fuera del contenedor.
      # Así la base de datos no se pierde al hacer 'docker compose down'.
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-uroot", "-proot"]
      interval: 10s   # Comprueba cada 10 segundos
      timeout: 5s     # Si no responde en 5 segundos, cuenta como fallo
      retries: 10     # Tras 10 fallos seguidos marca el servicio como unhealthy

  # ── Backend (API REST) ───────────────────────────────────────────────────
  # Construye la imagen desde ./backend/Dockerfile.
  # No arranca hasta que la base de datos supera el healthcheck (depends_on).
  # El comando de inicio hace dos cosas en orden:
  #   1. Ejecuta las migraciones (crea o actualiza las tablas de la BD)
  #   2. Arranca el servidor Express
  # Si las migraciones fallan, el servidor no arranca y Docker reinicia el contenedor.
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: allcourts-backend
    restart: unless-stopped
    env_file:
      - ./backend/.env              # Carga JWT_SECRET, STRIPE_SECRET_KEY, etc.
    volumes:
      # Los ficheros subidos por usuarios (imágenes de clubes, avatares)
      # se guardan en el host para que no se pierdan al recrear el contenedor.
      - ./backend/uploads:/app/uploads
    depends_on:
      db:
        condition: service_healthy  # Espera a que MySQL esté listo
    environment:
      NODE_ENV: production
    command: >
      sh -c "
      npx db-migrate up --env production --config ./src/db/database.json --migrations-dir ./src/db/migrations
      && npm start
      "
    ports:
      - "5000:5000"

  # ── Servidor de correo ───────────────────────────────────────────────────
  # Mailpit actúa como servidor SMTP local que intercepta todos los correos
  # (verificación de cuenta, recuperación de contraseña) sin enviarlos realmente.
  # Puerto 1025: SMTP, usado por el backend para enviar correos.
  # Puerto 8025: interfaz web para ver los correos interceptados.
  mailpit:
    image: axllent/mailpit
    container_name: allcourts-mailpit
    restart: unless-stopped
    ports:
      - "1025:1025"
      - "8025:8025"

  # ── Frontend (Next.js) ───────────────────────────────────────────────────
  # Construye la imagen desde ./frontend/Dockerfile (multi-stage build).
  # Depende del backend porque Next.js necesita la API disponible
  # para el renderizado en servidor (SSR).
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: allcourts-frontend
    restart: unless-stopped
    depends_on:
      - backend
    environment:
      NODE_ENV: production
    ports:
      - "3000:3000"

# Volúmenes nombrados: gestionados por Docker, independientes del sistema de ficheros del host.
# Persisten aunque se haga 'docker compose down'. Para eliminarlos: 'docker compose down -v'.
volumes:
  db_data:
```

---

## Variables de entorno

### Backend — `backend/.env`

Copia `backend/.env.example` a `backend/.env` y rellena los valores obligatorios:

| Variable | Obligatoria | Descripción |
|---|---|---|
| `PORT` | — | Puerto del servidor (por defecto `5000`) |
| `DB_HOST` | — | Host de MySQL (por defecto `db`, el nombre del servicio en Compose) |
| `DB_PORT` | — | Puerto de MySQL (por defecto `3306`) |
| `DB_USER` | — | Usuario de la base de datos |
| `DB_PASSWORD` | ✅ | Contraseña del usuario de base de datos |
| `DB_NAME` | — | Nombre de la base de datos (por defecto `allcourts_db`) |
| `JWT_SECRET` | ✅ | Clave para firmar los tokens JWT (mínimo 32 caracteres) |
| `JWT_EXPIRES_IN` | — | Tiempo de vida del token de acceso (por defecto `1h`) |
| `REFRESH_TOKEN_SECRET` | ✅ | Clave para los refresh tokens |
| `REFRESH_TOKEN_EXPIRES_IN` | — | Tiempo de vida del refresh token (por defecto `30d`) |
| `MAIL_HOST` | — | En producción real, el host del proveedor de correo |
| `MAIL_PORT` | — | Puerto SMTP (por defecto `1025`) |
| `MAIL_FROM` | — | Dirección remitente de los correos |
| `CORS_ORIGINAL` | — | URL del frontend permitida por CORS (por defecto `http://localhost:3000`) |
| `STRIPE_SECRET_KEY` | ✅ | Clave secreta de Stripe para procesar pagos |

### Frontend — `frontend/.env`

Copia `frontend/.env.example` a `frontend/.env`:

| Variable | Obligatoria | Descripción |
|---|---|---|
| `PORT` | — | Puerto del servidor Next.js (por defecto `3000`) |
| `NEXT_PUBLIC_API_URL` | ✅ | URL del backend (ej: `http://localhost:5000`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | Clave pública de Stripe para el formulario de pago |