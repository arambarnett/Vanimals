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
// src/routes/strava.ts
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../lib/prisma");
const router = express_1.default.Router();
// Using singleton prisma instance from ../lib/prisma
// Strava OAuth callback - exchange authorization code for access token
router.get('/exchange_token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, state } = req.query;
        if (!code) {
            return res.status(400).json({ error: 'Authorization code is required' });
        }
        // TODO: Get the actual user ID from your authentication system
        // For now, we'll use a placeholder
        const userId = req.query.userId || req.body.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        // Verify user exists in database
        const user = yield prisma_1.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Exchange the authorization code for an access token
        const tokenResponse = yield fetch('https://www.strava.com/oauth/token', {
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
        const tokenData = yield tokenResponse.json();
        if (!tokenResponse.ok) {
            console.error('Token exchange failed:', tokenData);
            return res.status(400).json({ error: 'Failed to exchange token' });
        }
        // Get user info from Strava
        const athleteResponse = yield fetch('https://www.strava.com/api/v3/athlete', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
            },
        });
        const athleteData = yield athleteResponse.json();
        // Save or update the integration in your database
        yield prisma_1.prisma.integration.upsert({
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
        const activitiesResponse = yield fetch('https://www.strava.com/api/v3/athlete/activities?per_page=10', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
            },
        });
        const activities = yield activitiesResponse.json();
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
    }
    catch (error) {
        console.error('Strava OAuth error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get user's Strava activities
router.get('/activities', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // TODO: Get the actual user ID from your authentication system
        // For now, we'll use a placeholder
        const userId = req.query.userId || req.body.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        // Verify user exists in database
        const user = yield prisma_1.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const integration = yield prisma_1.prisma.integration.findUnique({
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
        const activitiesResponse = yield fetch('https://www.strava.com/api/v3/athlete/activities?per_page=20', {
            headers: {
                'Authorization': `Bearer ${integration.accessToken}`,
            },
        });
        const activities = yield activitiesResponse.json();
        res.json(activities);
    }
    catch (error) {
        console.error('Error fetching Strava activities:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
