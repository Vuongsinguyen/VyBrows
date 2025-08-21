import type { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

const { ZOHO_USER, ZOHO_PASS } = process.env;

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: { user: ZOHO_USER, pass: ZOHO_PASS }
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST')
    return { statusCode: 405, body: 'Method Not Allowed' };

  if (!ZOHO_USER || !ZOHO_PASS)
    return { statusCode: 500, body: JSON.stringify({ success:false, error:'Env missing' }) };

  let data: any = {};
  try { data = JSON.parse(event.body || '{}'); }
  catch { return { statusCode:400, body: JSON.stringify({ success:false, error:'Bad JSON' }) }; }

  const { name='', email='', phone='', service='', message='' } = data;

  const plain = [
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

  try {
    const info = await transporter.sendMail({
      from: `"VyBrows Contact" <${ZOHO_USER}>`,
      to: 'contact@vybrows-academy.com',
      bcc: 'vuongsi.nguyen@gmail.com',
      replyTo: email || ZOHO_USER,
      subject: `Contact Form: ${service || 'General'} - ${name || 'Visitor'}`,
      text: plain,
      html,
      headers: {
        'List-Unsubscribe': `<mailto:${ZOHO_USER}>`,
        'X-Source': 'vybrows-form'
      }
    });
    console.log('Accepted:', info.accepted, 'Rejected:', info.rejected);
    return { statusCode:200, body: JSON.stringify({ success:true }) };
  } catch (e:any) {
    console.error('Send error:', e?.response || e?.message || e);
    return { statusCode:500, body: JSON.stringify({ success:false, error: e?.message || 'Send failed' }) };
  }
};