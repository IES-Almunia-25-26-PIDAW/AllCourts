# AllCourts

Aplicación web para gestionar clubes, pistas, reservas y pagos. El proyecto está dividido en un frontend con Next.js y un backend con Node.js, MySQL y autenticación JWT.

## Stack

- Frontend: Next.js, React, TypeScript, Redux Toolkit, SCSS
- Backend: Node.js, Express, MySQL, JWT, Nodemailer
- Entorno de desarrollo: Docker Compose, MySQL y Mailpit

## Requisitos

- Docker y Docker Compose
- Node.js 20+ si quieres ejecutar frontend o backend fuera de Docker

## Estructura

- `backend/`: API REST, migraciones, configuración de correo y base de datos
- `frontend/`: interfaz web
- `database/`: scripts SQL de apoyo
- `docker-compose.yml`: arranque completo del stack

## Variables de entorno

### Backend

Copia `backend/.env.example` a `backend/.env` y ajusta estos valores:

```env
PORT=5000
DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=allcourts_db
SALT_ROUNDS=10
JWT_SECRET=change_me_in_production
JWT_EXPIRES_IN=1h
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_FROM=no-reply@allcourts.com
APP_URL=http://localhost:3000
CORS_ORIGINAL=http://localhost:3000
```

### Frontend

<<<<<<< Updated upstream
## ⚙️ Instalación y Configuración
=======
Copia `frontend/.env.example` a `frontend/.env` y deja:
>>>>>>> Stashed changes

```env
PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

<<<<<<< Updated upstream
- Node.js (v16 o superior)
- MySQL (v8.0 o superior)
- Docker Engine

## 🚀 Pasos a seguir para el despliegue:
=======
## Ejecutar en local con Docker
>>>>>>> Stashed changes

Desde la raíz del proyecto:

```bash
docker compose up -d --build
```

<<<<<<< Updated upstream
### 2. Configurar el Backend

```bash
cd backend

# Copiar archivo backend/.env.example a backend/.env
# y ajustar valores reales de tu entorno

```

### 4. Configurar el Frontend

```bash
cd frontend

# Copiar archivo frontend/.env.example a frontend/.env
# y ajustar valores reales de tu entorno

```

### 5. Despliegue con Docker

La forma recomendada de despliegue y prueba es con docker-compose desde la raíz del proyecto:

```bash
docker compose up -d --build
```

Esto construye las imágenes e inicia estos servicios:

- `db`: MySQL 8.4
- `backend`: API en Node/Express -> `http://localhost:5000`
- `frontend`: aplicación web en Next.js -> `http://localhost:3000`
- `mailpit`: bandeja de correo de prueba con mailpit -> `http://localhost:8025`

Valores importantes:

- `backend/.env` debe usar `DB_HOST=db`, `MAIL_HOST=mailpit` y `APP_URL=http://localhost:3000`
- `frontend/.env` debe usar `NEXT_PUBLIC_API_URL=http://localhost:5000`

Para comprobar que todo está levantado:
=======
Esto levanta estos servicios:

- `db`: MySQL
- `backend`: API en `http://localhost:5000`
- `frontend`: web en `http://localhost:3000`
- `mailpit`: bandeja de prueba en `http://localhost:8025`

Para comprobar el estado:
>>>>>>> Stashed changes

```bash
docker compose ps
```

<<<<<<< Updated upstream
Para parar el entorno:
=======
Para parar todo:
>>>>>>> Stashed changes

```bash
docker compose down
```

<<<<<<< Updated upstream
Si quieres borrar también los datos persistentes de MySQL:

```bash
docker compose down -v
```

### 6. Acceder a la aplicación

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Mailpit: http://localhost:8025

### Datos de ejemplo

Para desarrollo local, el proyecto incluye una migración de datos de ejemplo con un club demo, un manager y varias pistas. Al levantar el proyecto, tendrías en la BBDD los datos de demo cargados.

El flujo principal de navegación de la interfaz es:

```text
/clubs -> /clubs/:id -> /courts/court -> /courts/:id
```

---

## 📌 Primeros pasos

### Usuarios

1. **Registrarse** – Crea una cuenta como jugador o gestor de pistas
2. **Explorar Clubes** – Navega por los clubes disponibles y entra en el que te interese
3. **Ver Pistas** – Consulta las pistas de cada club y revisa sus precios
4. **Reservar** – Selecciona fecha, hora y completa el pago
5. **Gestionar** – Visualiza y administra tus reservas desde tu dashboard

### Gestores

1. **Crear Perfil de Gestor** – Regístrate como administrador de instalaciones
2. **Añadir Pistas** – Configura tus pistas deportivas
3. **Gestionar Disponibilidad** – Define horarios y precios
4. **Ver Estadísticas** – Analiza el rendimiento de tus instalaciones

---

## 🔑 API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil del usuario

### Pistas

- `GET /api/courts` - Listar todas las pistas
- `GET /api/courts/:id` - Obtener detalle de una pista
- `POST /api/courts` - Crear nueva pista (solo gestores)
- `PUT /api/courts/:id` - Actualizar pista (solo gestores)
- `DELETE /api/courts/:id` - Eliminar pista (solo gestores)

### Reservas

- `GET /api/bookings` - Obtener reservas del usuario
- `POST /api/bookings` - Crear nueva reserva
- `PUT /api/bookings/:id` - Actualizar reserva
- `DELETE /api/bookings/:id` - Cancelar reserva

### Pagos

- `POST /api/payments` - Procesar pago de reserva
- `GET /api/payments/:id` - Obtener detalle de pago

### Gestores

- `GET /api/managers/dashboard` - Obtener estadísticas del gestor
- `GET /api/managers/bookings` - Listar reservas de las pistas del gestor

---

## 🔒 Seguridad

- **Autenticación JWT:** Tokens seguros para gestión de sesiones
- **Encriptación:** Contraseñas encriptadas con bcrypt
- **Middleware de Roles:** Control de acceso basado en roles (jugador/gestor)
- **Validación de Datos:** Validación en backend con express-validator
- **Headers Seguros:** Protección con helmet.js

---

## 🌍 Internacionalización

La aplicación soporta múltiples idiomas:

- 🇪🇸 Español
- 🇬🇧 Inglés

Los usuarios pueden cambiar el idioma desde la interfaz.

---

## 📝 Scripts Disponibles
=======
## Ejecutar sin Docker

Si prefieres levantarlo manualmente:
>>>>>>> Stashed changes

### Backend

```bash
cd backend
npm install
npm run migrate:up
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Qué probar

- Registro e inicio de sesión
- Verificación de email desde Mailpit
- Listado de clubes y pistas
- Creación y gestión de reservas

## Producción / despliegue

La forma recomendada de despliegue es con Docker Compose:

1. Configura las variables de entorno de backend y frontend.
2. Asegúrate de que `MAIL_HOST` apunte a Mailpit en desarrollo o al SMTP real en producción.
3. Ejecuta `docker compose up -d --build`.
4. Verifica el arranque con `docker compose ps`.
5. Expón al exterior solo los puertos que necesites, normalmente `3000` y `5000`, o colócalo detrás de un proxy inverso.

## Notas

- El backend ejecuta migraciones al arrancar dentro del contenedor.
- Mailpit solo se usa para desarrollo y pruebas de correo.
- Si cambias credenciales de base de datos o correo, actualiza los archivos `.env` antes de levantar los contenedores.
