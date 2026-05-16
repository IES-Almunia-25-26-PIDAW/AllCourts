/**
 * @module env
 * Carga la configuración de variables de entorno desde el archivo `.env`.
 * Debe ejecutarse antes de importar módulos que dependan de `process.env`.
 */
require("dotenv").config();
