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
exports.startStravaSyncJob = startStravaSyncJob;
// Cron job to sync Strava activities automatically
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = require("@prisma/client");
const goalTrackingService_1 = require("../services/goalTrackingService");
const prisma = new client_1.PrismaClient();
const goalTrackingService = new goalTrackingService_1.GoalTrackingService();
/**
 * Sync Strava activities every 6 hours for all connected users
 */
function startStravaSyncJob() {
    // Run every 6 hours at minute 15
    node_cron_1.default.schedule('15 */6 * * *', () => __awaiter(this, void 0, void 0, function* () {
        console.log('🏃 Running Strava activity sync...');
        try {
            const stravaIntegrations = yield prisma.integration.findMany({
                where: {
                    provider: 'strava',
                    isActive: true,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            console.log(`Found ${stravaIntegrations.length} active Strava integrations`);
            let totalProcessed = 0;
            for (const integration of stravaIntegrations) {
                try {
                    // Fetch recent activities
                    const activitiesResponse = yield fetch('https://www.strava.com/api/v3/athlete/activities?per_page=10', {
                        headers: {
                            'Authorization': `Bearer ${integration.accessToken}`,
                        },
                    });
                    if (!activitiesResponse.ok) {
                        console.error(`Failed to fetch activities for user ${integration.userId}`);
                        continue;
                    }
                    const activities = yield activitiesResponse.json();
                    // Process new activities
                    let processedCount = 0;
                    for (const activity of activities) {
                        // Check if already processed
                        const existing = yield prisma.activity.findFirst({
                            where: {
                                userId: integration.userId,
                                externalId: activity.id.toString(),
                            },
                        });
                        if (existing)
                            continue;
                        // Determine category
                        const activityType = activity.type.toLowerCase();
                        let category = 'workout';
                        if (activityType.includes('run'))
                            category = 'running';
                        else if (activityType.includes('ride') || activityType.includes('cycle'))
                            category = 'cycling';
                        else if (activityType.includes('swim'))
                            category = 'swimming';
                        else if (activityType.includes('walk'))
                            category = 'walking';
                        const distanceInMiles = activity.distance / 1609.34;
                        yield goalTrackingService.processActivity(integration.userId, {
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
                                startDate: activity.start_date,
                            },
                        });
                        processedCount++;
                    }
                    if (processedCount > 0) {
                        console.log(`  ✅ Processed ${processedCount} activities for ${integration.user.name}`);
                        totalProcessed += processedCount;
                    }
                    // Update last sync
                    yield prisma.integration.update({
                        where: { id: integration.id },
                        data: { lastSync: new Date() },
                    });
                }
                catch (error) {
                    console.error(`Error syncing Strava for user ${integration.userId}:`, error);
                }
            }
            console.log(`✅ Strava sync complete. Processed ${totalProcessed} new activities.`);
        }
        catch (error) {
            console.error('Error in Strava sync job:', error);
        }
    }));
    console.log('✅ Strava sync job scheduled (runs every 6 hours)');
}
