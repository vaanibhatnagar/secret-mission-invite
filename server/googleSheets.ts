import { google } from 'googleapis';
import { db } from './db';
import { appSettings } from '@shared/schema';
import { eq } from 'drizzle-orm';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-sheet',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Sheet not connected');
  }
  return accessToken;
}

async function getUncachableGoogleSheetClient() {
  const accessToken = await getAccessToken();
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.sheets({ version: 'v4', auth: oauth2Client });
}

async function getOrCreateSpreadsheet(): Promise<string> {
  const existing = await db.select().from(appSettings).where(eq(appSettings.key, "google_sheet_id"));
  if (existing.length > 0) {
    return existing[0].value;
  }

  const sheets = await getUncachableGoogleSheetClient();

  const response = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: "Heist Party - RSVPs" },
      sheets: [{ properties: { title: "RSVPs" } }],
    },
  });

  const spreadsheetId = response.data.spreadsheetId!;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "RSVPs!A1:C1",
    valueInputOption: "RAW",
    requestBody: {
      values: [["Name", "Attendees", "Date"]],
    },
  });

  await db.insert(appSettings).values({
    key: "google_sheet_id",
    value: spreadsheetId,
  });

  console.log(`Created Google Sheet: ${spreadsheetId}`);
  return spreadsheetId;
}

export async function appendRsvpToSheet(name: string, attendees: number) {
  try {
    const sheetId = await getOrCreateSpreadsheet();
    const sheets = await getUncachableGoogleSheetClient();

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "RSVPs!A:C",
      valueInputOption: "RAW",
      requestBody: {
        values: [[name, attendees, new Date().toISOString()]],
      },
    });

    console.log(`RSVP appended to Google Sheet: ${name} (${attendees})`);
  } catch (error) {
    console.error("Failed to append to Google Sheet:", error);
  }
}
