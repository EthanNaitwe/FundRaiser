// Simple test script to verify the API endpoints
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Testing FundRaiser API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);

    // Test creating an event
    console.log('\n2. Creating a test event...');
    const eventData = {
      title: 'Test Fundraiser',
      description: 'This is a test fundraiser for API testing',
      goalAmount: 1000,
      organizerName: 'Test Organizer',
      organizerEmail: 'test@example.com',
      location: 'Test Location',
      isPublic: true
    };

    const eventResponse = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData)
    });

    const createdEvent = await eventResponse.json();
    console.log('✅ Event created:', createdEvent);

    // Test getting all events
    console.log('\n3. Getting all events...');
    const eventsResponse = await fetch(`${BASE_URL}/events`);
    const events = await eventsResponse.json();
    console.log('✅ Events retrieved:', events.length, 'events');

    // Test creating a contribution
    console.log('\n4. Creating a test contribution...');
    const contributionData = {
      donorName: 'Test Donor',
      donorEmail: 'donor@example.com',
      amount: 50,
      message: 'Great cause!',
      isAnonymous: false,
      isPledge: false
    };

    const contributionResponse = await fetch(`${BASE_URL}/events/${createdEvent.id}/contributions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contributionData)
    });

    const createdContribution = await contributionResponse.json();
    console.log('✅ Contribution created:', createdContribution);

    // Test getting contributions for the event
    console.log('\n5. Getting contributions for the event...');
    const contributionsResponse = await fetch(`${BASE_URL}/events/${createdEvent.id}/contributions`);
    const contributions = await contributionsResponse.json();
    console.log('✅ Contributions retrieved:', contributions.length, 'contributions');

    console.log('\n🎉 All tests passed! API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running with: npm run dev');
  }
}

// Run the test
testAPI();
