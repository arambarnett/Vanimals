// Wallet-based authentication routes (replaces Privy)
import express, { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AptosService } from '../services/aptosService';

const router = express.Router();
const aptosService = new AptosService();

/**
 * Register or login with Aptos wallet
 * Creates user on first login and mints first Sprout NFT
 */
router.post('/connect-wallet', async (req: Request, res: Response): Promise<void> => {
  try {
    const { walletAddress, socialProvider, socialProviderId, name, email } = req.body;

    console.log('🔍 Connect wallet request:', {
      walletAddress,
      socialProvider,
      socialProviderId,
      name,
      email,
    });

    // Validate wallet address
    if (!aptosService.isValidAddress(walletAddress)) {
      res.status(400).json({ error: 'Invalid wallet address' });
      return;
    }

    // IMPORTANT: First check if user exists by socialProviderId (Google/Apple ID)
    // This ensures the same social account always gets the same user record
    let user = null;
    if (socialProviderId) {
      user = await prisma.user.findUnique({
        where: { socialProviderId },
        include: {
          sprouts: true,
          goals: true,
        },
      });

      if (user) {
        console.log(`✅ Found existing user by socialProviderId: ${user.id}`);

        // Update wallet address if it changed (Web3Auth might generate new addresses)
        if (user.walletAddress !== walletAddress) {
          console.log(`🔄 Updating wallet address from ${user.walletAddress} to ${walletAddress}`);
          user = await prisma.user.update({
            where: { id: user.id },
            data: { walletAddress, lastActiveAt: new Date() },
            include: {
              sprouts: true,
              goals: true,
            },
          });
        }
      }
    }

    // If not found by socialProviderId, check by wallet address (legacy)
    if (!user) {
      user = await prisma.user.findUnique({
        where: { walletAddress },
        include: {
          sprouts: true,
          goals: true,
        },
      });

      if (user) {
        console.log(`✅ Found existing user by walletAddress: ${user.id}`);
      }
    }

    let isNewUser = false;

    // Check if we're in waitlist period (before Hatch Day)
    const hatchDay = new Date('2026-02-01T17:00:00-08:00'); // Feb 1st, 2026, 5PM PST
    const isWaitlistPeriod = new Date() < hatchDay;

    if (!user) {
      isNewUser = true;
      console.log('🆕 Creating new user...');

      // Create new user
      user = await prisma.user.create({
        data: {
          walletAddress,
          socialProvider,
          socialProviderId,
          name: name || 'Sprout Trainer',
          email,
          experience: 0,
          level: 1,
          totalPoints: 0,
          streak: 0,
        },
        include: {
          sprouts: true,
          goals: true,
        },
      });

      // Create food inventory for new user
      await prisma.food.create({
        data: {
          userId: user.id,
          amount: isWaitlistPeriod ? 0 : 100, // No food during waitlist, 100 after launch
        },
      });

      // Create waitlist entry during waitlist period
      if (isWaitlistPeriod) {
        console.log('🎫 Creating waitlist entry...');
        try {
          // Generate referral code
          const generateReferralCode = () => {
            return Math.random().toString(36).substring(2, 10).toUpperCase();
          };

          await prisma.hatchWaitlist.create({
            data: {
              userId: user.id,
              referralCode: generateReferralCode(),
              eggsGranted: 1,
              feedGranted: 0,
            },
          });
          console.log('✅ Waitlist entry created');
        } catch (waitlistError) {
          console.error('⚠️ Failed to create waitlist entry:', waitlistError);
          // Continue anyway - waitlist is optional
        }
      }

      // Skip Sprout creation during waitlist period - eggs hatch on Hatch Day!
      if (!isWaitlistPeriod) {
        // Mint starter Sprout NFT in "Egg" state
        try {
          // Randomly select one of the 6 available species
          const availableSpecies = ['bear', 'deer', 'fox', 'owl', 'penguin', 'rabbit'];
          const randomSpecies = availableSpecies[Math.floor(Math.random() * availableSpecies.length)];

        const sproutName = `${name || 'Trainer'}'s Starter Sprout`;

        // Create Sprout record in database FIRST to get ID for metadata URI
        const tempSprout = await prisma.sprout.create({
          data: {
            userId: user.id,
            category: 'starter',
            nftAddress: 'pending', // Will update after minting
            tokenId: 'pending',
            mintTransactionHash: 'pending',
            name: sproutName,
            species: randomSpecies,
            rarity: 'Common',
            grade: 'Normal',
            level: 1,
            experience: 0,
            restScore: 100,
            waterScore: 100,
            foodScore: 100,
            mood: 'happy',
            healthPoints: 100,
            growthStage: 'Egg',
            sizeMultiplier: 1.0,
            isWithering: false,
            isDead: false,
          },
        });

        // Mint NFT with dynamic metadata URI pointing to our API
        const baseUrl = process.env.BASE_URL || 'https://68d80f1c6206.ngrok-free.app';
        const txHash = await aptosService.mintSproutNFT(walletAddress, {
          name: sproutName,
          species: randomSpecies,
          rarity: 'Common',
          uri: `${baseUrl}/api/nft/metadata/${tempSprout.id}`,
        });

        // Generate unique NFT address: userWallet + txHash prefix (ensures uniqueness)
        const uniqueNftAddress = `${walletAddress.slice(0, 20)}::${txHash.slice(0, 20)}`;

        // Update the Sprout record with actual NFT data
        await prisma.sprout.update({
          where: { id: tempSprout.id },
          data: {
            nftAddress: uniqueNftAddress,
            tokenId: txHash,
            mintTransactionHash: txHash,
          },
        });

        console.log(`✅ Minted starter Sprout egg for user ${user.id}: ${txHash}`);
      } catch (error) {
        console.error('❌ Error minting starter Sprout:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        // Continue even if minting fails - user is created
      }
      } // Close if (!isWaitlistPeriod)
    } else {
      // Update last active timestamp for existing users
      user = await prisma.user.update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() },
        include: {
          sprouts: true,
          goals: true,
        },
      });
      console.log(`🔄 Updated lastActiveAt for user ${user.id}`);
    }

    console.log(`✅ Responding with isNewUser: ${isNewUser}, sproutsCount: ${user.sprouts.length}`);

    res.json({
      success: true,
      isNewUser,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        name: user.name,
        email: user.email,
        level: user.level,
        experience: user.experience,
        totalPoints: user.totalPoints,
        streak: user.streak,
        sproutsCount: user.sprouts.length,
        activeGoalsCount: user.goals.filter((g) => g.isActive).length,
      },
    });
  } catch (error) {
    console.error('Error connecting wallet:', error);
    res.status(500).json({ error: 'Failed to connect wallet' });
  }
});

