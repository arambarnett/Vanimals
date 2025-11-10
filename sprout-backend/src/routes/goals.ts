// Goal management routes
import express, { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { GoalTrackingService } from '../services/goalTrackingService';
import { AptosService } from '../services/aptosService';

const router = express.Router();
// Using singleton prisma instance from ../lib/prisma
const goalTrackingService = new GoalTrackingService();
const aptosService = new AptosService();

/**
 * Create a new goal
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      userId,
      title,
      description,
      type,
      category,
      subcategory,
      targetValue,
      unit,
      frequency,
      startDate,
      endDate,
      experienceReward,
      foodReward,
      integrationId,
    } = req.body;

    console.log('📝 Creating goal:', {
      userId,
      title,
      category,
      subcategory,
      targetValue,
      unit,
      frequency,
    });

    // Validate required fields
    if (!userId || !title || !type || !targetValue || !unit || !frequency) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const goalCategory = category || type;

    // Check if user has a Sprout for this category, create if not
    let sprout = await prisma.sprout.findFirst({
      where: {
        userId,
        category: goalCategory,
      },
    });

    // If no Sprout exists for this category, mint a new one
    if (!sprout) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (user && user.walletAddress) {
          // Randomly select one of the 6 available species
          const availableSpecies = ['bear', 'deer', 'fox', 'owl', 'penguin', 'rabbit'];
          const randomSpecies = availableSpecies[Math.floor(Math.random() * availableSpecies.length)];

          // Capitalize first letter for display
          const speciesName = randomSpecies.charAt(0).toUpperCase() + randomSpecies.slice(1);
          const sproutName = `${user.name}'s ${goalCategory} ${speciesName}`;

          // Mint the Sprout NFT on Aptos blockchain
          const txHash = await aptosService.mintSproutNFT(user.walletAddress, {
            name: sproutName,
            species: randomSpecies,
            rarity: 'Rare',
            uri: `https://sprouts.app/nft/${userId}/${goalCategory}`,
          });

          // Generate unique NFT address
          const uniqueNftAddress = `${user.walletAddress.slice(0, 20)}::${txHash.slice(0, 20)}`;

          // Create Sprout record in database
          sprout = await prisma.sprout.create({
            data: {
              userId,
              nftAddress: uniqueNftAddress,
              tokenId: txHash,
              mintTransactionHash: txHash,
              name: sproutName,
              species: randomSpecies,
              rarity: 'Rare',
              category: goalCategory,
              grade: 'Normal',
              level: 1,
              experience: 0,
              restScore: 100,
              waterScore: 100,
              foodScore: 100,
              mood: 'happy',
              healthPoints: 100,
              growthStage: 'Sprout',
              sizeMultiplier: 1.0,
              isWithering: false,
              isDead: false,
            },
          });

          console.log(`✅ Minted ${goalCategory} Sprout for user ${userId}: ${txHash}`);
        }
      } catch (mintError) {
        console.error('Error minting Sprout NFT:', mintError);
        throw new Error('Failed to mint Sprout NFT');
      }
    }

    // Get integration ID for fitness goals with Strava
    let finalIntegrationId = integrationId;
    if (goalCategory === 'fitness' && !integrationId) {
      const stravaIntegration = await prisma.integration.findUnique({
        where: {
          userId_provider: {
            userId,
            provider: 'strava',
          },
        },
      });
      if (stravaIntegration && stravaIntegration.isActive) {
        finalIntegrationId = stravaIntegration.id;
        console.log(`✅ Auto-linked fitness goal to Strava integration: ${finalIntegrationId}`);
      }
    }

    // Calculate food reward based on difficulty
    const defaultFoodReward = frequency === 'daily' ? 5 : frequency === 'weekly' ? 15 : 30;

    // Now create the goal linked to the Sprout
    const goal = await prisma.goal.create({
      data: {
        userId,
        sproutId: sprout.id,
        title,
        description,
        category: goalCategory,
        subcategory: subcategory || (finalIntegrationId ? 'auto' : 'manual'),
        targetValue: parseFloat(targetValue),
        currentValue: 0,
        unit,
        frequency,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        experienceReward: experienceReward || 100,
        foodReward: foodReward || defaultFoodReward,
        integrationId: finalIntegrationId,
        isActive: true,
        isCompleted: false,
      },
    });

    console.log(`✅ Goal created: ${goal.id} (${goal.title})`);

    res.status(201).json({ goal, sprout });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

/**
 * Get user's goals
 */
router.get('/user/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { type, isActive, isCompleted } = req.query;

    const goals = await prisma.goal.findMany({
      where: {
        userId,
        ...(type && { category: type as string }),
        ...(isActive !== undefined && { isActive: isActive === 'true' }),
        ...(isCompleted !== undefined && { isCompleted: isCompleted === 'true' }),
      },
      include: {
        integration: true,
        activities: {
          orderBy: { activityDate: 'desc' },
          take: 5,
        },
      },
      orderBy: [
        { isCompleted: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

/**
 * Get goal by ID with progress details
 */
router.get('/:goalId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { goalId } = req.params;

    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: {
        integration: true,
        activities: {
          orderBy: { activityDate: 'desc' },
        },
        user: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
      },
    });

    if (!goal) {
      res.status(404).json({ error: 'Goal not found' });
      return;
    }

    // Calculate progress
    const progress = await goalTrackingService.calculateGoalProgress(goalId);

    res.json({
      ...goal,
      progress,
    });
  } catch (error) {
    console.error('Error fetching goal:', error);
    res.status(500).json({ error: 'Failed to fetch goal' });
  }
});

/**
 * Update a goal
 */
router.put('/:goalId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { goalId } = req.params;
    const {
      title,
      description,
      targetValue,
      currentValue,
      isActive,
      endDate,
    } = req.body;

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(targetValue !== undefined && { targetValue: parseFloat(targetValue) }),
        ...(currentValue !== undefined && { currentValue: parseFloat(currentValue) }),
        ...(isActive !== undefined && { isActive }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
      },
    });

    res.json(goal);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

/**
 * Delete a goal
 */
router.delete('/:goalId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { goalId } = req.params;

    await prisma.goal.delete({
      where: { id: goalId },
    });

    res.json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

/**
 * Manually log progress toward a goal
 */
router.post('/:goalId/progress', async (req: Request, res: Response): Promise<void> => {
  try {
    const { goalId } = req.params;
    const { value, notes } = req.body;

    if (!value || value <= 0) {
      res.status(400).json({ error: 'Invalid progress value' });
      return;
    }

    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!goal) {
      res.status(404).json({ error: 'Goal not found' });
      return;
    }

    // Process the activity
    const result = await goalTrackingService.processActivity(goal.userId, {
      type: goal.type,
      category: goal.category,
      value: parseFloat(value),
      unit: goal.unit,
      metadata: { notes, manual: true },
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error logging progress:', error);
    res.status(500).json({ error: 'Failed to log progress' });
  }
});

/**
 * Get goal progress analytics
 */
router.get('/:goalId/analytics', async (req: Request, res: Response): Promise<void> => {
  try {
    const { goalId } = req.params;

    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: {
        activities: {
          orderBy: { activityDate: 'asc' },
        },
      },
    });

    if (!goal) {
      res.status(404).json({ error: 'Goal not found' });
      return;
    }

    const progress = await goalTrackingService.calculateGoalProgress(goalId);

    // Calculate daily progress trend
    const dailyProgress: { [date: string]: number } = {};
    for (const activity of goal.activities) {
      const date = activity.activityDate.toISOString().split('T')[0];
      dailyProgress[date] = (dailyProgress[date] || 0) + (activity.value || 0);
    }

    // Calculate weekly totals
    const weeklyProgress: number[] = [];
    const activityDates = Object.keys(dailyProgress).sort();
    let weekTotal = 0;
    let weekCount = 0;

    for (const date of activityDates) {
      weekTotal += dailyProgress[date];
      weekCount++;

      if (weekCount === 7) {
        weeklyProgress.push(weekTotal);
        weekTotal = 0;
        weekCount = 0;
      }
    }
    if (weekCount > 0) {
      weeklyProgress.push(weekTotal);
    }

    res.json({
      goal: {
        id: goal.id,
        title: goal.title,
        type: goal.type,
        currentValue: goal.currentValue,
        targetValue: goal.targetValue,
        unit: goal.unit,
      },
      progress,
      analytics: {
        dailyProgress,
        weeklyProgress,
        totalActivities: goal.activities.length,
        averagePerActivity: goal.activities.length > 0
          ? goal.currentValue / goal.activities.length
          : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching goal analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

/**
 * Get recommended goals based on user's integrations
 */
router.get('/user/:userId/recommendations', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const integrations = await prisma.integration.findMany({
      where: { userId, isActive: true },
    });

    const recommendations = [];

    // Strava recommendations
    if (integrations.some((i) => i.provider === 'strava')) {
      recommendations.push({
        title: 'Weekly Running Goal',
        type: 'fitness',
        category: 'running',
        targetValue: 15,
        unit: 'miles',
        frequency: 'weekly',
        description: 'Run 15 miles this week',
        experienceReward: 150,
        pointsReward: 75,
      });
      recommendations.push({
        title: 'Monthly Cycling Challenge',
        type: 'fitness',
        category: 'cycling',
        targetValue: 100,
        unit: 'miles',
        frequency: 'monthly',
        description: 'Cycle 100 miles this month',
        experienceReward: 500,
        pointsReward: 250,
      });
    }

    // Plaid recommendations
    if (integrations.some((i) => i.provider === 'plaid')) {
      recommendations.push({
        title: 'Monthly Savings Goal',
        type: 'financial',
        category: 'savings',
        targetValue: 500,
        unit: 'USD',
        frequency: 'monthly',
        description: 'Save $500 this month',
        experienceReward: 300,
        pointsReward: 150,
      });
      recommendations.push({
        title: 'Reduce Spending',
        type: 'financial',
        category: 'spending',
        targetValue: 100,
        unit: 'USD',
        frequency: 'weekly',
        description: 'Spend less than $100 on dining out',
        experienceReward: 100,
        pointsReward: 50,
      });
    }

    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

export default router;
