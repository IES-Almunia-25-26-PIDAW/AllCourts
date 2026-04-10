require("./config/env");

const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const clubRoutes = require("./routes/clubRoutes");
const courtRoutes = require("./routes/courtRoutes");
const courtScheduleRoutes = require("./routes/courtScheduleRoutes");
const managerRoutes = require("./routes/managerRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
	const FRONTEND_URL = process.env.FRONTEND_URL;
	res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET,POST,PUT,PATCH,DELETE,OPTIONS"
	);

	if (req.method === "OPTIONS") {
		return res.sendStatus(204);
	}

	next();
});

app.get("/", (req, res) => {
	res.json({
		message: "AllCourts backend is running",
		endpoints: ["/auth", "/bookings", "/clubs", "/courts", "/court-schedules", "/managers", "/payments", "/users"],
	});
});

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
