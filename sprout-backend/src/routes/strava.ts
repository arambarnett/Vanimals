// src/routes/strava.ts
import express, { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();
// Using singleton prisma instance from ../lib/prisma

// Strava OAuth callback - exchange authorization code for access token
router.get('/exchange_token', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // TODO: Get the actual user ID from your authentication system
    // For now, we'll use a placeholder
    const userId = req.query.userId as string || req.body.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Exchange the authorization code for an access token
    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return res.status(400).json({ error: 'Failed to exchange token' });
    }

    // Get user info from Strava
    const athleteResponse = await fetch('https://www.strava.com/api/v3/athlete', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const athleteData = await athleteResponse.json();

    // Save or update the integration in your database
    await prisma.integration.upsert({
      where: {
        userId_provider: {
          userId: userId,
          provider: 'strava',
        },
      },
      update: {
        providerId: athleteData.id.toString(),
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        isActive: true,
        lastSync: new Date(),
        metadata: {
          athlete: athleteData,
          expiresAt: tokenData.expires_at,
        },
      },
      create: {
        userId: userId,
        provider: 'strava',
        providerId: athleteData.id.toString(),
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        isActive: true,
        lastSync: new Date(),
        metadata: {
          athlete: athleteData,
          expiresAt: tokenData.expires_at,
        },
      },
    });

    // Fetch latest activities from Strava
    const activitiesResponse = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=10', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const activities = await activitiesResponse.json();

    // Return success with activities data
    res.json({
      success: true,
      message: 'Successfully connected to Strava!',
      provider: 'strava',
      athlete: athleteData,
      activities: activities,
      integration: {
        userId: userId,
        provider: 'strava',
        isActive: true,
        lastSync: new Date(),
      }
    });
    
  } catch (error) {
    console.error('Strava OAuth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's Strava activities
router.get('/activities', async (req: Request, res: Response): Promise<void> => {
  try {
    // TODO: Get the actual user ID from your authentication system
    // For now, we'll use a placeholder
    const userId = req.query.userId as string || req.body.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const integration = await prisma.integration.findUnique({
      where: {
        userId_provider: {
          userId: userId,
          provider: 'strava',
        },
      },
    });

    if (!integration || !integration.isActive) {
      return res.status(404).json({ error: 'Strava integration not found or inactive' });
    }

    // Get activities from Strava
    const activitiesResponse = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=20', {
      headers: {
        'Authorization': `Bearer ${integration.accessToken}`,
      },
    });

    const activities = await activitiesResponse.json();
    res.json(activities);

  } catch (error) {
    console.error('Error fetching Strava activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
