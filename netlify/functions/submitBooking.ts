import type { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const {
  SENDER_EMAIL,
  SENDER_PASS,
  RECEIVER_EMAIL,
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_SHEET_ID
} = process.env;

function createTransport() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SENDER_EMAIL,
      pass: SENDER_PASS
    }
  });
}

async function appendToGoogleSheet(data: any) {
  console.log('appendToGoogleSheet started with data:', JSON.stringify(data, null, 2));

  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
    console.warn('Google Sheets credentials not configured');
    console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL:', GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log('GOOGLE_PRIVATE_KEY:', GOOGLE_PRIVATE_KEY ? 'Loaded (length: ' + GOOGLE_PRIVATE_KEY.length + ')' : 'Missing');
    console.log('GOOGLE_SHEET_ID:', GOOGLE_SHEET_ID);
    return false;
  }

  try {
    console.log('Creating Google Auth...');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    console.log('Google Auth created successfully');

    const sheets = google.sheets({ version: 'v4', auth });

    // Tạo sheet name theo tháng (VD: Bookings_2025_09)
    const now = new Date();
    const monthName = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}`;
    const sheetName = `Bookings_${monthName}`;
    console.log('Target sheet name:', sheetName);

    // Kiểm tra xem sheet có tồn tại không
    console.log('Checking if sheet exists...');
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: GOOGLE_SHEET_ID,
    });

    const existingSheets = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];
    const sheetExists = existingSheets.includes(sheetName);
    console.log('Existing sheets:', existingSheets);
    console.log('Sheet exists:', sheetExists);

    // Nếu sheet chưa tồn tại, tạo mới với headers
    if (!sheetExists) {
      console.log('Creating new sheet:', sheetName);
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
      console.log('New sheet created successfully');

      // Thêm headers
      console.log('Adding headers to new sheet');
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
      console.log('Headers added successfully');
    } else {
      console.log('Sheet already exists, skipping creation');
    }

    // Process multiple services if they exist
    const results = [];
    
    // Check if data has new format (services array) or old format (single service)
    if (data.services && Array.isArray(data.services)) {
      console.log('Processing multiple services format');
      
      for (const serviceId of data.services) {
        console.log(`serviceId: ${serviceId}`);
        console.log(`data.serviceNames:`, data.serviceNames);
        console.log(`data.options:`, data.options);
        
        const serviceName = data.serviceNames?.[serviceId] || serviceId;
        const optionName = data.options?.[serviceId] || '';
        
        console.log(`Processing service: ${serviceName}, option: ${optionName}`);
        
        // Check for duplicate
        const sheetDataResp = await sheets.spreadsheets.values.get({
          spreadsheetId: GOOGLE_SHEET_ID,
          range: `${sheetName}!A2:K1000`,
        });
        const rows = sheetDataResp.data.values || [];
        
        const isDuplicate = rows.some(row => {
          return row[3] === optionName && 
                 row[4] === data.date && 
                 row[5] === data.time && 
                 row[6] === data.name && 
                 row[2] === serviceName;
        });
        
        if (isDuplicate) {
          console.log('Duplicate booking found for:', {
            date: data.date, 
            time: data.time, 
            name: data.name, 
            service: serviceName, 
            option: optionName
          });
          results.push('DUPLICATE');
          continue;
        }

        // Add row for this service/option
        const values = [[
          new Date().toISOString(),
          data.category || '',
          serviceName,
          optionName,
          data.date || '',
          data.time || '',
          data.name || '',
          data.phone || '',
          data.email || '',
          data.notes || '',
          'Pending'
        ]];

        console.log('Appending data to sheet:', sheetName, 'Values:', JSON.stringify(values, null, 2));

        await sheets.spreadsheets.values.append({
          spreadsheetId: GOOGLE_SHEET_ID,
          range: `${sheetName}!A:K`,
          valueInputOption: 'RAW',
          requestBody: { values },
        });
        
        results.push(true);
      }
    } else {
      // Handle old format (single service/option)
      console.log('Processing single service format');
      
      // Đọc toàn bộ dữ liệu sheet tháng hiện tại để kiểm tra trùng booking
      console.log('Checking for duplicate booking...');
      const sheetDataResp = await sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: `${sheetName}!A2:K1000`, // Bỏ header
      });
      const rows = sheetDataResp.data.values || [];
      
      // Check for exact duplicate: same date, time, name, service, and option
      const isDuplicate = rows.some(row => {
        // row[3] = Option, row[4] = Date, row[5] = Time, row[6] = Name, row[2] = Service
        return row[3] === data.option && 
               row[4] === data.date && 
               row[5] === data.time && 
               row[6] === data.name && 
               row[2] === data.service;
      });
      
      if (isDuplicate) {
        console.log('Duplicate booking found for:', {
          date: data.date, 
          time: data.time, 
          name: data.name, 
          service: data.service, 
          option: data.option
        });
        return 'DUPLICATE';
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

      console.log('Appending data to sheet:', sheetName, 'Values:', JSON.stringify(values, null, 2));

      await sheets.spreadsheets.values.append({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: `${sheetName}!A:K`,
        valueInputOption: 'RAW',
        requestBody: { values },
      });
      
      results.push(true);
    }

    console.log('Data appended successfully to Google Sheets');
    
    // Return results
    const hasErrors = results.includes('DUPLICATE') || results.includes(false);
    const hasSuccess = results.includes(true);
    
    if (hasErrors && !hasSuccess) {
      return 'DUPLICATE';
    } else if (hasErrors && hasSuccess) {
      return 'PARTIAL';
    } else {
      return true;
    }
    
  } catch (error) {
    console.error('Google Sheets error details:', {
      message: (error as Error).message,
      stack: (error as Error).stack,
      code: (error as any).code,
      status: (error as any).status
    });
    return false;
  }
}

async function sendEmails(data: any) {
  if (!SENDER_EMAIL || !SENDER_PASS) {
    throw new Error('Email credentials not configured');
  }

  const transporter = createTransport();

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
    <p>If you have any questions, please contact us at ${RECEIVER_EMAIL}</p>
    <p>Best regards,<br>VyBrows Academy Team</p>
    <p style="margin-top:18px;font-size:12px;color:#666">Sent from VyBrows booking system.</p>
  `;

  // Gửi email cho Admin
  await transporter.sendMail({
    from: `"VyBrows Booking" <${SENDER_EMAIL}>`,
    to: RECEIVER_EMAIL,
    replyTo: data.email || SENDER_EMAIL,
    subject: adminSubject,
    html: adminHtml
  });

  // Gửi email cho Customer (chỉ khi có email)
  if (data.email && data.email.trim()) {
    await transporter.sendMail({
      from: `"VyBrows Academy" <${SENDER_EMAIL}>`,
      to: data.email,
      replyTo: RECEIVER_EMAIL,
      subject: customerSubject,
      html: customerHtml
    });
  }

  return true;
}

