const Booking = require("../models/Booking");
const Court = require("../models/Court");
const CourtSchedule = require("../models/CourtSchedule");
const { sendBookingCancellationEmail } = require("../services/emailService");

/**
 * @module bookingController
 * Controlador de reservas.
 * Gestiona la creación y seguimiento de reservas de pistas.
 * Al crear una reserva se verifica disponibilidad (sin solapamientos) y
 * se calcula el precio automáticamente según la duración y los precios de la pista.
 *
 * Rutas esperadas:
 *   POST   /bookings                         → create         (requiere authMiddleware)
 *   GET    /bookings                         → getAll         (p.ej. solo admin)
 *   GET    /bookings/:id                     → getById
 *   GET    /bookings/user/:userId            → getByUserId
 *   GET    /bookings/court/:courtId          → getByCourtId
 *   PATCH  /bookings/:id/status             → updateStatus
 *   PATCH  /bookings/:id/cancel             → cancel
 *   DELETE /bookings/:id                     → delete
 */

/**
 * Calcula el precio total de una reserva según duración y precios de la pista.
 * Para las 3 duraciones estándar (60/90/120 min) usa el precio exacto.
 * Para otras duraciones aplica tarifa proporcional basada en price_60.
 *
 * @param {object} court - Fila de la BD con price_60, price_90, price_120
 * @param {number} durationMin - Duración en minutos
 * @returns {number} Precio total redondeado a 2 decimales
 */

function calculatePrice(court, durationMin) {
  if (durationMin === 60) return parseFloat(court.price_60);
  if (durationMin === 90) return parseFloat(court.price_90);
  if (durationMin === 120) return parseFloat(court.price_120);
  // Tarifa proporcional para duraciones no estándar
  return parseFloat(((court.price_60 / 60) * durationMin).toFixed(2));
}

function timeToMinutes(time) {
  const [hours = "0", minutes = "0", seconds = "0"] = String(time).split(":");
  return (
    Number(hours) * 60 + Number(minutes) + Math.round(Number(seconds) / 60)
  );
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
}

function hasTimeOverlap(
  startMinutes,
  endMinutes,
  bookingStartMinutes,
  bookingEndMinutes,
) {
  return startMinutes < bookingEndMinutes && endMinutes > bookingStartMinutes;
}

