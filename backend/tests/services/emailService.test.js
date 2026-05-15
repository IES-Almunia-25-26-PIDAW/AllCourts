const mockSendMail = jest.fn();
const mockCreateTransport = jest.fn(() => ({ sendMail: mockSendMail }));

jest.mock('nodemailer', () => ({
  createTransport: mockCreateTransport,
}));

process.env.MAIL_HOST = 'smtp.example.com';
process.env.MAIL_PORT = '587';
process.env.MAIL_FROM = 'noreply@example.com';
process.env.APP_URL = 'https://app.example.com';

const nodemailer = require('nodemailer');
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail,
  sendSubscriptionActivationEmail,
} = require('../../src/services/emailService');

describe('emailService', () => {
  beforeEach(() => {
    mockSendMail.mockClear();
    mockSendMail.mockResolvedValue({ messageId: 'msg-1' });
  });

  it('sends a verification email with the expected payload', async () => {
    await sendVerificationEmail('ana@example.com', 'token-123');

    expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
      from: '"AllCourts" <noreply@example.com>',
      to: 'ana@example.com',
      subject: 'Verifica tu cuenta de AllCourts',
      html: expect.stringContaining('https://app.example.com/auth/verify/token-123'),
    }));
  });

  it('sends a booking confirmation email with the expected payload', async () => {
    await sendBookingConfirmationEmail(
      { name: 'Ana', email: 'ana@example.com' },
      {
        id: 77,
        date: '2026-06-10',
        start_time: '10:00:00',
        total_price: 25,
        court_name: 'Pista central',
        court_address: 'Calle Mayor 1',
        court_city: 'Madrid',
      },
    );

    expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'ana@example.com',
      subject: 'Confirmacion de reserva en AllCourts',
      html: expect.stringContaining('Pista central'),
    }));
  });

  it('sends a booking cancellation email with a refunded amount', async () => {
    await sendBookingCancellationEmail(
      { name: 'Ana', email: 'ana@example.com' },
      {
        id: 78,
        date: '2026-06-11',
        start_time: '12:00:00',
        court_name: 'Pista central',
        court_address: 'Calle Mayor 1',
        court_city: 'Madrid',
        refund_amount: 10,
      },
    );

    expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'ana@example.com',
      subject: 'Tu reserva ha sido cancelada – AllCourts',
      html: expect.stringContaining('Importe reembolsado'),
    }));
  });

  it('sends a booking cancellation email without a refunded amount', async () => {
    await sendBookingCancellationEmail(
      { name: 'Ana', email: 'ana@example.com' },
      {
        id: 79,
        date: '2026-06-11',
        start_time: '12:00:00',
        court_name: 'Pista central',
        court_address: 'Calle Mayor 1',
        court_city: 'Madrid',
      },
    );

    expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'ana@example.com',
      subject: 'Tu reserva ha sido cancelada – AllCourts',
      html: expect.not.stringContaining('Importe reembolsado'),
    }));
  });

  it('sends subscription activation emails with and without dates', async () => {
    await sendSubscriptionActivationEmail(
      { name: 'Ana', email: 'ana@example.com' },
      'Pro',
      {
        subscription_start: '2026-06-01',
        subscription_end: '2026-07-01',
      },
    );

    expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'ana@example.com',
      subject: 'Tu suscripción de manager está activa – AllCourts',
      html: expect.stringContaining('Inicio'),
    }));

    mockSendMail.mockClear();

    await sendSubscriptionActivationEmail(
      { name: 'Ana', email: 'ana@example.com' },
      '',
      {},
    );

    expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
      html: expect.stringContaining('Plan:'),
    }));
  });

  it('propagates SMTP failures', async () => {
    mockSendMail.mockRejectedValueOnce(new Error('SMTP down'));

    await expect(sendPasswordResetEmail('ana@example.com', 'reset-token')).rejects.toThrow('SMTP down');
  });
});
