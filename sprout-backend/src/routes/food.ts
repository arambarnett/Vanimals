// Food management routes
import express, { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AptosPaymentService } from '../services/aptosPaymentService';

const router = express.Router();
// Using singleton prisma instance from ../lib/prisma
const paymentService = new AptosPaymentService();

/**
 * Get user's food balance
 */
router.get('/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    let foodInventory = await prisma.food.findUnique({
      where: { userId },
    });

    // Create food inventory if it doesn't exist
    if (!foodInventory) {
      foodInventory = await prisma.food.create({
        data: {
          userId,
          amount: 0,
        },
      });
    }

    res.json({
      userId,
      foodBalance: foodInventory.amount,
      updatedAt: foodInventory.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching food balance:', error);
    res.status(500).json({ error: 'Failed to fetch food balance' });
  }
});

/**
 * Get food transaction history
 */
router.get('/:userId/transactions', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const transactions = await prisma.foodTransaction.findMany({
      where: { userId },
      include: {
        sprout: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        goal: {
          select: {
            id: true,
            title: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset),
    });

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching food transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

/**
 * Feed a Sprout - Allocate food to specific stat
 */
router.post('/feed', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, sproutId, statType, amount } = req.body;

    // Validate inputs
    if (!userId || !sproutId || !statType || !amount) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (!['rest', 'water', 'food'].includes(statType)) {
      res.status(400).json({ error: 'Invalid stat type. Must be rest, water, or food' });
      return;
    }

    if (amount <= 0) {
      res.status(400).json({ error: 'Amount must be positive' });
      return;
    }

    // Check if user has enough food
    const foodInventory = await prisma.food.findUnique({
      where: { userId },
    });

    if (!foodInventory || foodInventory.amount < amount) {
      res.status(400).json({
        error: 'Not enough food',
        currentBalance: foodInventory?.amount || 0,
        required: amount,
      });
      return;
    }

    // Get current sprout
    const sprout = await prisma.sprout.findUnique({
      where: { id: sproutId },
    });

    if (!sprout) {
      res.status(404).json({ error: 'Sprout not found' });
      return;
    }

    if (sprout.userId !== userId) {
      res.status(403).json({ error: 'This sprout does not belong to you' });
      return;
    }

    if (sprout.isDead) {
      res.status(400).json({ error: 'Cannot feed a dead Sprout' });
      return;
    }

    // Calculate stat increase (each food = 1 point, max 100)
    const statField = `${statType}Score`;
    const currentValue = sprout[statField as keyof typeof sprout] as number;
    const newValue = Math.min(100, currentValue + amount);
    const actualIncrease = newValue - currentValue;

    // Calculate new mood based on all stats
    const restValue = statType === 'rest' ? newValue : sprout.restScore;
    const waterValue = statType === 'water' ? newValue : sprout.waterScore;
    const foodValue = statType === 'food' ? newValue : sprout.foodScore;

    const avgNeeds = (restValue + waterValue + foodValue) / 3;
    let mood = 'happy';
    if (avgNeeds < 20) mood = 'distressed';
    else if (avgNeeds < 40) mood = 'sad';
    else if (avgNeeds < 60) mood = 'neutral';
    else if (avgNeeds < 80) mood = 'content';
    else mood = 'happy';

    // Update sprout stats and mood
    const updatedSprout = await prisma.sprout.update({
      where: { id: sproutId },
      data: {
        [statField]: newValue,
        mood,
        healthPoints: Math.floor(avgNeeds),
        isWithering: avgNeeds < 30,
        lastInteraction: new Date(),
      },
    });

    // Deduct food from inventory
    await prisma.food.update({
      where: { userId },
      data: {
        amount: { decrement: actualIncrease },
      },
    });

    // Record transaction
    await prisma.foodTransaction.create({
      data: {
        userId,
        sproutId,
        amount: -actualIncrease, // Negative because spent
        statType,
        source: 'allocation',
      },
    });

    console.log(`✅ User ${userId} fed ${actualIncrease} food to ${statType} stat of Sprout ${sproutId}`);

    res.json({
      success: true,
      message: `Fed ${actualIncrease} food to ${statType}!`,
      sprout: {
        id: updatedSprout.id,
        name: updatedSprout.name,
        restScore: updatedSprout.restScore,
        waterScore: updatedSprout.waterScore,
        foodScore: updatedSprout.foodScore,
        mood: updatedSprout.mood,
        healthPoints: updatedSprout.healthPoints,
      },
      foodBalance: foodInventory.amount - actualIncrease,
    });
  } catch (error) {
    console.error('Error feeding sprout:', error);
    res.status(500).json({ error: 'Failed to feed sprout' });
  }
});