/**
 * Get user by wallet address
 */
router.get('/user/:walletAddress', async (req: Request, res: Response): Promise<void> => {
  try {
    const { walletAddress } = req.params;

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        sprouts: {
          orderBy: { level: 'desc' },
        },
        goals: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
        achievements: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * Get user by ID
 */
router.get('/user-by-id/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sprouts: {
          orderBy: { level: 'desc' },
        },
        goals: {
          where: { isActive: true },
        },
        activities: {
          orderBy: { activityDate: 'desc' },
          take: 20,
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Get on-chain activity stats
    const onChainStats = await aptosService.getUserActivityStats(user.walletAddress);

    res.json({
      ...user,
      onChainStats,
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * Update user profile
 */
router.put('/user/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { name, email, profileImage } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(profileImage && { profileImage }),
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * Get user stats and progress summary
 */
router.get('/user/:userId/summary', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const [user, activeGoals, completedGoals, totalActivities, topSprout] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
      }),
      prisma.goal.count({
        where: { userId, isActive: true, isCompleted: false },
      }),
      prisma.goal.count({
        where: { userId, isCompleted: true },
      }),
      prisma.activity.count({
        where: { userId },
      }),
      prisma.sprout.findFirst({
        where: { userId },
        orderBy: { level: 'desc' },
      }),
    ]);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        level: user.level,
        experience: user.experience,
        totalPoints: user.totalPoints,
        streak: user.streak,
      },
      stats: {
        activeGoals,
        completedGoals,
        totalActivities,
        topSproutLevel: topSprout?.level || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching user summary:', error);
    res.status(500).json({ error: 'Failed to fetch user summary' });
  }
});

/**
 * Hatch a Sprout egg - Updates growthStage from "Egg" to "Sprout"
 * Accepts optional name from user
 */
router.post('/hatch-egg/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { name } = req.body; // Optional custom name from user

    // Find the user's egg (Sprout with growthStage = "Egg")
    const egg = await prisma.sprout.findFirst({
      where: {
        userId,
        growthStage: 'Egg',
      },
    });

    if (!egg) {
      res.status(404).json({ error: 'No egg found to hatch' });
      return;
    }

    // Prepare update data
    const updateData: any = {
      growthStage: 'Sprout',
    };

    // If user provided a custom name, use it
    if (name && typeof name === 'string' && name.trim().length > 0) {
      updateData.name = name.trim();
    }

    // Update the Sprout from "Egg" to "Sprout"
    const hatchedSprout = await prisma.sprout.update({
      where: { id: egg.id },
      data: updateData,
    });

    // Award experience to user for hatching
    await prisma.user.update({
      where: { id: userId },
      data: {
        experience: { increment: 50 },
      },
    });

    console.log(`✅ User ${userId} hatched their egg! Sprout: ${hatchedSprout.name} (${hatchedSprout.species})`);

    res.json({
      success: true,
      message: 'Egg hatched successfully! 🎉',
      sprout: {
        id: hatchedSprout.id,
        name: hatchedSprout.name,
        species: hatchedSprout.species,
        rarity: hatchedSprout.rarity,
        growthStage: hatchedSprout.growthStage,
        restScore: hatchedSprout.restScore,
        waterScore: hatchedSprout.waterScore,
        foodScore: hatchedSprout.foodScore,
        mood: hatchedSprout.mood,
      },
    });
  } catch (error) {
    console.error('Error hatching egg:', error);
    res.status(500).json({ error: 'Failed to hatch egg' });
  }
});

