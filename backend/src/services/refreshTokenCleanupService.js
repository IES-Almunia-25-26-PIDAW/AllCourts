const RefreshToken = require("../models/RefreshTokens");

const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000;

/**
 * Ejecuta la limpieza de refresh tokens expirados o revocados.
 *
 * @returns {Promise<number>} Número de filas eliminadas.
 */
async function cleanupRefreshTokens() {
	const [result] = await RefreshToken.deleteExpiredOrRevoked();
	return result.affectedRows ?? 0;
}

/**
 * Programa la limpieza periódica de refresh tokens.
 * Ejecuta una limpieza inmediata al arrancar y luego cada 24 horas.
 *
 * @returns {NodeJS.Timeout} Identificador del intervalo creado.
 */
function startRefreshTokenCleanupJob() {
	void cleanupRefreshTokens().catch((error) => {
		console.error("Refresh token cleanup failed:", error);
	});

	return setInterval(() => {
		void cleanupRefreshTokens().catch((error) => {
			console.error("Refresh token cleanup failed:", error);
		});
	}, CLEANUP_INTERVAL_MS);
}

module.exports = {
	cleanupRefreshTokens,
	startRefreshTokenCleanupJob,
};