export const handler: Handler = async (event) => {
  console.log('Handler started. Method:', event.httpMethod);

  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod);
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data: any = {};
  try {
    data = JSON.parse(event.body || '{}');
    console.log('Parsed booking data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('JSON parse error:', error);
    return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Invalid JSON' }) };
  }

  console.log('Booking submission:', data);

  let sheetResult: any = null;
  let emailResult: any = null;
  let sheetError: any = null;
  let emailError: any = null;

  // Step 1: Try to save to Google Sheets
  try {
    console.log('Calling appendToGoogleSheet...');
    sheetResult = await appendToGoogleSheet(data);
    console.log('appendToGoogleSheet result:', sheetResult);
  } catch (error: any) {
    console.error('Google Sheets error:', error);
    sheetError = error;
    sheetResult = false;
  }

  // Step 2: Send emails regardless of Google Sheets result
  try {
    console.log('Calling sendEmails...');
    emailResult = await sendEmails(data);
    console.log('sendEmails result:', emailResult);
  } catch (error: any) {
    console.error('Email sending error:', error);
    emailError = error;
    emailResult = false;
  }

  // Step 3: Handle response based on results
  
  // If duplicate booking detected
  if (sheetResult === 'DUPLICATE') {
    return {
      statusCode: 409,
      body: JSON.stringify({
        success: false,
        error: 'Duplicate booking: This exact booking (same service, option, date, time, and customer) already exists.',
        emailSent: emailResult === true
      })
    };
  }

  // If partial success (some duplicates)
  if (sheetResult === 'PARTIAL') {
    return {
      statusCode: 207,
      body: JSON.stringify({
        success: true,
        message: 'Some bookings submitted successfully, others were duplicates.',
        sheetUpdated: sheetResult,
        emailSent: emailResult === true
      })
    };
  }

  // If both succeeded
  if (sheetResult && emailResult) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Booking submitted successfully',
        sheetUpdated: true,
        emailSent: true
      })
    };
  }

  // If email sent but sheet failed
  if (emailResult && !sheetResult) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Booking email sent successfully (Google Sheets may have failed)',
        sheetUpdated: false,
        emailSent: true,
        warning: sheetError?.message || 'Google Sheets update failed'
      })
    };
  }

  // If sheet saved but email failed
  if (sheetResult && !emailResult) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Booking saved to Google Sheets (email may have failed)',
        sheetUpdated: true,
        emailSent: false,
        warning: emailError?.message || 'Email sending failed'
      })
    };
  }

  // If both failed
  return {
    statusCode: 500,
    body: JSON.stringify({
      success: false,
      error: 'Both Google Sheets and email sending failed',
      sheetError: sheetError?.message,
      emailError: emailError?.message
    })
  };
};