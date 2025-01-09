import { findTreasures } from '../services/treasureService.js';
import logger from '../utils/logger.js';

export const findTreasuresController = async (req, res, next) => {
    try {
      const { latitude, longitude, distance, prizeValue } = req.query;
      logger.info(`Treasure find request lat=${latitude}, lon=${longitude}, dist=${distance}, prizeVal=${prizeValue}`);

      const treasures = await findTreasures({ latitude, longitude, distance, prizeValue });
      logger.info(`Found ${treasures.length} treasures for the request.`);

      res.json({ count: treasures.length, treasures });
    } catch (err) {
      logger.error(`Error finding treasures: ${err.message}`, { stack: err.stack });
      next(err);
    }
};