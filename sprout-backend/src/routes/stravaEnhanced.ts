// Enhanced Strava routes with goal tracking integration
import express, { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { GoalTrackingService } from '../services/goalTrackingService';

const router = express.Router();
// Using singleton prisma instance from ../lib/prisma
const goalTrackingService = new GoalTrackingService();

/**
 * Exchange authorization code for access token and sync activities
 */
router.get('/exchange_token', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, state } = req.query;

    if (!code) {
      res.status(400).json({ error: 'Authorization code is required' });
      return;
    }

    const userId = req.query.userId as string || req.body.userId;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Exchange authorization code for access token
    console.log('🔄 Exchanging Strava code for token...');
    console.log('   Client ID:', process.env.STRAVA_CLIENT_ID);
    console.log('   Code:', code);

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
      console.error('❌ Token exchange failed:', tokenData);
      console.error('   Status:', tokenResponse.status);
      console.error('   Response:', JSON.stringify(tokenData, null, 2));
      res.status(400).json({
        error: 'Failed to exchange token',
        details: tokenData
      });
      return;
    }

    console.log('✅ Token exchange successful!');

    // Get athlete info
    const athleteResponse = await fetch('https://www.strava.com/api/v3/athlete', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const athleteData = await athleteResponse.json();

    // Save or update integration
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
        syncFrequency: 'daily',
        metadata: {
          athlete: athleteData,
          expiresAt: tokenData.expires_at,
        },
      },
    });

    // Fetch and process recent activities
    const activitiesResponse = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=20', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const activities = await activitiesResponse.json();

    // Process activities for fitness goals
    let processedCount = 0;
    for (const activity of activities) {
      // Check if already processed
      const existing = await prisma.activity.findFirst({
        where: {
          userId,
          externalId: activity.id.toString(),
        },
      });

      if (existing) continue;

      // Determine activity type
      const activityType = activity.type.toLowerCase();
      let category = 'workout';

      if (activityType.includes('run')) {
        category = 'running';
      } else if (activityType.includes('ride') || activityType.includes('cycle')) {
        category = 'cycling';
      } else if (activityType.includes('swim')) {
        category = 'swimming';
      } else if (activityType.includes('walk')) {
        category = 'walking';
      }

      // Process activity for goals
      const distanceInMiles = activity.distance / 1609.34; // Convert meters to miles

      await goalTrackingService.processActivity(userId, {
        type: 'fitness',
        category,
        value: distanceInMiles,
        unit: 'miles',
        externalId: activity.id.toString(),
        metadata: {
          name: activity.name,
          type: activity.type,
          distance: activity.distance,
          movingTime: activity.moving_time,
          elapsedTime: activity.elapsed_time,
          totalElevationGain: activity.total_elevation_gain,
          startDate: activity.start_date,
        },
      });

      processedCount++;
    }

    // Redirect back to app with success
    // Using a custom URL scheme for deep linking
    const successUrl = `sprouts://strava-connected?success=true&athleteName=${encodeURIComponent(athleteData.firstname + ' ' + athleteData.lastname)}&activitiesProcessed=${processedCount}`;

    // Return HTML that redirects and shows a message
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Strava Connected</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #FC4C02 0%, #1a1a2e 100%);
              color: white;
              text-align: center;
              padding: 20px;
            }
            .container {
              max-width: 400px;
            }
            .icon {
              font-size: 64px;
              margin-bottom: 20px;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 10px;
            }
            p {
              font-size: 16px;
              opacity: 0.9;
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background: white;
              color: #FC4C02;
              padding: 12px 24px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: bold;
              margin-top: 20px;
            }
            .stats {
              background: rgba(255,255,255,0.1);
              padding: 15px;
              border-radius: 8px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">✅</div>
            <h1>Strava Connected!</h1>
            <p>Welcome ${athleteData.firstname}! Your Strava account is now linked to Sprouts.</p>
            <div class="stats">
              <strong>${processedCount} activities</strong> have been synced and will count towards your fitness goals.
            </div>
            <p style="margin-top: 30px; font-size: 14px;">
              You can close this window and return to the Sprouts app.
            </p>
            <a href="${successUrl}" class="button">Return to Sprouts</a>
          </div>
          <script>
            // Try to redirect automatically after 2 seconds
            setTimeout(() => {
              window.location.href = '${successUrl}';
            }, 2000);
          </script>
        </body>
      </html>
    `);

  } catch (error) {
    console.error('Strava OAuth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Sync Strava activities and update goals
 */
router.post('/sync-activities', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
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
      res.status(404).json({ error: 'Strava integration not found or inactive' });
      return;
    }

    // Fetch activities
    const activitiesResponse = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=30', {
      headers: {
        'Authorization': `Bearer ${integration.accessToken}`,
      },
    });

    const activities = await activitiesResponse.json();

    // Process new activities
    let processedCount = 0;
    for (const activity of activities) {
      const existing = await prisma.activity.findFirst({
        where: {
          userId,
          externalId: activity.id.toString(),
        },
      });

      if (existing) continue;

      const activityType = activity.type.toLowerCase();
      let category = 'workout';

      if (activityType.includes('run')) category = 'running';
      else if (activityType.includes('ride') || activityType.includes('cycle')) category = 'cycling';
      else if (activityType.includes('swim')) category = 'swimming';
      else if (activityType.includes('walk')) category = 'walking';

      const distanceInMiles = activity.distance / 1609.34;

      await goalTrackingService.processActivity(userId, {
        type: 'fitness',
        category,
        value: distanceInMiles,
        unit: 'miles',
        externalId: activity.id.toString(),
        metadata: activity,
      });

      processedCount++;
    }

    // Update last sync
    await prisma.integration.update({
      where: { id: integration.id },
      data: { lastSync: new Date() },
    });

    res.json({
      success: true,
      activitiesCount: activities.length,
      processedCount,
    });

  } catch (error) {
    console.error('Error syncing Strava activities:', error);
    res.status(500).json({ error: 'Failed to sync activities' });
  }
});

/**
 * Get user's Strava activities
 */
router.get('/activities', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.query.userId as string || req.body.userId;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
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
      res.status(404).json({ error: 'Strava integration not found or inactive' });
      return;
    }

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

/**
 * Disconnect Strava integration
 */
router.delete('/disconnect/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    await prisma.integration.updateMany({
      where: {
        userId,
        provider: 'strava',
      },
      data: {
        isActive: false,
        accessToken: null,
        refreshToken: null,
      },
    });

    res.json({ success: true, message: 'Strava disconnected' });
  } catch (error) {
    console.error('Error disconnecting Strava:', error);
    res.status(500).json({ error: 'Failed to disconnect Strava' });
  }
});

/**
 * Get athlete stats and suggest personalized goals
 * Uses Strava API to fetch recent activities and YTD totals
 */
router.get('/athlete-stats/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const integration = await prisma.integration.findUnique({
      where: {
        userId_provider: {
          userId: userId,
          provider: 'strava',
        },
      },
    });

    if (!integration || !integration.isActive) {
      res.status(404).json({ error: 'Strava integration not found or inactive' });
      return;
    }

    // Get athlete profile
    const athleteResponse = await fetch('https://www.strava.com/api/v3/athlete', {
      headers: {
        'Authorization': `Bearer ${integration.accessToken}`,
      },
    });

    const athlete = await athleteResponse.json();

    // Get athlete stats (YTD totals)
    const statsResponse = await fetch(`https://www.strava.com/api/v3/athletes/${athlete.id}/stats`, {
      headers: {
        'Authorization': `Bearer ${integration.accessToken}`,
      },
    });

    const stats = await statsResponse.json();

    // Get recent activities (last 30 days)
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
    const activitiesResponse = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?after=${thirtyDaysAgo}&per_page=50`,
      {
        headers: {
          'Authorization': `Bearer ${integration.accessToken}`,
        },
      }
    );

    const recentActivities = await activitiesResponse.json();

    // Calculate activity breakdowns
    const activityBreakdown: { [key: string]: { count: number; distance: number; time: number } } = {};

    for (const activity of recentActivities) {
      const type = activity.type.toLowerCase();
      let category = 'other';

      if (type.includes('run')) category = 'running';
      else if (type.includes('ride') || type.includes('cycle')) category = 'cycling';
      else if (type.includes('swim')) category = 'swimming';
      else if (type.includes('walk')) category = 'walking';

      if (!activityBreakdown[category]) {
        activityBreakdown[category] = { count: 0, distance: 0, time: 0 };
      }

      activityBreakdown[category].count++;
      activityBreakdown[category].distance += activity.distance / 1609.34; // Convert to miles
      activityBreakdown[category].time += activity.moving_time / 60; // Convert to minutes
    }

    // Generate personalized goal suggestions based on stats
    const goalSuggestions = [];

    // Running suggestions
    if (stats.ytd_run_totals?.count > 0) {
      const avgWeeklyMiles = (stats.recent_run_totals?.distance || 0) / 1609.34 / 4; // Last 4 weeks average
      const suggestedWeekly = Math.ceil(avgWeeklyMiles * 1.1); // 10% increase

      goalSuggestions.push({
        category: 'running',
        activityType: 'Run',
        icon: '🏃',
        title: 'Weekly Running Goal',
        suggestions: [
          {
            title: `Run ${suggestedWeekly} miles this week`,
            targetValue: suggestedWeekly,
            unit: 'miles',
            frequency: 'weekly',
            difficulty: 'medium',
            description: `Based on your recent average of ${avgWeeklyMiles.toFixed(1)} miles/week`,
          },
          {
            title: `Complete 3 runs this week`,
            targetValue: 3,
            unit: 'workouts',
            frequency: 'weekly',
            difficulty: 'easy',
            description: 'Consistency goal - run at least 3 times',
          },
          {
            title: `Run 50 miles this month`,
            targetValue: 50,
            unit: 'miles',
            frequency: 'monthly',
            difficulty: 'hard',
            description: 'Challenge yourself with a monthly distance goal',
          },
        ],
        recentStats: {
          last30Days: {
            count: activityBreakdown.running?.count || 0,
            distance: (activityBreakdown.running?.distance || 0).toFixed(1),
            time: (activityBreakdown.running?.time || 0).toFixed(0),
          },
          ytd: {
            count: stats.ytd_run_totals?.count || 0,
            distance: ((stats.ytd_run_totals?.distance || 0) / 1609.34).toFixed(1),
            elevation: ((stats.ytd_run_totals?.elevation_gain || 0) * 3.28084).toFixed(0), // meters to feet
          },
        },
      });
    }

    // Cycling suggestions
    if (stats.ytd_ride_totals?.count > 0) {
      const avgWeeklyMiles = (stats.recent_ride_totals?.distance || 0) / 1609.34 / 4;
      const suggestedWeekly = Math.ceil(avgWeeklyMiles * 1.1);

      goalSuggestions.push({
        category: 'cycling',
        activityType: 'Ride',
        icon: '🚴',
        title: 'Weekly Cycling Goal',
        suggestions: [
          {
            title: `Ride ${suggestedWeekly} miles this week`,
            targetValue: suggestedWeekly,
            unit: 'miles',
            frequency: 'weekly',
            difficulty: 'medium',
            description: `Based on your recent average of ${avgWeeklyMiles.toFixed(1)} miles/week`,
          },
          {
            title: `Complete 2 rides this week`,
            targetValue: 2,
            unit: 'workouts',
            frequency: 'weekly',
            difficulty: 'easy',
            description: 'Get out on the bike twice this week',
          },
          {
            title: `Ride 100 miles this month`,
            targetValue: 100,
            unit: 'miles',
            frequency: 'monthly',
            difficulty: 'hard',
            description: 'Century challenge - ride 100 miles in a month',
          },
        ],
        recentStats: {
          last30Days: {
            count: activityBreakdown.cycling?.count || 0,
            distance: (activityBreakdown.cycling?.distance || 0).toFixed(1),
            time: (activityBreakdown.cycling?.time || 0).toFixed(0),
          },
          ytd: {
            count: stats.ytd_ride_totals?.count || 0,
            distance: ((stats.ytd_ride_totals?.distance || 0) / 1609.34).toFixed(1),
            elevation: ((stats.ytd_ride_totals?.elevation_gain || 0) * 3.28084).toFixed(0),
          },
        },
      });
    }

    // Swimming suggestions
    if (stats.ytd_swim_totals?.count > 0) {
      goalSuggestions.push({
        category: 'swimming',
        activityType: 'Swim',
        icon: '🏊',
        title: 'Weekly Swimming Goal',
        suggestions: [
          {
            title: `Swim 2 times this week`,
            targetValue: 2,
            unit: 'workouts',
            frequency: 'weekly',
            difficulty: 'easy',
            description: 'Hit the pool twice this week',
          },
          {
            title: `Swim 5000 meters this month`,
            targetValue: 5000,
            unit: 'meters',
            frequency: 'monthly',
            difficulty: 'medium',
            description: 'Monthly distance goal in the water',
          },
        ],
        recentStats: {
          last30Days: {
            count: activityBreakdown.swimming?.count || 0,
            distance: (activityBreakdown.swimming?.distance || 0).toFixed(1),
            time: (activityBreakdown.swimming?.time || 0).toFixed(0),
          },
          ytd: {
            count: stats.ytd_swim_totals?.count || 0,
            distance: ((stats.ytd_swim_totals?.distance || 0) / 1000).toFixed(1), // meters to km
          },
        },
      });
    }

    // If no specific activity types, suggest general fitness goals
    if (goalSuggestions.length === 0) {
      goalSuggestions.push({
        category: 'fitness',
        activityType: 'Any',
        icon: '💪',
        title: 'Get Started with Fitness',
        suggestions: [
          {
            title: 'Complete 3 workouts this week',
            targetValue: 3,
            unit: 'workouts',
            frequency: 'weekly',
            difficulty: 'easy',
            description: 'Build a consistent exercise habit',
          },
          {
            title: 'Move for 150 minutes this week',
            targetValue: 150,
            unit: 'minutes',
            frequency: 'weekly',
            difficulty: 'medium',
            description: 'Meet the WHO recommendation for weekly activity',
          },
        ],
        recentStats: {
          last30Days: {
            count: recentActivities.length,
            distance: '0',
            time: '0',
          },
        },
      });
    }

    res.json({
      athlete: {
        id: athlete.id,
        name: `${athlete.firstname} ${athlete.lastname}`,
        profilePicture: athlete.profile,
      },
      stats: {
        ytd: {
          run: stats.ytd_run_totals,
          ride: stats.ytd_ride_totals,
          swim: stats.ytd_swim_totals,
        },
        recent: {
          run: stats.recent_run_totals,
          ride: stats.recent_ride_totals,
          swim: stats.recent_swim_totals,
        },
      },
      activityBreakdown,
      goalSuggestions,
    });

  } catch (error) {
    console.error('Error fetching athlete stats:', error);
    res.status(500).json({ error: 'Failed to fetch athlete stats' });
  }
});

export default router;
