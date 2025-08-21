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

  console.log('Payload:', data);

  const { name='', email='', phone='', service='', message='' } = data;

  // Thêm dòng này để khai báo subject
  const subject = `Contact Form: ${service || 'General'} - ${name || 'Visitor'}`;

  const text = [
    'New Contact Form Submission',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Service: ${service}`,
    'Message:',
    message
  ].join('\n');
  const html = `
    <h2>New Contact Form Submission</h2>
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Phone:</b> ${phone}</p>
    <p><b>Service:</b> ${service}</p>
    <p><b>Message:</b><br>${String(message).replace(/\n/g,'<br>')}</p>
    <p style="margin-top:18px;font-size:12px;color:#666">Sent from website form.</p>
  `;

  let transporter = createTransport(true);
  try {
    await transporter.verify();
  } catch {
    transporter = createTransport(false);
    await transporter.verify();
  }

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