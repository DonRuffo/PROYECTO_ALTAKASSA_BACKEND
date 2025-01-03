import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config()

let transporter = nodemailer.createTransport({
  host: process.env.HOST_MAILTRAP,
  port: process.env.PORT_MAILTRAP,
  secure:true,
  auth: {
      user: process.env.USER_MAILTRAP,
      pass: process.env.PASS_MAILTRAP,
  }
});

const sendMailToAdmin = (userMail, token) => {

  let mailOptions = {
      from: process.env.USER_MAILTRAP,
      to: userMail,
      subject: "Verifica tu cuenta",
      html: `<p>Hola, haz clic <a href="${process.env.URL_BACKEND}confirmar/${encodeURIComponent(token)}">aquí</a> para confirmar tu cuenta.</p>`
  };
  

  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error);
      } else {
          console.log('Correo enviado: ' + info.response);
      }
  });
};

const sendMailToAdminRestore = (userMail, token) => {

  let mailOptions = {
      from: process.env.USER_MAILTRAP,
      to: userMail,
      subject: "Recupera tu cuenta",
      html: `<p>Hola, haz clic <a href="${process.env.URL_BACKEND}recuperar/${encodeURIComponent(token)}">aquí</a> para restablecer tu contraseña.</p>`
  };
  

  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error);
      } else {
          console.log('Correo enviado: ' + info.response);
      }
  });
};

export {
  sendMailToAdmin, sendMailToAdminRestore
}