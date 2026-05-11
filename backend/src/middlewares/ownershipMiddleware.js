//#region MODULES
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Court = require("../models/Court");
const Club = require("../models/Club");
//#endregion

/**
 * @module ownershipMiddleware
 * Middleware de autorización por propiedad y relación jerárquica.
 * Permite validar que un usuario, manager o propietario pueda acceder a reservas, pagos o pistas concretas.
 */

function sameId(left, right) {
  return String(left) === String(right);
}

function forbidden(res) {
  return res.status(403).json({ message: "Forbidden" });
}

function requireSameUserParam(paramName) {
  return (req, res, next) => {
    if (!sameId(req.user?.id, req.params[paramName])) {
      return forbidden(res);
    }

    next();
  };
}

async function requireManagerOwnClub(req, res, next) {
  try {
    const [clubRows] = await Club.getById(req.params.id);
    if (clubRows.length === 0) {
      return res.status(404).json({ message: "Club not found" });
    }

    if (!sameId(clubRows[0].manager_id, req.user?.id)) {
      return forbidden(res);
    }

    next();
  } catch (error) {
    next(error);
  }
}

async function loadBookingContext(bookingId) {
  const [bookingRows] = await Booking.getById(bookingId);
  if (bookingRows.length === 0) {
    return { found: false };
  }

  const booking = bookingRows[0];
  const [courtRows] = await Court.getById(booking.court_id);
  if (courtRows.length === 0) {
    return { found: false };
  }

  const court = courtRows[0];
  const [clubRows] = await Club.getById(court.club_id);
  if (clubRows.length === 0) {
    return { found: false };
  }

  return {
    found: true,
    booking,
    court,
    club: clubRows[0],
  };
}

function canAccessBookingContext(context, user) {
  if (sameId(context.booking.user_id, user.id)) {
    return true;
  }

  if (user.role !== "manager") {
    return false;
  }

  return sameId(context.club.manager_id, user.id);
}

function requireBookingAccessByParam(paramName) {
  return async (req, res, next) => {
    try {
      const bookingId = req.params[paramName];
      const context = await loadBookingContext(bookingId);
      if (!context.found) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (!canAccessBookingContext(context, req.user)) {
        return forbidden(res);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

async function requireManagerOwnCourt(req, res, next) {
  try {
    const courtId = req.params.id || req.params.courtId;
    const [courtRows] = await Court.getById(courtId);
    if (courtRows.length === 0) {
      return res.status(404).json({ message: "Court not found" });
    }

    const court = courtRows[0];
    const [clubRows] = await Club.getById(court.club_id);
    if (clubRows.length === 0) {
      return res.status(404).json({ message: "Club not found" });
    }

    if (!sameId(clubRows[0].manager_id, req.user?.id)) {
      return forbidden(res);
    }

    next();
  } catch (error) {
    next(error);
  }
}

function requirePaymentAccessByParam(paramName, lookupType = "payment") {
  return async (req, res, next) => {
    try {
      let context;

      if (lookupType === "payment") {
        const paymentId = req.params[paramName];
        const [paymentRows] = await Payment.getById(paymentId);
        if (paymentRows.length === 0) {
          return res.status(404).json({ message: "Payment not found" });
        }
        const payment = paymentRows[0];
        context = await loadBookingContext(payment.booking_id);
      } else if (lookupType === "booking") {
        const bookingId = req.params[paramName];
        context = await loadBookingContext(bookingId);
      }

      if (!context.found) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (!canAccessBookingContext(context, req.user)) {
        return forbidden(res);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

async function requirePaymentCreateAccess(req, res, next) {
  try {
    const context = await loadBookingContext(req.body.booking_id);
    if (!context.found) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!canAccessBookingContext(context, req.user)) {
      return forbidden(res);
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  requireSameUserParam,
  requireManagerOwnClub,
  requireBookingAccessByParam,
  requireManagerOwnCourt,
  requirePaymentAccessByParam,
  requirePaymentCreateAccess,
};
