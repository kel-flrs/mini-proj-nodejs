import express from 'express';
import { findTreasuresController } from '../controllers/treasureController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { treasureSchema } from './validations/treasureSchema.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, validateRequest(treasureSchema, 'query'), findTreasuresController);

export default router;
