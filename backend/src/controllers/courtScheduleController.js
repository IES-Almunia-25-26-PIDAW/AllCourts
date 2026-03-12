const CourtSchedule = require("../models/CourtSchedule");

/**
 * @module courtScheduleController
 * Controlador de horarios semanales de pistas.
 * Cada pista puede tener un horario por día de la semana (0=Domingo ... 6=Sábado).
 * La tabla tiene UNIQUE(court_id, day_of_week), por lo que se usa UPSERT
 * (INSERT ... ON DUPLICATE KEY UPDATE) para crear o actualizar en una sola operación.
 *
 * Rutas esperadas:
 *   POST   /court-schedules/bulk              → upsertBulk   (guarda los 7 días de golpe)
 *   POST   /court-schedules                   → upsert       (guarda un día concreto)
 *   GET    /court-schedules/court/:courtId    → getByCourtId
 *   GET    /court-schedules/court/:courtId/day/:dayOfWeek → getByCourtAndDay
 *   PUT    /court-schedules/:id               → update
 *   DELETE /court-schedules/:id               → delete
 *   DELETE /court-schedules/court/:courtId    → deleteByCourtId
 */
const courtScheduleController = {
    /**
     * Guarda o actualiza los horarios de los 7 días de una pista de una sola vez.
     * Itera el array y hace upsert por cada día.
     * Útil al configurar el horario completo de una pista nueva.
     *
     * Body: {
     *   court_id,
     *   schedules: [{ day_of_week, opening_time, closing_time, is_closed }, ...]
     * }
     * Response 200: confirmación
     */
    upsertBulk: async (req, res, next) => {
        try {
            const { court_id, schedules } = req.body;
            // Procesar cada día de forma secuencial (UNIQUE constraint por court_id + day_of_week)
            for (const schedule of schedules) {
                await CourtSchedule.upsert({ court_id, ...schedule });
            }
            res.json({ message: "Schedules saved successfully" });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Guarda o actualiza el horario de un día concreto de una pista.
     * Si ya existe una fila (court_id + day_of_week), la sobreescribe.
     *
     * Body: { court_id, day_of_week, opening_time, closing_time, is_closed }
     * day_of_week: 0=Dom, 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sab
     * Response 200: confirmación
     */
    upsert: async (req, res, next) => {
        try {
            const { court_id, day_of_week, opening_time, closing_time, is_closed } =
                req.body;
            await CourtSchedule.upsert({
                court_id,
                day_of_week,
                opening_time,
                closing_time,
                is_closed,
            });
            res.json({ message: "Schedule saved successfully" });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Devuelve todos los horarios de una pista, ordenados por day_of_week (0-6).
     *
     * Params: courtId
     * Response 200: array de horarios (hasta 7, uno por día)
     */
    getByCourtId: async (req, res, next) => {
        try {
            const [rows] = await CourtSchedule.getByCourtId(req.params.courtId);
            res.json(rows);
        } catch (err) {
            next(err);
        }
    },

    /**
     * Devuelve el horario de una pista para un día específico de la semana.
     * Útil para validar disponibilidad antes de mostrar huecos de reserva.
     *
     * Params: courtId, dayOfWeek (0-6)
     * Response 200: objeto horario
     * Response 404: no hay horario configurado para ese día
     */
    getByCourtAndDay: async (req, res, next) => {
        try {
            const { courtId, dayOfWeek } = req.params;
            const [rows] = await CourtSchedule.getByCourtAndDay(courtId, dayOfWeek);
            if (rows.length === 0)
                return res.status(404).json({ message: "Schedule not found" });
            res.json(rows[0]);
        } catch (err) {
            next(err);
        }
    },

    /**
     * Actualiza un horario existente por su ID (no hace upsert, requiere que exista).
     *
     * Params: id
     * Body: { opening_time?, closing_time?, is_closed? }
     * Response 200: confirmación
     * Response 404: horario no encontrado
     */
    update: async (req, res, next) => {
        try {
            const { opening_time, closing_time, is_closed } = req.body;
            const [result] = await CourtSchedule.update(req.params.id, {
                opening_time,
                closing_time,
                is_closed,
            });
            if (result.affectedRows === 0)
                return res.status(404).json({ message: "Schedule not found" });
            res.json({ message: "Schedule updated successfully" });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Elimina un horario concreto por su ID.
     *
     * Params: id
     * Response 200: confirmación
     * Response 404: horario no encontrado
     */
    delete: async (req, res, next) => {
        try {
            const [result] = await CourtSchedule.delete(req.params.id);
            if (result.affectedRows === 0)
                return res.status(404).json({ message: "Schedule not found" });
            res.json({ message: "Schedule deleted successfully" });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Elimina todos los horarios de una pista.
     * Útil antes de reconfigurar el horario completo desde cero.
     *
     * Params: courtId
     * Response 200: confirmación
     */
    deleteByCourtId: async (req, res, next) => {
        try {
            await CourtSchedule.deleteByCourtId(req.params.courtId);
            res.json({ message: "All schedules for court deleted successfully" });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = courtScheduleController;
