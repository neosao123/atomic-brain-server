const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport(
      {
        host: 'smtp-mail.outlook.com',
        secureConnection: false,
        port: 587,
        tls: {
          ciphers: 'SSLv3'
        },
        auth: {
          user: process.env.AUTH_EMAIL,
          pass: process.env.AUTH_PASS,
        }
      }
    );
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    })
    console.log("Email sent successfully".green);
  }
  catch (err) {
    console.log(err);
  }
}