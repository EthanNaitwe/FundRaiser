// Basic API tests
const request = require('supertest');
const app = require('../app');

describe('API Tests', () => {
  let testEventId;
  let testContributionId;

  test('Health check endpoint', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  test('Create event', async () => {
    const eventData = {
      title: 'Test Fundraiser',
      description: 'Test description',
      goalAmount: 1000,
      organizerName: 'Test Organizer',
      organizerEmail: 'test@example.com'
    };

    const response = await request(app)
      .post('/api/events')
      .send(eventData);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(eventData.title);
    testEventId = response.body.id;
  });

  test('Get all events', async () => {
    const response = await request(app).get('/api/events');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('Create contribution', async () => {
    const contributionData = {
      donorName: 'Test Donor',
      donorEmail: 'donor@example.com',
      amount: 100,
      message: 'Great cause!'
    };

    const response = await request(app)
      .post(`/api/events/${testEventId}/contributions`)
      .send(contributionData);

    expect(response.status).toBe(201);
    expect(response.body.amount).toBe(contributionData.amount);
    testContributionId = response.body.id;
  });

  test('Get contributions for event', async () => {
    const response = await request(app).get(`/api/events/${testEventId}/contributions`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('Update contribution status', async () => {
    const response = await request(app)
      .put(`/api/contributions/${testContributionId}`)
      .send({ status: 'confirmed' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('confirmed');
  });

  test('Delete event', async () => {
    const response = await request(app).delete(`/api/events/${testEventId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Event deleted successfully');
  });
});
