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

const buildEmailTemplate = (title, bodyHtml) => `
  <!doctype html>
  <html lang="es">
    <body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,sans-serif;color:#1f2937;">
      <div style="width:100%;background-color:#f4f7fb;padding:32px 16px;box-sizing:border-box;">
        <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 12px 34px rgba(15,23,42,0.10);border:1px solid #e7eef8;">
          <div style="height:6px;background:linear-gradient(90deg,#0059ff 0%,#2ecc71 100%);"></div>
          <div style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:24px 28px;text-align:center;">
            <div style="font-size:30px;line-height:1.1;font-weight:800;letter-spacing:0.6px;color:#ffffff;">
              All<span style="color:#0059ff;">Courts</span>
            </div>
            <div style="margin-top:10px;font-size:12px;line-height:1.4;letter-spacing:1.8px;text-transform:uppercase;color:#cbd5e1;">
              Tenis, pádel y reservas
            </div>
          </div>
          <div style="padding:32px 28px 28px;">
            <div style="display:inline-block;margin:0 0 14px;padding:7px 12px;border-radius:999px;background-color:#eef4ff;color:#0059ff;font-size:12px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;">
              AllCourts
            </div>
            <h1 style="margin:0 0 18px;font-size:24px;line-height:1.3;color:#0f172a;">${title}</h1>
            <div style="font-size:16px;line-height:1.7;color:#334155;">
              ${bodyHtml}
            </div>
          </div>
          <div style="padding:0 28px 28px;">
            <div style="height:1px;background-color:#e8eef7;"></div>
            <p style="margin:18px 0 0;font-size:12px;line-height:1.6;color:#64748b;text-align:center;">
              © AllCourts. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </body>
  </html>
`;

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
    html: buildEmailTemplate(
      'Verifica tu cuenta',
      `
        <p style="margin:0 0 18px;">Bienvenido a AllCourts. Para activar tu cuenta, confirma tu correo electrónico desde el siguiente botón.</p>
        <p style="margin:0 0 24px;text-align:center;">
          <a href="${verifyUrl}" style="display:inline-block;background-color:#0059ff;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:6px;box-shadow:0 8px 16px rgba(0,89,255,0.20);">Verificar email</a>
        </p>
        <p style="margin:0 0 12px;word-break:break-word;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
        <p style="margin:0;word-break:break-word;"><a href="${verifyUrl}" style="color:#0059ff;text-decoration:underline;">${verifyUrl}</a></p>
        <p style="margin:18px 0 0;">Este enlace expira en 24 horas.</p>
      `
    )
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
    html: buildEmailTemplate(
      'Recuperación de contraseña',
      `
        <p style="margin:0 0 18px;">Hemos recibido una solicitud para restablecer tu contraseña de AllCourts.</p>
        <p style="margin:0 0 24px;text-align:center;">
          <a href="${resetUrl}" style="display:inline-block;background-color:#0059ff;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:6px;box-shadow:0 8px 16px rgba(0,89,255,0.20);">Restablecer contraseña</a>
        </p>
        <p style="margin:0 0 12px;word-break:break-word;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
        <p style="margin:0;word-break:break-word;"><a href="${resetUrl}" style="color:#0059ff;text-decoration:underline;">${resetUrl}</a></p>
        <p style="margin:18px 0 0;">Este enlace expira en 1 hora.</p>
      `
    )
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
    html: buildEmailTemplate(
      'Reserva confirmada',
      `
        <p style="margin:0 0 18px;">Hola ${user.name}, tu reserva ha sido confirmada correctamente.</p>
        <div style="margin:0 0 18px;padding:16px;border-radius:10px;background-color:#f8fbff;border:1px solid #dbe7ff;box-shadow:inset 0 1px 0 rgba(255,255,255,0.7);">
          <p style="margin:0 0 8px;"><strong style="color:#0f172a;">Pista:</strong> ${courtName}</p>
          <p style="margin:0 0 8px;"><strong style="color:#0f172a;">Club:</strong> ${clubAddress} ${clubCity}</p>
          <p style="margin:0 0 8px;"><strong style="color:#0f172a;">Fecha:</strong> ${bookingDate}</p>
          <p style="margin:0 0 8px;"><strong style="color:#0f172a;">Hora:</strong> ${bookingTime}</p>
          <p style="margin:0 0 8px;"><strong style="color:#0f172a;">Importe pagado:</strong> ${amountPaid} EUR</p>
          <p style="margin:0;"><strong style="color:#0f172a;">Número de reserva:</strong> ${booking.id}</p>
        </div>
        <p style="margin:0;text-align:center;">
          <a href="${process.env.APP_URL}/profile" style="display:inline-block;background-color:#0059ff;color:#ffffff;text-decoration:none;font-weight:700;padding:11px 20px;border-radius:6px;box-shadow:0 8px 16px rgba(0,89,255,0.20);">Ver mis reservas</a>
        </p>
      `
    ),
  });
};

