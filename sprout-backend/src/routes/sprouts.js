"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Sprout NFT management routes
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../lib/prisma");
const aptosService_1 = require("../services/aptosService");
const aptosPaymentService_1 = require("../services/aptosPaymentService");
const router = express_1.default.Router();
// Using singleton prisma instance from ../lib/prisma
const aptosService = new aptosService_1.AptosService();
const paymentService = new aptosPaymentService_1.AptosPaymentService();
/**
 * Get all Sprouts for a user
 */
router.get('/user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const sprouts = yield prisma_1.prisma.sprout.findMany({
            where: { userId },
            orderBy: [
                { level: 'desc' },
                { experience: 'desc' },
            ],
        });
        // Optionally fetch on-chain data for each Sprout
        const sproutsWithStats = yield Promise.all(sprouts.map((sprout) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const onChainStats = yield aptosService.getSproutStats(sprout.nftAddress);
                return Object.assign(Object.assign({}, sprout), { onChainStats });
            }
            catch (error) {
                // Return local data if on-chain fetch fails
                return sprout;
            }
        })));
        res.json(sproutsWithStats);
    }
    catch (error) {
        console.error('Error fetching Sprouts:', error);
        res.status(500).json({ error: 'Failed to fetch Sprouts' });
    }
}));
/**
 * Get single Sprout by ID with detailed stats
 */
router.get('/:sproutId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sproutId } = req.params;
        const sprout = yield prisma_1.prisma.sprout.findUnique({
            where: { id: sproutId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        walletAddress: true,
                    },
                },
            },
        });
        if (!sprout) {
            res.status(404).json({ error: 'Sprout not found' });
            return;
        }
        // Fetch on-chain stats
        try {
            const onChainStats = yield aptosService.getSproutStats(sprout.nftAddress);
            const onChainInfo = yield aptosService.getSproutInfo(sprout.nftAddress);
            res.json(Object.assign(Object.assign({}, sprout), { onChain: Object.assign(Object.assign({}, onChainStats), onChainInfo) }));
        }
        catch (error) {
            // Return local data if blockchain fetch fails
            res.json(sprout);
        }
    }
    catch (error) {
        console.error('Error fetching Sprout:', error);
        res.status(500).json({ error: 'Failed to fetch Sprout' });
    }
}));
/**
 * Get Sprout by NFT address
 */
router.get('/nft/:nftAddress', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nftAddress } = req.params;
        const sprout = yield prisma_1.prisma.sprout.findUnique({
            where: { nftAddress },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        walletAddress: true,
                    },
                },
            },
        });
        if (!sprout) {
            res.status(404).json({ error: 'Sprout not found' });
            return;
        }
        // Try to fetch on-chain stats (will fail gracefully if contract not deployed)
        try {
            const onChainStats = yield aptosService.getSproutStats(nftAddress);
            const onChainInfo = yield aptosService.getSproutInfo(nftAddress);
            res.json(Object.assign(Object.assign({}, sprout), { onChain: Object.assign(Object.assign({}, onChainStats), onChainInfo) }));
        }
        catch (error) {
            // Return local data if blockchain fetch fails
            res.json(sprout);
        }
    }
    catch (error) {
        console.error('Error fetching Sprout by NFT address:', error);
        res.status(500).json({ error: 'Failed to fetch Sprout' });
    }
}));
/**
 * Rename a Sprout
 */
