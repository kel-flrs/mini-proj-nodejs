import { pool as db } from '../db/config.js';
import logger from '../utils/logger.js';

// Service to find treasures within a distance and optionally by prize value
export const findTreasures = async ({ latitude, longitude, distance, prizeValue }) => {
  logger.debug(`Querying treasures with lat=${latitude}, lon=${longitude}, dist=${distance}, prizeValue=${prizeValue}`);

  let results;

  if (prizeValue) {
    // If prizeValue is provided, we do an aggregation (MIN(m.amt)) or filtering
    logger.debug('Executing query with prizeValue filter...');
    [results] = await db.query(
      `
        SELECT t.*, MIN(m.amt) AS moneyValue
        FROM treasures t
        INNER JOIN money_values m ON t.id = m.treasure_id
        WHERE 
          ST_Distance_Sphere(POINT(t.longitude, t.latitude), POINT(?, ?)) <= ? * 1000
          AND m.amt >= ?
        GROUP BY t.id
      `,
      [longitude, latitude, distance, prizeValue]
    );

    logger.debug(`Query returned ${results.length} row(s) with minimum amounts >= ${prizeValue}.`);

  } else {
    // If no prizeValue, we just list all money values for each treasure in distance
    logger.debug('Executing query without prizeValue filter...');

    [results] = await db.query(
      `
       SELECT t.*, m.amt AS moneyValue
       FROM treasures t
       INNER JOIN money_values m ON t.id = m.treasure_id
       WHERE ST_Distance_Sphere(POINT(t.longitude, t.latitude), POINT(?, ?)) <= ? * 1000
      `,
      [longitude, latitude, distance]
    );

    logger.debug(`Query returned ${results.length} row(s) without filtering on amount.`);
  }

  // Transform the results to group money values or unify duplicates
  const groupedTreasures = transformResult(results);

  logger.debug(`Final grouped result has ${groupedTreasures.length} treasure(s).`);
  return groupedTreasures;
};

function transformResult(rows) {
  // We'll store them in a Map, keyed by treasure "id"
  const treasureMap = new Map();

  for (const row of rows) {
    const { id, latitude, longitude, name, moneyValue } = row;

    // Check if we already have an entry for this "id"
    if (!treasureMap.has(id)) {
      // If not, create a new treasure object
      treasureMap.set(id, {
        id,
        latitude,
        longitude,
        name,
        moneyValues: [moneyValue], // start with the current prizeValue
      });
    } else {
      // If we already have this treasure, just push the new prizeValue
      const existingTreasure = treasureMap.get(id);
      existingTreasure.moneyValues.push(moneyValue);
    }
  }

  // Convert the Map values to an array
  return Array.from(treasureMap.values());
}
