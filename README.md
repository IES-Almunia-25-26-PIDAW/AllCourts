# 🎾 AllCourts

<img width="1024" height="1024" alt="AllCourts Logo" src="https://github.com/user-attachments/assets/019d5034-5501-40a6-a84e-440ab98c8145" />

**AllCourts** es una **aplicación web moderna e intuitiva** para **reservar y gestionar clubes y pistas deportivas**. Inspirada en **Playtomic**, combina un **frontend en Next.js con TypeScript** y un **backend en Node.js con MySQL** para ofrecer una experiencia rápida, fiable y escalable.

---

## ✨ Características

### Para Jugadores

- 🏟 **Explorar Clubes y Pistas** – Consulta clubes, entra en cada instalación y revisa sus pistas en **tiempo real**
- 📅 **Reservar y Cancelar** – Gestiona tus reservas de forma **rápida e intuitiva**
- 💳 **Pagos Seguros** – Sistema de pagos integrado con **Stripe Elements** para completar reservas
- ✅ **Seguimiento de Reservas** – Visualiza el historial y estado de tus reservas
- 🌐 **Multiidioma** – Soporte para español e inglés (i18n)
- 📱 **Diseño Responsivo** – Experiencia optimizada en **ordenador, tablet y móvil**

### Para Gestores

- 🏢 **Panel de Gestión** – Dashboard completo para administrar pistas y reservas
- 📊 **Estadísticas** – Visualiza métricas y rendimiento de tus instalaciones
- ⚙️ **Gestión de Pistas** – Crea, edita y administra pistas deportivas
- 📆 **Control de Disponibilidad** – Gestiona horarios y disponibilidad de cada pista

---

## 💻 Tecnologías

### Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)

- **Framework:** Next.js 14+ (React framework con SSR/SSG)
- **Lenguaje:** TypeScript para type-safety
- **Estado:** Redux Toolkit para gestión de estado global
- **Estilos:** SCSS/CSS Modules
- **Internacionalización:** i18next para soporte multiidioma
- **Pagos:** Stripe Elements (`@stripe/stripe-js` + `@stripe/react-stripe-js`)
- **API Client:** helpers `fetch` tipados para comunicación con el backend

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)

- **Runtime:** Node.js
- **Framework:** Express.js para API REST
- **Base de datos:** MySQL con db-migrate
- **Autenticación:** JWT (JSON Web Tokens) via cookies httpOnly
- **Pagos:** Stripe SDK (`stripe`) con webhook de confirmación
- **Validación:** Express-validator
- **Seguridad:** bcrypt para encriptación, helmet para headers HTTP seguros

---

## 📁 Estructura del Proyecto

```
allcourts/
├── backend/           # API REST con Node.js y Express
│   ├── src/
│   │   ├── config/    # Configuración de DB y variables de entorno
│   │   ├── controllers/   # Lógica de negocio
│   │   ├── middlewares/   # Autenticación y manejo de errores
│   │   ├── models/        # Modelos de datos (Sequelize)
│   │   ├── routes/        # Definición de rutas API
│   │   └── utils/         # Utilidades
│   └── package.json
│
├── frontend/          # Aplicación Next.js con TypeScript
│   ├── src/
│   │   ├── api/          # Servicios API
│   │   ├── components/   # Componentes React reutilizables
│   │   ├── config/       # Configuración i18n
│   │   ├── pages/        # Páginas Next.js (routing)
│   │   ├── store/        # Redux store y slices
│   │   ├── styles/       # Estilos globales SCSS
│   │   └── utils/        # Funciones auxiliares
│   └── package.json
│
└── database/         # Scripts SQL y esquemas
    └── schema.sql
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v16 o superior)
- MySQL (v8.0 o superior) — o Docker para levantar todo con docker-compose
- npm o yarn
- Cuenta de Stripe (gratuita) — ver sección [Configurar Stripe](#-configurar-stripe)

### 1. Clonar el repositorio

```bash
git clone https://github.com/IES-Almunia-25-26-PIDAW/AllCourts.git
cd AllCourts
```

### 2. Configurar variables de entorno

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.local.example frontend/.env.local
```

Edita ambos archivos con tus valores. Los campos de Stripe se explican en la sección siguiente.

### 3. Configurar el Backend

```bash
cd backend
npm install

# Crear archivo .env a partir de backend/.env.example
# y ajustar valores reales de tu entorno

# Ejecutar migraciones
npm run migrate:up

npm run dev
```

El proyecto incluye una migración de datos de ejemplo para que puedas probar el flujo desde el primer arranque. Al levantar la base de datos tendrás un club demo y varias pistas cargadas.

El flujo principal de navegación del frontend es:

```text
/clubs -> /clubs/:id -> /courts/court -> /courts/:id
```

### 4. Configurar el Frontend

```bash
cd ../frontend
npm install

# El frontend se conectará al backend en http://localhost:5000
npm run dev
```

