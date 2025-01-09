import logger from "../utils/logger.js";
import { pool } from "./config.js";
import bcryptjs from 'bcryptjs';

export const seed = async () => {
    try {
      const db = await pool.getConnection();

      logger.info('Seeding database...');
      await db.query(`
        INSERT INTO treasures (id, latitude, longitude, name) VALUES
        (100, 14.54376481, 121.0199117, 'T1'),
        (101, 14.55320766, 121.0557745, 'T2'),
        (102, 14.54464357, 121.0203656, 'T3'),
        (103, 14.58726159, 120.9795048, 'T4'),
        (104, 14.57320327, 121.0230904, 'T5'),
        (105, 14.52311313, 121.0194573, 'T6'),
        (106, 14.60242292, 121.0115134, 'T7'),
        (107, 14.60857463, 121.0185514, 'T8'),
        (108, 14.49111434, 121.0437482, 'T9'),
        (109, 14.54455953, 121.1060883, 'T10'),
        (110, 14.58798141, 121.058208, 'T11'),
        (111, 14.54886493, 121.0336393, 'T12'),
        (112, 14.53715059, 120.9904302, 'T13'),
        (113, 14.52579666, 121.0208688, 'T14'),
        (114, 14.51709988, 120.9810021, 'T15'),
        (115, 14.50200687, 120.9916181, 'T16'),
        (116, 14.52112441, 121.0427714, 'T17'),
        (117, 14.47720766, 120.9867927, 'T18');
      `);
  
      // Seed users with hashed passwords
      const users = [
        { id: 3000, name: 'U1', age: 21, password: '123123', email: 'u1@kitra.abc' },
        { id: 3001, name: 'U2', age: 51, password: '234234', email: 'u2@kitra.abc' },
        { id: 3002, name: 'U3', age: 31, password: '345345', email: 'u3@kitra.abc' },
        { id: 3003, name: 'U4', age: 18, password: '456456', email: 'u4@kitra.abc' },
        { id: 3004, name: 'U5', age: 21, password: '567567', email: 'u5@kitra.abc' },
        { id: 3005, name: 'U6', age: 35, password: '678678', email: 'u6@kitra.abc' },
      ];

      const hashedUsers = await Promise.all(users.map(async (user) => {
        const saltRounds = 10;
        const hashedPassword = await bcryptjs.hash(user.password, saltRounds);
        return [user.id, user.name, user.age, hashedPassword, user.email];
      }));

      await db.query(`
        INSERT INTO users (id, name, age, password, email) VALUES ?
      `, [hashedUsers]);
  
      // Seed money values
      await db.query(`
        INSERT INTO money_values (treasure_id, amt) VALUES
        (100, 15),
        (101, 10),
        (102, 15),
        (103, 15),
        (104, 10),
        (105, 15),
        (106, 15),
        (107, 10),
        (108, 15),
        (109, 15),
        (110, 10),
        (111, 15),
        (112, 15),
        (113, 10),
        (114, 15),
        (115, 15),
        (116, 10),
        (117, 15),
        (100, 20),
        (101, 25),
        (102, 20),
        (103, 25),
        (107, 30),
        (108, 30),
        (109, 30);
      `);
  
      logger.info('Seeds executed successfully');
      db.release();
    } catch (err) {
      logger.error('Seeding failed:', err);
      throw err;
    }
  };
  