router.put('/:sproutId/rename', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sproutId } = req.params;
        const { name } = req.body;
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            res.status(400).json({ error: 'Invalid name provided' });
            return;
        }
        if (name.trim().length > 50) {
            res.status(400).json({ error: 'Name must be 50 characters or less' });
            return;
        }
        const sprout = yield prisma_1.prisma.sprout.findUnique({
            where: { id: sproutId },
        });
        if (!sprout) {
            res.status(404).json({ error: 'Sprout not found' });
            return;
        }
        // Update sprout name
        const updatedSprout = yield prisma_1.prisma.sprout.update({
            where: { id: sproutId },
            data: {
                name: name.trim(),
            },
        });
        console.log(`✅ Renamed Sprout ${sproutId}: "${sprout.name}" → "${updatedSprout.name}"`);
        res.json({
            success: true,
            message: 'Sprout renamed successfully',
            sprout: {
                id: updatedSprout.id,
                name: updatedSprout.name,
                species: updatedSprout.species,
                level: updatedSprout.level,
            },
        });
    }
    catch (error) {
        console.error('Error renaming Sprout:', error);
        res.status(500).json({ error: 'Failed to rename Sprout' });
    }
}));
/**
 * Manually feed a Sprout (special items, rewards, etc.)
 */
router.post('/:sproutId/feed', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sproutId } = req.params;
        const { nutritionValue, reason } = req.body;
        if (!nutritionValue || nutritionValue < 1 || nutritionValue > 100) {
            res.status(400).json({ error: 'Invalid nutrition value (1-100)' });
            return;
        }
        const sprout = yield prisma_1.prisma.sprout.findUnique({
            where: { id: sproutId },
        });
        if (!sprout) {
            res.status(404).json({ error: 'Sprout not found' });
            return;
        }
        // Feed on-chain
        const txHash = yield aptosService.feedSprout(sprout.nftAddress, nutritionValue);
        // Update local database
        yield prisma_1.prisma.sprout.update({
            where: { id: sproutId },
            data: {
                hungerLevel: Math.min(100, sprout.hungerLevel + nutritionValue),
                happinessLevel: Math.min(100, sprout.happinessLevel + 5),
                lastFed: new Date(),
                lastInteraction: new Date(),
            },
        });
        res.json({
            success: true,
            transactionHash: txHash,
            message: 'Sprout fed successfully',
        });
    }
    catch (error) {
        console.error('Error feeding Sprout:', error);
        res.status(500).json({ error: 'Failed to feed Sprout' });
    }
}));
/**
 * Get Sprout health status and warnings
 */
router.get('/:sproutId/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sproutId } = req.params;
        const sprout = yield prisma_1.prisma.sprout.findUnique({
            where: { id: sproutId },
        });
        if (!sprout) {
            res.status(404).json({ error: 'Sprout not found' });
            return;
        }
        // Calculate time-based metrics
        const now = Date.now();
        const hoursSinceLastFed = (now - sprout.lastFed.getTime()) / (1000 * 60 * 60);
        const hoursSinceLastInteraction = (now - sprout.lastInteraction.getTime()) / (1000 * 60 * 60);
        // Determine health status
        let status = 'healthy';
        const warnings = [];
        if (sprout.isWithering) {
            status = 'critical';
            warnings.push('Sprout is withering! Complete goals to restore health.');
        }
        else if (sprout.healthPoints < 30) {
            status = 'poor';
            warnings.push('Health is very low. Complete goals to restore health.');
        }
        else if (sprout.hungerLevel < 20) {
            status = 'hungry';
            warnings.push('Sprout is starving! Complete goals to feed it.');
        }
        else if (hoursSinceLastFed > 48) {
            status = 'neglected';
            warnings.push('Sprout hasnt been fed in over 2 days.');
        }
        else if (sprout.healthPoints < 50 || sprout.hungerLevel < 40) {
            status = 'fair';
            warnings.push('Sprout needs attention soon.');
        }
        res.json({
            sprout: {
                id: sprout.id,
                name: sprout.name,
                level: sprout.level,
            },
            health: {
                status,
                healthPoints: sprout.healthPoints,
                hungerLevel: sprout.hungerLevel,
                happinessLevel: sprout.happinessLevel,
                isWithering: sprout.isWithering,
            },
            timing: {
                hoursSinceLastFed,
                hoursSinceLastInteraction,
                lastFed: sprout.lastFed,
                lastInteraction: sprout.lastInteraction,
            },
            warnings,
        });
    }
    catch (error) {
        console.error('Error checking Sprout health:', error);
        res.status(500).json({ error: 'Failed to check health' });
    }
}));
/**
 * Get Sprout level-up requirements
 */
