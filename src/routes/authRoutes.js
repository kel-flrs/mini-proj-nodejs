import express from 'express';
import { loginController } from '../controllers/authController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { loginSchema } from './validations/loginSchema.js';

const router = express.Router();

router.post('/login', validateRequest(loginSchema), loginController);

export default router;