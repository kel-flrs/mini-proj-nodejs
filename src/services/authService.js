import { pool as db } from '../db/config.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

function invalidCredentialsError() {
  const err = new Error('Invalid email or password');
  err.invalidCredentials = true;
  return err;
}

export const login = async ({ email, password }) => {
  logger.debug(`Querying user by email=${email} from DB`);

  // 1. Fetch the user by email
  const [rows] = await db.execute(
    'SELECT id, name, age, email, password FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  logger.debug(`Fetched ${rows.length} row(s) for email=${email}`);

  if (rows.length === 0) {
    logger.warn(`No user found for email=${email}`);
    throw invalidCredentialsError();
  }

  const user = rows[0];
  logger.debug(`Comparing password for user id=${user.id}`);

  // 2. Compare the hashed password in DB with the provided password
  const passwordMatches = await bcryptjs.compare(password, user.password);
  if (!passwordMatches) {
    logger.warn(`Password mismatch for user id=${user.id}`);
    throw invalidCredentialsError();
  }

  // 3. Generate a JWT token
  const token = jwt.sign(
    {
      userId: user.id,
      name: user.name,
      age: user.age,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  logger.info(`JWT generated for user id=${user.id} name=${user.name}`);

  // 4. Return user basic info + token
  return {
    id: user.id,
    name: user.name,
    age: user.age,
    token,
  };
};