/**
 * Award food to user (called internally when goals complete)
 */
router.post('/award', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, amount, source, goalId } = req.body;

    if (!userId || !amount || !source) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (amount <= 0) {
      res.status(400).json({ error: 'Amount must be positive' });
      return;
    }

    // Get or create food inventory
    let foodInventory = await prisma.food.findUnique({
      where: { userId },
    });

    if (!foodInventory) {
      foodInventory = await prisma.food.create({
        data: {
          userId,
          amount: 0,
        },
      });
    }

    // Add food to inventory
    const updatedInventory = await prisma.food.update({
      where: { userId },
      data: {
        amount: { increment: amount },
      },
    });

    // Record transaction
    await prisma.foodTransaction.create({
      data: {
        userId,
        goalId,
        amount, // Positive because earned
        source,
      },
    });

    console.log(`✅ Awarded ${amount} food to user ${userId} from ${source}`);

    res.json({
      success: true,
      message: `Earned ${amount} food!`,
      newBalance: updatedInventory.amount,
    });
  } catch (error) {
    console.error('Error awarding food:', error);
    res.status(500).json({ error: 'Failed to award food' });
  }
});

/**
 * Purchase food with points
 * Packages:
 * - Small: 50 food for 100 points
 * - Medium: 150 food for 250 points
 * - Large: 500 food for 750 points
 */
router.post('/purchase', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, foodAmount, pointsCost } = req.body;

    // Validate inputs
    if (!userId || !foodAmount || !pointsCost) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (foodAmount <= 0 || pointsCost <= 0) {
      res.status(400).json({ error: 'Amounts must be positive' });
      return;
    }

    // Validate package options
    const validPackages = [
      { food: 50, points: 100 },
      { food: 150, points: 250 },
      { food: 500, points: 750 },
    ];

    const isValidPackage = validPackages.some(
      (pkg) => pkg.food === foodAmount && pkg.points === pointsCost
    );

    if (!isValidPackage) {
      res.status(400).json({ error: 'Invalid package selection' });
      return;
    }

    // Check if user has enough points
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.totalPoints < pointsCost) {
      res.status(400).json({
        error: 'Not enough points',
        currentPoints: user.totalPoints,
        required: pointsCost,
      });
      return;
    }

    // Get or create food inventory
    let foodInventory = await prisma.food.findUnique({
      where: { userId },
    });

    if (!foodInventory) {
      foodInventory = await prisma.food.create({
        data: {
          userId,
          amount: 0,
        },
      });
    }

    // Deduct points from user
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalPoints: { decrement: pointsCost },
      },
    });

    // Add food to inventory
    const updatedInventory = await prisma.food.update({
      where: { userId },
      data: {
        amount: { increment: foodAmount },
      },
    });

    // Record transaction
    await prisma.foodTransaction.create({
      data: {
        userId,
        amount: foodAmount, // Positive because received
        source: 'purchase',
      },
    });

    console.log(`✅ User ${userId} purchased ${foodAmount} food for ${pointsCost} points`);

    res.json({
      success: true,
      message: `Purchased ${foodAmount} food for ${pointsCost} points!`,
      newFoodBalance: updatedInventory.amount,
      newPointsBalance: user.totalPoints - pointsCost,
    });
  } catch (error) {
    console.error('Error purchasing food:', error);
    res.status(500).json({ error: 'Failed to purchase food' });
  }
});

