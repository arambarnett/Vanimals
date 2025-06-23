# Sprouts Backend

A Node.js/Express backend with PostgreSQL and Prisma ORM for the Sprouts app.

## Features
- User authentication (basic, extensible)
- Users can have multiple animals, habits, and milestones
- PostgreSQL database with Prisma ORM
- TypeScript support
- Strava OAuth integration

## Tech Stack
- Node.js 18+
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- DBeaver (optional, for DB management)

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd sprouts-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up PostgreSQL
- Install PostgreSQL (e.g. `brew install postgresql@14`)
- Start the service: `brew services start postgresql@14`
- Create a user and database:
  ```sql
  CREATE USER sproutuser WITH PASSWORD 'sproutpass';
  CREATE DATABASE sprouts OWNER sproutuser;
  GRANT ALL PRIVILEGES ON DATABASE sprouts TO sproutuser;
  ```

### 4. Configure environment variables
Create a `.env` file in the root directory:
```
DATABASE_URL="postgresql://sproutuser:sproutpass@localhost:5432/sprouts"
PORT=3000
STRAVA_CLIENT_ID=165294
STRAVA_CLIENT_SECRET=your_strava_client_secret
```

### 5. Set up the database schema
```bash
npx prisma migrate reset --force
npx prisma db seed
```

### 6. Start the development server
```bash
npm run dev
```

The server will run on [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Strava Integration
- `GET /api/exchange_token` - OAuth callback endpoint
- `GET /api/activities` - Get user's Strava activities

## Strava OAuth Integration

### For Frontend Engineers

To connect a user's Strava account, redirect them to this OAuth URL:

```
https://www.strava.com/oauth/authorize?client_id=165294&response_type=code&redirect_uri=http://localhost:3000/api/exchange_token?userId=YOUR_USER_ID&scope=activity:read_all&approval_prompt=force
```

**Parameters:**
- `client_id`: Your Strava app client ID
- `redirect_uri`: Must match your Strava app settings
- `userId`: The authenticated user's ID (required)
- `scope`: `activity:read_all` (required for reading activities)
- `approval_prompt`: `force` (forces re-authorization)

**Example with user ID:**
```
https://www.strava.com/oauth/authorize?client_id=165294&response_type=code&redirect_uri=http://localhost:3000/api/exchange_token?userId=sproutsuser&scope=activity:read_all&approval_prompt=force
```

**Response:**
After successful authorization, the user will be redirected to `/api/exchange_token` which returns:
```json
{
  "success": true,
  "message": "Successfully connected to Strava!",
  "provider": "strava",
  "athlete": { /* athlete data */ },
  "activities": [ /* latest 10 activities */ ],
  "integration": { /* integration details */ }
}
```

### Get User's Activities
To fetch a user's Strava activities:
```
GET /api/activities?userId=YOUR_USER_ID
```

### Strava App Configuration
- **Authorization Callback Domain**: `localhost:3000`
- **Client ID**: `165294`
- **Required Scopes**: `activity:read_all`

## Database Management
- Use [DBeaver](https://dbeaver.io/) or `psql` to view and manage your database.

## Prisma
- Edit your data models in `prisma/schema.prisma`
- Run `npx prisma migrate dev` after changes
- Generate the client with `npx prisma generate`

## Example Prisma Schema
See `prisma/schema.prisma` for the latest schema.

## License
MIT 