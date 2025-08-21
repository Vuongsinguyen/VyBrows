const nodemailer = require('nodemailer');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const data = JSON.parse(event.body);

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: 'contact@vybrows-academy.com',
  pass: 'LbhMfXpLtxQ8'
    }
  });

  const mailOptions = {
    from: '"VyBrows Website" <contact@vybrows-academy.com>',
    to: 'contact@vybrows-academy.com',
    subject: 'New Contact Form Submission',
    html: `
      <b>Name:</b> ${data.name}<br>
      <b>Email:</b> ${data.email}<br>
      <b>Phone:</b> ${data.phone}<br>
      <b>Service:</b> ${data.service}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
};