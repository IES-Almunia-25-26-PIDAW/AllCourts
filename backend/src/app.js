require("./config/env");

const express = require("express");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

app.use(errorHandler);

module.exports = app;