const bookingController = {
  /**
   * Crea una nueva reserva para el usuario autenticado.
   * Pasos:
   *   1. Verifica que la pista existe.
   *   2. Comprueba que no hay reservas activas que se solapen (checkAvailability).
   *   3. Calcula el precio total automáticamente.
   *   4. Crea la reserva con status='pending'.
   *
   * Body: { court_id, date, start_time, end_time, duration_min }
   * req.user.id debe ser inyectado por authMiddleware.
   * Response 201: { message, id, total_price }
   * Response 404: pista no encontrada
   * Response 409: pista no disponible en ese horario
   */
  create: async (req, res, next) => {
    try {
      const { court_id, date, start_time, end_time, duration_min } = req.body;
      const user_id = req.user.id; // Viene del JWT decodificado por authMiddleware

      const requestedDate = new Date(`${date}T12:00:00`);
      const dayOfWeek = requestedDate.getDay();

      // Paso 1: comprobar que la pista existe y obtener sus precios
      const [courts] = await Court.getById(court_id);
      if (courts.length === 0)
        return res.status(404).json({ message: "Court not found" });

      // Paso 1.1: comprobar que la pista tiene horario para ese día y que está abierta
      const [scheduleRows] = await CourtSchedule.getByCourtAndDay(
        court_id,
        dayOfWeek,
      );
      if (scheduleRows.length === 0) {
        return res
          .status(409)
          .json({ message: "Court schedule is required for this day" });
      }

      const schedule = scheduleRows[0];
      if (schedule.is_closed) {
        return res
          .status(409)
          .json({ message: "Court is closed on the requested day" });
      }

      if (
        start_time < schedule.opening_time ||
        end_time > schedule.closing_time
      ) {
        return res
          .status(409)
          .json({ message: "Requested time is outside court opening hours" });
      }

      // Paso 2: verificar que no hay solapamiento con otras reservas no canceladas
      const [conflicts] = await Booking.checkAvailability(
        court_id,
        date,
        start_time,
        end_time,
      );
      if (conflicts.length > 0)
        return res
          .status(409)
          .json({ message: "Court is not available for the requested time" });

      // Paso 3: calcular precio según duración
      const total_price = calculatePrice(courts[0], duration_min);

      // Paso 4: crear la reserva
      const [result] = await Booking.create({
        user_id,
        court_id,
        date,
        start_time,
        end_time,
        duration_min,
        total_price,
        status: "pending",
      });

      res.status(201).json({
        message: "Booking created successfully",
        id: result.insertId,
        total_price,
      });
    } catch (err) {
      next(err);
    }
  },

  getAvailability: async (req, res, next) => {
    try {
      const { courtId } = req.params;
      const selectedDate = Array.isArray(req.query.date)
        ? req.query.date[0]
        : req.query.date;
      const selectedDuration = Array.isArray(req.query.duration_min)
        ? req.query.duration_min[0]
        : req.query.duration_min;

      if (!selectedDate || typeof selectedDate !== "string") {
        return res.status(400).json({ message: "date is required" });
      }

      const durationMin = Number(selectedDuration || 60);
      if (!Number.isFinite(durationMin) || durationMin <= 0) {
        return res
          .status(400)
          .json({ message: "duration_min must be a positive number" });
      }

      const requestedDate = new Date(`${selectedDate}T12:00:00`);
      if (Number.isNaN(requestedDate.getTime())) {
        return res.status(400).json({ message: "Invalid date" });
      }

      const dayOfWeek = requestedDate.getDay();
      const [courts] = await Court.getById(courtId);
      if (courts.length === 0) {
        return res.status(404).json({ message: "Court not found" });
      }

      const court = courts[0];
      const [scheduleRows] = await CourtSchedule.getByCourtAndDay(
        courtId,
        dayOfWeek,
      );

      const suggestedDurations = [
        ...new Set([Number(court.min_unit_min) || 30, 60, 90, 120]),
      ]
        .filter((value) => value > 0)
        .sort((a, b) => a - b);

      if (scheduleRows.length === 0) {
        return res.json({
          court_id: Number(courtId),
          date: selectedDate,
          day_of_week: dayOfWeek,
          schedule_found: false,
          is_closed: true,
          opening_time: null,
          closing_time: null,
          duration_min: durationMin,
          slot_step_min: 30,
          suggested_durations: suggestedDurations,
          slots: [],
        });
      }

      const schedule = scheduleRows[0];
      if (schedule.is_closed) {
        return res.json({
          court_id: Number(courtId),
          date: selectedDate,
          day_of_week: dayOfWeek,
          schedule_found: true,
          is_closed: true,
          opening_time: schedule.opening_time,
          closing_time: schedule.closing_time,
          duration_min: durationMin,
          slot_step_min: 30,
          suggested_durations: suggestedDurations,
          slots: [],
        });
      }

      const [bookings] = await Booking.getByCourtAndDate(courtId, selectedDate);
      const activeBookings = bookings.map((booking) => ({
        start: timeToMinutes(booking.start_time),
        end: timeToMinutes(booking.end_time),
      }));

      const openingMinutes = timeToMinutes(schedule.opening_time);
      const closingMinutes = timeToMinutes(schedule.closing_time);
      const today = new Date();
      const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const currentMinutes = today.getHours() * 60 + today.getMinutes();
      const isToday = selectedDate === localToday;

      const slots = [];
      for (
        let startMinutes = openingMinutes;
        startMinutes <= closingMinutes;
        startMinutes += 30
      ) {
        const endMinutes = startMinutes + durationMin;
        const fitsSchedule = endMinutes <= closingMinutes;
        const isPast = isToday && startMinutes < currentMinutes;
        const available =
          fitsSchedule &&
          !isPast &&
          !activeBookings.some((booking) =>
            hasTimeOverlap(
              startMinutes,
              endMinutes,
              booking.start,
              booking.end,
            ),
          );

        slots.push({
          start_time: minutesToTime(startMinutes),
          end_time: minutesToTime(endMinutes),
          available,
        });
      }

      res.json({
        court_id: Number(courtId),
        date: selectedDate,
        day_of_week: dayOfWeek,
        schedule_found: true,
        is_closed: false,
        opening_time: schedule.opening_time,
        closing_time: schedule.closing_time,
        duration_min: durationMin,
        slot_step_min: 30,
        suggested_durations: suggestedDurations,
        slots,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Devuelve las reservas visibles para el manager autenticado con datos de usuario, pista y club (JOIN).
   * Ordenadas por fecha y hora descendente.
   *
   * Response 200: array de reservas
   */
  getAll: async (req, res, next) => {
    try {
      const [rows] = await Booking.getAll(req.user.id);
      res.json(rows);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Devuelve una reserva por su ID con datos completos (usuario, pista, club).
   *
   * Params: id
   * Response 200: objeto reserva
   * Response 404: reserva no encontrada
   */
  getById: async (req, res, next) => {
    try {
      const [rows] = await Booking.getById(req.params.id);
      if (rows.length === 0)
        return res.status(404).json({ message: "Booking not found" });
      res.json(rows[0]);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Devuelve todas las reservas de un usuario concreto.
   * Incluye datos de la pista y el club (sin datos de otros usuarios).
   *
   * Params: userId
   * Response 200: array de reservas (puede ser vacío)
   */
  getByUserId: async (req, res, next) => {
    try {
      const [rows] = await Booking.getByUserId(req.params.userId);
      res.json(rows);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Devuelve todas las reservas de una pista concreta.
   * Útil para que el manager vea la ocupación de su pista.
   *
   * Params: courtId
   * Response 200: array de reservas (puede ser vacío)
   */
  getByCourtId: async (req, res, next) => {
    try {
      const [rows] = await Booking.getByCourtId(req.params.courtId);
      res.json(rows);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Actualiza el estado de una reserva.
   * Estados posibles: 'pending' | 'confirmed' | 'cancelled'
   * Si se cancela se puede indicar el motivo en cancel_reason.
   *
   * Params: id
   * Body: { status, cancel_reason? }
   * Response 200: confirmación
   * Response 404: reserva no encontrada
   */
  updateStatus: async (req, res, next) => {
    try {
      const { status, cancel_reason } = req.body;
      const [result] = await Booking.updateStatus(
        req.params.id,
        status,
        cancel_reason || null,
      );
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Booking not found" });
      res.json({ message: "Booking status updated successfully" });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Cancela una reserva (atajo de updateStatus a 'cancelled').
   * Permite indicar motivo de cancelación.
   *
   * Params: id
   * Body: { cancel_reason? }
   * Response 200: confirmación
   * Response 404: reserva no encontrada
   */
  cancel: async (req, res, next) => {
    try {
      const { cancel_reason } = req.body;
      const [result] = await Booking.updateStatus(
        req.params.id,
        "cancelled",
        cancel_reason || null,
      );
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Booking not found" });

      const [rows] = await Booking.getById(req.params.id);
      const booking = rows[0];
      const user = {
        ...req.user,
        email: req.user?.email || booking?.user_email,
        name: req.user?.name || booking?.user_name,
      };

      try {
        await sendBookingCancellationEmail(user, booking);
      } catch (emailErr) {
        console.error("Error sending booking cancellation email:", emailErr);
      }

      res.json({ message: "Booking cancelled successfully" });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Elimina una reserva permanentemente de la BD.
   * En la mayoría de los casos es preferible cancelar en vez de eliminar.
   *
   * Params: id
   * Response 200: confirmación
   * Response 404: reserva no encontrada
   */
  delete: async (req, res, next) => {
    try {
      const [result] = await Booking.delete(req.params.id);
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Booking not found" });
      res.json({ message: "Booking deleted successfully" });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = bookingController;
