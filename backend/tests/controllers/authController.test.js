const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mockSendVerificationEmail = jest.fn();
const mockSendPasswordResetEmail = jest.fn();

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

jest.mock('../../src/models/User', () => ({
  create: jest.fn(),
  getByEmail: jest.fn(),
  getByUsername: jest.fn(),
  getById: jest.fn(),
  updateLastLogin: jest.fn(),
  setVerificationToken: jest.fn(),
  verifyUser: jest.fn(),
  findByResetToken: jest.fn(),
  updatePassword: jest.fn(),
  clearResetToken: jest.fn(),
}));

jest.mock('../../src/models/Manager', () => ({
  create: jest.fn(),
  getById: jest.fn(),
}));

jest.mock('../../src/models/RefreshTokens', () => ({
  create: jest.fn(),
  findByHash: jest.fn(),
  revokeByHash: jest.fn(),
}));

jest.mock('../../src/services/emailService', () => ({
  sendVerificationEmail: (...args) => mockSendVerificationEmail(...args),
  sendPasswordResetEmail: (...args) => mockSendPasswordResetEmail(...args),
}));

process.env.NODE_ENV = 'test';
process.env.SALT_ROUNDS = '10';
process.env.JWT_SECRET = 'access-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.REFRESH_TOKEN_SECRET = 'refresh-secret';
process.env.REFRESH_TOKEN_EXPIRES_IN = '30d';

const User = require('../../src/models/User');
const Manager = require('../../src/models/Manager');
const RefreshToken = require('../../src/models/RefreshTokens');
const authController = require('../../src/controllers/authController');

function createRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
}

