const { sheetsConfig, initializeSheets } = require('../config/sheets.config');
const logger = require('../utils/logger');

class GoogleSheetsService {
  constructor() {
    this.sheets = null;
    this.spreadsheetId = sheetsConfig.spreadsheetId;
  }

  async initialize() {
    try {
      this.sheets = await initializeSheets();
      logger.info('Google Sheets service initialized');
    } catch (error) {
      logger.error('Failed to initialize Google Sheets service:', error.message);
      throw error;
    }
  }

  // Generic method to get all rows from a sheet
  async getAllRows(sheetName) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:Z`
      });

      const rows = response.data.values || [];
      if (rows.length === 0) return [];

      // Skip header row
      const dataRows = rows.slice(1);
      const headers = rows[0];

      // Convert rows to objects
      return dataRows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          let value = row[index] || '';
          
          // Convert string values back to appropriate types
          if (header === 'goalAmount' || header === 'currentAmount' || header === 'amount') {
            value = parseFloat(value) || 0;
          } else if (header === 'isPublic' || header === 'isAnonymous' || header === 'isPledge') {
            value = value === 'TRUE' || value === 'true';
          } else if (header === 'deadline' || header === 'createdAt') {
            value = value ? new Date(value) : null;
          }
          
          obj[header] = value;
        });
        return obj;
      });
    } catch (error) {
      logger.error(`Failed to get rows from ${sheetName}:`, error.message);
      throw error;
    }
  }

  // Generic method to add a row to a sheet
  async addRow(sheetName, data) {
    try {
      const headers = sheetName === sheetsConfig.sheets.events 
        ? sheetsConfig.eventsHeaders 
        : sheetsConfig.contributionsHeaders;

      // Convert object to array in the correct order
      const row = headers.map(header => {
        let value = data[header] || '';
        
        // Convert values to string format for Google Sheets
        if (typeof value === 'boolean') {
          value = value ? 'TRUE' : 'FALSE';
        } else if (value instanceof Date) {
          value = value.toISOString();
        } else if (value === null || value === undefined) {
          value = '';
        }
        
        return value;
      });

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'RAW',
        resource: {
          values: [row]
        }
      });

      logger.info(`Added row to ${sheetName}`);
      return data;
    } catch (error) {
      logger.error(`Failed to add row to ${sheetName}:`, error.message);
      throw error;
    }
  }

  // Generic method to update a row in a sheet
  async updateRow(sheetName, id, updates) {
    try {
      const rows = await this.getAllRows(sheetName);
      const rowIndex = rows.findIndex(row => row.id === id);
      
      if (rowIndex === -1) {
        throw new Error(`${sheetName.slice(0, -1)} not found`);
      }

      // Update the data
      const updatedData = { ...rows[rowIndex], ...updates };
      
      // Delete the old row and add the updated one
      await this.deleteRow(sheetName, id);
      await this.addRow(sheetName, updatedData);

      logger.info(`Updated row in ${sheetName}`);
      return updatedData;
    } catch (error) {
      logger.error(`Failed to update row in ${sheetName}:`, error.message);
      throw error;
    }
  }

  // Generic method to delete a row from a sheet
  async deleteRow(sheetName, id) {
    try {
      const rows = await this.getAllRows(sheetName);
      const rowIndex = rows.findIndex(row => row.id === id);
      
      if (rowIndex === -1) {
        throw new Error(`${sheetName.slice(0, -1)} not found`);
      }

      // Row number in sheet (accounting for header row)
      const sheetRowNumber = rowIndex + 2;

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        resource: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: await this.getSheetId(sheetName),
                dimension: 'ROWS',
                startIndex: sheetRowNumber - 1,
                endIndex: sheetRowNumber
              }
            }
          }]
        }
      });

      logger.info(`Deleted row from ${sheetName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to delete row from ${sheetName}:`, error.message);
      throw error;
    }
  }

  // Helper method to get sheet ID
  async getSheetId(sheetName) {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId
      });

      const sheet = response.data.sheets.find(s => s.properties.title === sheetName);
      return sheet ? sheet.properties.sheetId : null;
    } catch (error) {
      logger.error(`Failed to get sheet ID for ${sheetName}:`, error.message);
      throw error;
    }
  }

  // Event-specific methods
  async getAllEvents() {
    return await this.getAllRows(sheetsConfig.sheets.events);
  }

  async getEventById(id) {
    const events = await this.getAllEvents();
    return events.find(event => event.id === id);
  }

  async createEvent(eventData) {
    return await this.addRow(sheetsConfig.sheets.events, eventData);
  }

  async updateEvent(id, updates) {
    return await this.updateRow(sheetsConfig.sheets.events, id, updates);
  }

  async deleteEvent(id) {
    return await this.deleteRow(sheetsConfig.sheets.events, id);
  }

  // Contribution-specific methods
  async getAllContributions() {
    return await this.getAllRows(sheetsConfig.sheets.contributions);
  }

  async getContributionById(id) {
    const contributions = await this.getAllContributions();
    return contributions.find(contribution => contribution.id === id);
  }

  async getContributionsByEventId(eventId) {
    const contributions = await this.getAllContributions();
    return contributions.filter(contribution => contribution.eventId === eventId);
  }

  async createContribution(contributionData) {
    return await this.addRow(sheetsConfig.sheets.contributions, contributionData);
  }

  async updateContribution(id, updates) {
    return await this.updateRow(sheetsConfig.sheets.contributions, id, updates);
  }

  async deleteContribution(id) {
    return await this.deleteRow(sheetsConfig.sheets.contributions, id);
  }
}

module.exports = new GoogleSheetsService();
