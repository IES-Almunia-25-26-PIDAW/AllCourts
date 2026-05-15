const express = require('express');
const request = require('supertest');

const mockQuery = jest.fn();

jest.mock('../src/config/db', () => ({
  pool: {
    query: (...args) => mockQuery(...args),
  },
}));

const healthRoutes = require('../src/routes/healthRoutes');

describe('health routes', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it('returns an ok response when the database is available', async () => {
    mockQuery.mockResolvedValueOnce([[{ one: 1 }]]);

    const app = express();
    app.use('/health-check', healthRoutes);

    const response = await request(app).get('/health-check');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.db).toEqual({ ok: true });
  });

  it('returns a service unavailable response when the database query fails', async () => {
    mockQuery.mockRejectedValueOnce(new Error('db unavailable'));

    const app = express();
    app.use('/health-check', healthRoutes);

    const response = await request(app).get('/health-check');

    expect(response.status).toBe(503);
    expect(response.body.db).toEqual({ ok: false, error: 'db unavailable' });
  });
});