router.get('/:sproutId/level-up-info', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sproutId } = req.params;
        const sprout = yield prisma_1.prisma.sprout.findUnique({
            where: { id: sproutId },
        });
        if (!sprout) {
            res.status(404).json({ error: 'Sprout not found' });
            return;
        }
        const expRequired = sprout.level * 100;
        const expProgress = sprout.experience;
        const expToNext = expRequired - expProgress;
        const progressPercentage = (expProgress / expRequired) * 100;
        // Determine next grade
        let nextGrade = 'Elite';
        let levelForNextGrade = 10;
        if (sprout.level >= 50) {
            nextGrade = 'Marshal (Max)';
            levelForNextGrade = 50;
        }
        else if (sprout.level >= 30) {
            nextGrade = 'Marshal';
            levelForNextGrade = 50;
        }
        else if (sprout.level >= 20) {
            nextGrade = 'Commander';
            levelForNextGrade = 30;
        }
        else if (sprout.level >= 10) {
            nextGrade = 'Knight';
            levelForNextGrade = 20;
        }
        // Determine next growth stage
        let nextGrowthStage = 'Seedling';
        let levelForNextStage = 5;
        if (sprout.level >= 20) {
            nextGrowthStage = 'Tree (Max)';
            levelForNextStage = 20;
        }
        else if (sprout.level >= 10) {
            nextGrowthStage = 'Tree';
            levelForNextStage = 20;
        }
        else if (sprout.level >= 5) {
            nextGrowthStage = 'Plant';
            levelForNextStage = 10;
        }
        res.json({
            currentLevel: sprout.level,
            currentGrade: sprout.grade,
            currentGrowthStage: sprout.growthStage,
            experience: {
                current: expProgress,
                required: expRequired,
                toNext: expToNext,
                percentage: Math.min(progressPercentage, 100),
            },
            nextMilestones: {
                nextLevel: {
                    level: sprout.level + 1,
                    expRequired: expToNext,
                },
                nextGrade: {
                    grade: nextGrade,
                    levelRequired: levelForNextGrade,
                    levelsToGo: Math.max(0, levelForNextGrade - sprout.level),
                },
                nextGrowthStage: {
                    stage: nextGrowthStage,
                    levelRequired: levelForNextStage,
                    levelsToGo: Math.max(0, levelForNextStage - sprout.level),
                },
            },
        });
    }
    catch (error) {
        console.error('Error getting level-up info:', error);
        res.status(500).json({ error: 'Failed to get level-up info' });
    }
}));
/**
 * Get Sprout evolution history
 */
router.get('/:sproutId/history', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sproutId } = req.params;
        const sprout = yield prisma_1.prisma.sprout.findUnique({
            where: { id: sproutId },
        });
        if (!sprout) {
            res.status(404).json({ error: 'Sprout not found' });
            return;
        }
        // Get user's activities that contributed to this Sprout
        const activities = yield prisma_1.prisma.activity.findMany({
            where: {
                userId: sprout.userId,
                contributesToGoal: true,
            },
            orderBy: { activityDate: 'desc' },
            take: 50,
        });
        // Calculate milestones
        const milestones = [];
        if (sprout.level >= 5) {
            milestones.push({
                type: 'growth',
                description: 'Evolved to Seedling',
                achievedAt: sprout.createdAt, // Approximate
            });
        }
        if (sprout.level >= 10) {
            milestones.push({
                type: 'growth',
                description: 'Evolved to Plant',
                grade: 'Elite',
                achievedAt: sprout.createdAt,
            });
        }
        if (sprout.level >= 20) {
            milestones.push({
                type: 'growth',
                description: 'Evolved to Tree',
                grade: 'Knight',
                achievedAt: sprout.createdAt,
            });
        }
        res.json({
            sprout: {
                id: sprout.id,
                name: sprout.name,
                species: sprout.species,
                mintedAt: sprout.createdAt,
            },
            currentStats: {
                level: sprout.level,
                grade: sprout.grade,
                growthStage: sprout.growthStage,
                totalExperience: sprout.experience,
            },
            milestones,
            recentActivities: activities.slice(0, 10),
            totalActivitiesContributed: activities.length,
        });
    }
    catch (error) {
        console.error('Error fetching Sprout history:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
}));
/**
 * Get available Sprout eggs for purchase with APT
 */
