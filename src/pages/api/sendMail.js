import nodemailer from 'nodemailer';

export async function post({ request }) {
  const data = await request.json();

  // Tạo transporter với Zoho SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: 'contact@vybrows-academy.com', // Thay bằng email Zoho của bạn
      pass: 'LUFzRYc6puHJ' // Thay bằng app password Zoho
    }
  });

  // Nội dung email
  const mailOptions = {
    from: 'VyBrows Website <contact@vybrows-academy.com>',
    to: 'contact@vybrows-academy.com',
    subject: 'New Contact Form Submission',
    html: `
      <b>Name:</b> ${data.name}<br>
      <b>Email:</b> ${data.email}<br>
      <b>Phone:</b> ${data.phone}<br>
      <b>Service:</b> ${data.service}<br>
      <b>Message:</b> ${data.message}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
