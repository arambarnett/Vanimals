import express, { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { verifyPrivyToken } from '../middleware/verifyPrivy';

const router = express.Router();
// Using singleton prisma instance from ../lib/prisma

// OAuth success page
router.get('/success', (req: Request, res: Response) => {
  const { provider } = req.query;
  
  res.json({
    success: true,
    message: `Successfully connected to ${provider}!`,
    provider: provider
  });
});

// Get all animals
router.get('/animals', async (req: Request, res: Response): Promise<void> => {
  try {
    const animals = await prisma.animal.findMany();
    res.json(animals);
  } catch (error) {
    console.error('Error fetching animals:', error);
    res.status(500).json({ error: 'Failed to fetch animals' });
  }
});

// Create a new user
router.post('/users', async (req: Request, res: Response): Promise<void> => {
  try {
    const { privyId, name, email, animalId } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { privyId }
    });
    
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    const user = await prisma.user.create({
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
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get user by ID
router.get('/users/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    const user = await prisma.user.findUnique({
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
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user
router.put('/users/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { name, email, experience, level } = req.body;
    
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (experience !== undefined) updateData.experience = experience;
    if (level !== undefined) updateData.level = level;
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        animal: true
      }
    });
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Get user's habits
router.get('/users/:userId/habits', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    const habits = await prisma.habit.findMany({
      where: { userId }
    });
    
    res.json(habits);
  } catch (error) {
    console.error('Error fetching user habits:', error);
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
});

// Get user's Strava integration
router.get('/users/:userId/integrations/strava', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const integration = await prisma.integration.findFirst({
      where: { 
        userId,
        provider: 'strava'
      }
    });
    
    if (!integration) {
      return res.status(404).json({ error: 'Strava integration not found' });
    }
    
    res.json(integration);
  } catch (error) {
    console.error('Error fetching Strava integration:', error);
    res.status(500).json({ error: 'Failed to fetch integration' });
  }
});

// Create a habit
router.post('/habits', async (req: Request, res: Response) => {
  try {
    const { userId, title, frequency } = req.body;
    
    const habit = await prisma.habit.create({
      data: {
        userId,
        title,
        frequency
      }
    });
    
    res.status(201).json(habit);
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ error: 'Failed to create habit' });
  }
});

// Create a milestone
router.post('/milestones', async (req: Request, res: Response) => {
  try {
    const { userId, title } = req.body;
    
    const milestone = await prisma.milestone.create({
      data: {
        userId,
        title,
        achieved: false
      }
    });
    
    res.status(201).json(milestone);
  } catch (error) {
    console.error('Error creating milestone:', error);
    res.status(500).json({ error: 'Failed to create milestone' });
  }
});

// Update a milestone
router.put('/milestones/:milestoneId', async (req: Request, res: Response) => {
  try {
    const { milestoneId } = req.params;
    const { achieved } = req.body;
    
    const milestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: { achieved }
    });
    
    res.json(milestone);
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({ error: 'Failed to update milestone' });
  }
});

export default router; 