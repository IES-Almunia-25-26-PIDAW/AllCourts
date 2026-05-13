//#region MODULES
const express = require('express');
const { body } = require('express-validator');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');
const handleValidation = require('../middlewares/handleValidation');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  requireSameUserParam,
  requireBookingAccessByParam,
  requireManagerOwnCourt
} = require('../middlewares/ownershipMiddleware');
//#endregion

/**
 * @module bookingRouter
 * Rutas de reservas.
 *
 * POST   /bookings                → Crear una reserva (requiere token)
 * GET    /bookings                → Listar todas las reservas (solo gestores)
 * GET    /bookings/user/:userId   → Reservas de un usuario autenticado
 * GET    /bookings/court/:courtId → Reservas de una pista (solo gestores)
 * GET    /bookings/:id            → Detalle de una reserva
 * PATCH  /bookings/:id/status     → Actualizar estado de una reserva (solo gestores)
 * PATCH  /bookings/:id/cancel     → Cancelar una reserva
 * DELETE /bookings/:id            → Eliminar una reserva (solo gestores)
 */
const router = express.Router();

router.post(
  '/',
  authMiddleware,
  body('court_id')
    .notEmpty()
    .withMessage('La pista es obligatoria')
    .isInt({ min: 1 })
    .withMessage('La pista debe ser un identificador válido'),
  body('date').notEmpty().withMessage('La fecha es obligatoria').isISO8601().withMessage('La fecha no es válida'),
  body('start_time')
    .notEmpty()
    .withMessage('La hora de inicio es obligatoria')
    .matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
    .withMessage('La hora de inicio no es válida'),
  body('end_time')
    .notEmpty()
    .withMessage('La hora de fin es obligatoria')
    .matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
    .withMessage('La hora de fin no es válida'),
  body('duration_min')
    .notEmpty()
    .withMessage('La duración es obligatoria')
    .isInt({ min: 1 })
    .withMessage('La duración debe ser un número entero válido'),
  handleValidation,
  bookingController.create
);
router.get('/', authMiddleware, roleMiddleware('manager'), bookingController.getAll);
router.get('/user/:userId', authMiddleware, requireSameUserParam('userId'), bookingController.getByUserId);
router.get(
  '/court/:courtId',
  authMiddleware,
  roleMiddleware('manager'),
  requireManagerOwnCourt,
  bookingController.getByCourtId
);
router.get('/availability/:courtId', bookingController.getAvailability);
router.get('/:id', authMiddleware, requireBookingAccessByParam('id'), bookingController.getById);
router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware('manager'),
  requireBookingAccessByParam('id'),
  body('status')
    .notEmpty()
    .withMessage('El estado es obligatorio')
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('El estado no es válido'),
  handleValidation,
  bookingController.updateStatus
);
router.patch('/:id/cancel', authMiddleware, requireBookingAccessByParam('id'), bookingController.cancel);
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('manager'),
  requireBookingAccessByParam('id'),
  bookingController.delete
);

module.exports = router;
