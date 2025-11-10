import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get user's waitlist status
router.get('/status/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const waitlistEntry = await prisma.hatchWaitlist.findFirst({
      where: { userId },
    });

    if (!waitlistEntry) {
      return res.status(404).json({
        success: false,
        message: 'User not on waitlist',
      });
    }

    res.json({
      success: true,
      data: {
        joinedAt: waitlistEntry.joinedAt,
        stravaConnected: waitlistEntry.stravaConnected,
        hasPrism: waitlistEntry.hasPrism,
        hasPremium: waitlistEntry.hasPremium,
        eggsGranted: waitlistEntry.eggsGranted,
        feedGranted: waitlistEntry.feedGranted,
        referralCode: waitlistEntry.referralCode,
        referralCount: waitlistEntry.referralCount,
      },
    });
  } catch (error) {
    console.error('Error fetching waitlist status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch waitlist status',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Update Strava connection status (grants feed)
router.post('/connect-strava/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const STRAVA_FEED_REWARD = 100; // Amount of feed granted for connecting Strava

    const waitlistEntry = await prisma.hatchWaitlist.findFirst({
      where: { userId },
    });

    if (!waitlistEntry) {
      return res.status(404).json({
        success: false,
        message: 'User not on waitlist',
      });
    }

    // Check if already connected
    if (waitlistEntry.stravaConnected) {
      return res.json({
        success: true,
        message: 'Strava already connected',
        data: {
          feedGranted: waitlistEntry.feedGranted,
        },
      });
    }

    // Update waitlist entry with Strava connection
    const updated = await prisma.hatchWaitlist.update({
      where: { id: waitlistEntry.id },
      data: {
        stravaConnected: true,
        stravaConnectedAt: new Date(),
        feedGranted: waitlistEntry.feedGranted + STRAVA_FEED_REWARD,
      },
    });

    res.json({
      success: true,
      message: `Strava connected! You earned ${STRAVA_FEED_REWARD} feed.`,
      data: {
        feedGranted: updated.feedGranted,
        reward: STRAVA_FEED_REWARD,
      },
    });
  } catch (error) {
    console.error('Error connecting Strava:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update Strava connection',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Update prism purchase status (grants feed)
router.post('/purchase-prism/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { transactionId } = req.body;
    const PRISM_FEED_REWARD = 200; // Amount of feed granted for purchasing prism

    const waitlistEntry = await prisma.hatchWaitlist.findFirst({
      where: { userId },
    });

    if (!waitlistEntry) {
      return res.status(404).json({
        success: false,
        message: 'User not on waitlist',
      });
    }

    // Check if already purchased
    if (waitlistEntry.hasPrism) {
      return res.json({
        success: true,
        message: 'Prism already purchased',
        data: {
          feedGranted: waitlistEntry.feedGranted,
        },
      });
    }

    // Update waitlist entry with prism purchase
    const updated = await prisma.hatchWaitlist.update({
      where: { id: waitlistEntry.id },
      data: {
        hasPrism: true,
        feedGranted: waitlistEntry.feedGranted + PRISM_FEED_REWARD,
      },
    });

    res.json({
      success: true,
      message: `Prism purchased! You earned ${PRISM_FEED_REWARD} feed.`,
      data: {
        feedGranted: updated.feedGranted,
        reward: PRISM_FEED_REWARD,
        transactionId,
      },
    });
  } catch (error) {
    console.error('Error purchasing prism:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update prism purchase',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Update premium purchase status (grants feed)
router.post('/purchase-premium/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { transactionId } = req.body;
    const PREMIUM_FEED_REWARD = 150; // Amount of feed granted for premium

    const waitlistEntry = await prisma.hatchWaitlist.findFirst({
      where: { userId },
    });

    if (!waitlistEntry) {
      return res.status(404).json({
        success: false,
        message: 'User not on waitlist',
      });
    }

    // Check if already has premium
    if (waitlistEntry.hasPremium) {
      return res.json({
        success: true,
        message: 'Premium already active',
        data: {
          feedGranted: waitlistEntry.feedGranted,
        },
      });
    }

    // Update waitlist entry with premium purchase
    const updated = await prisma.hatchWaitlist.update({
      where: { id: waitlistEntry.id },
      data: {
        hasPremium: true,
        feedGranted: waitlistEntry.feedGranted + PREMIUM_FEED_REWARD,
      },
    });

    res.json({
      success: true,
      message: `Premium activated! You earned ${PREMIUM_FEED_REWARD} feed.`,
      data: {
        feedGranted: updated.feedGranted,
        reward: PREMIUM_FEED_REWARD,
        transactionId,
      },
    });
  } catch (error) {
    console.error('Error purchasing premium:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update premium purchase',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get waitlist leaderboard (by referral count)
router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;

    const leaderboard = await prisma.hatchWaitlist.findMany({
      orderBy: {
        referralCount: 'desc',
      },
      take: limit,
      select: {
        referralCode: true,
        referralCount: true,
        joinedAt: true,
      },
    });

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Validate referral code
router.get('/referral/:code', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const referrer = await prisma.hatchWaitlist.findFirst({
      where: { referralCode: code },
    });

    if (!referrer) {
      return res.status(404).json({
        success: false,
        message: 'Invalid referral code',
      });
    }

    res.json({
      success: true,
      valid: true,
      message: 'Valid referral code',
    });
  } catch (error) {
    console.error('Error validating referral code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate referral code',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
