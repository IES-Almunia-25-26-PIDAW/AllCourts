const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

const authMiddleware = require('../../src/middlewares/authMiddleware');

function createRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('authMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  it('accepts a valid bearer token and executes next', () => {
    jwt.verify.mockReturnValue({ id: 'user-1', role: 'player' });
    const req = { headers: { authorization: 'Bearer valid-token' } };
    const res = createRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
    expect(req.user).toEqual({ id: 'user-1', role: 'player' });
    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('accepts a token from cookies and executes next', () => {
    jwt.verify.mockReturnValue({ id: 'user-2', role: 'manager' });
    const req = { headers: {}, cookies: { allcourts_token: 'cookie-token' } };
    const res = createRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('cookie-token', 'test-secret');
    expect(req.user).toEqual({ id: 'user-2', role: 'manager' });
    expect(next).toHaveBeenCalledWith();
  });

  it('returns 401 when there is no token', () => {
    const req = { headers: {} };
    const res = createRes();

    authMiddleware(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(jwt.verify).not.toHaveBeenCalled();
  });

  it('returns 401 for an invalid token', () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('invalid token');
    });
    const req = { headers: { authorization: 'Bearer invalid-token' } };
    const res = createRes();

    authMiddleware(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
  });

  it('returns 401 for an expired token', () => {
    jwt.verify.mockImplementation(() => {
      const error = new Error('jwt expired');
      error.name = 'TokenExpiredError';
      throw error;
    });
    const req = { headers: { authorization: 'Bearer expired-token' } };
    const res = createRes();

    authMiddleware(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
  });
});
