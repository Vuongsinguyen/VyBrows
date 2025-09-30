import type { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL ? 'set' : 'not set');
  console.log('SENDER_PASS:', process.env.SENDER_PASS ? 'set' : 'not set');
  console.log('RECEIVER_EMAIL:', process.env.RECEIVER_EMAIL ? 'set' : 'not set');

  if (!process.env.SENDER_EMAIL || !process.env.SENDER_PASS || !process.env.RECEIVER_EMAIL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Email environment variables are not configured' }),
    };
  }

  try {
    const { name, email, phone, subject, message } = JSON.parse(event.body || '{}');

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: process.env.RECEIVER_EMAIL,
      cc: email,
      replyTo: email,
      subject: subject || "Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error: unknown) {
    console.error("Send mail error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to send email", error: String(error) }),
    };
  }
};

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}