const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendVerificationEmail = (toEmail, token) => {
    const verifyUrl = `${process.env.APP_URL}/auth/verify/${token}`;

    return transporter.sendMail({
        from: `"AllCourts" <${process.env.MAIL_USER}>`,
        to: toEmail,
        subject: "Verifica tu cuenta en AllCourts",
        html: `
            <h2>Bienvenido a AllCourts</h2>
            <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
            <a href="${verifyUrl}">${verifyUrl}</a>
            <p>Este enlace expira en 24 horas.</p>
        `,
    });
};

module.exports = { sendVerificationEmail };
