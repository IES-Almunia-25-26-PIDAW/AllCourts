const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');

const mockQuery = jest.fn();

jest.mock('../../src/config/db', () => ({
  pool: {
    query: (...args) => mockQuery(...args),
  },
}));

jest.mock('../../src/routes/bookingRoutes', () => {
  const express = require('express');
  const router = express.Router();
  router.get('/boom', (req, res, next) => next(new Error('middleware failed')));
  return router;
});

jest.mock('../../src/routes/clubRoutes', () => {
  const express = require('express');
  return express.Router();
});

jest.mock('../../src/routes/courtRoutes', () => {
  const express = require('express');
  return express.Router();
});

jest.mock('../../src/routes/courtScheduleRoutes', () => {
  const express = require('express');
  return express.Router();
});

jest.mock('../../src/routes/managerRoutes', () => {
  const express = require('express');
  return express.Router();
});

jest.mock('../../src/routes/paymentRoutes', () => {
  const express = require('express');
  return express.Router();
});

jest.mock('../../src/routes/stripeRoutes', () => {
  const express = require('express');
  return express.Router();
});

jest.mock('../../src/routes/userRoutes', () => {
  const express = require('express');
  return express.Router();
});

jest.mock('../../src/routes/authRoutes', () => {
  const express = require('express');
  const authMiddleware = require('../../src/middlewares/authMiddleware');
  const router = express.Router();

  router.post('/login', (req, res) => {
    res.status(200).json({ message: 'login ok', identifier: req.body.identifier });
  });

  router.get('/me', authMiddleware, (req, res) => {
    res.json({ user: req.user });
  });

  return router;
});

const app = require('../../src/app');

describe('app integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'integration-secret';
    process.env.CORS_ORIGINAL = 'http://localhost:3000';
  });

  it('returns a healthy response when the database is reachable', async () => {
    mockQuery.mockResolvedValueOnce([[{ one: 1 }]]);

    const response = await request(app).get('/health-check');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.db).toEqual({ ok: true });
  });

  it('returns 503 when the healthcheck query fails', async () => {
    mockQuery.mockRejectedValueOnce(new Error('db unavailable'));

    const response = await request(app).get('/health-check');

    expect(response.status).toBe(503);
    expect(response.body.db).toEqual({ ok: false, error: 'db unavailable' });
  });

  it('returns 404 for unknown routes', async () => {
    const response = await request(app).get('/no-such-route');

    expect(response.status).toBe(404);
  });

  it('surfaces middleware errors through the global error handler', async () => {
    const response = await request(app).get('/bookings/boom');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'middleware failed' });
  });

  it('accepts the login endpoint', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ identifier: 'ana@example.com', password: 'secret123' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'login ok', identifier: 'ana@example.com' });
  });

  it('accepts a valid JWT on a protected endpoint', async () => {
    const token = jwt.sign({ id: 'user-1', role: 'player' }, 'integration-secret');

    const response = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual(expect.objectContaining({ id: 'user-1', role: 'player' }));
  });
});
