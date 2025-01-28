"use server"

import { google } from "googleapis"
import { JWT } from "google-auth-library"

// Initialize Google Sheets client
const client = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

const sheets = google.sheets({ version: "v4", auth: client })
const SPREADSHEET_ID = "1ZVp_rc9t5-P0-x1k34mJPHs8tcY7lNe87yC_U9jt_2c"

export async function saveToSheet(data: {
  organizationName: string
  contactInfo: string
  result: string
  xSum: number
  ySum: number
}) {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:E",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [data.organizationName, data.contactInfo, data.result, data.xSum, data.ySum, new Date().toISOString()],
        ],
      },
    })
    return { success: true }
  } catch (error) {
    console.error("Error saving to sheet:", error)
    return { success: false, error: "Failed to save data" }
  }
}

