const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
let events = [];
let contributions = [];

// Helper function to validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Events API Routes

// GET /api/events - Get all events
app.get('/api/events', (req, res) => {
  try {
    const publicEvents = events.filter(event => event.isPublic);
    res.json(publicEvents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/events/:id - Get specific event
app.get('/api/events/:id', (req, res) => {
  try {
    const event = events.find(e => e.id === req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// POST /api/events - Create new event
app.post('/api/events', (req, res) => {
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

    // Validation
    if (!title || !description || !goalAmount || !organizerName || !organizerEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!isValidEmail(organizerEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (goalAmount <= 0) {
      return res.status(400).json({ error: 'Goal amount must be positive' });
    }

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

    events.push(newEvent);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// PUT /api/events/:id - Update event
app.put('/api/events/:id', (req, res) => {
  try {
    const eventIndex = events.findIndex(e => e.id === req.params.id);
    if (eventIndex === -1) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const {
      title,
      description,
      goalAmount,
      coverImage,
      location,
      deadline,
      isPublic,
      organizerName,
      organizerEmail,
      status
    } = req.body;

    // Validation
    if (organizerEmail && !isValidEmail(organizerEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (goalAmount && goalAmount <= 0) {
      return res.status(400).json({ error: 'Goal amount must be positive' });
    }

    // Update event
    events[eventIndex] = {
      ...events[eventIndex],
      ...(title && { title }),
      ...(description && { description }),
      ...(goalAmount && { goalAmount }),
      ...(coverImage !== undefined && { coverImage }),
      ...(location !== undefined && { location }),
      ...(deadline && { deadline: new Date(deadline) }),
      ...(isPublic !== undefined && { isPublic }),
      ...(organizerName && { organizerName }),
      ...(organizerEmail && { organizerEmail }),
      ...(status && { status })
    };

    res.json(events[eventIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE /api/events/:id - Delete event
app.delete('/api/events/:id', (req, res) => {
  try {
    const eventIndex = events.findIndex(e => e.id === req.params.id);
    if (eventIndex === -1) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Also delete related contributions
    contributions = contributions.filter(c => c.eventId !== req.params.id);
    events.splice(eventIndex, 1);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Contributions API Routes

// GET /api/events/:eventId/contributions - Get contributions for an event
app.get('/api/events/:eventId/contributions', (req, res) => {
  try {
    const eventContributions = contributions.filter(c => c.eventId === req.params.eventId);
    res.json(eventContributions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contributions' });
  }
});

// POST /api/events/:eventId/contributions - Create new contribution
app.post('/api/events/:eventId/contributions', (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const {
      donorName,
      donorEmail,
      amount,
      isAnonymous = false,
      isPledge = false,
      message,
      status = 'pending'
    } = req.body;

    // Validation
    if (!donorName || !donorEmail || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!isValidEmail(donorEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    const newContribution = {
      id: uuidv4(),
      eventId,
      donorName,
      donorEmail,
      amount,
      isAnonymous,
      isPledge,
      message,
      status,
      createdAt: new Date()
    };

    contributions.push(newContribution);

    // Update event's current amount if contribution is not a pledge
    if (!isPledge && status === 'confirmed') {
      const eventIndex = events.findIndex(e => e.id === eventId);
      events[eventIndex].currentAmount += amount;
    }

    res.status(201).json(newContribution);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create contribution' });
  }
});

// PUT /api/contributions/:id - Update contribution status
app.put('/api/contributions/:id', (req, res) => {
  try {
    const contributionIndex = contributions.findIndex(c => c.id === req.params.id);
    if (contributionIndex === -1) {
      return res.status(404).json({ error: 'Contribution not found' });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const contribution = contributions[contributionIndex];
    const oldStatus = contribution.status;
    const isPledge = contribution.isPledge;

    // Update contribution
    contributions[contributionIndex] = {
      ...contribution,
      status
    };

    // Update event's current amount if status changed to confirmed
    if (status === 'confirmed' && oldStatus !== 'confirmed' && !isPledge) {
      const eventIndex = events.findIndex(e => e.id === contribution.eventId);
      if (eventIndex !== -1) {
        events[eventIndex].currentAmount += contribution.amount;
      }
    }

    res.json(contributions[contributionIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contribution' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export for Vercel
module.exports = app;
