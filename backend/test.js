require('dotenv').config(); // Asegúrate de que esto está en la parte superior
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true, // true para 465, false para otros puertos
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

transporter.verify(function(error, success) {
    if (error) {
        console.error(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

let mailOptions = {
    from: process.env.MAIL_USER,
    to: 'verify@narrativetwist.app', // Cambia esto por tu dirección de correo electrónico para pruebas
    subject: 'Nodemailer Test',
    text: 'This is a test email from Nodemailer.'
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
});
