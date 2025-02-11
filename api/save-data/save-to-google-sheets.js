// pages/api/save-to-google-sheets.js
import { google } from 'googleapis';
import { authenticate } from '@google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SHEET_ID = '1ZVp_rc9t5-P0-x1k34mJPHs8tcY7lNe87yC_U9jt_2c';  // Replace with your Google Sheets spreadsheet ID.

async function getAuthClient() {
  // Load the credentials from your credentials JSON file.
  const auth = new google.auth.GoogleAuth({
    keyFile: 'api/save-data/google_key.json',  // Path to your credentials file
    scopes: SCOPES,
  });

  const authClient = await auth.getClient();
  return authClient;
}

async function appendDataToSheet(data) {
  const authClient = await getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  const values = [
    [
      data.organizationName,
      data.contactName,
      data.contactRole,
      data.contactEmail,
      JSON.stringify(data.answers),  // Storing the answers as a JSON string
      data.xSum,
      data.ySum,
      data.resultCategory,
      data.timestamp,
    ],
  ];

  const resource = {
    values,
  };

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A1', // Starting from the first row
      valueInputOption: 'RAW',
      resource,
    });
    return { success: true, response };
  } catch (error) {
    console.error('Error appending data to Google Sheets:', error);
    return { success: false, error };
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const data = req.body;
      const result = await appendDataToSheet(data);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error processing request' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
