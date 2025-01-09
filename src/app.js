import express from 'express';
import { initializeDatabase } from './db/config.js';
import treasureRoutes from './routes/treasureRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import dotenv from 'dotenv';
import logger from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

initializeDatabase();

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/treasures', treasureRoutes);

// Centralized error handling middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
