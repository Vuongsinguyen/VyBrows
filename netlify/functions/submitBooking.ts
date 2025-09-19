import type { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const {
  ZOHO_USER,
  ZOHO_PASS,
  ZOHO_SMTP_HOST = 'smtppro.zoho.com',
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_SHEET_ID,
  ADMIN_EMAIL = 'vybrowsk@gmail.com'
} = process.env;

function createTransport(port465 = true) {
  return nodemailer.createTransport({
    host: ZOHO_SMTP_HOST,
    port: port465 ? 465 : 587,
    secure: port465,
    auth: { user: ZOHO_USER, pass: ZOHO_PASS }
  });
}

async function appendToGoogleSheet(data: any) {
  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
    console.warn('Google Sheets credentials not configured');
    console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL:', GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log('GOOGLE_PRIVATE_KEY:', GOOGLE_PRIVATE_KEY ? 'Loaded' : 'Missing');
    console.log('GOOGLE_SHEET_ID:', GOOGLE_SHEET_ID);
    return false;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Tạo sheet name theo tháng (VD: Bookings_2025_09)
    const now = new Date();
    const monthName = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}`;
    const sheetName = `Bookings_${monthName}`;

    // Kiểm tra xem sheet có tồn tại không
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: GOOGLE_SHEET_ID,
    });

    const existingSheets = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];
    const sheetExists = existingSheets.includes(sheetName);

    // Nếu sheet chưa tồn tại, tạo mới với headers
    if (!sheetExists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: GOOGLE_SHEET_ID,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: sheetName,
                gridProperties: {
                  rowCount: 1000,
                  columnCount: 11
                }
              }
            }
          }]
        }
      });

      // Thêm headers
      const headers = [[
        'Timestamp', 'Category', 'Service', 'Option', 'Date', 'Time',
        'Name', 'Phone', 'Email', 'Notes', 'Status'
      ]];

      await sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: `${sheetName}!A1:K1`,
        valueInputOption: 'RAW',
        requestBody: { values: headers },
      });
    }

    const values = [[
      new Date().toISOString(),
      data.category || '',
      data.service || '',
      data.option || '',
      data.date || '',
      data.time || '',
      data.name || '',
      data.phone || '',
      data.email || '',
      data.notes || '',
      'Pending'
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: `${sheetName}!A:K`,
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    return true;
  } catch (error) {
    console.error('Google Sheets error:', error);
    return false;
  }
}

async function sendEmails(data: any) {
  if (!ZOHO_USER || !ZOHO_PASS) {
    throw new Error('Email credentials not configured');
  }

  const transporter = createTransport(true);

  const bookingDetails = `
    <h3>Booking Details:</h3>
    <ul>
      <li><strong>Category:</strong> ${data.category || 'N/A'}</li>
      <li><strong>Service:</strong> ${data.service || 'N/A'}</li>
      <li><strong>Option:</strong> ${data.option || 'N/A'}</li>
      <li><strong>Date:</strong> ${data.date || 'N/A'}</li>
      <li><strong>Time:</strong> ${data.time || 'N/A'}</li>
      <li><strong>Name:</strong> ${data.name || 'N/A'}</li>
      <li><strong>Phone:</strong> ${data.phone || 'N/A'}</li>
      <li><strong>Email:</strong> ${data.email || 'N/A'}</li>
      <li><strong>Notes:</strong> ${data.notes || 'N/A'}</li>
    </ul>
  `;

  // Email cho Admin
  const adminSubject = `New Booking: ${data.service || 'Service'} - ${data.name || 'Customer'}`;
  const adminHtml = `
    <h2>New Booking Received</h2>
    ${bookingDetails}
    <p>Please contact the customer to confirm the booking.</p>
    <p style="margin-top:18px;font-size:12px;color:#666">Sent from VyBrows booking system.</p>
  `;

  // Email cho Customer
  const customerSubject = `Booking Confirmation - VyBrows Academy`;
  const customerHtml = `
    <h2>Thank you for your booking!</h2>
    <p>Dear ${data.name},</p>
    <p>We have received your booking request. Here are the details:</p>
    ${bookingDetails}
    <p>Our team will contact you within 24 hours to confirm your booking.</p>
    <p>If you have any questions, please contact us at ${ADMIN_EMAIL}</p>
    <p>Best regards,<br>VyBrows Academy Team</p>
    <p style="margin-top:18px;font-size:12px;color:#666">Sent from VyBrows booking system.</p>
  `;

  // Gửi email cho Admin
  await transporter.sendMail({
    from: `"VyBrows Booking" <${ZOHO_USER}>`,
    to: ADMIN_EMAIL,
    replyTo: data.email || ZOHO_USER,
    subject: adminSubject,
    html: adminHtml
  });

  // Gửi email cho Customer
  await transporter.sendMail({
    from: `"VyBrows Academy" <${ZOHO_USER}>`,
    to: data.email,
    replyTo: ADMIN_EMAIL,
    subject: customerSubject,
    html: customerHtml
  });

  return true;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data: any = {};
  try {
    data = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Invalid JSON' }) };
  }

  console.log('Booking submission:', data);

  try {
    // Chỉ ghi lên Google Sheets, không gửi email
    const sheetSuccess = await appendToGoogleSheet(data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Booking submitted successfully',
        sheetUpdated: sheetSuccess
      })
    };
  } catch (error: any) {
    console.error('Booking submission error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      })
    };
  }
};