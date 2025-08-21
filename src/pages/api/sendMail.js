import nodemailer from 'nodemailer';

const { ZOHO_USER, ZOHO_PASS, ZOHO_SMTP_HOST = 'smtp.zoho.com' } = process.env;

export async function post({ request }) {
  if (!ZOHO_USER || !ZOHO_PASS)
    return new Response(JSON.stringify({ success:false, error:'Env missing' }), { status:500 });

  const data = await request.json().catch(()=> ({}));
  const { name='', email='', phone='', service='', message='' } = data;

  const transporter = nodemailer.createTransport({
    host: ZOHO_SMTP_HOST,
    port: 465,
    secure: true,
    auth: { user: ZOHO_USER, pass: ZOHO_PASS }
  });

  try { await transporter.verify(); }
  catch (e) {
    return new Response(JSON.stringify({ success:false, error:'SMTP auth failed' }), { status:500 });
  }

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

  try {
    await transporter.sendMail({
      from: `"VyBrows" <${ZOHO_USER}>`,
      to: 'contact@vybrows-academy.com',
      replyTo: email || ZOHO_USER,
      subject, text,
      html: text.replace(/\n/g,'<br>')
    });
    return new Response(JSON.stringify({ success:true }), { status:200 });
  } catch (e:any) {
    return new Response(JSON.stringify({ success:false, error:e?.message || 'Send failed' }), { status:500 });
  }
}
