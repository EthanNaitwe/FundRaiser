const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

// Get contributions for an event
const getContributionsByEventId = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const contributions = db.findContributionsByEventId(eventId);
    res.json(contributions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contributions' });
  }
};

// Create new contribution
const createContribution = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = db.findEventById(eventId);
    
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

    const createdContribution = db.addContribution(newContribution);

    // Update event's current amount if contribution is not a pledge and confirmed
    if (!isPledge && status === 'confirmed') {
      db.updateEvent(eventId, { 
        currentAmount: event.currentAmount + amount 
      });
    }

    res.status(201).json(createdContribution);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create contribution' });
  }
};

// Update contribution status
const updateContribution = async (req, res) => {
  try {
    const contributionId = req.params.id;
    const { status } = req.body;

    const contribution = db.findContributionById(contributionId);
    if (!contribution) {
      return res.status(404).json({ error: 'Contribution not found' });
    }

    const oldStatus = contribution.status;
    const isPledge = contribution.isPledge;

    const updatedContribution = db.updateContribution(contributionId, { status });

    // Update event's current amount if status changed to confirmed
    if (status === 'confirmed' && oldStatus !== 'confirmed' && !isPledge) {
      const event = db.findEventById(contribution.eventId);
      if (event) {
        db.updateEvent(contribution.eventId, { 
          currentAmount: event.currentAmount + contribution.amount 
        });
      }
    }

    res.json(updatedContribution);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contribution' });
  }
};

module.exports = {
  getContributionsByEventId,
  createContribution,
  updateContribution
};
