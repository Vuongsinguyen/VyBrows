// getAvailableTimes.ts - Netlify Function to return booked times for a date from Google Sheet
import { Handler } from '@netlify/functions';
import { google } from 'googleapis';

const SHEET_ID = process.env.SHEET_ID;
const RANGE = 'Bookings!A2:E'; // Adjust range as needed

const handler: Handler = async (event) => {
  const date = event.queryStringParameters?.date;
  if (!date) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing date parameter' }),
    };
  }
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

    // Collect booked times for the given date
    const bookedTimes: string[] = [];
    for (const row of rows) {
      if (row[2] === date && row[3]) bookedTimes.push(row[3]); // Assuming date is column C, time is column D
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ bookedTimes }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export { handler };