/**
 * Connect external Aptos wallet (Petra, Pontem, Martian, etc.)
 * For users who already have an Aptos wallet
 */
router.post('/connect-external-wallet', async (req: Request, res: Response): Promise<void> => {
  try {
    const { walletAddress, walletType, signature, message } = req.body;

    console.log('🔍 Connect external wallet request:', {
      walletAddress,
      walletType,
    });

    // Validate wallet address
    if (!aptosService.isValidAddress(walletAddress)) {
      res.status(400).json({ error: 'Invalid wallet address' });
      return;
    }

    // Optional: Verify signature if provided
    // This proves the user owns the wallet
    if (signature && message) {
      const isValid = await aptosService.verifySignature(walletAddress, message, signature);
      if (!isValid) {
        res.status(401).json({ error: 'Invalid signature - wallet ownership verification failed' });
        return;
      }
      console.log('✅ Wallet ownership verified via signature');
    }

    // Check if user exists by wallet address
    let user = await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        sprouts: true,
        goals: true,
      },
    });

    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      console.log('🆕 Creating new user with external wallet...');

      // Create new user
      user = await prisma.user.create({
        data: {
          walletAddress,
          socialProvider: walletType || 'external_wallet',
          socialProviderId: walletAddress, // Use wallet address as provider ID
          name: 'Sprout Trainer',
          experience: 0,
          level: 1,
          totalPoints: 0,
          streak: 0,
        },
        include: {
          sprouts: true,
          goals: true,
        },
      });

      // Create food inventory for new user
      await prisma.food.create({
        data: {
          userId: user.id,
          amount: 100, // Starting food
        },
      });

      // Mint starter Sprout NFT in "Egg" state
      try {
        const availableSpecies = ['bear', 'deer', 'fox', 'owl', 'penguin', 'rabbit'];
        const randomSpecies = availableSpecies[Math.floor(Math.random() * availableSpecies.length)];
        const sproutName = `${user.name}'s Starter Sprout`;

        // Create Sprout record in database FIRST to get ID for metadata URI
        const tempSprout = await prisma.sprout.create({
          data: {
            userId: user.id,
            category: 'starter',
            nftAddress: 'pending', // Will update after minting
            tokenId: 'pending',
            mintTransactionHash: 'pending',
            name: sproutName,
            species: randomSpecies,
            rarity: 'Common',
            grade: 'Normal',
            level: 1,
            experience: 0,
            restScore: 100,
            waterScore: 100,
            foodScore: 100,
            mood: 'happy',
            healthPoints: 100,
            growthStage: 'Egg',
            sizeMultiplier: 1.0,
            isWithering: false,
            isDead: false,
          },
        });

        // Mint NFT with dynamic metadata URI pointing to our API
        const baseUrl = process.env.BASE_URL || 'https://68d80f1c6206.ngrok-free.app';
        const txHash = await aptosService.mintSproutNFT(walletAddress, {
          name: sproutName,
          species: randomSpecies,
          rarity: 'Common',
          uri: `${baseUrl}/api/nft/metadata/${tempSprout.id}`,
        });

        // Generate unique NFT address: userWallet + txHash prefix (ensures uniqueness)
        const uniqueNftAddress = `${walletAddress.slice(0, 20)}::${txHash.slice(0, 20)}`;

        // Update the Sprout record with actual NFT data
        await prisma.sprout.update({
          where: { id: tempSprout.id },
          data: {
            nftAddress: uniqueNftAddress,
            tokenId: txHash,
            mintTransactionHash: txHash,
          },
        });

        console.log(`✅ Minted starter Sprout egg for external wallet user ${user.id}: ${txHash}`);
      } catch (error) {
        console.error('❌ Error minting starter Sprout:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        // Continue even if minting fails - user is created
        // But this means no egg will be available to hatch!
      }
    } else {
      // Update last active timestamp for existing users
      user = await prisma.user.update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() },
        include: {
          sprouts: true,
          goals: true,
        },
      });
      console.log(`🔄 Updated lastActiveAt for external wallet user ${user.id}`);
    }

    console.log(`✅ External wallet connected - isNewUser: ${isNewUser}, sproutsCount: ${user.sprouts.length}`);

    res.json({
      success: true,
      isNewUser,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        name: user.name,
        email: user.email,
        level: user.level,
        experience: user.experience,
        totalPoints: user.totalPoints,
        streak: user.streak,
        sproutsCount: user.sprouts.length,
        activeGoalsCount: user.goals.filter((g) => g.isActive).length,
      },
    });
  } catch (error) {
    console.error('Error connecting external wallet:', error);
    res.status(500).json({ error: 'Failed to connect external wallet' });
  }
});

export default router;