### 5. Despliegue con Docker (recomendado)

La forma recomendada de despliegue y prueba es con docker-compose desde la raíz del proyecto:

Antes de arrancar el Docker, prepara la configuración de entorno:

- Copia `backend/.env.example` a `backend/.env` y rellena sus valores.
- Copia `frontend/.env.local.example` a `frontend/.env.local` y rellena sus valores.

```bash
docker compose up -d --build
```

Esto construye las imágenes e inicia estos servicios:

- `db`: MySQL 8.4
- `backend`: API en Node/Express → `http://localhost:5000`
- `frontend`: aplicación web en Next.js → `http://localhost:3000`
- `mailpit`: bandeja de correo de prueba → `http://localhost:8025`

Valores importantes:

- `backend/.env` debe usar `DB_HOST=db`, `MAIL_HOST=mailpit` y `APP_URL=http://localhost:3000`
- `frontend/.env.local` debe usar `NEXT_PUBLIC_API_URL=http://localhost:5000`

Para comprobar que todo está levantado:

```bash
docker compose ps
```

Para parar el entorno:

```bash
docker compose down
```

Si quieres borrar también los datos persistentes de MySQL:

```bash
docker compose down -v
```

### 6. Levantar en local (sin Docker)

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev

# Terminal 3 — Stripe CLI (necesaria para pruebas de pago)
stripe listen --forward-to localhost:5000/stripe/webhook
```

### 7. Acceder a la aplicación

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Mailpit: http://localhost:8025

El recorrido principal de la interfaz es:

```text
/clubs -> /clubs/:id -> /courts/court -> /courts/:id
```

### Datos de ejemplo

Para desarrollo local se incluye una migración de seed con un club demo, un manager y varias pistas. Si la interfaz te aparece vacía, normalmente significa que no se han ejecutado las migraciones o que la base de datos no contiene todavía esa seed.

---

## 💳 Configurar Stripe

### 1. Crear cuenta

Regístrate gratis en [stripe.com](https://stripe.com). Asegúrate de estar en **modo test**.

### 2. Obtener las claves

Ve a [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys):

| Clave | Dónde va | Ejemplo |
|-------|----------|---------|
| **Publishable key** | `frontend/.env.local` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` |
| **Secret key** | `backend/.env` → `STRIPE_SECRET_KEY` | `sk_test_...` |

> La clave secreta **nunca** debe estar en el frontend ni en Git.

### 3. Instalar la Stripe CLI

