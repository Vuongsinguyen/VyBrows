import type { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

const {
  ZOHO_USER,
  ZOHO_PASS,
  ZOHO_SMTP_HOST = 'smtppro.zoho.com'
} = process.env;

function createTransport(port465 = true) {
  return nodemailer.createTransport({
    host: ZOHO_SMTP_HOST,
    port: port465 ? 465 : 587,
    secure: port465,
    auth: { user: ZOHO_USER, pass: ZOHO_PASS }
  });
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST')
    return { statusCode:405, body:'Method Not Allowed' };

  if (!ZOHO_USER || !ZOHO_PASS)
    return { statusCode:500, body: JSON.stringify({ success:false, error:'Env missing' }) };

  let data:any = {};
  try { data = JSON.parse(event.body || '{}'); }
  catch { return { statusCode:400, body: JSON.stringify({ success:false, error:'Bad JSON' }) }; }

  const { name='', email='', phone='', service='', message='' } = data;

  // Hard code message để test
  const testMessage = 'Đây là nội dung test message!';
  // Dùng testMessage thay cho message
  const text = [
    'New Contact Form Submission',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Service: ${service}`,
    'Message:',
    testMessage
  ].join('\n');
  const html = `
    <h2>New Contact Form Submission</h2>
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Phone:</b> ${phone}</p>
    <p><b>Service:</b> ${service}</p>
    <p><b>Message:</b><br>${testMessage}</p>
    <p style="margin-top:18px;font-size:12px;color:#666">Sent from website form.</p>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"VyBrows Contact" <${ZOHO_USER}>`,
      to: 'contact@vybrows-academy.com',
      replyTo: email || ZOHO_USER,
      subject,
      text,
      html
    });
    console.log('Accepted:', info.accepted, 'Rejected:', info.rejected);
    return { statusCode:200, body: JSON.stringify({ success:true }) };
  } catch (e:any) {
    const raw = e?.message || '';
    return { statusCode:500, body: JSON.stringify({
      success:false,
      error:/535/i.test(raw)?'SMTP auth failed (App Password sai / chưa cập nhật)':raw
    }) };
  }
};