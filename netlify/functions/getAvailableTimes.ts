import type { Handler } from '@netlify/functions';
import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const {
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_SHEET_ID
} = process.env;

async function getBookingsForDate(targetDate: string) {
  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
    console.warn('Google Sheets credentials not configured');
    return [];
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Lấy dữ liệu từ sheet hiện tại (theo tháng)
    const now = new Date();
    const monthName = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}`;
    const sheetName = `Bookings_${monthName}`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: `${sheetName}!A:K`, // Lấy tất cả dữ liệu
    });

    const rows = response.data.values || [];
    if (rows.length <= 1) return []; // Chỉ có header hoặc không có dữ liệu

    // Filter bookings cho ngày cụ thể và bỏ qua header
    const bookingsForDate = rows.slice(1).filter(row => {
      const date = row[4]; // Cột E - Date
      const status = row[10]; // Cột K - Status
      
      // Chỉ lấy booking cho ngày này và không bị cancelled
      return date === targetDate && status !== 'cancelled';
    });

    return bookingsForDate;
  } catch (error) {
    console.error('Error reading from Google Sheets:', error);
    return [];
  }
}

export const handler: Handler = async (event) => {
  try {
    const { date } = event.queryStringParameters || {};

    if (!date) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Date parameter is required',
          bookedTimes: []
        }),
      };
    }

    // Lấy tất cả bookings cho ngày này
    const bookingsForDate = await getBookingsForDate(date);
    
    // Lấy danh sách giờ đã được đặt
    const bookedTimes = bookingsForDate.map(row => {
      const time = row[5]; // Cột F - Time
      return time;
    }).filter(time => time); // Loại bỏ giá trị rỗng

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookedTimes,
        message: `Found ${bookedTimes.length} booked slots for ${date}`,
        debug: {
          totalBookingsForDate: bookingsForDate.length,
          date,
          rawBookings: bookingsForDate.map(row => ({
            timestamp: row[0],
            service: row[2],
            date: row[4],
            time: row[5],
            name: row[6],
            status: row[10]
          }))
        }
      }),
    };
  } catch (error) {
    console.error('Error in getAvailableTimes:', error);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookedTimes: [],
        message: 'Error reading from Google Sheets - showing all times available',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};