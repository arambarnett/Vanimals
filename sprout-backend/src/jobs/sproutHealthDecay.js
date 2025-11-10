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
exports.startSproutHealthDecayJob = startSproutHealthDecayJob;
// Cron job to decay Sprout health over time
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = require("@prisma/client");
const goalTrackingService_1 = require("../services/goalTrackingService");
const prisma = new client_1.PrismaClient();
const goalTrackingService = new goalTrackingService_1.GoalTrackingService();
/**
 * Run every hour to decay all Sprouts' hunger and health
 * Sprouts that aren't being cared for (no goal completion) will wither
 */
function startSproutHealthDecayJob() {
    // Run every hour at minute 0
    node_cron_1.default.schedule('0 * * * *', () => __awaiter(this, void 0, void 0, function* () {
        console.log('🕐 Running Sprout health decay check...');
        try {
            const sprouts = yield prisma.sprout.findMany({
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            let decayedCount = 0;
            let witheringCount = 0;
            for (const sprout of sprouts) {
                try {
                    yield goalTrackingService.decaySproutHealth(sprout.id);
                    decayedCount++;
                    // Check if now withering
                    const updated = yield prisma.sprout.findUnique({
                        where: { id: sprout.id },
                    });
                    if ((updated === null || updated === void 0 ? void 0 : updated.isWithering) && !sprout.isWithering) {
                        witheringCount++;
                        console.log(`⚠️  Sprout "${sprout.name}" is now withering!`);
                    }
                }
                catch (error) {
                    console.error(`Error decaying Sprout ${sprout.id}:`, error);
                }
            }
            console.log(`✅ Updated ${decayedCount} Sprouts (${witheringCount} now withering)`);
        }
        catch (error) {
            console.error('Error in Sprout health decay job:', error);
        }
    }));
    console.log('✅ Sprout health decay job scheduled (runs hourly)');
}