describe('authController', () => {
  let randomUuidSpy;
  let randomBytesSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    randomUuidSpy = jest.spyOn(crypto, 'randomUUID').mockReturnValue('uuid-1234');
    randomBytesSpy = jest.spyOn(crypto, 'randomBytes').mockReturnValue(Buffer.from('0123456789abcdef0123456789abcdef', 'hex'));
    bcrypt.hash.mockResolvedValue('hashed-password');
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockImplementationOnce(() => 'access-token').mockImplementationOnce(() => 'refresh-token');
    User.create.mockResolvedValue([[]]);
    User.setVerificationToken.mockResolvedValue([[]]);
    User.updateLastLogin.mockResolvedValue([[]]);
    User.getById.mockResolvedValue([[]]);
    User.verifyUser.mockResolvedValue([{ affectedRows: 1 }]);
    User.findByResetToken.mockResolvedValue([[]]);
    User.updatePassword.mockResolvedValue([[]]);
    User.clearResetToken.mockResolvedValue([[]]);
    Manager.create.mockResolvedValue([[]]);
    RefreshToken.create.mockResolvedValue([[]]);
    RefreshToken.findByHash.mockResolvedValue([[]]);
    RefreshToken.revokeByHash.mockResolvedValue([[]]);
    mockSendVerificationEmail.mockResolvedValue({ messageId: 'mail-1' });
    mockSendPasswordResetEmail.mockResolvedValue({ messageId: 'mail-2' });
  });

  afterEach(() => {
    randomUuidSpy.mockRestore();
    randomBytesSpy.mockRestore();
  });

  it('registers a player successfully', async () => {
    User.getByEmail.mockResolvedValueOnce([[]]);
    User.getByUsername.mockResolvedValueOnce([[]]);

    const req = {
      body: {
        name: 'Ana Player',
        username: 'anaplayer',
        email: 'ana@example.com',
        password: 'secret123',
        role: 'player',
        phone: '600000000',
        avatar_url: '/avatar.png',
      },
    };
    const res = createRes();
    const next = jest.fn();

    await authController.register(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith('secret123', 10);
    expect(User.create).toHaveBeenCalledWith({
      id: 'uuid-1234',
      name: 'Ana Player',
      username: 'anaplayer',
      email: 'ana@example.com',
      password: 'hashed-password',
      role: 'player',
      phone: '600000000',
      avatar_url: '/avatar.png',
    });
    expect(User.setVerificationToken).toHaveBeenCalledWith('uuid-1234', '0123456789abcdef0123456789abcdef', expect.any(Date));
    expect(mockSendVerificationEmail).toHaveBeenCalledWith('ana@example.com', '0123456789abcdef0123456789abcdef');
    expect(Manager.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
  });

  it('returns 409 when the email is already registered', async () => {
    User.getByEmail.mockResolvedValueOnce([[{ id: 'existing' }]]);

    const req = {
      body: {
        name: 'Ana Player',
        username: 'anaplayer',
        email: 'ana@example.com',
        password: 'secret123',
      },
    };
    const res = createRes();

    await authController.register(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'Correo electrónico ya registrado' });
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  it('returns 409 when the username is already registered', async () => {
    User.getByEmail.mockResolvedValueOnce([[]]);
    User.getByUsername.mockResolvedValueOnce([[{ id: 'existing' }]]);

    const req = {
      body: {
        name: 'Ana Player',
        username: 'anaplayer',
        email: 'ana@example.com',
        password: 'secret123',
      },
    };
    const res = createRes();

    await authController.register(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'Nombre de usuario ya registrado' });
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  it('returns 200 and sets auth cookies on successful login', async () => {
    User.getByEmail.mockResolvedValueOnce([[{
      id: 'user-1',
      name: 'Ana Player',
      username: 'anaplayer',
      email: 'ana@example.com',
      password: 'hashed-password',
      role: 'player',
      phone: '600000000',
      avatar_url: '/avatar.png',
      is_verified: true,
      verification_token: 'secret-token',
      token_expires_at: new Date().toISOString(),
    }]]);

    const req = {
      body: {
        identifier: 'ana@example.com',
        password: 'secret123',
      },
    };
    const res = createRes();

    await authController.login(req, res, jest.fn());

    expect(bcrypt.compare).toHaveBeenCalledWith('secret123', 'hashed-password');
    expect(jwt.sign).toHaveBeenNthCalledWith(1, { id: 'user-1', role: 'player' }, 'access-secret', { expiresIn: '1h' });
    expect(jwt.sign).toHaveBeenNthCalledWith(2, { id: 'user-1', type: 'refresh' }, 'refresh-secret', { expiresIn: '30d' });
    expect(RefreshToken.create).toHaveBeenCalledWith(expect.objectContaining({
      id: 'uuid-1234',
      user_id: 'user-1',
      token_hash: expect.any(String),
      expires_at: expect.any(Date),
    }));
    expect(res.cookie).toHaveBeenCalledWith('allcourts_token', 'access-token', expect.objectContaining({
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 1000,
    }));
    expect(res.cookie).toHaveBeenCalledWith('allcourts_refresh_token', 'refresh-token', expect.objectContaining({
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    }));
    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: 'user-1',
        name: 'Ana Player',
        username: 'anaplayer',
        email: 'ana@example.com',
        role: 'player',
        phone: '600000000',
        avatar_url: '/avatar.png',
        is_verified: true,
      },
    });
  });

  it('returns 401 when credentials are invalid', async () => {
    User.getByEmail.mockResolvedValueOnce([[{
      id: 'user-1',
      password: 'hashed-password',
      is_verified: true,
    }]]);
    bcrypt.compare.mockResolvedValueOnce(false);

    const req = {
      body: {
        identifier: 'ana@example.com',
        password: 'wrong-password',
      },
    };
    const res = createRes();

    await authController.login(req, res, jest.fn());

    expect(bcrypt.compare).toHaveBeenCalledWith('wrong-password', 'hashed-password');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Credenciales incorrectas' });
  });

  it('returns 404 when login is not found by identifier', async () => {
    User.getByEmail.mockResolvedValueOnce([[]]);

    const req = {
      body: {
        identifier: 'missing@example.com',
        password: 'wrong-password',
      },
    };
    const res = createRes();

    await authController.login(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Credenciales incorrectas' });
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  it('returns 403 when the user is not verified', async () => {
    User.getByEmail.mockResolvedValueOnce([[{
      id: 'user-1',
      password: 'hashed-password',
      is_verified: false,
    }]]);

    const req = {
      body: {
        identifier: 'ana@example.com',
        password: 'secret123',
      },
    };
    const res = createRes();

    await authController.login(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Verifica tu correo electrónico para poder iniciar sesión. Revisa tu bandeja de entrada o de spam',
    });
  });

  it('forwards database errors from register', async () => {
    const error = new Error('database failure');
    User.getByEmail.mockRejectedValueOnce(error);
    const next = jest.fn();

    await authController.register(
      {
        body: {
          name: 'Ana Player',
          username: 'anaplayer',
          email: 'ana@example.com',
          password: 'secret123',
        },
      },
      createRes(),
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
  });

  it('returns the current profile', async () => {
    User.getById.mockResolvedValueOnce([[
      {
        id: 'user-1',
        name: 'Ana Player',
        username: 'anaplayer',
        email: 'ana@example.com',
      },
    ]]);

    const res = createRes();
    await authController.me({ user: { id: 'user-1' } }, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith({
      id: 'user-1',
      name: 'Ana Player',
      username: 'anaplayer',
      email: 'ana@example.com',
    });
  });

  it('returns 404 when the current user is missing', async () => {
    User.getById.mockResolvedValueOnce([[]]);

    const res = createRes();
    await authController.me({ user: { id: 'user-1' } }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('verifies an email token successfully', async () => {
    User.verifyUser.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = createRes();
    await authController.verifyEmail({ params: { token: 'verify-token' } }, res, jest.fn());

    expect(User.verifyUser).toHaveBeenCalledWith('verify-token');
    expect(res.json).toHaveBeenCalledWith({ message: 'Email verified successfully' });
  });

  it('returns 400 when the email verification token is invalid', async () => {
    User.verifyUser.mockResolvedValueOnce([{ affectedRows: 0 }]);

    const res = createRes();
    await authController.verifyEmail({ params: { token: 'invalid-token' } }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired verification token' });
  });

  it('sends a password reset email when the user exists', async () => {
    User.getByEmail.mockResolvedValueOnce([[{
      id: 'user-1',
      email: 'ana@example.com',
    }]]);

    const res = createRes();
    await authController.forgotPassword({ body: { email: 'ana@example.com' } }, res, jest.fn());

    expect(User.setVerificationToken).toHaveBeenCalledWith('user-1', expect.any(String), expect.any(Date));
    expect(mockSendPasswordResetEmail).toHaveBeenCalledWith('ana@example.com', expect.any(String));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Si el email existe, recibirás un enlace de recuperación' });
  });

  it('returns the same response when the password reset email is missing', async () => {
    User.getByEmail.mockResolvedValueOnce([[]]);

    const res = createRes();
    await authController.forgotPassword({ body: { email: 'missing@example.com' } }, res, jest.fn());

    expect(mockSendPasswordResetEmail).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('resets the password with a valid token', async () => {
    User.findByResetToken.mockResolvedValueOnce([[{
      id: 'user-1',
    }]]);

    const res = createRes();
    await authController.resetPassword(
      { params: { token: 'reset-token' }, body: { newPassword: 'newsecret123' } },
      res,
      jest.fn(),
    );

    expect(bcrypt.hash).toHaveBeenCalledWith('newsecret123', 10);
    expect(User.updatePassword).toHaveBeenCalledWith('user-1', 'hashed-password');
    expect(User.clearResetToken).toHaveBeenCalledWith('user-1');
    expect(res.json).toHaveBeenCalledWith({ message: 'Contraseña actualizada correctamente' });
  });

  it('returns 400 when the reset token is invalid', async () => {
    User.findByResetToken.mockResolvedValueOnce([[]]);

    const res = createRes();
    await authController.resetPassword(
      { params: { token: 'reset-token' }, body: { newPassword: 'newsecret123' } },
      res,
      jest.fn(),
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired reset token' });
  });

  it('resends verification when the user exists and is not verified', async () => {
    User.getByEmail.mockResolvedValueOnce([[{
      id: 'user-1',
      is_verified: false,
      email: 'ana@example.com',
    }]]);

    const res = createRes();
    await authController.resendVerification({ body: { email: 'ana@example.com' } }, res, jest.fn());

    expect(User.setVerificationToken).toHaveBeenCalledWith('user-1', '0123456789abcdef0123456789abcdef', expect.any(Date));
    expect(mockSendVerificationEmail).toHaveBeenCalledWith('ana@example.com', '0123456789abcdef0123456789abcdef');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('revokes the refresh token on logout', async () => {
    const res = createRes();
    await authController.logout({ cookies: { allcourts_refresh_token: 'refresh-token' } }, res, jest.fn());

    expect(RefreshToken.revokeByHash).toHaveBeenCalledWith(expect.any(String));
    expect(res.cookie).toHaveBeenCalledWith('allcourts_token', '', expect.objectContaining({ maxAge: 0 }));
    expect(res.cookie).toHaveBeenCalledWith('allcourts_refresh_token', '', expect.objectContaining({ maxAge: 0 }));
    expect(res.json).toHaveBeenCalledWith({ message: 'Logged out' });
  });

  it('refreshes the session with a valid refresh token', async () => {
    jwt.verify.mockReturnValueOnce({ id: 'user-1', type: 'refresh' });
    RefreshToken.findByHash.mockResolvedValueOnce([[{
      id: 'token-1',
      revoked_at: null,
    }]]);
    User.getById.mockResolvedValueOnce([[{
      id: 'user-1',
      name: 'Ana Player',
      username: 'anaplayer',
      email: 'ana@example.com',
      role: 'player',
      is_verified: true,
    }]]);

    const res = createRes();
    await authController.refresh({ cookies: { allcourts_refresh_token: 'refresh-token' } }, res, jest.fn());

    expect(RefreshToken.revokeByHash).toHaveBeenCalledWith(expect.any(String));
    expect(res.cookie).toHaveBeenCalledWith('allcourts_token', 'access-token', expect.any(Object));
    expect(res.cookie).toHaveBeenCalledWith('allcourts_refresh_token', 'refresh-token', expect.any(Object));
    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: 'user-1',
        name: 'Ana Player',
        username: 'anaplayer',
        email: 'ana@example.com',
        role: 'player',
        is_verified: true,
      },
    });
  });
});
