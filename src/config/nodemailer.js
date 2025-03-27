import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config()

let transporter = nodemailer.createTransport({
  host: process.env.HOST_MAILTRAP,
  port: process.env.PORT_MAILTRAP,
  secure: true,
  auth: {
    user: process.env.USER_MAILTRAP,
    pass: process.env.PASS_MAILTRAP,
  }
});

const sendMailToAdmin = async (userMail, token) => {

  try {
    let mailOptions = {
      from: process.env.USER_MAILTRAP,
      to: userMail,
      subject: "Verifica tu cuenta",
      html: `<p>Hola , haz clic <a href="${process.env.URL_FRONTEND}confirmar/${encodeURIComponent(token)}">aquí</a> para confirmar tu cuenta.</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado: ' + info.response)
  } catch (error) {
    console.error("Error en envío de correo", error)
  }
};

const sendMailToAdminRestore = async (userMail, token) => {
  try {
    let mailOptions = {
      from: process.env.USER_MAILTRAP,
      to: userMail,
      subject: "Recupera tu cuenta",
      html: `<p>Hola, haz clic <a href="${process.env.URL_FRONTEND}restablecer/${encodeURIComponent(token)}">aquí</a> para restablecer tu contraseña.</p>`
    };

    const infoRes = await transporter.sendMail(mailOptions);
    console.log("Correo enviado: " + infoRes.response)
  } catch (error) {
    console.error("Error al enviar el correo", error)
  }
};

export {
  sendMailToAdmin, sendMailToAdminRestore
}