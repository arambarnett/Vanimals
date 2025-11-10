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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalTrackingService = void 0;
const client_1 = require("@prisma/client");
const aptosService_1 = require("./aptosService");
const prisma = new client_1.PrismaClient();
class GoalTrackingService {
    constructor() {
        this.aptosService = new aptosService_1.AptosService();
    }
    /**
     * Process an activity and update related goals
     */
    processActivity(userId, activityData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('📊 Processing activity:', {
                    userId,
                    type: activityData.type,
                    category: activityData.category,
                    value: activityData.value,
                    unit: activityData.unit,
                });
                // Find relevant active goals
                // Match by both category (fitness) and subcategory (running, cycling, etc.)
                const relevantGoals = yield prisma.goal.findMany({
                    where: {
                        userId,
                        isActive: true,
                        OR: [
                            {
                                // Match specific subcategory (e.g., running goal + running activity)
                                category: activityData.type,
                                subcategory: activityData.category,
                            },
                            {
                                // Match general fitness goals (no specific subcategory or 'auto')
                                category: activityData.type,
                                subcategory: { in: ['auto', 'manual'] },
                            },
                        ],
                    },
                });
                console.log(`📝 Found ${relevantGoals.length} relevant goals`);
                let totalPoints = 0;
                let totalExperience = 0;
                let totalFoodEarned = 0;
                const completedGoals = [];
                // Update each relevant goal
                for (const goal of relevantGoals) {
                    const newValue = goal.currentValue + activityData.value;
                    const wasCompleted = goal.isCompleted;
                    const isNowCompleted = newValue >= goal.targetValue;
                    yield prisma.goal.update({
                        where: { id: goal.id },
                        data: {
                            currentValue: newValue,
                            isCompleted: isNowCompleted,
                            completedAt: isNowCompleted && !wasCompleted ? new Date() : goal.completedAt,
                        },
                    });
                    // Award food and experience for goal completion
                    if (isNowCompleted && !wasCompleted) {
                        totalExperience += goal.experienceReward;
                        totalFoodEarned += goal.foodReward;
                        completedGoals.push(goal.id);
                        // Award food to user
                        yield prisma.food.upsert({
                            where: { userId },
                            update: { amount: { increment: goal.foodReward } },
                            create: { userId, amount: goal.foodReward },
                        });
                        // Record food transaction
                        yield prisma.foodTransaction.create({
                            data: {
                                userId,
                                goalId: goal.id,
                                amount: goal.foodReward,
                                source: 'goal_completion',
                            },
                        });
                        console.log(`🎉 Goal completed! User ${userId} earned ${goal.foodReward} food`);
                    }
                    else {
                        // Award partial progress experience
                        const progress = Math.min(newValue / goal.targetValue, 1.0);
                        totalExperience += Math.floor(goal.experienceReward * progress * 0.1);
                    }
                }
                // Log activity in database
                const activity = yield prisma.activity.create({
                    data: {
                        userId,
                        type: activityData.type,
                        category: activityData.category,
                        value: activityData.value,
                        unit: activityData.unit,
                        externalId: activityData.externalId,
                        metadata: activityData.metadata,
                        pointsEarned: totalPoints,
                        experienceEarned: totalExperience,
                        contributesToGoal: relevantGoals.length > 0,
                        impactType: 'positive',
                    },
                });
                // Update user stats
                const user = yield prisma.user.update({
                    where: { id: userId },
                    data: {
                        totalPoints: { increment: totalPoints },
                        experience: { increment: totalExperience },
                        lastActiveAt: new Date(),
                    },
                });
                // Update all user's Sprouts (database only, no on-chain calls)
                yield this.updateUserSprouts(userId, totalExperience, totalPoints > 0);
                // Skip on-chain recording for now (smart contract not fully deployed)
                // TODO: Re-enable when contract has all required view functions
                // if (user.walletAddress) {
                //   await this.aptosService.recordActivity(user.walletAddress, {
                //     type: activityData.type,
                //     pointsEarned: totalPoints,
                //     experienceEarned: totalExperience,
                //   });
                // }
                return {
                    totalPoints,
                    totalExperience,
                    totalFoodEarned,
                    completedGoals,
                    activity,
                };
            }
            catch (error) {
                console.error('Error processing activity:', error);
                throw error;
            }
        });
    }
    /**
     * Update all Sprouts owned by a user
     */
    updateUserSprouts(userId, experienceGain, isPositiveActivity) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sprouts = yield prisma.sprout.findMany({
                    where: { userId },
                });
                for (const sprout of sprouts) {
                    // Calculate nutrition value based on experience gained
                    const nutritionValue = Math.min(20, Math.floor(experienceGain / 5));
                    if (isPositiveActivity) {
                        // Skip on-chain calls (contract not fully deployed)
                        // TODO: Re-enable when contract has all required functions
                        // await this.aptosService.feedSprout(sprout.nftAddress, nutritionValue);
                        // await this.aptosService.updateSproutStats(sprout.nftAddress, {
                        //   experienceGain,
                        //   healthChange: 10,
                        //   hungerChange: nutritionValue,
                        // });
                        // Update local database (this is the source of truth)
                        yield prisma.sprout.update({
                            where: { id: sprout.id },
                            data: {
                                experience: { increment: experienceGain },
                                hungerLevel: Math.min(100, sprout.hungerLevel + nutritionValue),
                                healthPoints: Math.min(100, sprout.healthPoints + 10),
                                happinessLevel: Math.min(100, sprout.happinessLevel + 5),
                                lastInteraction: new Date(),
                                lastFed: new Date(),
                                isWithering: false,
                            },
                        });
                        // Check for level up
                        const expRequired = sprout.level * 100;
                        if (sprout.experience + experienceGain >= expRequired) {
                            yield prisma.sprout.update({
                                where: { id: sprout.id },
                                data: {
                                    level: { increment: 1 },
                                    strength: { increment: 1 },
                                    intelligence: { increment: 1 },
                                    speed: { increment: 1 },
                                },
                            });
                        }
                    }
                }
            }
            catch (error) {
                console.error('Error updating user Sprouts:', error);
                throw error;
            }
        });
    }
    /**
     * Decay Sprout stats over time (called by cron job)
     * Rest decays 2 points/hour, Water 1.5 points/hour, Food 1 point/hour
     */
    decaySproutHealth(sproutId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sprout = yield prisma.sprout.findUnique({ where: { id: sproutId } });
                if (!sprout)
                    return;
                // Skip if Sprout is dead or still an egg
                if (sprout.isDead || sprout.growthStage === 'Egg')
                    return;
                // Calculate hours since last decay
                const hoursSinceLastDecay = (Date.now() - sprout.lastStatDecay.getTime()) / (1000 * 60 * 60);
                // Only decay if at least 1 hour has passed
                if (hoursSinceLastDecay < 1)
                    return;
                // Calculate decay amounts
                const restDecay = Math.floor(hoursSinceLastDecay * 2); // 2 points/hour (rest/sleep)
                const waterDecay = Math.floor(hoursSinceLastDecay * 1.5); // 1.5 points/hour (hydration)
                const foodDecay = Math.floor(hoursSinceLastDecay * 1); // 1 point/hour (hunger)
                // Apply decay (minimum 0)
                const newRest = Math.max(0, sprout.restScore - restDecay);
                const newWater = Math.max(0, sprout.waterScore - waterDecay);
                const newFood = Math.max(0, sprout.foodScore - foodDecay);
                // Calculate overall health (average of 3 needs)
                const overallHealth = Math.floor((newRest + newWater + newFood) / 3);
                // Calculate mood based on needs
                let mood = 'happy';
                if (overallHealth < 20)
                    mood = 'distressed';
                else if (overallHealth < 40)
                    mood = 'sad';
                else if (overallHealth < 60)
                    mood = 'neutral';
                else if (overallHealth < 80)
                    mood = 'content';
                else
                    mood = 'happy';
                // Check if Sprout should die (any stat hits 0)
                const shouldDie = newRest === 0 || newWater === 0 || newFood === 0;
                // Update database
                yield prisma.sprout.update({
                    where: { id: sproutId },
                    data: {
                        restScore: newRest,
                        waterScore: newWater,
                        foodScore: newFood,
                        mood,
                        healthPoints: overallHealth,
                        lastStatDecay: new Date(),
                        isWithering: overallHealth < 30,
                        isDead: shouldDie,
                        diedAt: shouldDie && !sprout.isDead ? new Date() : sprout.diedAt,
                    },
                });
                if (shouldDie && !sprout.isDead) {
                    console.log(`💀 Sprout ${sproutId} died! Rest: ${newRest}, Water: ${newWater}, Food: ${newFood}`);
                }
                else {
                    console.log(`⏰ Decayed Sprout ${sproutId}: Rest ${newRest}, Water ${newWater}, Food ${newFood}, Mood: ${mood}`);
                }
            }
            catch (error) {
                console.error(`Error decaying Sprout stats for ${sproutId}:`, error);
            }
        });
    }
    /**
     * Calculate if user is on track for a goal
     */
    calculateGoalProgress(goalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const goal = yield prisma.goal.findUnique({
                where: { id: goalId },
                include: {
                    activities: {
                        orderBy: { activityDate: 'desc' },
                        take: 30, // Last 30 activities
                    },
                },
            });
            if (!goal) {
                throw new Error('Goal not found');
            }
            const percentage = (goal.currentValue / goal.targetValue) * 100;
            const now = new Date();
            const startDate = new Date(goal.startDate);
            const endDate = goal.endDate ? new Date(goal.endDate) : null;
            let daysRemaining = 0;
            let isOnTrack = false;
            if (endDate) {
                const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                const daysPassed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                daysRemaining = totalDays - daysPassed;
                const expectedProgress = (daysPassed / totalDays) * 100;
                isOnTrack = percentage >= expectedProgress;
            }
            // Calculate average daily progress
            const activities = goal.activities || [];
            const totalValue = activities.reduce((sum, act) => sum + (act.value || 0), 0);
            const daysActive = Math.max(1, Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
            const averageDailyProgress = totalValue / daysActive;
            return {
                percentage: Math.min(percentage, 100),
                isOnTrack,
                daysRemaining: Math.max(0, daysRemaining),
                averageDailyProgress,
            };
        });
    }
    /**
     * Get user's overall progress summary
     */
    getUserProgressSummary(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [activeGoals, completedGoals, totalActivities, user] = yield Promise.all([
                prisma.goal.count({ where: { userId, isActive: true, isCompleted: false } }),
                prisma.goal.count({ where: { userId, isCompleted: true } }),
                prisma.activity.count({ where: { userId } }),
                prisma.user.findUnique({
                    where: { id: userId },
                    select: {
                        level: true,
                        experience: true,
                        totalPoints: true,
                        streak: true,
                    },
                }),
            ]);
            return {
                activeGoals,
                completedGoals,
                totalActivities,
                level: (user === null || user === void 0 ? void 0 : user.level) || 1,
                experience: (user === null || user === void 0 ? void 0 : user.experience) || 0,
                totalPoints: (user === null || user === void 0 ? void 0 : user.totalPoints) || 0,
                streak: (user === null || user === void 0 ? void 0 : user.streak) || 0,
            };
        });
    }
}
exports.GoalTrackingService = GoalTrackingService;