Descarga el ZIP desde [github.com/stripe/stripe-cli/releases](https://github.com/stripe/stripe-cli/releases), extrae el `stripe.exe` (Windows) en una carpeta, por ejemplo `D:\stripe\`, y añádela al PATH:

```powershell
# PowerShell como administrador
[Environment]::SetEnvironmentVariable(
  "Path",
  $env:Path + ";D:\stripe",
  [EnvironmentVariableTarget]::Machine
)
```

Cierra y vuelve a abrir PowerShell. Verifica:

```bash
stripe --version
```

Inicia sesión:

```bash
stripe login
```

### 4. Configurar el webhook en local

Con el backend corriendo, ejecuta en una terminal dedicada:

```bash
stripe listen --forward-to localhost:5000/stripe/webhook
```

Copia el `whsec_...` que aparece en la terminal y ponlo en `backend/.env`:

```
STRIPE_WEBHOOK_SECRET=whsec_...
```

> Debes tener esta terminal abierta siempre que quieras probar pagos en local.

### 5. Tarjetas de prueba

Usa estas tarjetas en el formulario de pago para simular distintos escenarios:

| Número | Resultado |
|--------|-----------|
| `4242 4242 4242 4242` | ✅ Pago exitoso |
| `4000 0000 0000 0002` | ❌ Tarjeta rechazada |
| `4000 0025 0000 3155` | 🔐 Requiere autenticación 3D Secure |

Fecha de expiración: cualquiera futura. CVV: cualquier 3 dígitos. CP: cualquier 5 dígitos.

### 6. Pasar a producción

Cuando quieras cobros reales:

1. Cambia `STRIPE_SECRET_KEY` por la clave `sk_live_...`
2. Cambia `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` por la clave `pk_live_...`
3. Registra el webhook en [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks) apuntando a tu dominio real (`https://tu-dominio.com/stripe/webhook`) y copia el nuevo `STRIPE_WEBHOOK_SECRET`

El código no cambia nada, solo las variables de entorno.

---

## 📌 Primeros pasos

### Usuarios

1. **Registrarse** – Crea una cuenta como jugador o gestor de pistas
2. **Explorar Clubes** – Navega por los clubes disponibles y entra en el que te interese
3. **Ver Pistas** – Consulta las pistas de cada club y revisa sus precios
4. **Reservar** – Selecciona fecha, hora y completa el pago con Stripe
5. **Gestionar** – Visualiza y administra tus reservas desde tu dashboard

### Gestores

1. **Crear Perfil de Gestor** – Regístrate como administrador de instalaciones
2. **Añadir Pistas** – Configura tus pistas deportivas
3. **Gestionar Disponibilidad** – Define horarios y precios
4. **Ver Estadísticas** – Analiza el rendimiento de tus instalaciones

---

## 🔑 API Endpoints

### Autenticación (`/auth`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/auth/register` | Registrar nuevo usuario |
| `POST` | `/auth/login` | Iniciar sesión |
| `POST` | `/auth/logout` | Cerrar sesión |
| `GET` | `/auth/me` | Obtener usuario autenticado |
| `POST` | `/auth/refresh` | Renovar token de sesión |
| `GET` | `/auth/verify/:token` | Verificar email |

### Pistas (`/courts`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/courts` | Listar todas las pistas |
| `GET` | `/courts/:id` | Detalle de una pista |
| `GET` | `/courts/club/:clubId` | Pistas de un club |
| `POST` | `/courts` | Crear pista (solo gestores) |
| `PUT` | `/courts/:id` | Actualizar pista (solo gestores) |
| `DELETE` | `/courts/:id` | Eliminar pista (solo gestores) |

### Reservas (`/bookings`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/bookings` | Crear reserva |
| `GET` | `/bookings` | Todas las reservas (solo managers) |
| `GET` | `/bookings/:id` | Detalle de una reserva |
| `GET` | `/bookings/user/:userId` | Reservas de un usuario |
| `GET` | `/bookings/court/:courtId` | Reservas de una pista (solo managers) |
| `GET` | `/bookings/availability/:courtId` | Disponibilidad de una pista |
| `PATCH` | `/bookings/:id/status` | Actualizar estado (solo managers) |
| `PATCH` | `/bookings/:id/cancel` | Cancelar reserva |
| `DELETE` | `/bookings/:id` | Eliminar reserva (solo managers) |

### Pagos (`/payments`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/payments` | Todos los pagos (solo managers) |
| `GET` | `/payments/:id` | Detalle de un pago |
| `GET` | `/payments/booking/:bookingId` | Pago de una reserva |
| `GET` | `/payments/user/:userId` | Historial de pagos de un usuario |
| `GET` | `/payments/manager/:managerId` | Pagos recibidos por un manager |
| `PATCH` | `/payments/:id/status` | Actualizar estado (solo managers) |

### Stripe (`/stripe`)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/stripe/create-payment-intent` | Crear PaymentIntent para una reserva | ✅ Requerida |
| `POST` | `/stripe/webhook` | Webhook de confirmación de Stripe | ❌ (firma Stripe) |

### Gestores (`/managers`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/managers` | Listar gestores |
| `GET` | `/managers/user/:userId` | Manager por user ID |
| `GET` | `/managers/:id` | Detalle de un manager |
| `GET` | `/managers/:id/stats` | Estadísticas del manager |
| `GET` | `/managers/:id/courts` | Pistas del manager |
| `PATCH` | `/managers/:id/subscription` | Actualizar suscripción |
| `DELETE` | `/managers/:id` | Eliminar manager |

### Clubes (`/clubs`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/clubs` | Listar clubes |
| `GET` | `/clubs/:id` | Detalle de un club |

---

## 🔒 Seguridad

- **Autenticación JWT:** Tokens seguros via cookies httpOnly (no accesibles desde JavaScript)
- **Encriptación:** Contraseñas encriptadas con bcrypt
- **Middleware de Roles:** Control de acceso basado en roles (jugador/gestor)
- **Validación de Datos:** Validación en backend con express-validator
- **Stripe webhook:** Verificación criptográfica de firma para garantizar que los eventos vienen de Stripe
- **PCI Compliance:** Los datos de tarjeta nunca pasan por nuestros servidores (Stripe Elements los gestiona directamente)
- **Headers Seguros:** Protección con helmet.js

---

## 🌍 Internacionalización

La aplicación soporta múltiples idiomas:

- 🇪🇸 Español
- 🇬🇧 Inglés

Los usuarios pueden cambiar el idioma desde la interfaz.

---

## 📝 Scripts Disponibles

### Backend

```bash
npm run dev                                    # Iniciar servidor en modo desarrollo
npm start                                      # Iniciar servidor en producción
npm run migrate:up                             # Aplicar migraciones pendientes
npm run migrate:down                           # Revertir la última migración
npm run migrate:status                         # Ver estado de migraciones
npm run migrate:create -- nombre_migracion     # Crear nueva migración
```

### Frontend

```bash
npm run dev      # Iniciar Next.js en modo desarrollo
npm run build    # Compilar aplicación para producción
npm start        # Iniciar servidor de producción
npm run lint     # Ejecutar linter
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

<div align="center">
  Hecho con ❤️ por el equipo de AllCourts
</div>