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
    <hr style="margin-top:12px;font-size:12px;color:#666">
    <p style="font-size:12px;color:#666">Sent from website form.</p>
  `;

  const baseMail = {
    from: `"VyBrows Contact" <${ZOHO_USER}>`,
    replyTo: email || ZOHO_USER,
    subject: `Contact Form: ${service || 'General'} - ${name || 'Visitor'}`,
    text: plain,
    html
  };

  try {
    // 1. Gửi cho Zoho inbox chính
    const primary = await transporter.sendMail({ ...baseMail, to: 'contact@vybrows-academy.com' });
    console.log('Primary accepted:', primary.accepted, 'rejected:', primary.rejected);

    // 2. Gửi bản copy tách riêng tới Gmail (không làm fail nếu lỗi)
    transporter.sendMail({ ...baseMail, to: 'vuongsi.nguyen@gmail.com', subject: `[Copy] ${baseMail.subject}` })
      .then(copy => console.log('Copy accepted:', copy.accepted, 'rejected:', copy.rejected))
      .catch(e => console.error('Copy fail:', e?.message || e));

    return { statusCode:200, body: JSON.stringify({ success:true }) };
  } catch (e:any) {
    console.error('Send error:', e?.response || e?.message || e);
    return { statusCode:500, body: JSON.stringify({ success:false, error: e?.message || 'Send failed' }) };
  }
};