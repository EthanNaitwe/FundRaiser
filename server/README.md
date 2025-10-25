# FundRaiser Backend Server

This is an **independent** Node.js Express backend server for the FundRaiser application. It's completely separate from the frontend and can be deployed independently to Vercel as serverless functions.

## 🚀 **Independent Project Structure**

This server folder is a standalone project with:
- ✅ **Own package.json** with server-specific dependencies
- ✅ **Own vercel.json** for independent deployment
- ✅ **Own node_modules** (when installed)
- ✅ **Independent versioning** and development workflow

## Features

- **Events Management**: Create, read, update, and delete fundraising events
- **Contributions Management**: Handle donations and pledges for events
- **RESTful API**: Clean API endpoints following REST conventions
- **Data Validation**: Input validation and error handling
- **CORS Support**: Cross-origin resource sharing enabled
- **Vercel Ready**: Optimized for serverless deployment
- **Independent Deployment**: Can be deployed separately from frontend

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Navigate to server directory:**
```bash
cd server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

The server will run on `http://localhost:3000` (or the port specified by Vercel)

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run API tests

## API Endpoints

### Events

- `GET /api/events` - Get all public events
- `GET /api/events/:id` - Get specific event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Contributions

- `GET /api/events/:eventId/contributions` - Get contributions for an event
- `POST /api/events/:eventId/contributions` - Create new contribution
- `PUT /api/contributions/:id` - Update contribution status

### Health Check

- `GET /api/health` - Server health check

## Data Models

### Event
```javascript
{
  id: string,
  title: string,
  description: string,
  goalAmount: number,
  currentAmount: number,
  coverImage: string | null,
  location: string | null,
  deadline: Date | null,
  isPublic: boolean,
  organizerName: string,
  organizerEmail: string,
  status: string,
  createdAt: Date
}
```

### Contribution
```javascript
{
  id: string,
  eventId: string,
  donorName: string,
  donorEmail: string,
  amount: number,
  isAnonymous: boolean,
  isPledge: boolean,
  message: string | null,
  status: string,
  createdAt: Date
}
```

## Testing the API

Run the included test script:

```bash
npm test
```

Or test manually with curl:

```bash
# Get all events
curl http://localhost:3000/api/events

# Create a new event
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "School Fundraiser",
    "description": "Help us raise funds for new equipment",
    "goalAmount": 5000,
    "organizerName": "John Doe",
    "organizerEmail": "john@example.com"
  }'

# Create a contribution
curl -X POST http://localhost:3000/api/events/{eventId}/contributions \
  -H "Content-Type: application/json" \
  -d '{
    "donorName": "Jane Smith",
    "donorEmail": "jane@example.com",
    "amount": 100,
    "message": "Great cause!"
  }'
```

## Independent Deployment

### Vercel Deployment (Server Only)

1. **Navigate to server directory:**
```bash
cd server
```

2. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

3. **Deploy to Vercel:**
```bash
vercel
```

4. **Production deployment:**
```bash
vercel --prod
```

The server will be deployed as a separate Vercel project with its own URL (e.g., `https://your-server-name.vercel.app`)

### Environment Variables

For production, add environment variables in your Vercel dashboard:

- `NODE_ENV=production`
- Any database connection strings (when you add a database)

## Project Structure

```
server/
├── index.js          # Main Express server
├── package.json      # Server dependencies
├── vercel.json       # Vercel deployment config
├── test-api.js       # API test script
└── README.md         # This file
```

## Data Storage

Currently uses in-memory storage (arrays) for development. For production:

1. **Add a database** (PostgreSQL, MongoDB, etc.)
2. **Implement proper data persistence**
3. **Add data validation** using Zod schemas
4. **Add authentication and authorization**

## Development Workflow

Since this is an independent project:

1. **Work in the server directory:**
```bash
cd server
```

2. **Install new dependencies:**
```bash
npm install package-name
```

3. **Run tests:**
```bash
npm test
```

4. **Deploy independently:**
```bash
vercel
```

## Integration with Frontend

The frontend can connect to this server by:

1. **Development:** Use `http://localhost:3000/api/...`
2. **Production:** Use the deployed Vercel URL `https://your-server.vercel.app/api/...`

Update your frontend's API base URL accordingly.

## Next Steps

1. **Database Integration**: Replace in-memory storage with a real database
2. **Authentication**: Add user authentication and authorization
3. **File Upload**: Implement image upload for event cover images
4. **Payment Integration**: Add payment processing for contributions
5. **Email Notifications**: Send emails for event updates and confirmations
6. **Rate Limiting**: Add rate limiting to prevent abuse
7. **Logging**: Add proper logging and monitoring

## Error Handling

The server includes comprehensive error handling:
- Input validation with meaningful error messages
- HTTP status codes following REST conventions
- Error logging for debugging
- Graceful error responses

## CORS Configuration

CORS is enabled for all origins in development. For production, configure specific allowed origins in the CORS middleware.