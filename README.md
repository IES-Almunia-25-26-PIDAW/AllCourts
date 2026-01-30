# 🎾 AllCourts

<img width="1024" height="1024" alt="logoallcourts" src="https://github.com/user-attachments/assets/0068d41c-ed0c-4064-9e5b-0978d3f22949" />

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
git clone https://github.com/tu-usuario/allcourts.git
cd allcourts
```

### 2. Configurar la base de datos
```bash
# Crear la base de datos en MySQL
mysql -u root -p < database/schema.sql
```

### 3. Configurar el Backend
```bash
cd backend
npm install

# Crear archivo .env con las variables de entorno
# DB_HOST=localhost
# DB_USER=tu_usuario
# DB_PASSWORD=tu_contraseña
# DB_NAME=allcourts
# JWT_SECRET=tu_secreto_jwt
# PORT=5000

npm run dev
```

### 4. Configurar el Frontend
```bash
cd ../frontend
npm install

# El frontend se conectará al backend en http://localhost:5000
npm run dev
```

### 5. Acceder a la aplicación
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
```

### Frontend
```bash
npm run dev      # Iniciar Next.js en modo desarrollo
npm run build    # Compilar aplicación para producción
npm start        # Iniciar servidor de producción
npm run lint     # Ejecutar linter
```

---

## 🛠 Próximas Características

- [ ] Sistema de valoraciones y reseñas
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Integración con pasarelas de pago (Stripe/PayPal)
- [ ] Sistema de torneos y competiciones
- [ ] Chat entre usuarios
- [ ] Búsqueda avanzada con filtros
- [ ] Aplicación móvil nativa
- [ ] Sistema de fidelización y descuentos

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [tu-usuario](https://github.com/tu-usuario)

---

## 📞 Contacto

¿Preguntas o sugerencias? No dudes en contactar:

- **Email:** tu-email@ejemplo.com
- **GitHub:** [tu-usuario](https://github.com/tu-usuario)

---

## 🙏 Agradecimientos

- Inspirado en **Playtomic**
- Comunidad de desarrolladores de Next.js y Node.js
- Todos los contribuidores del proyecto

---

<div align="center">
  Hecho con ❤️ por el equipo de AllCourts
</div>

