const nodemailer = require('nodemailer');

async function sendEmail({ to, subject, text, html }) {
  const transporter = nodemailer.createTransport({
    host: 'mail.wcg-mail.com', // Replace with your SMTP provider's domain
    port: 587,
    secure: false,
    auth: {
      user: 'support@uptopeats.com', // Replace with your email
      pass: 'Bladeisbatman1!', // Replace with your email password
    },
  });

  const mailOptions = {
    from: 'support@uptopeats.com', // Replace with your email
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error occurred while sending email: %s', error.message);
  }
}

module.exports = sendEmail;
