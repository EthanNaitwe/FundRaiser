const express = require('express');
const eventController = require('../controllers/event.controller');
const contributionController = require('../controllers/contribution.controller');
const authRoutes = require('./auth.routes');
const { 
  createEventSchema, 
  updateEventSchema, 
  createContributionSchema, 
  updateContributionSchema, 
  validate 
} = require('../validations/event.validation');

const router = express.Router();

// Auth routes
router.use('/', authRoutes);

// Event routes
router.get('/events', eventController.getAllEvents);
router.get('/events/search', eventController.searchEvents);
router.get('/events/user/:userId', eventController.getEventsByUser);
router.get('/events/:id', eventController.getEventById);
router.post('/events', validate(createEventSchema), eventController.createEvent);
router.put('/events/:id', validate(updateEventSchema), eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);

// Contribution routes
router.get('/events/:eventId/contributions', contributionController.getContributionsByEventId);
router.post('/events/:eventId/contributions', validate(createContributionSchema), contributionController.createContribution);
router.put('/contributions/:id', validate(updateContributionSchema), contributionController.updateContribution);

module.exports = router;
