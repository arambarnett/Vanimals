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
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../lib/prisma");
const router = express_1.default.Router();
// Using singleton prisma instance from ../lib/prisma
// OAuth success page
router.get('/success', (req, res) => {
    const { provider } = req.query;
    res.json({
        success: true,
        message: `Successfully connected to ${provider}!`,
        provider: provider
    });
});
// Get all animals
router.get('/animals', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const animals = yield prisma_1.prisma.animal.findMany();
        res.json(animals);
    }
    catch (error) {
        console.error('Error fetching animals:', error);
        res.status(500).json({ error: 'Failed to fetch animals' });
    }
}));
// Create a new user
router.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { privyId, name, email, animalId } = req.body;
        // Check if user already exists
        const existingUser = yield prisma_1.prisma.user.findUnique({
            where: { privyId }
        });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        const user = yield prisma_1.prisma.user.create({
            data: {
                privyId,
                name,
                email,
                animalId,
                experience: 0,
                level: 1
            },
            include: {
                animal: true
            }
        });
        res.status(201).json(user);
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
}));
// Get user by ID
router.get('/users/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield prisma_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                animal: true,
                habits: true,
                milestones: true
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
}));
// Update user
router.put('/users/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { name, email, experience, level } = req.body;
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (email !== undefined)
            updateData.email = email;
        if (experience !== undefined)
            updateData.experience = experience;
        if (level !== undefined)
            updateData.level = level;
        const user = yield prisma_1.prisma.user.update({
            where: { id: userId },
            data: updateData,
            include: {
                animal: true
            }
        });
        res.json(user);
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
}));
// Get user's habits
router.get('/users/:userId/habits', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const habits = yield prisma_1.prisma.habit.findMany({
            where: { userId }
        });
        res.json(habits);
    }
    catch (error) {
        console.error('Error fetching user habits:', error);
        res.status(500).json({ error: 'Failed to fetch habits' });
    }
}));
// Get user's Strava integration
router.get('/users/:userId/integrations/strava', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const integration = yield prisma_1.prisma.integration.findFirst({
            where: {
                userId,
                provider: 'strava'
            }
        });
        if (!integration) {
            return res.status(404).json({ error: 'Strava integration not found' });
        }
        res.json(integration);
    }
    catch (error) {
        console.error('Error fetching Strava integration:', error);
        res.status(500).json({ error: 'Failed to fetch integration' });
    }
}));
// Create a habit
router.post('/habits', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, title, frequency } = req.body;
        const habit = yield prisma_1.prisma.habit.create({
            data: {
                userId,
                title,
                frequency
            }
        });
        res.status(201).json(habit);
    }
    catch (error) {
        console.error('Error creating habit:', error);
        res.status(500).json({ error: 'Failed to create habit' });
    }
}));
// Create a milestone
router.post('/milestones', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, title } = req.body;
        const milestone = yield prisma_1.prisma.milestone.create({
            data: {
                userId,
                title,
                achieved: false
            }
        });
        res.status(201).json(milestone);
    }
    catch (error) {
        console.error('Error creating milestone:', error);
        res.status(500).json({ error: 'Failed to create milestone' });
    }
}));
// Update a milestone
router.put('/milestones/:milestoneId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { milestoneId } = req.params;
        const { achieved } = req.body;
        const milestone = yield prisma_1.prisma.milestone.update({
            where: { id: milestoneId },
            data: { achieved }
        });
        res.json(milestone);
    }
    catch (error) {
        console.error('Error updating milestone:', error);
        res.status(500).json({ error: 'Failed to update milestone' });
    }
}));
exports.default = router;
