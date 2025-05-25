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
      subject: "Confirma tu cuenta de Alta-Kassa",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #4CAF50;">¡Bienvenido a Alta-Kassa!</h2>
        <p style="font-size: 16px; color: #555;">Gracias por registrarte en nuestro sistema de multiservicios. Para activar tu cuenta, haz clic en el siguiente botón:</p>
        <div style="text-align: center; margin: 20px;">
          <a href="${process.env.URL_FRONTEND}confirmar/${encodeURIComponent(token)}" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">Confirmar Cuenta</a>
        </div>
        <p style="font-size: 14px; color: #999;">Si tú no solicitaste esta cuenta, puedes ignorar este correo.</p>
      </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error en envío de correo", error)
  }
};

const sendMailToAdminRestore = async (userMail, token) => {
  try {
    let mailOptions = {
      from: process.env.USER_MAILTRAP,
      to: userMail,
      subject: "Recupera tu acceso a Alta-Kassa",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #2196F3;">¿Olvidaste tu contraseña?</h2>
        <p style="font-size: 16px; color: #555;">No te preocupes, puedes restablecerla haciendo clic en el botón a continuación:</p>
        <div style="text-align: center; margin: 20px;">
          <a href="${process.env.URL_FRONTEND}restablecer/${encodeURIComponent(token)}" style="background-color: #2196F3; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">Restablecer Contraseña</a>
        </div>
        <p style="font-size: 14px; color: #999;">Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
      </div>
      `
    };

    const infoRes = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar el correo", error)
  }
};

export {
  sendMailToAdmin, sendMailToAdminRestore
}