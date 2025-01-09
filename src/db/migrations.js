import { pool } from "./config.js";
import logger from "../utils/logger.js";

export const migrate = async () => {
    try {
      const db = await pool.getConnection();
      
      logger.info('Running migrations...');
      await db.query(`
        CREATE TABLE IF NOT EXISTS treasures (
          id INT PRIMARY KEY,
          latitude DECIMAL(10, 8) NOT NULL,
          longitude DECIMAL(10, 7) NOT NULL,
          name VARCHAR(50) NOT NULL
        )
      `);
  
      await db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          age INT NOT NULL,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE
        )
      `);
  
      await db.query(`
        CREATE TABLE IF NOT EXISTS money_values (
          treasure_id INT NOT NULL,
          amt INT NOT NULL,
          FOREIGN KEY (treasure_id) REFERENCES treasures(id) ON DELETE CASCADE,
          CONSTRAINT chk_amt_range CHECK (amt BETWEEN 10 AND 30)
        )
      `);

      await db.query(`
       CREATE TRIGGER before_money_values_insert
       BEFORE INSERT ON money_values
       FOR EACH ROW
       BEGIN
          DECLARE count_vals INT;
          SELECT COUNT(*) INTO count_vals
          FROM money_values
          WHERE treasure_id = NEW.treasure_id;

          IF count_vals >= 5 THEN
              SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Cannot have more than 5 monetary values per treasure.';
          END IF;
       END;
     `)
  
      logger.info('Migrations executed successfully');
      db.release();
    } catch (err) {
      logger.error('Migration failed:', err);
      throw err;
    }
  };
  