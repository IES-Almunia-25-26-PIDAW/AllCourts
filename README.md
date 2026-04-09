# 🎾 AllCourts

<img width="1024" height="1024" alt="AllCourts Logo" src="https://github.com/user-attachments/assets/019d5034-5501-40a6-a84e-440ab98c8145" />


**AllCourts** es una **aplicación web moderna e intuitiva** para **reservar y gestionar pistas deportivas**. Inspirada en **Playtomic**, combina un **frontend en Next.js con TypeScript** y un **backend en Node.js con MySQL** para ofrecer una experiencia rápida, fiable y escalable.  

---

## ✨ Características

### Para Jugadores
- 🏟 **Explorar Pistas** – Consulta la disponibilidad de pistas deportivas en **tiempo real**  
- 📅 **Reservar y Cancelar** – Gestiona tus reservas de forma **rápida e intuitiva**  
- 💳 **Pagos Seguros** – Sistema de pagos integrado para completar reservas  
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

- **Framework:** Next.js 14+ (React framework con SSR/SSG)
- **Lenguaje:** TypeScript para type-safety
- **Estado:** Redux Toolkit para gestión de estado global
- **Estilos:** SCSS/CSS Modules
- **Internacionalización:** i18next para soporte multiidioma
- **API Client:** Axios para comunicación con el backend

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

- **Runtime:** Node.js
- **Framework:** Express.js para API REST
- **Base de datos:** MySQL con Sequelize ORM
- **Autenticación:** JWT (JSON Web Tokens)
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
- MySQL (v8.0 o superior)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/IES-Almunia-25-26-PIDAW/AllCourts.git
cd allcourts
```

### 2. Configurar la base de datos
```bash
# Opcional: crear la base de datos manualmente (si no existe)
# CREATE DATABASE allcourts_db;
```

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

### 4. Configurar el Frontend
```bash
cd ../frontend
npm install

# El frontend se conectará al backend en http://localhost:5000
npm run dev
```

### 5. Despliegue con Docker
Si quieres levantar todo el stack con Docker, usa docker-compose desde la raíz del proyecto:

```bash
git clone https://github.com/IES-Almunia-25-26-PIDAW/AllCourts.git
cd AllCourts
docker compose up --build -d
```

Esto crea y levanta los siguientes servicios:
- `db`: MySQL 8.4
- `backend`: API en Node/Express en el puerto `5000`
- `frontend`: Next.js en el puerto `3000`

Verifica el estado con:

```bash
docker compose ps
```

Para detener y eliminar los contenedores, redes y volúmenes creados:

```bash
docker compose down
```

> Nota: el backend en `docker-compose.yml` ya define las variables de entorno necesarias para la base de datos y JWT en modo producción.

### 6. Acceder a la aplicación
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## 📌 Primeros pasos

### Usuarios
1. **Registrarse** – Crea una cuenta como jugador o gestor de pistas
2. **Explorar Pistas** – Navega por las pistas disponibles
3. **Reservar** – Selecciona fecha, hora y completa el pago
4. **Gestionar** – Visualiza y administra tus reservas desde tu dashboard

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

### Backend
```bash
npm run dev      # Iniciar servidor en modo desarrollo
npm start        # Iniciar servidor en producción
npm run migrate:up      # Aplicar migraciones pendientes
npm run migrate:down    # Revertir la ultima migracion
npm run migrate:status  # Ver estado de migraciones
npm run migrate:create -- nombre_migracion  # Crear nueva migracion
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

