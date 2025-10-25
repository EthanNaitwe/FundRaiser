const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

// Get all public events
const getAllEvents = async (req, res) => {
  try {
    const events = db.getEvents().filter(event => event.isPublic);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Get specific event by ID
const getEventById = async (req, res) => {
  try {
    const event = db.findEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

// Create new event
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      goalAmount,
      coverImage,
      location,
      deadline,
      isPublic = true,
      organizerName,
      organizerEmail,
      status = 'active'
    } = req.body;

    const newEvent = {
      id: uuidv4(),
      title,
      description,
      goalAmount,
      currentAmount: 0,
      coverImage,
      location,
      deadline: deadline ? new Date(deadline) : null,
      isPublic,
      organizerName,
      organizerEmail,
      status,
      createdAt: new Date()
    };

    const createdEvent = db.addEvent(newEvent);
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updates = req.body;

    // Convert deadline string to Date if provided
    if (updates.deadline) {
      updates.deadline = new Date(updates.deadline);
    }

    const updatedEvent = db.updateEvent(eventId, updates);
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const deleted = db.deleteEvent(eventId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
