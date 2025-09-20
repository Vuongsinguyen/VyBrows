// getAvailableDates.ts - Netlify Function to return available dates from Google Sheet
import { Handler } from '@netlify/functions';
import { google } from 'googleapis';

const SHEET_ID = process.env.SHEET_ID;
const RANGE = 'Bookings!A2:E'; // Adjust range as needed

const handler: Handler = async (event) => {
  try {
    // Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch all bookings
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });
    const rows = response.data.values || [];

    // Collect booked dates
    const bookedDates = new Set<string>();
    for (const row of rows) {
      if (row[2]) bookedDates.add(row[2]); // Assuming date is in column C
    }

    // Generate next 60 days
    const availableDates: string[] = [];
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      if (!bookedDates.has(iso)) {
        availableDates.push(iso);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ availableDates }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export { handler };
