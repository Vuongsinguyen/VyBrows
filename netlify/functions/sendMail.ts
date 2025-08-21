import type { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_USER, // contact@vybrows-academy.com
    pass: process.env.ZOHO_PASS  // App password (NOT normal password)
  }
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data: any = {};
  try {
    data = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ success:false, error:'Bad JSON' }) };
  }

  const { name = '', email = '', phone = '', service = '', message = '' } = data;

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
    await transporter.sendMail({
      from: `"VyBrows Contact" <${process.env.ZOHO_USER}>`,
      to: [
        'contact@vybrows-academy.com',
        'vuongsi.nguyen@gmail.com'
      ],
      replyTo: email || process.env.ZOHO_USER,
      subject: `Contact Form: ${service || 'General'} - ${name || 'Visitor'}`,
      html
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message || 'Send failed' })
    };
  }
};