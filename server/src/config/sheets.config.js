// Load environment variables first
require('dotenv').config();

const { google } = require('googleapis');
const config = require('./config');

// Google Sheets configuration
const sheetsConfig = {
  // Spreadsheet ID (found in the URL)
  spreadsheetId: process.env.GOOGLE_SHEETS_ID || '',

  // Sheet names for different data
  sheets: {
    events: 'Events',
    contributions: 'Contributions'
  },
  
  // Column headers for Events sheet
  eventsHeaders: [
    'id',
    'title', 
    'description',
    'goalAmount',
    'currentAmount',
    'coverImage',
    'location',
    'deadline',
    'isPublic',
    'organizerName',
    'organizerEmail',
    'status',
    'createdAt'
  ],
  
  // Column headers for Contributions sheet
  contributionsHeaders: [
    'id',
    'eventId',
    'donorName',
    'donorEmail', 
    'amount',
    'isAnonymous',
    'isPledge',
    'message',
    'status',
    'createdAt'
  ]
};

// Initialize Google Sheets API
const initializeSheets = async () => {
  try {
    // Simplified JWT Authentication (only needs email and private key)
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Test connection and create sheets if they don't exist
    await ensureSheetsExist(sheets);
    
    return sheets;
  } catch (error) {
    console.error('Failed to initialize Google Sheets:', error.message);
    throw error;
  }
};

// Ensure required sheets exist and have proper headers
const ensureSheetsExist = async (sheets) => {
  try {
    const spreadsheetId = sheetsConfig.spreadsheetId;
    
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_ID environment variable is required');
    }

    // Get spreadsheet info
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId
    });

    const existingSheets = spreadsheet.data.sheets.map(sheet => sheet.properties.title);
    
    // Create Events sheet if it doesn't exist
    if (!existingSheets.includes(sheetsConfig.sheets.events)) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [{
            addSheet: {
              properties: {
                title: sheetsConfig.sheets.events
              }
            }
          }]
        }
      });
      
      // Add headers to Events sheet
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetsConfig.sheets.events}!A1`,
        valueInputOption: 'RAW',
        resource: {
          values: [sheetsConfig.eventsHeaders]
        }
      });
    }
    
    // Create Contributions sheet if it doesn't exist
    if (!existingSheets.includes(sheetsConfig.sheets.contributions)) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [{
            addSheet: {
              properties: {
                title: sheetsConfig.sheets.contributions
              }
            }
          }]
        }
      });
      
      // Add headers to Contributions sheet
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetsConfig.sheets.contributions}!A1`,
        valueInputOption: 'RAW',
        resource: {
          values: [sheetsConfig.contributionsHeaders]
        }
      });
    }
    
    console.log('✅ Google Sheets initialized successfully');
  } catch (error) {
    console.error('❌ Failed to ensure sheets exist:', error.message);
    throw error;
  }
};

module.exports = {
  sheetsConfig,
  initializeSheets
};