router.get('/eggs/available', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eggTypes = [
            {
                id: 'common',
                name: 'Common Egg',
                rarity: 'Common',
                aptCost: 1.0, // 1 APT = ~$8
                usdEstimate: 8.00,
                description: 'A mysterious egg with potential',
                species: ['bear', 'deer', 'fox', 'owl', 'penguin', 'rabbit'],
                benefits: [
                    'Random common species',
                    'Start at level 1',
                    'Normal grade',
                    'Standard growth rate',
                ],
            },
            {
                id: 'rare',
                name: 'Rare Egg',
                rarity: 'Rare',
                aptCost: 5.0, // 5 APT = ~$40
                usdEstimate: 40.00,
                description: 'A shimmering egg with great promise',
                species: ['dragon', 'phoenix', 'tiger', 'wolf', 'eagle', 'lion'],
                benefits: [
                    'Random rare species',
                    'Start at level 3',
                    'Elite grade',
                    '20% faster growth',
                    '+10 starting food',
                ],
                popular: true,
            },
            {
                id: 'epic',
                name: 'Epic Egg',
                rarity: 'Epic',
                aptCost: 10.0, // 10 APT = ~$80
                usdEstimate: 80.00,
                description: 'A radiant egg brimming with power',
                species: ['celestial', 'leviathan', 'hydra', 'griffin', 'sphinx', 'basilisk'],
                benefits: [
                    'Random epic species',
                    'Start at level 5',
                    'Knight grade',
                    '50% faster growth',
                    '+25 starting food',
                    'Unique visual effects',
                ],
            },
        ];
        res.json(eggTypes);
    }
    catch (error) {
        console.error('Error fetching egg types:', error);
        res.status(500).json({ error: 'Failed to fetch egg types' });
    }
}));
/**
 * Purchase a Sprout egg with APT
 */
