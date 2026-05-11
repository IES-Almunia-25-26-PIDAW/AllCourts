const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false
});

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