/**
 * Envía el correo de confirmación de una reserva cancelada.
 *
 * @param {object} user Usuario destinatario.
 * @param {object} booking Reserva cancelada.
 * @returns {Promise<import('nodemailer').SentMessageInfo>} Resultado del envío.
 */
const sendBookingCancellationEmail = (user, booking) => {
  const bookingDate = booking.date;
  const bookingTime = booking.start_time;
  const courtName = booking.court_name || '';
  const clubAddress = booking.court_address || '';
  const clubCity = booking.court_city || '';
  const refundedAmount = booking.refund_amount ?? booking.refunded_amount ?? booking.amount_refunded;
  const hasRefundedAmount = refundedAmount !== undefined && refundedAmount !== null && refundedAmount !== '';

  return transporter.sendMail({
    from: `"AllCourts" <${process.env.MAIL_FROM}>`,
    to: user.email,
    subject: 'Tu reserva ha sido cancelada – AllCourts',
    html: buildEmailTemplate(
      'Reserva cancelada',
      `
        <p style="margin:0 0 18px;">Hola ${user.name}, tu reserva ha sido cancelada correctamente.</p>
        <div style="margin:0 0 18px;padding:16px;border-radius:10px;background-color:#f8fbff;border:1px solid #dbe7ff;box-shadow:inset 0 1px 0 rgba(255,255,255,0.7);">
          <p style="margin:0 0 8px;"><strong style="color:#0f172a;">Pista:</strong> ${courtName}</p>
          <p style="margin:0 0 8px;"><strong style="color:#0f172a;">Club:</strong> ${clubAddress} ${clubCity}</p>
          <p style="margin:0 0 8px;"><strong style="color:#0f172a;">Fecha:</strong> ${bookingDate}</p>
          <p style="margin:0 0 8px;"><strong style="color:#0f172a;">Hora:</strong> ${bookingTime}</p>
          ${hasRefundedAmount ? `<p style="margin:0 0 8px;"><strong style="color:#0f172a;">Importe reembolsado:</strong> ${refundedAmount} EUR</p>` : ''}
          <p style="margin:0;"><strong style="color:#0f172a;">Número de reserva:</strong> ${booking.id}</p>
        </div>
        <p style="margin:0;text-align:center;">
          <a href="${process.env.APP_URL}/courts" style="display:inline-block;background-color:#0059ff;color:#ffffff;text-decoration:none;font-weight:700;padding:11px 20px;border-radius:6px;box-shadow:0 8px 16px rgba(0,89,255,0.20);">Hacer nueva reserva</a>
        </p>
      `
    ),
  });
};

/**
 * Envía el correo de activación de la suscripción del manager.
 *
 * @param {object} user Usuario destinatario.
 * @param {string} planName Nombre legible del plan contratado.
 * @param {object} subscription Datos básicos de la suscripción.
 * @returns {Promise<import('nodemailer').SentMessageInfo>} Resultado del envío.
 */
const sendSubscriptionActivationEmail = (user, planName, subscription) => {
  const subscriptionStart = subscription.subscription_start || subscription.start_date || null;
  const subscriptionEnd = subscription.subscription_end || subscription.current_period_end || null;

  return transporter.sendMail({
    from: `"AllCourts" <${process.env.MAIL_FROM}>`,
    to: user.email,
    subject: "Tu suscripción de manager está activa – AllCourts",
    html: buildEmailTemplate(
      "Suscripción activada",
      `
        <p style="margin:0 0 18px;">Hola ${user.name}, ya tienes la suscripción de manager activa.</p>
        <div style="margin:0 0 18px;padding:16px;border-radius:10px;background-color:#f8fbff;border:1px solid #dbe7ff;box-shadow:inset 0 1px 0 rgba(255,255,255,0.7);">
          <p style="margin:0 0 8px;"><strong style="color:#0f172a;">Plan:</strong> ${planName || "Manager"}</p>
          ${subscriptionStart ? `<p style="margin:0 0 8px;"><strong style="color:#0f172a;">Inicio:</strong> ${subscriptionStart}</p>` : ""}
          ${subscriptionEnd ? `<p style="margin:0;"><strong style="color:#0f172a;">Renovación:</strong> ${subscriptionEnd}</p>` : ""}
        </div>
        <p style="margin:0;text-align:center;">
          <a href="${process.env.APP_URL}/manager" style="display:inline-block;background-color:#0059ff;color:#ffffff;text-decoration:none;font-weight:700;padding:11px 20px;border-radius:6px;box-shadow:0 8px 16px rgba(0,89,255,0.20);">Ir al panel</a>
        </p>
      `
    ),
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail,
  sendSubscriptionActivationEmail,
};
