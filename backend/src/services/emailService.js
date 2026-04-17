const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
});

const sendVerificationEmail = (toEmail, token) => {
  const verifyUrl = `${process.env.APP_URL}/auth/verify/${token}`;

  return transporter.sendMail({
    from: `"AllCourts" <${process.env.MAIL_FROM}>`,
    to: toEmail,
    subject: "Verifica tu cuenta de AllCourts",
    html: `
            <h2>Bienvenido a AllCourts</h2>
            <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
            <a href="${verifyUrl}">${verifyUrl}</a>
            <p>Este enlace expira en 24 horas.</p>
        `,
  });
};

module.exports = { sendVerificationEmail };
