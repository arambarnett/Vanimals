import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import stravaRoutes from './routes/strava';
import authRoutes from './routes/auth';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sprouts backend is running!' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Sprouts Backend API' });
});

// Routes
app.use('/api', stravaRoutes);
app.use('/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});