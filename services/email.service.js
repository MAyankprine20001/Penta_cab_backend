const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail({ to, subject, text, html }) {
  try {
    const result = await sgMail.send({
      to,
      from: "booking@pentacab.com",
      subject,
      text,
      html,
    });
    return result; // return so caller resolves
  } catch (error) {
    console.error("❌ SendGrid error:", error.response?.body || error);
    throw error; // rethrow so Express catches it
  }
}

module.exports = sendEmail;
