const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   port: 587,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   },
//   connectionTimeout: 10000
// });

const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    api_key: process.env.SENDGRID_API_KEY,
  },
});

module.exports = transporter;
