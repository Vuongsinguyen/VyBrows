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

// Tất cả khung giờ có thể đặt (trừ 12:00 PM)
const ALL_TIME_SLOTS = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

async function getBookingsFromSheet() {
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

    // Bỏ qua header (dòng đầu tiên)
    return rows.slice(1);
  } catch (error) {
    console.error('Error reading from Google Sheets:', error);
    return [];
  }
}

export const handler: Handler = async () => {
  try {
    // Lấy dữ liệu booking từ Google Sheets
    const bookings = await getBookingsFromSheet();
    
    // Nhóm bookings theo ngày và đếm số slot đã đặt
    const dateBookingCount: { [date: string]: number } = {};
    
    bookings.forEach(row => {
      const date = row[4]; // Cột E - Date
      const time = row[5]; // Cột F - Time
      const status = row[10]; // Cột K - Status
      
      // Chỉ đếm những booking confirmed (không phải cancelled)
      if (date && time && status !== 'cancelled') {
        if (!dateBookingCount[date]) {
          dateBookingCount[date] = 0;
        }
        dateBookingCount[date]++;
      }
    });

    // Tạo danh sách ngày available (ngày không bị book hết slot)
    const availableDates: string[] = [];
    const today = new Date();
    
    // Check 60 ngày tới
    for (let i = 0; i < 60; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      // Nếu ngày này có ít hơn tổng số slot available thì vẫn còn chỗ
      const bookedSlots = dateBookingCount[dateStr] || 0;
      if (bookedSlots < ALL_TIME_SLOTS.length) {
        availableDates.push(dateStr);
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        availableDates,
        message: `Found ${availableDates.length} available dates`,
        debug: {
          totalBookings: bookings.length,
          dateBookingCount
        }
      }),
    };
  } catch (error) {
    console.error('Error in getAvailableDates:', error);
    
    // Fallback: trả về tất cả ngày nếu có lỗi
    const fallbackDates: string[] = [];
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      fallbackDates.push(d.toISOString().split('T')[0]);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        availableDates: fallbackDates,
        message: 'Error reading from Google Sheets - showing all dates',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};