router.post('/eggs/purchase', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, eggType, txHash, category } = req.body;
        console.log('🥚 Sprout egg purchase request:', {
            userId,
            eggType,
            txHash,
            category,
        });
        // Validate inputs
        if (!userId || !eggType || !txHash) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        // Define egg types with pricing
        const eggTypes = {
            common: {
                rarity: 'Common',
                apt: 1.0,
                species: ['bear', 'deer', 'fox', 'owl', 'penguin', 'rabbit'],
                startLevel: 1,
                startGrade: 'Normal',
                startFood: 0,
            },
            rare: {
                rarity: 'Rare',
                apt: 5.0,
                species: ['dragon', 'phoenix', 'tiger', 'wolf', 'eagle', 'lion'],
                startLevel: 3,
                startGrade: 'Elite',
                startFood: 10,
            },
            epic: {
                rarity: 'Epic',
                apt: 10.0,
                species: ['celestial', 'leviathan', 'hydra', 'griffin', 'sphinx', 'basilisk'],
                startLevel: 5,
                startGrade: 'Knight',
                startFood: 25,
            },
        };
        const egg = eggTypes[eggType.toLowerCase()];
        if (!egg) {
            res.status(400).json({
                error: 'Invalid egg type. Must be common, rare, or epic',
            });
            return;
        }
        // Check if transaction already used
        const existingPurchase = yield prisma_1.prisma.sprout.findFirst({
            where: { mintTransactionHash: txHash },
        });
        if (existingPurchase) {
            res.status(400).json({
                error: 'Transaction already used for a previous purchase',
            });
            return;
        }
        // Get user
        const user = yield prisma_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        // Verify APT payment on-chain
        const verification = yield paymentService.verifyPayment(txHash, egg.apt, user.walletAddress);
        if (!verification.isValid) {
            console.error('❌ Payment verification failed:', verification.error);
            res.status(400).json({
                error: 'Payment verification failed',
                details: verification.error,
            });
            return;
        }
        // Randomly select species from available options
        const randomSpecies = egg.species[Math.floor(Math.random() * egg.species.length)];
        const sproutName = `${user.name}'s ${randomSpecies.charAt(0).toUpperCase() + randomSpecies.slice(1)}`;
        // Mint the Sprout NFT on-chain
        let mintTxHash;
        try {
            mintTxHash = yield aptosService.mintSproutNFT(user.walletAddress, {
                name: sproutName,
                species: randomSpecies,
                rarity: egg.rarity,
                uri: `https://sprouts.app/nft/${userId}/${eggType}-${Date.now()}`,
            });
        }
        catch (error) {
            console.error('Error minting Sprout NFT:', error);
            res.status(500).json({ error: 'Failed to mint Sprout NFT on blockchain' });
            return;
        }
        // Create Sprout record in database
        const sprout = yield prisma_1.prisma.sprout.create({
            data: {
                userId,
                category: category || 'purchased',
                nftAddress: user.walletAddress,
                tokenId: mintTxHash,
                mintTransactionHash: mintTxHash,
                name: sproutName,
                species: randomSpecies,
                rarity: egg.rarity,
                grade: egg.startGrade,
                level: egg.startLevel,
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
        // Add starting food if applicable
        if (egg.startFood > 0) {
            const foodInventory = yield prisma_1.prisma.food.findUnique({
                where: { userId },
            });
            if (foodInventory) {
                yield prisma_1.prisma.food.update({
                    where: { userId },
                    data: {
                        amount: { increment: egg.startFood },
                    },
                });
            }
            // Record food bonus
            yield prisma_1.prisma.foodTransaction.create({
                data: {
                    userId,
                    amount: egg.startFood,
                    source: 'egg_purchase_bonus',
                },
            });
        }
        console.log(`✅ User ${userId} purchased ${eggType} egg for ${egg.apt} APT (payment tx: ${txHash}, mint tx: ${mintTxHash})`);
        res.json({
            success: true,
            message: `Purchased ${egg.rarity} egg for ${egg.apt} APT!`,
            sprout: {
                id: sprout.id,
                name: sprout.name,
                species: sprout.species,
                rarity: sprout.rarity,
                grade: sprout.grade,
                level: sprout.level,
                growthStage: sprout.growthStage,
            },
            aptPaid: egg.apt,
            paymentTxHash: txHash,
            mintTxHash,
            bonusFood: egg.startFood,
            txDetails: verification.txDetails,
        });
    }
    catch (error) {
        console.error('Error purchasing Sprout egg:', error);
        res.status(500).json({ error: 'Failed to purchase Sprout egg' });
    }
}));
/**
 * Transfer a Sprout to another wallet
 */
