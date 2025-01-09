import { login } from '../services/authService.js';
import logger from '../utils/logger.js';

export const loginController = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      logger.info(`Login attempt for email=${email}`);

      const userDetails = await login({ email, password });
      logger.info(`User ${userDetails.name} (id=${userDetails.id}) logged in successfully.`);

      res.json(userDetails);
    } catch (err) {
      logger.error(`Login error: ${err.message}`, { stack: err.stack });
      next(err);
    }
};