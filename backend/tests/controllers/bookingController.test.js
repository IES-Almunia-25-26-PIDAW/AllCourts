const Booking = require('../../src/models/Booking');
const Court = require('../../src/models/Court');
const CourtSchedule = require('../../src/models/CourtSchedule');

const mockSendBookingCancellationEmail = jest.fn();

jest.mock('../../src/models/Booking', () => ({
  create: jest.fn(),
  checkAvailability: jest.fn(),
  getByCourtAndDate: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  getByUserId: jest.fn(),
  getByCourtId: jest.fn(),
  updateStatus: jest.fn(),
  delete: jest.fn(),
}));

jest.mock('../../src/models/Court', () => ({
  getById: jest.fn(),
}));

jest.mock('../../src/models/CourtSchedule', () => ({
  getByCourtAndDay: jest.fn(),
}));

jest.mock('../../src/services/emailService', () => ({
  sendBookingCancellationEmail: (...args) => mockSendBookingCancellationEmail(...args),
}));

const bookingController = require('../../src/controllers/bookingController');

function createRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('bookingController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Court.getById.mockResolvedValue([
      [
        {
          id: 9,
          price_60: 25,
          price_90: 35,
          price_120: 45,
          min_unit_min: 30,
        },
      ],
    ]);
    CourtSchedule.getByCourtAndDay.mockResolvedValue([
      [
        {
          id: 4,
          opening_time: '08:00:00',
          closing_time: '22:00:00',
          is_closed: false,
        },
      ],
    ]);
    Booking.checkAvailability.mockResolvedValue([[]]);
    Booking.create.mockResolvedValue([{ insertId: 55 }]);
    Booking.getByCourtAndDate.mockResolvedValue([[]]);
    Booking.getAll.mockResolvedValue([[{ id: 1 }]]);
    Booking.getById.mockResolvedValue([[{ id: 10 }]]);
    Booking.getByUserId.mockResolvedValue([[{ id: 2 }]]);
    Booking.getByCourtId.mockResolvedValue([[{ id: 3 }]]);
    Booking.updateStatus.mockResolvedValue([{ affectedRows: 1 }]);
    Booking.delete.mockResolvedValue([{ affectedRows: 1 }]);
    mockSendBookingCancellationEmail.mockResolvedValue({ messageId: 'mail-1' });
  });

  it('creates a booking successfully', async () => {
    const req = {
      user: { id: 'user-1' },
      body: {
        court_id: 9,
        date: '2026-06-10',
        start_time: '10:00:00',
        end_time: '11:00:00',
        duration_min: 60,
      },
    };
    const res = createRes();

    await bookingController.create(req, res, jest.fn());

    expect(Court.getById).toHaveBeenCalledWith(9);
    expect(CourtSchedule.getByCourtAndDay).toHaveBeenCalledWith(9, 3);
    expect(Booking.checkAvailability).toHaveBeenCalledWith(9, '2026-06-10', '10:00:00', '11:00:00');
    expect(Booking.create).toHaveBeenCalledWith(expect.objectContaining({
      user_id: 'user-1',
      court_id: 9,
      date: '2026-06-10',
      start_time: '10:00:00',
      end_time: '11:00:00',
      duration_min: 60,
      total_price: 25,
      status: 'pending',
    }));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Booking created successfully',
      id: 55,
      total_price: 25,
    });
  });

  it('returns 409 when the court has a conflicting booking', async () => {
    Booking.checkAvailability.mockResolvedValueOnce([[{ id: 99 }]]);

    const res = createRes();
    await bookingController.create(
      {
        user: { id: 'user-1' },
        body: {
          court_id: 9,
          date: '2026-06-10',
          start_time: '10:00:00',
          end_time: '11:00:00',
          duration_min: 60,
        },
      },
      res,
      jest.fn(),
    );

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'Court is not available for the requested time' });
  });

  it('returns 404 when the court does not exist', async () => {
    Court.getById.mockResolvedValueOnce([[]]);

    const res = createRes();
    await bookingController.create(
      {
        user: { id: 'user-1' },
        body: {
          court_id: 999,
          date: '2026-06-10',
          start_time: '10:00:00',
          end_time: '11:00:00',
          duration_min: 60,
        },
      },
      res,
      jest.fn(),
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Court not found' });
  });

  it('returns 400 when availability parameters are invalid', async () => {
    const resMissingDate = createRes();
    await bookingController.getAvailability({ params: { courtId: '9' }, query: { duration_min: '60' } }, resMissingDate, jest.fn());
    expect(resMissingDate.status).toHaveBeenCalledWith(400);
    expect(resMissingDate.json).toHaveBeenCalledWith({ message: 'date is required' });

    const resInvalidDuration = createRes();
    await bookingController.getAvailability({ params: { courtId: '9' }, query: { date: '2026-06-10', duration_min: '0' } }, resInvalidDuration, jest.fn());
    expect(resInvalidDuration.status).toHaveBeenCalledWith(400);
    expect(resInvalidDuration.json).toHaveBeenCalledWith({ message: 'duration_min must be a positive number' });
  });

  it('returns availability when the court is open', async () => {
    Booking.getByCourtAndDate.mockResolvedValueOnce([[{
      start_time: '11:00:00',
      end_time: '12:00:00',
      status: 'pending',
    }]]);

    const res = createRes();
    await bookingController.getAvailability(
      {
        params: { courtId: '9' },
        query: { date: '2099-06-10', duration_min: '60' },
      },
      res,
      jest.fn(),
    );

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      court_id: 9,
      date: '2099-06-10',
      schedule_found: true,
      is_closed: false,
      opening_time: '08:00:00',
      closing_time: '22:00:00',
    }));
    expect(Array.isArray(res.json.mock.calls[0][0].slots)).toBe(true);
    expect(res.json.mock.calls[0][0].slots.length).toBeGreaterThan(0);
  });

  it('does not include slots that would end after closing time', async () => {
    CourtSchedule.getByCourtAndDay.mockResolvedValueOnce([[
      {
        id: 4,
        opening_time: '21:00:00',
        closing_time: '22:00:00',
        is_closed: false,
      },
    ]]);

    const res = createRes();
    await bookingController.getAvailability(
      {
        params: { courtId: '9' },
        query: { date: '2099-06-10', duration_min: '60' },
      },
      res,
      jest.fn(),
    );

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      opening_time: '21:00:00',
      closing_time: '22:00:00',
    }));

    const { slots } = res.json.mock.calls[0][0];
    expect(slots).toEqual([
      {
        start_time: '21:00:00',
        end_time: '22:00:00',
        available: true,
      },
    ]);
  });

  it('returns closed availability when the court schedule is closed', async () => {
    CourtSchedule.getByCourtAndDay.mockResolvedValueOnce([[{
      opening_time: '08:00:00',
      closing_time: '22:00:00',
      is_closed: true,
    }]]);

    const res = createRes();
    await bookingController.getAvailability(
      {
        params: { courtId: '9' },
        query: { date: '2099-06-10', duration_min: '60' },
      },
      res,
      jest.fn(),
    );

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      court_id: 9,
      is_closed: true,
      slots: [],
    }));
  });

  it('lists bookings for a manager', async () => {
    const res = createRes();
    await bookingController.getAll({ user: { id: 'manager-1' } }, res, jest.fn());

    expect(Booking.getAll).toHaveBeenCalledWith('manager-1');
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it('returns 404 when a booking is missing', async () => {
    Booking.getById.mockResolvedValueOnce([[]]);

    const res = createRes();
    await bookingController.getById({ params: { id: '999' } }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Booking not found' });
  });

  it('lists bookings by user and by court', async () => {
    const userRes = createRes();
    await bookingController.getByUserId({ params: { userId: 'user-1' } }, userRes, jest.fn());
    expect(Booking.getByUserId).toHaveBeenCalledWith('user-1');
    expect(userRes.json).toHaveBeenCalledWith([{ id: 2 }]);

    const courtRes = createRes();
    await bookingController.getByCourtId({ params: { courtId: '9' } }, courtRes, jest.fn());
    expect(Booking.getByCourtId).toHaveBeenCalledWith('9');
    expect(courtRes.json).toHaveBeenCalledWith([{ id: 3 }]);
  });

  it('updates booking status successfully and returns 404 when missing', async () => {
    const successRes = createRes();
    await bookingController.updateStatus(
      { params: { id: '10' }, body: { status: 'confirmed', cancel_reason: 'n/a' } },
      successRes,
      jest.fn(),
    );
    expect(Booking.updateStatus).toHaveBeenCalledWith('10', 'confirmed', 'n/a');
    expect(successRes.json).toHaveBeenCalledWith({ message: 'Booking status updated successfully' });

    Booking.updateStatus.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const missingRes = createRes();
    await bookingController.updateStatus(
      { params: { id: '999' }, body: { status: 'confirmed' } },
      missingRes,
      jest.fn(),
    );
    expect(missingRes.status).toHaveBeenCalledWith(404);
    expect(missingRes.json).toHaveBeenCalledWith({ message: 'Booking not found' });
  });

  it('cancels a booking and sends a cancellation email', async () => {
    Booking.getById.mockResolvedValueOnce([[{
      id: 10,
      user_email: 'ana@example.com',
      user_name: 'Ana',
      date: '2026-06-10',
      start_time: '10:00:00',
      court_name: 'Pista central',
      court_address: 'Calle Mayor 1',
      court_city: 'Madrid',
    }]]);

    const res = createRes();
    await bookingController.cancel({ params: { id: '10' }, body: { cancel_reason: 'rain' }, user: { id: 'user-1' } }, res, jest.fn());

    expect(Booking.updateStatus).toHaveBeenCalledWith('10', 'cancelled', 'rain');
    expect(mockSendBookingCancellationEmail).toHaveBeenCalledWith(expect.objectContaining({ email: 'ana@example.com', name: 'Ana' }), expect.objectContaining({ id: 10 }));
    expect(res.json).toHaveBeenCalledWith({ message: 'Booking cancelled successfully' });
  });

  it('deletes bookings and returns 404 when needed', async () => {
    const successRes = createRes();
    await bookingController.delete({ params: { id: '10' } }, successRes, jest.fn());
    expect(successRes.json).toHaveBeenCalledWith({ message: 'Booking deleted successfully' });

    Booking.delete.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const missingRes = createRes();
    await bookingController.delete({ params: { id: '999' } }, missingRes, jest.fn());
    expect(missingRes.status).toHaveBeenCalledWith(404);
    expect(missingRes.json).toHaveBeenCalledWith({ message: 'Booking not found' });
  });

  it('forwards database errors', async () => {
    const error = new Error('database down');
    Court.getById.mockRejectedValueOnce(error);
    const next = jest.fn();

    await bookingController.create(
      {
        user: { id: 'user-1' },
        body: {
          court_id: 9,
          date: '2026-06-10',
          start_time: '10:00:00',
          end_time: '11:00:00',
          duration_min: 60,
        },
      },
      createRes(),
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});