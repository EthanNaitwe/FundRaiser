// Database configuration and connection
// Currently using in-memory storage, but ready for database integration

const config = require('./config');

// In-memory storage (replace with database in production)
let events = [];
let contributions = [];

// Database connection function (for future use)
const connectDatabase = async () => {
  try {
    // Add database connection logic here
    // Example for MongoDB:
    // const mongoose = require('mongoose');
    // await mongoose.connect(config.database.url, config.database.options);
    // console.log('✅ Database connected successfully');
    
    console.log('📝 Using in-memory storage (development mode)');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Data access functions
const getEvents = () => events;
const getContributions = () => contributions;

const addEvent = (event) => {
  events.push(event);
  return event;
};

const addContribution = (contribution) => {
  contributions.push(contribution);
  return contribution;
};

const updateEvent = (id, updates) => {
  const index = events.findIndex(e => e.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...updates };
    return events[index];
  }
  return null;
};

const updateContribution = (id, updates) => {
  const index = contributions.findIndex(c => c.id === id);
  if (index !== -1) {
    contributions[index] = { ...contributions[index], ...updates };
    return contributions[index];
  }
  return null;
};

const deleteEvent = (id) => {
  const index = events.findIndex(e => e.id === id);
  if (index !== -1) {
    events.splice(index, 1);
    // Also delete related contributions
    contributions = contributions.filter(c => c.eventId !== id);
    return true;
  }
  return false;
};

const findEventById = (id) => events.find(e => e.id === id);
const findContributionById = (id) => contributions.find(c => c.id === id);
const findContributionsByEventId = (eventId) => contributions.filter(c => c.eventId === eventId);

module.exports = {
  connectDatabase,
  getEvents,
  getContributions,
  addEvent,
  addContribution,
  updateEvent,
  updateContribution,
  deleteEvent,
  findEventById,
  findContributionById,
  findContributionsByEventId
};
