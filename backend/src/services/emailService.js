/**
 * @module emailService
 * Servicio de correo saliente de AllCourts.
 * Centraliza los emails de verificación, recuperación de contraseña y confirmación de reserva.
 */
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false
});

/**
 * Envía un enlace de verificación de cuenta al correo indicado.
 *
 * @param {string} toEmail Correo destino.
 * @param {string} token Token de verificación sin hashear.
 * @returns {Promise<import('nodemailer').SentMessageInfo>} Resultado del envío.
 */
const sendVerificationEmail = (toEmail, token) => {
  const verifyUrl = `${process.env.APP_URL}/auth/verify/${token}`;

  return transporter.sendMail({
    from: `"AllCourts" <${process.env.MAIL_FROM}>`,
    to: toEmail,
    subject: 'Verifica tu cuenta de AllCourts',
    html: `
            <h2>Bienvenido a AllCourts</h2>
            <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
            <a href="${verifyUrl}">${verifyUrl}</a>
            <p>Este enlace expira en 24 horas.</p>
        `
  });
};

/**
 * Envía un enlace temporal para restablecer la contraseña.
 *
 * @param {string} toEmail Correo destino.
 * @param {string} token Token de recuperación sin hashear.
 * @returns {Promise<import('nodemailer').SentMessageInfo>} Resultado del envío.
 */
const sendPasswordResetEmail = (toEmail, token) => {
  const resetUrl = `${process.env.APP_URL}/auth/reset-password/${token}`;

  return transporter.sendMail({
    from: `"AllCourts" <${process.env.MAIL_FROM}>`,
    to: toEmail,
    subject: 'Recupera tu contraseña de AllCourts',
    html: `
            <h2>Recuperación de contraseña</h2>
            <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>Este enlace expira en 1 hora.</p>
        `
  });
};

/**
 * Envía el correo de confirmación de una reserva pagada.
 *
 * @param {object} user Usuario destinatario.
 * @param {object} booking Reserva confirmada.
 * @returns {Promise<import('nodemailer').SentMessageInfo>} Resultado del envío.
 */
const sendBookingConfirmationEmail = (user, booking) => {
  const bookingDate = booking.date;
  const bookingTime = booking.start_time;
  const amountPaid = booking.total_price;
  const courtName = booking.court_name || "";
  const clubAddress = booking.court_address || "";
  const clubCity = booking.court_city || "";

  return transporter.sendMail({
    from: `"AllCourts" <${process.env.MAIL_FROM}>`,
    to: user.email,
    subject: "Confirmacion de reserva en AllCourts",
    html: `
            <h2>Reserva confirmada</h2>
            <p>Hola ${user.name}, tu reserva ha sido confirmada.</p>
            <p><strong>Pista:</strong> ${courtName}</p>
            <p><strong>Club:</strong> ${clubAddress} ${clubCity}</p>
            <p><strong>Fecha:</strong> ${bookingDate}</p>
            <p><strong>Hora:</strong> ${bookingTime}</p>
            <p><strong>Importe pagado:</strong> ${amountPaid} EUR</p>
            <p><strong>Numero de reserva:</strong> ${booking.id}</p>
        `,
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendBookingConfirmationEmail,
};
