import type { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

const { ZOHO_USER, ZOHO_PASS } = process.env;

if (!ZOHO_USER || !ZOHO_PASS) {
  console.warn('Missing ZOHO_USER or ZOHO_PASS env variables');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: ZOHO_USER,
    pass: ZOHO_PASS
  },
  logger: true,   // thêm log (xóa khi ok)
  debug: true
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data: any = {};
  try {
    data = JSON.parse(event.body || '{}');
  } catch (e) {
    console.error('Bad JSON', e);
    return { statusCode: 400, body: JSON.stringify({ success:false, error:'Bad JSON' }) };
  }

  const { name = '', email = '', phone = '', service = '', message = '' } = data;
  console.log('Incoming form data:', data);

  if (!name && !email && !message) {
    return { statusCode: 400, body: JSON.stringify({ success:false, error:'Missing required fields' }) };
  }
  if (!ZOHO_USER || !ZOHO_PASS) {
    return { statusCode: 500, body: JSON.stringify({ success:false, error:'Mail env not set' }) };
  }

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Phone:</b> ${phone}</p>
    <p><b>Service:</b> ${service}</p>
    <p><b>Message:</b><br>${String(message).replace(/\n/g,'<br>')}</p>
    <hr style="margin-top:16px" />
    <p style="font-size:12px;color:#666">Sent from VyBrows website form.</p>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"VyBrows Contact" <${ZOHO_USER}>`,
      to: ['contact@vybrows-academy.com','vuongsi.nguyen@gmail.com'],
      replyTo: email || ZOHO_USER,
      subject: `Contact Form: ${service || 'General'} - ${name || 'Visitor'}`,
      html
    });
    console.log('Mail sent id:', info.messageId);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err: any) {
    console.error('Send error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err?.message || 'Send failed' })
    };
  }
};