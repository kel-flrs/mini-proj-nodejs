import mysql from 'mysql2/promise';
import { migrate } from './migrations.js';
import { seed } from './seeds.js';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

const initializeDatabase = async () => {
    try {
      await migrate();
      await seed();

      logger.info('Database initialized with migrations and seeds');
    } catch (error) {
      logger.error('Database initialization failed:', error.message);
      process.exit(1);
    }
};

export { pool, initializeDatabase }