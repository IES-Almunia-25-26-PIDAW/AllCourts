require("./config/env");

/**
 * @module app
 * Configuración principal de Express para AllCourts.
 * Registra CORS, cookies, rutas, archivos estáticos y el manejador global de errores.
 */

const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const clubRoutes = require("./routes/clubRoutes");
const courtRoutes = require("./routes/courtRoutes");
const courtScheduleRoutes = require("./routes/courtScheduleRoutes");
const managerRoutes = require("./routes/managerRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const userRoutes = require("./routes/userRoutes");
const healthRoutes = require("./routes/healthRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

/**
 * Configura CORS para el frontend y corta las preflight requests.
 *
 * @param {import('express').Request} req Petición HTTP.
 * @param {import('express').Response} res Respuesta HTTP.
 * @param {import('express').NextFunction} next Middleware siguiente.
 */
function corsMiddleware(req, res, next) {
	const FRONTEND_URL = process.env.CORS_ORIGINAL || process.env.FRONTEND_URL;
	res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization",
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET,POST,PUT,PATCH,DELETE,OPTIONS",
	);
	if (req.method === "OPTIONS") {
		return res.sendStatus(204);
	}
	next();
}

/**
 * Devuelve un payload mínimo de estado del backend.
 *
 * @param {import('express').Request} req Petición HTTP.
 * @param {import('express').Response} res Respuesta HTTP.
 */
function rootStatusHandler(req, res) {
	res.json({
		message: "AllCourts backend is running",
		endpoints: [
			"/auth",
			"/bookings",
			"/clubs",
			"/courts",
			"/court-schedules",
			"/managers",
			"/payments",
			"/stripe",
			"/users",
		],
	});
}

app.use(corsMiddleware);

app.use(cookieParser());
app.use("/stripe", stripeRoutes);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", rootStatusHandler);

app.use("/health-check", healthRoutes);
app.use("/auth", authRoutes);
app.use("/bookings", bookingRoutes);
app.use("/clubs", clubRoutes);
app.use("/courts", courtRoutes);
app.use("/court-schedules", courtScheduleRoutes);
app.use("/managers", managerRoutes);
app.use("/payments", paymentRoutes);
app.use("/users", userRoutes);

app.use(errorHandler);

module.exports = app;
