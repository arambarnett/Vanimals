# Sprouts API Documentation

## Base URL

**Development:** `http://localhost:3000`
**Production:** `https://your-backend.vercel.app`

---

## Authentication

All endpoints require wallet authentication via Aptos Keyless.

**Headers:**
```
Authorization: Bearer <wallet_signature>
Content-Type: application/json
```

---

## Endpoints

### Health Check

#### `GET /health`
Check if server is running

**Response:**
```json
{
  "status": "OK",
  "message": "Sprouts backend is running!",
  "timestamp": "2025-10-03T10:30:00.000Z"
}
```

---

## Authentication

### Connect Wallet

#### `POST /api/auth/connect-wallet`
Create or retrieve user by wallet address

**Request:**
```json
{
  "walletAddress": "0x52503f9537...",
  "socialProvider": "google",
  "socialProviderId": "google_123456",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "user": {
    "id": "clx1234...",
    "walletAddress": "0x52503f9537...",
    "name": "John Doe",
    "level": 1,
    "experience": 0,
    "streak": 0
  },
  "isNewUser": true
}
```

### Get User

#### `GET /api/auth/user/:walletAddress`
Get user profile by wallet address

**Response:**
```json
{
  "id": "clx1234...",
  "walletAddress": "0x52503f9537...",
  "name": "John Doe",
  "email": "john@example.com",
  "level": 5,
  "experience": 450,
  "totalPoints": 1250,
  "streak": 7,
  "sproutsCount": 2,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

## Sprouts

### Mint New Sprout

#### `POST /api/sprouts/mint`
Mint a new Sprout NFT for a category

**Request:**
```json
{
  "userId": "clx1234...",
  "category": "fitness",
  "species": "Dragon",
  "name": "My Fitness Dragon",
  "rarity": "Common"
}
```

**Response:**
```json
{
  "sprout": {
    "id": "clx5678...",
    "category": "fitness",
    "species": "Dragon",
    "name": "My Fitness Dragon",
    "nftAddress": "0xabc...",
    "tokenId": "1",
    "mintTransactionHash": "0xdef...",
    "level": 1,
    "healthPoints": 100
  },
  "transactionUrl": "https://explorer.aptoslabs.com/txn/0xdef..."
}
```

### Get User's Sprouts

#### `GET /api/sprouts/user/:userId`
Get all Sprouts for a user

**Response:**
```json
{
  "sprouts": [
    {
      "id": "clx5678...",
      "category": "fitness",
      "species": "Dragon",
      "name": "My Fitness Dragon",
      "level": 3,
      "experience": 45,
      "healthPoints": 85,
      "isWithering": false,
      "activeGoalsCount": 2,
      "completedGoalsCount": 5,
      "equippedAccessories": ["acc_fitness_shoes", "acc_fitness_headband"]
    },
    {
      "id": "clx9012...",
      "category": "finance",
      "species": "Elephant",
      "name": "Wealthy Elephant",
      "level": 2,
      "experience": 80,
      "healthPoints": 92,
      "isWithering": false,
      "activeGoalsCount": 1,
      "completedGoalsCount": 2,
      "equippedAccessories": ["acc_finance_piggy"]
    }
  ]
}
```

### Get Sprout Details

#### `GET /api/sprouts/:sproutId`
Get detailed info for a specific Sprout

**Response:**
```json
{
  "id": "clx5678...",
  "userId": "clx1234...",
  "category": "fitness",
  "species": "Dragon",
  "name": "My Fitness Dragon",
  "rarity": "Common",
  "grade": "Elite",
  "level": 3,
  "experience": 45,
  "healthPoints": 85,
  "growthStage": "Seedling",
  "sizeMultiplier": 1.2,
  "isWithering": false,
  "nftAddress": "0xabc...",
  "goals": [
    {
      "id": "clxg123...",
      "title": "Run 20 miles this week",
      "progress": 70,
      "isActive": true
    },
    {
      "id": "clxg456...",
      "title": "10k steps daily",
      "progress": 85,
      "isActive": true
    }
  ],
  "accessories": [
    {
      "id": "acc_fitness_shoes",
      "name": "Running Shoes",
      "isEquipped": true
    }
  ]
}
```

### Get Sprout Health

#### `GET /api/sprouts/:sproutId/health`
Get real-time health calculation

**Response:**
```json
{
  "sproutId": "clx5678...",
  "healthPoints": 85,
  "isWithering": false,
  "status": "Good",
  "activeGoals": 2,
  "averageProgress": 77.5,
  "needsAttention": false
}
```

### Update Sprout

#### `PUT /api/sprouts/:sproutId`
Update Sprout details (name, equipped accessories)

**Request:**
```json
{
  "name": "Super Dragon",
  "equippedAccessories": ["acc_fitness_shoes", "acc_fitness_medal"]
}
```

**Response:**
```json
{
  "id": "clx5678...",
  "name": "Super Dragon",
  "equippedAccessories": ["acc_fitness_shoes", "acc_fitness_medal"],
  "updatedAt": "2025-10-03T10:30:00.000Z"
}
```

---

## Goals

### Create Goal

#### `POST /api/goals`
Create a new goal for a Sprout

**Request:**
```json
{
  "userId": "clx1234...",
  "sproutId": "clx5678...",
  "title": "Run 20 miles this week",
  "description": "Weekly running goal",
  "category": "fitness",
  "subcategory": "running",
  "targetValue": 20,
  "unit": "miles",
  "frequency": "weekly",
  "endDate": "2025-10-10T23:59:59.000Z",
  "experienceReward": 50,
  "pointsReward": 25,
  "accessoryReward": "acc_fitness_shoes",
  "integrationId": "clxi123..."
}
```

**Response:**
```json
{
  "id": "clxg123...",
  "title": "Run 20 miles this week",
  "category": "fitness",
  "targetValue": 20,
  "currentValue": 0,
  "unit": "miles",
  "progress": 0,
  "isActive": true,
  "daysRemaining": 7
}
```

### Get User's Goals

#### `GET /api/goals/user/:userId`
Get all goals for a user

**Query Parameters:**
- `category` - Filter by category (fitness, finance, etc.)
- `isActive` - Filter by active status (true/false)
- `isCompleted` - Filter by completion (true/false)

**Example:** `/api/goals/user/clx1234?category=fitness&isActive=true`

**Response:**
```json
{
  "goals": [
    {
      "id": "clxg123...",
      "sproutId": "clx5678...",
      "sproutName": "My Fitness Dragon",
      "title": "Run 20 miles this week",
      "category": "fitness",
      "targetValue": 20,
      "currentValue": 14.2,
      "unit": "miles",
      "progress": 71,
      "frequency": "weekly",
      "startDate": "2025-10-01T00:00:00.000Z",
      "endDate": "2025-10-07T23:59:59.000Z",
      "isActive": true,
      "isCompleted": false,
      "daysRemaining": 3,
      "recentActivities": [
        {
          "date": "2025-10-03",
          "value": 5.2,
          "unit": "miles"
        }
      ]
    }
  ]
}
```

### Get Goal Details

#### `GET /api/goals/:goalId`
Get detailed goal info with progress

**Response:**
```json
{
  "id": "clxg123...",
  "userId": "clx1234...",
  "sproutId": "clx5678...",
  "sprout": {
    "name": "My Fitness Dragon",
    "species": "Dragon",
    "healthPoints": 85
  },
  "title": "Run 20 miles this week",
  "description": "Weekly running goal",
  "category": "fitness",
  "targetValue": 20,
  "currentValue": 14.2,
  "unit": "miles",
  "frequency": "weekly",
  "progress": {
    "percentage": 71,
    "remaining": 5.8,
    "onTrack": true
  },
  "timeline": {
    "startDate": "2025-10-01T00:00:00.000Z",
    "endDate": "2025-10-07T23:59:59.000Z",
    "daysElapsed": 3,
    "daysRemaining": 4,
    "daysTotal": 7
  },
  "rewards": {
    "experienceReward": 50,
    "pointsReward": 25,
    "accessoryReward": {
      "id": "acc_fitness_shoes",
      "name": "Running Shoes"
    }
  },
  "activities": [
    {
      "id": "clxa123...",
      "date": "2025-10-03",
      "value": 5.2,
      "type": "run",
      "source": "strava"
    }
  ]
}
```

### Update Goal Progress

#### `PUT /api/goals/:goalId`
Update goal progress

**Request:**
```json
{
  "currentValue": 15.5
}
```

**Response:**
```json
{
  "id": "clxg123...",
  "currentValue": 15.5,
  "progress": 77.5,
  "remainingValue": 4.5
}
```

### Log Manual Progress

#### `POST /api/goals/:goalId/progress`
Manually log progress toward a goal

**Request:**
```json
{
  "value": 3.5,
  "unit": "miles",
  "notes": "Morning run in the park",
  "activityDate": "2025-10-03T08:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "activity": {
    "id": "clxa123...",
    "value": 3.5,
    "unit": "miles"
  },
  "goal": {
    "currentValue": 17.7,
    "progress": 88.5
  },
  "experienceEarned": 5
}
```

### Complete Goal

#### `POST /api/goals/:goalId/complete`
Mark goal as completed (usually automatic)

**Response:**
```json
{
  "success": true,
  "goal": {
    "id": "clxg123...",
    "isCompleted": true,
    "completedAt": "2025-10-07T15:30:00.000Z"
  },
  "rewards": {
    "experience": 50,
    "points": 25,
    "accessoryUnlocked": {
      "id": "acc_fitness_shoes",
      "name": "Running Shoes",
      "rarity": "Common"
    }
  },
  "sprout": {
    "level": 4,
    "experience": 20,
    "leveledUp": true
  }
}
```

### Delete Goal

#### `DELETE /api/goals/:goalId`
Delete a goal

**Response:**
```json
{
  "success": true,
  "message": "Goal deleted"
}
```

---

## Integrations

### Connect Platform

#### `POST /api/integrations/connect`
Connect external platform

**Request:**
```json
{
  "userId": "clx1234...",
  "provider": "strava",
  "providerId": "strava_123456",
  "accessToken": "token_abc...",
  "refreshToken": "refresh_xyz...",
  "expiresAt": "2026-10-03T00:00:00.000Z"
}
```

**Response:**
```json
{
  "id": "clxi123...",
  "provider": "strava",
  "isActive": true,
  "lastSync": null,
  "syncFrequency": "daily"
}
```

### Get User's Integrations

#### `GET /api/integrations/user/:userId`
Get all connected platforms

**Response:**
```json
{
  "integrations": [
    {
      "id": "clxi123...",
      "provider": "strava",
      "isActive": true,
      "lastSync": "2025-10-03T06:00:00.000Z",
      "syncFrequency": "daily",
      "goalsCount": 2
    },
    {
      "id": "clxi456...",
      "provider": "plaid",
      "isActive": true,
      "lastSync": "2025-10-03T05:00:00.000Z",
      "syncFrequency": "daily",
      "goalsCount": 1
    }
  ]
}
```

### Sync Integration

#### `POST /api/integrations/:integrationId/sync`
Manually trigger sync for integration

**Response:**
```json
{
  "success": true,
  "integration": "strava",
  "activitiesSynced": 5,
  "goalsUpdated": 2,
  "lastSync": "2025-10-03T10:30:00.000Z"
}
```

### Disconnect Integration

#### `DELETE /api/integrations/:integrationId`
Disconnect platform

**Response:**
```json
{
  "success": true,
  "message": "Strava disconnected"
}
```

---

## Strava Integration

### Authorize Strava

#### `GET /api/strava/authorize`
Redirect to Strava OAuth

**Query Parameters:**
- `userId` - User ID to associate with Strava account

**Response:** Redirect to Strava authorization page

### Exchange Strava Token

#### `GET /api/strava/exchange_token`
Handle OAuth callback (automatic)

**Query Parameters:**
- `code` - OAuth code from Strava
- `state` - User ID

**Response:** Redirect to app with success/error

### Sync Strava Activities

#### `POST /api/strava/sync-activities`
Sync recent activities from Strava

**Request:**
```json
{
  "userId": "clx1234..."
}
```

**Response:**
```json
{
  "success": true,
  "activitiesSynced": 5,
  "goalsUpdated": 2,
  "activities": [
    {
      "id": "clxa123...",
      "type": "Run",
      "distance": 5.2,
      "date": "2025-10-03T08:00:00.000Z"
    }
  ]
}
```

---

## Plaid Integration (Financial Goals)

### Create Link Token

#### `POST /api/plaid/create-link-token`
Create Plaid Link token for bank connection

**Request:**
```json
{
  "userId": "clx1234..."
}
```

**Response:**
```json
{
  "linkToken": "link-sandbox-abc123..."
}
```

### Exchange Public Token

#### `POST /api/plaid/exchange-token`
Exchange public token for access token

**Request:**
```json
{
  "userId": "clx1234...",
  "publicToken": "public-sandbox-xyz..."
}
```

**Response:**
```json
{
  "success": true,
  "integration": {
    "id": "clxi456...",
    "provider": "plaid",
    "accountsLinked": 2
  }
}
```

### Sync Transactions

#### `POST /api/plaid/sync-transactions`
Sync recent transactions from Plaid

**Request:**
```json
{
  "userId": "clx1234..."
}
```

**Response:**
```json
{
  "success": true,
  "transactionsSynced": 45,
  "goalsUpdated": 1,
  "balances": {
    "checking": 2500.50,
    "savings": 10250.00
  }
}
```

---

## Accessories

### Get All Accessories

#### `GET /api/accessories`
Get catalog of all accessories

**Query Parameters:**
- `category` - Filter by category

**Example:** `/api/accessories?category=fitness`

**Response:**
```json
{
  "accessories": [
    {
      "id": "acc_fitness_shoes",
      "name": "Running Shoes",
      "description": "First steps on your fitness journey",
      "category": "fitness",
      "rarity": "Common",
      "imageUrl": "/accessories/running_shoes.png",
      "requirement": {
        "type": "first_goal",
        "value": 1,
        "description": "Complete your first fitness goal"
      }
    }
  ]
}
```

### Get User's Accessories

#### `GET /api/accessories/user/:userId`
Get earned accessories for user

**Query Parameters:**
- `sproutId` - Filter by Sprout

**Response:**
```json
{
  "accessories": [
    {
      "id": "acc_fitness_shoes",
      "name": "Running Shoes",
      "rarity": "Common",
      "imageUrl": "/accessories/running_shoes.png",
      "sproutId": "clx5678...",
      "sproutName": "My Fitness Dragon",
      "isEquipped": true,
      "unlockedAt": "2025-10-01T10:00:00.000Z"
    }
  ],
  "totalUnlocked": 3,
  "totalAvailable": 24
}
```

### Equip Accessory

#### `POST /api/accessories/equip`
Equip accessory on Sprout

**Request:**
```json
{
  "userId": "clx1234...",
  "sproutId": "clx5678...",
  "accessoryId": "acc_fitness_shoes"
}
```

**Response:**
```json
{
  "success": true,
  "sprout": {
    "id": "clx5678...",
    "equippedAccessories": ["acc_fitness_shoes", "acc_fitness_medal"]
  }
}
```

### Unequip Accessory

#### `POST /api/accessories/unequip`
Unequip accessory from Sprout

**Request:**
```json
{
  "userId": "clx1234...",
  "sproutId": "clx5678...",
  "accessoryId": "acc_fitness_shoes"
}
```

**Response:**
```json
{
  "success": true,
  "sprout": {
    "id": "clx5678...",
    "equippedAccessories": ["acc_fitness_medal"]
  }
}
```

---

## Activities

### Get User's Activities

#### `GET /api/activities/user/:userId`
Get activity history

**Query Parameters:**
- `type` - Filter by type (workout, transaction, etc.)
- `goalId` - Filter by goal
- `startDate` - Start date (ISO 8601)
- `endDate` - End date (ISO 8601)
- `limit` - Max results (default: 50)

**Example:** `/api/activities/user/clx1234?type=workout&limit=20`

**Response:**
```json
{
  "activities": [
    {
      "id": "clxa123...",
      "type": "workout",
      "category": "run",
      "value": 5.2,
      "unit": "miles",
      "goalId": "clxg123...",
      "goalTitle": "Run 20 miles this week",
      "contributesToGoal": true,
      "pointsEarned": 5,
      "experienceEarned": 5,
      "activityDate": "2025-10-03T08:00:00.000Z",
      "source": "strava"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "perPage": 50
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Error Codes

- `400` - Bad Request (invalid input)
- `401` - Unauthorized (invalid auth)
- `403` - Forbidden (not allowed)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

**Example:**
```json
{
  "error": "Goal not found",
  "code": "GOAL_NOT_FOUND",
  "details": {
    "goalId": "invalid_id"
  }
}
```

---

## Rate Limiting

- **Default:** 100 requests/minute per IP
- **Authenticated:** 1000 requests/minute per user
- **Webhooks:** No limit

**Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1633024800
```

---

## Webhooks (Future)

### Strava Webhook
Receives activity updates from Strava

### Plaid Webhook
Receives transaction updates from Plaid

---

## Testing

### Postman Collection
Import `docs/sprouts-api.postman_collection.json`

### Example cURL Commands

**Health Check:**
```bash
curl http://localhost:3000/health
```

**Connect Wallet:**
```bash
curl -X POST http://localhost:3000/api/auth/connect-wallet \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x123...",
    "name": "Test User"
  }'
```

**Create Goal:**
```bash
curl -X POST http://localhost:3000/api/goals \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "clx123...",
    "sproutId": "clx456...",
    "title": "Run 20 miles",
    "category": "fitness",
    "targetValue": 20,
    "unit": "miles",
    "frequency": "weekly"
  }'
```

---

For database schema details, see `docs/DATABASE_SCHEMA.md`