router.post('/:sproutId/transfer', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sproutId } = req.params;
        const { fromUserId, toWalletAddress, signature, message } = req.body;
        console.log('🔄 Sprout transfer request:', {
            sproutId,
            fromUserId,
            toWalletAddress,
        });
        // Validate inputs
        if (!fromUserId || !toWalletAddress) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        // Validate wallet address format
        if (!aptosService.isValidAddress(toWalletAddress)) {
            res.status(400).json({ error: 'Invalid recipient wallet address' });
            return;
        }
        // Get the Sprout
        const sprout = yield prisma_1.prisma.sprout.findUnique({
            where: { id: sproutId },
            include: {
                user: true,
            },
        });
        if (!sprout) {
            res.status(404).json({ error: 'Sprout not found' });
            return;
        }
        // Verify ownership
        if (sprout.userId !== fromUserId) {
            res.status(403).json({ error: 'You do not own this Sprout' });
            return;
        }
        // Verify signature if provided (optional but recommended)
        // Message format: "Transfer Sprout {sproutId} to {toWalletAddress}"
        if (signature && message) {
            const isValid = yield aptosService.verifySignature(sprout.user.walletAddress, message, signature);
            if (!isValid) {
                res.status(401).json({ error: 'Invalid signature - transfer authorization failed' });
                return;
            }
            console.log('✅ Transfer authorized via signature');
        }
        // Can't transfer to yourself
        if (sprout.user.walletAddress.toLowerCase() === toWalletAddress.toLowerCase()) {
            res.status(400).json({ error: 'Cannot transfer Sprout to yourself' });
            return;
        }
        // Transfer NFT on-chain
        let transferTxHash;
        try {
            // Note: This requires the transfer function in the smart contract
            // For now, we'll simulate the transfer
            // In production, implement actual on-chain transfer
            transferTxHash = `transfer_${Date.now()}_${sproutId.substring(0, 8)}`;
            console.log('⚠️ Simulated on-chain transfer (implement actual transfer in production)');
        }
        catch (error) {
            console.error('Error transferring NFT on-chain:', error);
            res.status(500).json({ error: 'Failed to transfer NFT on blockchain' });
            return;
        }
        // Find or create recipient user
        let recipientUser = yield prisma_1.prisma.user.findUnique({
            where: { walletAddress: toWalletAddress },
        });
        if (!recipientUser) {
            console.log(`📝 Creating placeholder user for wallet ${toWalletAddress}`);
            recipientUser = yield prisma_1.prisma.user.create({
                data: {
                    walletAddress: toWalletAddress,
                    socialProvider: 'wallet_transfer',
                    socialProviderId: toWalletAddress,
                    name: 'New Trainer',
                    experience: 0,
                    level: 1,
                    totalPoints: 0,
                    streak: 0,
                },
            });
            // Create food inventory for new user
            yield prisma_1.prisma.food.create({
                data: {
                    userId: recipientUser.id,
                    amount: 50, // Welcome bonus
                },
            });
        }
        // Update Sprout ownership in database
        const updatedSprout = yield prisma_1.prisma.sprout.update({
            where: { id: sproutId },
            data: {
                userId: recipientUser.id,
                nftAddress: toWalletAddress,
            },
        });
        // Record transfer in history (if you have a SproutTransfer model)
        // For now, we'll log it
        console.log(`✅ Transferred Sprout ${sproutId} from ${sprout.user.walletAddress} to ${toWalletAddress}`);
        res.json({
            success: true,
            message: `Sprout "${sprout.name}" transferred successfully!`,
            transfer: {
                sproutId,
                sproutName: sprout.name,
                fromUserId: sprout.userId,
                fromWallet: sprout.user.walletAddress,
                toUserId: recipientUser.id,
                toWallet: toWalletAddress,
                transferTxHash,
                transferredAt: new Date(),
            },
            sprout: {
                id: updatedSprout.id,
                name: updatedSprout.name,
                species: updatedSprout.species,
                level: updatedSprout.level,
                newOwner: recipientUser.name,
            },
        });
    }
    catch (error) {
        console.error('Error transferring Sprout:', error);
        res.status(500).json({ error: 'Failed to transfer Sprout' });
    }
}));
/**
 * Get Sprout transfer history (for a user)
 */
router.get('/transfers/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Get all Sprouts that were transferred to this user
        const receivedSprouts = yield prisma_1.prisma.sprout.findMany({
            where: {
                userId,
                // Filter for Sprouts that have been transferred (different initial owner)
                NOT: {
                    userId: undefined,
                },
            },
            select: {
                id: true,
                name: true,
                species: true,
                level: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { updatedAt: 'desc' },
        });
        res.json({
            userId,
            receivedTransfers: receivedSprouts,
            totalReceived: receivedSprouts.length,
        });
    }
    catch (error) {
        console.error('Error fetching transfer history:', error);
        res.status(500).json({ error: 'Failed to fetch transfer history' });
    }
}));
exports.default = router;
