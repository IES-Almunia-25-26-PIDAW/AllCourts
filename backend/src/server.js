/**
 * @module server
 * Punto de arranque del backend.
 * Importa la aplicación Express y la expone en el puerto configurado por entorno.
 */
const app = require("./app");

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