/**
 * Purchase food with APT tokens
 * Packages:
 * - Small: 50 food for 0.1 APT (~$0.80)
 * - Medium: 150 food for 0.25 APT (~$2.00)
 * - Large: 500 food for 0.75 APT (~$6.00)
 */
router.post('/purchase-with-apt', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, packageType, txHash } = req.body;

    console.log('💰 APT purchase request:', {
      userId,
      packageType,
      txHash,
    });

    // Validate inputs
    if (!userId || !packageType || !txHash) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Define food packages with APT pricing
    const packages: { [key: string]: { food: number; apt: number } } = {
      small: { food: 50, apt: 0.1 },
      medium: { food: 150, apt: 0.25 },
      large: { food: 500, apt: 0.75 },
    };

    const pkg = packages[packageType.toLowerCase()];
    if (!pkg) {
      res.status(400).json({
        error: 'Invalid package type. Must be small, medium, or large',
      });
      return;
    }

    // Check if transaction already used (prevent replay attacks)
    const isUsed = await paymentService.isTransactionUsed(txHash, prisma);
    if (isUsed) {
      res.status(400).json({
        error: 'Transaction already used',
      });
      return;
    }

    // Get user to verify wallet address
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Verify APT payment on-chain
    const verification = await paymentService.verifyPayment(
      txHash,
      pkg.apt,
      user.walletAddress
    );

    if (!verification.isValid) {
      console.error('❌ Payment verification failed:', verification.error);
      res.status(400).json({
        error: 'Payment verification failed',
        details: verification.error,
      });
      return;
    }

    // Get or create food inventory
    let foodInventory = await prisma.food.findUnique({
      where: { userId },
    });

    if (!foodInventory) {
      foodInventory = await prisma.food.create({
        data: {
          userId,
          amount: 0,
        },
      });
    }

    // Add food to inventory
    const updatedInventory = await prisma.food.update({
      where: { userId },
      data: {
        amount: { increment: pkg.food },
      },
    });

    // Record transaction with APT details
    await prisma.foodTransaction.create({
      data: {
        userId,
        amount: pkg.food, // Positive because received
        source: 'apt_purchase',
        txHash,
        aptAmount: pkg.apt,
      },
    });

    console.log(`✅ User ${userId} purchased ${pkg.food} food for ${pkg.apt} APT (tx: ${txHash})`);

    res.json({
      success: true,
      message: `Purchased ${pkg.food} food for ${pkg.apt} APT!`,
      foodReceived: pkg.food,
      aptPaid: pkg.apt,
      newFoodBalance: updatedInventory.amount,
      txHash,
      txDetails: verification.txDetails,
    });
  } catch (error) {
    console.error('Error processing APT purchase:', error);
    res.status(500).json({ error: 'Failed to process APT purchase' });
  }
});

/**
 * Get APT food packages
 */
router.get('/apt-packages', async (req: Request, res: Response): Promise<void> => {
  try {
    const packages = [
      {
        id: 'small',
        name: 'Small Food Pack',
        food: 50,
        aptCost: 0.1,
        usdEstimate: 0.80,
        description: 'Perfect for a quick boost',
      },
      {
        id: 'medium',
        name: 'Medium Food Pack',
        food: 150,
        aptCost: 0.25,
        usdEstimate: 2.00,
        description: 'Best value for regular trainers',
        popular: true,
      },
      {
        id: 'large',
        name: 'Large Food Pack',
        food: 500,
        aptCost: 0.75,
        usdEstimate: 6.00,
        description: 'For serious Sprout collectors',
      },
    ];

    res.json(packages);
  } catch (error) {
    console.error('Error fetching APT packages:', error);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

export default router;
